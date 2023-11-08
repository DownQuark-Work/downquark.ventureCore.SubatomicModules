// curated dependencies for game dev

// Grid
import { ArrayGrid } from '»/array.grid.ts'
export const { Grid } = ArrayGrid

// PRNG && Seed
import * as Parser from '@/iterables/seed/parser.ts'
import * as Pointer from '@/iterables/seed/pointer.ts'
import { createPseudoSeed } from '»/prng.seed.ts'

export type { SeedConfigType } from '»/prng.seed.ts'

// Maze
import { Maze } from '@/algorithms/procedural-generation/maze/_base.ts'

let SeededValue = {}
export const Seed = {
  Create: createPseudoSeed,
  Parser, Pointer,
  Seeded: ()=>SeededValue
}

import { MAZE_CELL as CELL } from '¢/maze.cell.ts'
import { MAZE_ALGORITHM as ALGORITHM } from '../_utils/constants/maze.algorithm.ts'
export const MAZE = { ALGORITHM, CELL }

export const initGame = async (cnfg:any) => {
  // store for use
  const baseMazeType = cnfg.Maze?.algorithm?.base,
        baseMazeTypeIsCarved = baseMazeType === ALGORITHM._BASE.CARVED
  
  if(baseMazeTypeIsCarved) {
    // the length of the width and height must be odd for carved grids
    if(!cnfg.Grid.GRID_HEIGHT.isOdd()) --cnfg.Grid.GRID_HEIGHT
    if(!cnfg.Grid.GRID_WIDTH.isOdd()) --cnfg.Grid.GRID_WIDTH
    cnfg.Grid.FILL_CHARACTER = MAZE.CELL.COMMON.UNVISITED // set all cells to unvisited
  }
// console.log('cnfg.Grid: ', cnfg.Grid)
  // create grid
  Grid.Create.Config(cnfg.Grid)
  Grid.Create.Initial()

  // create prng w/ seed
  const pseudoSeed = await Seed.Create(cnfg.Seed)
  // register pointer
  const curPointer = Pointer.registerSeedPointer('_BASE_SEED_POINTER')
  SeededValue = {...pseudoSeed,curPointer} // allows access to pointer from outside this file

  if(baseMazeType) {
    // clone and store index
    const cellIndexes = Object.keys(Grid.Get.Cells() as Array<unknown>).map(k => parseInt(k,10))
    Maze.Set.MutableGridValues({
        cells:[...cellIndexes],
        height: cnfg.Grid.GRID_HEIGHT,
        perimeter:[...Grid.Get.Perimiter()],
        width: cnfg.Grid.GRID_WIDTH,
      })

    if(baseMazeTypeIsCarved) { // if carved base type then configure inital grid
      Maze.Create.Initial.Carved() // create initial maze
      const initialCarved = Maze.Get.Initial.Carved(),
            everyOther = initialCarved.filter((_crv,indx) => indx.isOdd()), // store odd indexes
            perim = Grid.Get.Perimiter(), // store outer perimeter
            adjacentPerim = [...new Set(perim.reduce((a:number[],c:number)=> {
              a.push(c+1,c-1,c+cnfg.Grid.GRID_WIDTH,c-cnfg.Grid.GRID_WIDTH)
              return a // store cells adjacent to outer perimeter
            },[]))]
      Grid.Set.Cells({location:everyOther,value:MAZE.CELL.CARVED.PASSAGE}) // all odd indexed cells are a valid passage
      Grid.Set.Cells({location:adjacentPerim,value:MAZE.CELL.COMMON.UNVISITED}) // all cells adjacent to the perimeter are unvisited
      Grid.Set.Cells({location:perim,value:MAZE.CELL.COMMON.PERIMETER}) // perimeter cells take priority and overwrite any overlap from the above
    }
  }

return Promise.resolve()
}