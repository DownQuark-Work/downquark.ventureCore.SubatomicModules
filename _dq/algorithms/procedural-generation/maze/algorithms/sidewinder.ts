import { Grid, Seed } from '¿/Gaming.ts'
import { MAZE_CELL } from '¢/maze.cell.ts'
import formatNum from '../../../../../external/iarna-toml/lib/format-num.js';

const SidewinderAlgorithm = {
  _RootGrid:{
    Get:{Cells:(cell:any)=>[]},
    Set:{Cells:(cell:any)=>{}}},
  Config:{Grid:{GRID_WIDTH:0},Maze:{animationStepDelay:0,callback:{onProcGenComplete:(stringifiedJsonMaze:string)=>{}},exportPath:undefined}},
  Grid:{subGridDimensions:{w:0},subGridIndexes:[],subGridPerimeter:{applied:[]}},
  WalkIndices:[]
}
const argumentDefaults:Record<string,number> = {
  paddingPerimeterHorizontal: 0, // leftPadding - right padding will be determined as needed
    // the amount of space between the perimeter and any place a block or passage can be added
    // this should be a minimum of 1 to ensure adjusting for `adjacentVertValues` below does not error
  carveNorthMaxAmt:3, // minimum of 1 required
  carveNorthPercent:30, // more vertical moves with higher values
}
export const withArgs = (args:object) => {
  const defaultArgs = {
    ...argumentDefaults,
    ...args
  }
  Object.entries(defaultArgs).forEach(entry => {
    argumentDefaults[entry[0]] = entry[1]
  })
}

let renderAnimationStep = async (wlk:number,val='🤓') => {
  console.clear()
  wlk && Grid.Set.Cells({location:wlk,value:val})
  Grid.Render()
  return new Promise((resolve) => setTimeout(resolve, (wlk && val==='🤓')
    ? SidewinderAlgorithm.Config.Maze.animationStepDelay
    : SidewinderAlgorithm.Config.Maze.animationStepDelay*8))
}

const determineEgress = async () => {
  const egress = [MAZE_CELL.EGRESS.ENTRANCE,MAZE_CELL.EGRESS.EXIT],
        bottomRowEgress = Seed.Parser.parseOptionWithSeedValue('BOOL')
                        ? egress.pop() : egress.shift(),
        topRowEgress = egress.pop()

  const topRowLocation = [...Array(SidewinderAlgorithm.Config.Grid.GRID_WIDTH).keys()],
        topPassageLocation = topRowLocation.map(loc => loc+SidewinderAlgorithm.Config.Grid.GRID_WIDTH)
        topPassageLocation.pop(); topPassageLocation.shift() // allows perimeters to remain as-is
  const topRowOpts = SidewinderAlgorithm._RootGrid.Get.Cells({location:topRowLocation}).reduce((a:number[],c,i) => { if(c===MAZE_CELL.CARVED.PASSAGE)a.push(i); return a} ,[]),
        topRowIndex = Seed.Parser.parseOptionWithSeedValue(topRowOpts) as number
        topRowLocation.splice(topRowIndex,1)
        SidewinderAlgorithm._RootGrid.Set.Cells({location:topRowLocation,value:MAZE_CELL.COMMON.PERIMETER})
        SidewinderAlgorithm._RootGrid.Set.Cells({location:topPassageLocation,value:MAZE_CELL.CARVED.PASSAGE})
        SidewinderAlgorithm._RootGrid.Set.Cells({location:topRowIndex,value:topRowEgress})
  await renderAnimationStep(0)
  const bottomRowLocation = SidewinderAlgorithm.Grid.subGridPerimeter.applied.toSpliced(SidewinderAlgorithm.Grid.subGridDimensions.w),
        bottomPassageIndex = Seed.Parser.parseOptionWithSeedValue(bottomRowLocation) as number, // this will eliminate any solid in the bottom carved passage (if it exists)
        bottomPerimeterIndex = bottomPassageIndex + SidewinderAlgorithm.Grid.subGridDimensions.w // this will remove the perimeter
        SidewinderAlgorithm._RootGrid.Set.Cells({location:bottomPassageIndex,value:MAZE_CELL.CARVED.PASSAGE})
        SidewinderAlgorithm._RootGrid.Set.Cells({location:bottomPerimeterIndex,value:bottomRowEgress})
  await renderAnimationStep(0)
  // final value should always be exported JSON or TOML for use in whatever following step is desired
  console.clear()
  const jsonForCallback = Grid.Export.JSON(SidewinderAlgorithm.Config.Maze.exportPath) as string
  SidewinderAlgorithm.Config.Maze?.callback?.onProcGenComplete(jsonForCallback)
}

const walkCarvedGridCells = async () => { // async to allow for render animation
  let createSolid=false, carvedRowLocations:Array<[number,number]>=[],
      curRun:number[]=[]
  function doCarveNorth(){
    if(curRun.length < argumentDefaults.paddingPerimeterHorizontal)
      return false // ensures spacing between carves
    if(createSolid) { createSolid = false; return false } // prevents horizontally adjacent carves
    const cN = Seed.Parser.parseOptionWithSeedValue({RANGE:[0,100]}) as number
    if(cN < argumentDefaults.carveNorthPercent) createSolid = true
    return createSolid
  }
  function createCarveNorth(solidCellIndex:number){
    let northCarveLocation = Seed.Parser.parseOptionWithSeedValue(curRun) as number - SidewinderAlgorithm.Config.Grid.GRID_WIDTH
    let verticallyAdjacentCell = SidewinderAlgorithm._RootGrid.Get.Cells({location:northCarveLocation-SidewinderAlgorithm.Config.Grid.GRID_WIDTH})
    while(verticallyAdjacentCell[0]
      && verticallyAdjacentCell[0]!==MAZE_CELL.CARVED.PASSAGE
      && northCarveLocation > 0
    ){
      ++northCarveLocation
      verticallyAdjacentCell = SidewinderAlgorithm._RootGrid.Get.Cells({location:northCarveLocation-SidewinderAlgorithm.Config.Grid.GRID_WIDTH})
      if(SidewinderAlgorithm._RootGrid.Get.Cells({location:northCarveLocation}) === MAZE_CELL.COMMON.PERIMETER) northCarveLocation = -1 // failsafe
    }
    SidewinderAlgorithm._RootGrid.Set.Cells({location:northCarveLocation,value:MAZE_CELL.CARVED.PASSAGE})
    carvedRowLocations.push([solidCellIndex,northCarveLocation])
    curRun=[]
  }
  async function onWalkedFullRow(walk:number){
    if(curRun.length) // possible there is a `solid` adjacent to the perimeter
    createCarveNorth(walk)
  // Apply `carveNorthMaxAmt` to limit amount of carves per row
  while(carvedRowLocations.length > argumentDefaults.carveNorthMaxAmt){
    const removeCarveAtIndex = Seed.Parser.parseOptionWithSeedValue({RANGE:[0,carvedRowLocations.length-1]}) as number,
          removeCarve = carvedRowLocations.splice(removeCarveAtIndex,1).pop()
          // renderAnimationStep
    await renderAnimationStep((removeCarve as any),'💥')
    SidewinderAlgorithm._RootGrid.Set.Cells({location:removeCarve?.[0],value:MAZE_CELL.CARVED.PASSAGE})
    SidewinderAlgorithm._RootGrid.Set.Cells({location:removeCarve?.[1],value:MAZE_CELL.CARVED.SOLID})
  }
  carvedRowLocations = []
  return Promise.resolve()
  }
   // for loop to allow for render animation
  for(let walkIndex=0;walkIndex<SidewinderAlgorithm.WalkIndices.length;walkIndex++){
    const walk = SidewinderAlgorithm.WalkIndices[walkIndex],
    curCell = SidewinderAlgorithm._RootGrid.Get.Cells({location:walk})[0]
    
    if(curCell === MAZE_CELL.CARVED.PASSAGE) {
      if(doCarveNorth()){
        SidewinderAlgorithm._RootGrid.Set.Cells({location:walk,value:MAZE_CELL.CARVED.SOLID})
        createCarveNorth(walk)
      } else {
        curRun.push(walk)
        await renderAnimationStep(walk) // renderanimation - display emoji for UI step
        Grid.Set.Cells({location:walk,value:MAZE_CELL.CARVED.PASSAGE}) // remove emoji before logic step
      }
    }
    if(curCell === MAZE_CELL.COMMON.PERIMETER){ await onWalkedFullRow(walk) }
  }
  if(curRun.length) // ensures bottom right of maze has a north carve
    await onWalkedFullRow(SidewinderAlgorithm.WalkIndices.length)
  determineEgress()
}

export const SIDEWINDER = (args:any) => {
  const {cnfg,Grid, Maze} = args
  if(!~cnfg.Maze.animationStepDelay) renderAnimationStep = (_a,_b)=>Promise.resolve()
  SidewinderAlgorithm._RootGrid = Grid
  SidewinderAlgorithm.Config = cnfg
  // console.log('cnfg: ', cnfg); return
  SidewinderAlgorithm.Grid = Grid.Create.SubGrid([1,1],[cnfg.Grid.GRID_WIDTH-2,cnfg.Grid.GRID_HEIGHT-2])
  SidewinderAlgorithm.WalkIndices = Maze.Get.Carved.Indexes().row
  argumentDefaults.paddingPerimeterHorizontal = Math.ceil((cnfg.Grid.GRID_WIDTH/argumentDefaults.carveNorthMaxAmt)/2)
  if(cnfg.Maze.algorithm.base === 'CARVED') walkCarvedGridCells()
}