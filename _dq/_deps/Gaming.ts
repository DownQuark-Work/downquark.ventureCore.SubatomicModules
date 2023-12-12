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
import { InitMazeType } from '@/algorithms/procedural-generation/maze/base.type.ts'
import { APPLY_ALGORITHM } from '@/algorithms/procedural-generation/maze/base.algorithm.ts'

let SeededValue = {}
export const Seed = {
  Create: createPseudoSeed,
  Parser, Pointer,
  Seeded: ()=>SeededValue
}

import { MAZE_CELL as CELL } from '¢/maze.cell.ts'
import { MAZE_ALGORITHM as ALGORITHM } from '¢/maze.algorithm.ts'
export const MAZE = { ALGORITHM, CELL }

export const initGame = async (cnfg:any) => {
  // console.log('cnfg: ', cnfg)
  // store for use
  const baseMazeFormula = cnfg.Maze?.algorithm?.formula,
        baseMazeType = cnfg.Maze?.algorithm?.base,
        baseMazeTypeIsBordered = baseMazeType === ALGORITHM._BASE.BORDERED,
        baseMazeTypeIsCarved = baseMazeType === ALGORITHM._BASE.CARVED
  
  if(baseMazeTypeIsCarved) {
    // console.log('baseMazeFormula: ', baseMazeFormula)
    // the length of the width and height must be odd for carved grids
    if(!cnfg.Grid.GRID_HEIGHT.isOdd()) --cnfg.Grid.GRID_HEIGHT
    if(!cnfg.Grid.GRID_WIDTH.isOdd()) --cnfg.Grid.GRID_WIDTH
    cnfg.Grid.FILL_CHARACTER = baseMazeFormula._name === ALGORITHM.SIDEWINDER
      ? MAZE.CELL.CARVED.SOLID // handle sidewinder as a one-off
      : MAZE.CELL.DEBUG.BASE // default set all cells to be basic
    
  }

  // create grid
  Grid.Create.Config(cnfg.Grid)
  Grid.Create.Initial()

  // TODO: MOVE SEEDED TO NEW FILE IF/WHEN APPROPRIATE
  // create prng w/ seed
  const pseudoSeed = await Seed.Create(cnfg.Seed)
  // register pointer
  const curPointer = Pointer.registerSeedPointer('_BASE_SEED_POINTER')
  SeededValue = {...pseudoSeed,curPointer} // allows access to pointer from outside this file

  baseMazeType // type is required
    && InitMazeType({
      cnfg,
      baseMazeTypeIsBordered, baseMazeTypeIsCarved,
      Grid, Maze
    })
  baseMazeFormula._name // formula is required
    && (APPLY_ALGORITHM[baseMazeFormula._name] as Function)({cnfg,Grid, Maze})

return Promise.resolve()
}