// deno run alogrithms/diamond-square.ts 
import { ArrayGrid } from '»/array.grid.ts'
import { GRID_DIRECTIONS } from '¢/iterables.array.grid.ts'

type FourPointsType = [number,number,number,number]
type CurStepType = {
  diamond:FourPointsType,
  midpoint:number,
  square:FourPointsType,
}

const { Grid } = ArrayGrid

const gridConfig = {FILL_CHARACTER:0,GRID_HEIGHT:5,GRID_WIDTH:5}
// const gridConfig = {FILL_CHARACTER:0,GRID_HEIGHT:7,GRID_WIDTH:7}
// const gridConfig = {FILL_CHARACTER:0,GRID_HEIGHT:9,GRID_WIDTH:9}
Grid.Create.Config(gridConfig)

console.log('UtilsGrid.: ', Grid.Create.Initial())
console.log('--------------------------------------------')

// Setup
const initial = {
  indexesLength: gridConfig.GRID_WIDTH,
  randomRange: 5, // 125,
  value: 7 // Math.round(Math.random()*35+35),
}

// Utils
// Grid.Create.SubGrid([10,10],[13,12])
const reduceRandomness = () => {
        initial.randomRange = Math.max(
          // Math.ceil(initial.randomRange - Math.random()*initial.randomRange),
          initial.randomRange -1, 1)
      },
      curStepIndexes:CurStepType = {
        diamond:[0,0,0,0],
        midpoint:0,
        square:[0,0,0,0]
      },
      resetCurStepIndexes = () => {
        curStepIndexes.diamond.fill(0)
        curStepIndexes.midpoint = 0
        curStepIndexes.square.fill(0)
      },
      getSquareIndexes = (len:number,offset:number):FourPointsType => [Math.max(offset,0),offset+len,len**2-len+offset+1,len**2+offset],
      getDiamondAppliedIndexes = (dimensions:{w:number,h:number},perimeterIndexes:number[]):FourPointsType => [
                            perimeterIndexes[perimeterIndexes.length-Math.ceil(dimensions.w/2)], // top
                            perimeterIndexes[perimeterIndexes.length-dimensions.w-Math.ceil(dimensions.w/2)], // left
                            perimeterIndexes[dimensions.w+Math.floor(dimensions.w/2)], // right
                            perimeterIndexes[Math.floor(dimensions.w/2)], // bottom
                          ],
      getMidPointAppliedIndex = (appliedIndexes:number[]) => appliedIndexes[Math.floor(appliedIndexes.length/2)],
      getSquareIndexesByCornerPoints = (subgrid:any):FourPointsType => {
                            const squareIndexes:FourPointsType = [
                              subgrid.subGridPerimeter.applied[subgrid.subGridPerimeter.applied.length-1],
                              subgrid.subGridPerimeter.applied[subgrid.subGridPerimeter.applied.length-subgrid.subGridDimensions.w],
                              subgrid.subGridPerimeter.applied[subgrid.subGridDimensions.w-1],
                              subgrid.subGridPerimeter.applied[0],
                            ]
                            return squareIndexes
                          },
      determineIndexesByCornerPoints = (cornerPoints:[number,number]) => {
                            resetCurStepIndexes()
                            const sG = Grid.Create.SubGrid(...cornerPoints)
                            // console.log('sG: ', sG)
                            curStepIndexes.square = getSquareIndexesByCornerPoints(sG)
                            curStepIndexes.midpoint = getMidPointAppliedIndex(sG.subGridIndexes)
                            curStepIndexes.diamond = getDiamondAppliedIndexes(sG.subGridDimensions,sG.subGridPerimeter.applied)
                            // console.log('curStepIndexes: ', curStepIndexes)
                          }


// Set Values
const curStepValues:CurStepType = {
        diamond:[0,0,0,0],
        midpoint:0,
        square:[0,0,0,0]
      },
      gridPerimeter = Grid.Get.Perimiter(),
      getAverage = (points:FourPointsType) => Math.round(points.reduce((a,c)=>a+c,0)/points.length),
      pointOffset = () => {
        const offsetAmt = Math.floor(Math.random()*initial.randomRange),
        offsetSign = offsetAmt%2===0 ? 1 : -1
        return offsetAmt * offsetSign
      },
      setMidpointValue = () => getAverage(curStepValues.square) + pointOffset(),
      getSquareValues = ():FourPointsType => Grid.Get.Cells({location:curStepIndexes.square}) as FourPointsType,
      applyDiamondValues = () => {
        const len = curStepIndexes.diamond[0]-curStepIndexes.square[0],
              pnts:FourPointsType[] = []
        curStepIndexes.diamond.forEach(dI => {
          const borderCells = Grid.Get.Cells({location:[
            dI-(gridConfig.GRID_WIDTH*len), // up
            dI-len, // left
            dI+len, // right
            dI+(gridConfig.GRID_WIDTH*len), // down
          ]}) || []
          
          // handle perimeter - TODO: Make this a lot cleaner
          if(gridPerimeter.includes(dI)){ // if on perimeter
            let rowMatch = false // possible to match on both row and column perimeter - this prevents that
            // update out of bounds value to wrap
            if(dI<gridConfig.GRID_WIDTH) { // top row
              rowMatch = true
              // same column in bottom row
              const wrapPos = gridConfig.GRID_WIDTH**2-(gridConfig.GRID_WIDTH-dI)
              borderCells[0] = Grid.Get.Cells({location:[wrapPos - (gridConfig.GRID_WIDTH*len)]})?.pop()
            }
            if(dI>gridConfig.GRID_WIDTH**2-gridConfig.GRID_WIDTH-1) { // bottom row
              rowMatch = true
              // same column in top row
              const wrapPos = dI-gridConfig.GRID_WIDTH**2+gridConfig.GRID_WIDTH
              borderCells[3] = Grid.Get.Cells({location:[wrapPos + (gridConfig.GRID_WIDTH*len)]})?.pop()
            }
            if(!rowMatch){
              if(gridPerimeter.indexOf(dI) >= gridPerimeter.length/2) { // left column
                // same row in right column
                const wrapPos = dI+gridConfig.GRID_WIDTH-1
                borderCells[1] = Grid.Get.Cells({location:[wrapPos - len]})?.pop()
              }
              if(gridPerimeter.indexOf(dI) < gridPerimeter.length/2) { // right column
                // same row in left column
                const wrapPos = dI-gridConfig.GRID_WIDTH+1
                borderCells[2] = Grid.Get.Cells({location:[wrapPos + len]})?.pop()
              }
            }
          }
          pnts.push(borderCells as FourPointsType)
        })
        pnts.forEach((pnt,indx) => {
          curStepValues.diamond[indx] = getAverage(pnt) + pointOffset()
        })
        Grid.Set.Cells({location:curStepIndexes.diamond,value:curStepValues.diamond})
      },
      applySquareValues = () => {
        curStepValues.square = getSquareValues()
        curStepValues.midpoint = setMidpointValue()
        Grid.Set.Cells({location:[curStepIndexes.midpoint],value:curStepValues.midpoint})
      }

// initialize with corners
Grid.Set.Cells({location:getSquareIndexes(gridConfig.GRID_WIDTH,-1),value:initial.value})
Grid.Render()

/* INITIAL 
// loop below // initial
determineIndexes(initial.indexesLength)
applySquareValues()
applyDiamondValues()
reduceRandomness()


// console.log('curStepIndexes: ', curStepIndexes)
// console.log('curStepValues: ', curStepValues)
// console.log('initial: ', initial)

Grid.Set.Cells({location:curStepIndexes.square,value:[1,2,3,4]})
Grid.Set.Cells({location:[curStepIndexes.midpoint],value:[5]})
Grid.Set.Cells({location:curStepIndexes.diamond,value:[6,7,8,9]})

Grid.Render()
*/
// console.log('Grid cell at: ', Grid.Get.Cells({location:[{X:4,Y:0}]}))

// console.log('Grid.Create.SubGrid([0,0],[2,2]): ', Grid.Create.SubGrid([0,0],[2,2]))


/*
const indexArr:Array<[number,number]>=[ [ 0, 24 ], [ 0, 12 ], [ 2, 14 ], [ 10, 22 ], [ 12, 24 ] ]
indexArr.forEach((cornerPoints) => {
  determineIndexesByCornerPoints(cornerPoints)
  applySquareValues()
  Grid.Render()
  applyDiamondValues()
  Grid.Render()
  // console.log('curStepIndexes: ', curStepIndexes)
  // console.log('curStepValues: ', curStepValues)
  reduceRandomness()
})

Grid.Render()
console.log('The above is CLOSER .,... HOWEVER:::');
console.log('we need this to run in grouped steps');
console.log(`for instance:
- FIRST > ALL of the square+midpoint transforms run for one subgroup
- THEN > ALL of the diamond transforms run for that subgroup
- THEN > move to the next subgroup and repeat
`);
*/

/*
const groupedIndexArr:Array<[number,number][]>=[ [[ 0, 24 ]], [[ 0, 12 ], [ 2, 14 ], [ 10, 22 ], [ 12, 24 ]] ]
groupedIndexArr.forEach(subgroup => {
  subgroup.forEach((cornerPoints) => {
    determineIndexesByCornerPoints(cornerPoints)
    applySquareValues()
    Grid.Render()
  })
  subgroup.forEach((cornerPoints) => {
    determineIndexesByCornerPoints(cornerPoints)
    applyDiamondValues()
    reduceRandomness()
    Grid.Render()
  })
})
Grid.Render()
*/

/*
console.log('curStepIndexes: ', curStepIndexes)
console.log('curStepValues: ', curStepValues)
console.log('initial: ', initial)
*/

const dlTst = () => {
  // what 5 should output:
  // console.log('full: ', Grid.Create.SubGrid(0,24))
  // console.log('loop 1');
  // console.log('full: ', Grid.Create.SubGrid(0,12))
  // console.log('full: ', Grid.Create.SubGrid(2,14))
  // console.log('full: ', Grid.Create.SubGrid(10,22))
  // console.log('full: ', Grid.Create.SubGrid(12,24))
  // initial.indexesLength = 7

  const finalIndex = initial.indexesLength**2-1
  let divisionPoint = finalIndex / 2,
      algorithmPoints:Array<[number,number][]> = [[[0,finalIndex]]]
  console.log('finalIndex: ', finalIndex, divisionPoint)
  while (divisionPoint >= 9) { // at index 9 the 3x3 grid has been established
    const subGridAmt = (finalIndex/divisionPoint)**2,
          indexShift = Math.floor(Math.sqrt(divisionPoint)-1)
    console.log('divisionPoint: ', divisionPoint)
    console.log('subGridAmt: ', subGridAmt)
    console.log('indexShift: ', indexShift)
    const subgridPoints:[number,number][] = [],
        subgridPointsFromEnd:[number,number][] = []
    for(let i=0; i<subGridAmt/2; i++){
    // for(let i=0; i<divisionPoint; i+=indexShift){
      const offsetIndexShift = i*indexShift
      if(offsetIndexShift>divisionPoint) break
      subgridPoints.push([offsetIndexShift,divisionPoint+offsetIndexShift]) // walk up
      subgridPointsFromEnd.push([divisionPoint-offsetIndexShift,finalIndex-offsetIndexShift])// walk down
      console.log('subgridPointsFromEnd: ', subgridPointsFromEnd)
    }
    subgridPoints.push(...subgridPointsFromEnd.reverse())
    algorithmPoints.push(subgridPoints)
    
    // console.log('finalIndex/divisionPoint: ', finalIndex/divisionPoint)
    // console.log('finalIndex/subGridAmt: ', finalIndex/subGridAmt)
    // console.log('9*subGridAmt: ', 9*subGridAmt)

    // const indexShift = Math.floor(divisionPoint / 2 - 1)
    // console.log('divisionPoint: ', divisionPoint, indexShift)
    // algorithmPoints = [
    //   ...algorithmPoints,
    //   [0,divisionPoint], [indexShift,divisionPoint+indexShift],
    //   [divisionPoint-indexShift,finalIndex-indexShift],[divisionPoint,finalIndex]
    // ]
    divisionPoint /= 2
  }
  
  console.log('algorithmPoints: ', algorithmPoints)

Grid.Render(1)
  // 5x5 gives: Array<[number,number][]>=[ [[ 0, 24 ]], [[ 0, 12 ], [ 2, 14 ], [ 10, 22 ], [ 12, 24 ]] ]

  // algorithmPoints = []; console.log('DEBUG!!!! <<<< REMOVE THIS line when ready')
  algorithmPoints.forEach(subgroup => {
    subgroup.forEach((cornerPoints) => {
      determineIndexesByCornerPoints(cornerPoints)
      applySquareValues()
      Grid.Render()
    })
    subgroup.forEach((cornerPoints) => {
      determineIndexesByCornerPoints(cornerPoints)
      applyDiamondValues()
      reduceRandomness()
      Grid.Render()
    })
  })
  // Grid.Render()
}
dlTst()
