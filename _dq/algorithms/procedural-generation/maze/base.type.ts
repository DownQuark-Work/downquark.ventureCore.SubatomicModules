import { MAZE_CELL as CELL } from '¢/maze.cell.ts'
import { MAZE_ALGORITHM as ALGORITHM } from '¢/maze.algorithm.ts'
export const MAZE = { ALGORITHM, CELL }

export const InitMazeType = (MazeType:any) => {
  const {
    cnfg,
    baseMazeTypeIsBordered, baseMazeTypeIsCarved,
    Grid, Maze
  } = MazeType // destructure type
  
  // clone and store index
  const cellIndexes = Object.keys(Grid.Get.Cells() as Array<unknown>).map(k => parseInt(k,10))
  Maze.Set.MutableGridValues({
      cells:[...cellIndexes],
      height: cnfg.Grid.GRID_HEIGHT,
      perimeter:[...Grid.Get.Perimiter()],
      width: cnfg.Grid.GRID_WIDTH,
    })

  if(baseMazeTypeIsCarved) { // configure inital carved grid
    Maze.Create.Initial.Carved() // create initial maze
    const initialCarved = Maze.Get.Initial.Carved(),
          everyOther = {
            cell: initialCarved.filter((_crv:number,indx:number) => indx.isOdd()),
            row: initialCarved.filter((crv:number) => Math.floor(crv/cnfg.Grid.GRID_WIDTH).isOdd()), 
          }, // store odd indexes
          
          // initialCarved.filter((crv:number,indx:number) => {
          //   if(Math.floor(crv/cnfg.Grid.GRID_WIDTH).isOdd()) return false
          //   // console.log('Math.floor(indx/cnfg.Grid.GRID_WIDTH): ',indx, Math.floor(indx/cnfg.Grid.GRID_WIDTH))
          //   return indx.isOdd()
          // }), // store odd indexes
          perim = Grid.Get.Perimiter(), // store outer perimeter
          adjacentPerim = [...new Set(perim.reduce((a:number[],c:number)=> {
            a.push(c+1,c-1,c+cnfg.Grid.GRID_WIDTH,c-cnfg.Grid.GRID_WIDTH)
            return a // store cells adjacent to outer perimeter
          },[]))]
    // Grid.Set.Cells({location:everyOther.cell,value:MAZE.CELL.CARVED.PASSAGE}) // all odd indexed cells are a valid passage
    Grid.Set.Cells({location:everyOther.cell,value:MAZE.CELL.COMMON.UNVISITED}) // all odd indexed cells are visitable - but default to unvisited
    Grid.Set.Cells({location:everyOther.row,value:MAZE.CELL.DEBUG.BASE}) // all cells in odd rows are base (must be carved, cannot be visited)
    Grid.Set.Cells({location:adjacentPerim,value:MAZE.CELL.DEBUG.BASE}) // all cells adjacent to the perimeter are base (must be carved, cannot be visited)
    Grid.Set.Cells({location:perim,value:MAZE.CELL.COMMON.PERIMETER}) // perimeter cells take priority and overwrite any overlap from the above
  }

  if(baseMazeTypeIsBordered) { // configure inital bordered grid
    Maze.Create.Initial.Bordered() // create initial maze
    Maze.Get.Initial.Bordered()
    const perim = Grid.Get.Perimiter() // store outer perimeter
    Grid.Set.Cells({location:perim,value:MAZE.CELL.COMMON.PERIMETER}) // perimeter cells take priority and overwrite any overlap from the above
  }
}