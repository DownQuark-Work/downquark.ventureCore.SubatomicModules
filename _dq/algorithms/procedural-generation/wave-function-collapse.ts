"use strict";

import { Grid, Seed } from '¿/Gaming.ts'

enum BARRIER {
  UNKNOWN = '?',
  CLOSED = '0000',
  OPEN = '1111',
  PERIMETER = '#',
}

enum DIRECTION {
  BOTTOM = 2,
  LEFT = 3,
  RIGHT = 1,
  TOP = 0,
}

const { Parser, Pointer } = Seed
let parsedArgs:{
  anim:number,
  seeded:string,
  h:number,
  w:number,
  v:boolean,
} // set during instantiation
// register pointer
const curPointer = Pointer.registerSeedPointer('_BASE_WFC_SEED_POINTER')

const collapsedCells:Record<string,string> = {},
      pendingCells:Record<string,string> = {}
let amtUncollapsed = 0

const directionBarriers:string[] = []
for(let i=0; i<4**2; i++) {  // 4 is top,bottom,left,right
  directionBarriers.push(i.toString(2).padStart(4,'0'))
}

// below renders in the CLI only
const openKeys:Record<string,string> = {
  all:'+',
  bottom:'↓',
  bottomLeft: '⎤',
  bottomRight: '⎡',
  horiz: '⟷',
  horizBottom: '⊤',
  horizTop: '⊥',
  left:'←',
  right:'→',
  top:'↑',
  topLeft: '⎦',
  topRight: '⎣',
  vert:'🡙',
  vertLeft:'⊣',
  vertRight:'⊢',
  zero:'ø',
}
const openDirection:Record<string,string[]> = {
  bottom:[openKeys.bottom],
  left:[openKeys.left],
  right:[openKeys.right],
  top:[openKeys.top],
  zero:[openKeys.zero],
  //
  bottomLeft: [openKeys.bottomLeft,openKeys.bottom,openKeys.left],
  bottomRight: [openKeys.bottomRight,openKeys.bottom,openKeys.right],
  topLeft: [openKeys.topLeft,openKeys.top,openKeys.left],
  topRight: [openKeys.topRight,openKeys.top,openKeys.right],
  //
  horiz:[openKeys.horiz,openKeys.left,openKeys.right],
  vert:[openKeys.vert,openKeys.bottom,openKeys.top],
}
openDirection.horizBottom = [openKeys.horizBottom, ...[... new Set([ ...openDirection.horiz, ...openDirection.bottomLeft, ...openDirection.bottomRight]) ]],
openDirection.horizTop = [openKeys.horizTop, ...[... new Set([ ...openDirection.horiz, ...openDirection.topLeft, ...openDirection.topRight]) ]],
openDirection.vertLeft = [openKeys.vertLeft, ...[... new Set([ ...openDirection.vert, ...openDirection.topLeft, ...openDirection.bottomLeft]) ]],
openDirection.vertRight = [openKeys.vertRight, ...[... new Set([ ...openDirection.vert, ...openDirection.topRight, ...openDirection.bottomRight]) ]],
openDirection.all = [openKeys.all, ...[... new Set([  ...openDirection.horizBottom, ...openDirection.horizTop, ...openDirection.vertLeft, ...openDirection.vertRight,]) ]]

const openDirectionBarrierKeyMap = [
  'zero','left','bottom','bottomLeft','right','horiz','bottomRight','horizBottom',
  'top','topLeft','vert','vertLeft','topRight','horizTop','vertRight','all',
]

const openDirectionBarriers:Record<string,string[]|string> = {}
directionBarriers.forEach((dB:string,i) => {
  openDirectionBarriers[dB] = openDirection[openDirectionBarrierKeyMap[i]]
  openDirectionBarriers[openKeys[openDirectionBarrierKeyMap[i]]] = dB
})
openDirectionBarriers[BARRIER.UNKNOWN] = openDirection.all

const gridConfig = {FILL_CHARACTER:BARRIER.UNKNOWN,GRID_HEIGHT:15,GRID_WIDTH:15}
Grid.Create.Config(gridConfig)

Grid.Create.Initial()

Grid.Set.Cells({location:Grid.Get.Perimiter(),value:BARRIER.PERIMETER})
Grid.Render()

amtUncollapsed = Grid.Get.Cells()?.filter(cell => cell !== BARRIER.PERIMETER).length || 0

const one = Parser.parseOptionWithSeedValue({RANGE:[2,gridConfig.GRID_WIDTH-4]}) as number // -4/+2 ensures we we select a cell that is unimpeded by the border
const two = Parser.parseOptionWithSeedValue({RANGE:[2,gridConfig.GRID_HEIGHT-4]}) as number // -4/+2 ensures we we select a cell that is unimpeded by the border
const StartPos:[number,number] = [one, two]
pendingCells[Grid.Set.Position(StartPos)._i] = BARRIER.OPEN

let runAgain = 0
const collapsePending = async () => {
  console.clear()
  
  const setGridCell = (cell:string,val:string) => {
    const valueSymbolIndex = (Parser.parseOptionWithSeedValue({RANGE:[0,openDirectionBarriers[val].length-1]}) as number) || 0
    const valCell = openDirectionBarriers[val][valueSymbolIndex]
    Grid.Set.Cells({location:[parseInt(cell,10)],value:valCell})
    return valCell
  }

  // select from pending cells
  const availCells = Object.entries(pendingCells)
  if(!availCells.length) throw new Error('No more available cells')
  const selectedIndex = (Parser.parseOptionWithSeedValue({RANGE:[0,availCells.length-1]}) as number) || 0
  const selectedCell = availCells[selectedIndex][0]
  const selectedVal = availCells[selectedIndex][1]
  // choose collapse value and display
  const valueCell = setGridCell(selectedCell,selectedVal)

  // store collapsed value - remove from pending
  const cellValueKey = openDirectionBarriers[valueCell] as string
  collapsedCells[selectedCell] = cellValueKey
  delete pendingCells[selectedCell]

  // create pending from perimeter cells
  const collapsedCell = Grid.Set.Position(parseInt(selectedCell,10))
  
  if(collapsedCell?.ADJACENT){
    const {N,E,S,W} = collapsedCell.ADJACENT
    const adjacentCells = [N,E,S,W]
    adjacentCells.forEach((cell,indx) => {
    /** Regressive Checks for Perimeter and Missing Bridge */
      if(collapsedCells[''+cell]) { // adjacent cell is collapsed
        if(collapsedCells[selectedCell].at(indx)!=='1') { // if bridge does not exist between current and previously collapsed
          let checkDirectionForBridge = 0
          switch(indx) {
            case DIRECTION.BOTTOM: checkDirectionForBridge = DIRECTION.TOP; break
            case DIRECTION.LEFT: checkDirectionForBridge = DIRECTION.RIGHT; break
            case DIRECTION.RIGHT: checkDirectionForBridge = DIRECTION.LEFT; break
            case DIRECTION.TOP: checkDirectionForBridge = DIRECTION.BOTTOM; break
          }       
          if(collapsedCells[''+cell].at(checkDirectionForBridge) === '1') { // if determined it should exist
            const bridgeCell = collapsedCells[selectedCell].split('')
                  bridgeCell[indx] = '1' // create the bridge
            collapsedCells[selectedCell] = bridgeCell.join('')
            setGridCell(selectedCell,collapsedCells[selectedCell])
          }
        }
        return
      }

      let curAdjCellValue = Grid.Get.Cells({location:cell})?.[0] as string
      if(curAdjCellValue === BARRIER.PERIMETER) {
        if(collapsedCells[selectedCell].at(indx) === '0') return // perimeter already closed
        const perimClosed = collapsedCells[selectedCell].split('')
              perimClosed[indx] = '0'
        collapsedCells[selectedCell] = perimClosed.join('')
        setGridCell(selectedCell,collapsedCells[selectedCell])
        return // ignore perimeter
      }
      /** End Regressive Checks for Perimeter and Missing Bridge */

      if(pendingCells[cell])
        curAdjCellValue = pendingCells[cell]
      else
        curAdjCellValue = curAdjCellValue === BARRIER.UNKNOWN ? BARRIER.OPEN : curAdjCellValue
      
      // update if CLOSED value
      if(cellValueKey.at(indx) === '0'){
        let updateIndx
        switch(indx) {
          case DIRECTION.BOTTOM: updateIndx = DIRECTION.TOP; break
          case DIRECTION.LEFT: updateIndx = DIRECTION.RIGHT; break
          case DIRECTION.RIGHT: updateIndx = DIRECTION.LEFT; break
          case DIRECTION.TOP: updateIndx = DIRECTION.BOTTOM; break
        }
        if(!updateIndx) return // failsafe
        curAdjCellValue = curAdjCellValue.substring(0,updateIndx)+'0'+curAdjCellValue.substring(updateIndx+1)
      }
      pendingCells[cell] = curAdjCellValue
      // if -v(erbose) flag
      if(parsedArgs.v)
        Grid.Set.Cells({location:[cell],value:'['+openDirectionBarriers[curAdjCellValue].length+']'})
    })
  }

  Grid.Render()
  if(runAgain<amtUncollapsed-1) {
    ++runAgain
    if(parsedArgs.anim)
      setTimeout(collapsePending,parsedArgs.anim)
    else
      collapsePending()
  }
  else {
    if(!parsedArgs.anim){
      console.clear()
      console.log('collapsedCells: ', collapsedCells)
    }
  }
}

export const WaveFunctionCollapse = async (args:typeof parsedArgs) => {
  parsedArgs = {...args}
  await Seed.Create({
    requiredLength:Math.ceil((parsedArgs.w * parsedArgs.h)*1.5),
    shaSeed: parsedArgs.seeded
  })
  collapsePending()
}