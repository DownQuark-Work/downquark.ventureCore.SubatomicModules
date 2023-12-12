import { MAZE_ALGORITHM } from '¢/maze.algorithm.ts'
import { ELLER } from './algorithms/eller.ts'
import { SIDEWINDER } from './algorithms/sidewinder.ts'

export const APPLY_ALGORITHM:{[k:keyof typeof MAZE_ALGORITHM]: unknown} = {}
APPLY_ALGORITHM[MAZE_ALGORITHM.SIDEWINDER] = SIDEWINDER
APPLY_ALGORITHM[MAZE_ALGORITHM.ELLER] = ELLER