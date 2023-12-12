enum MAZE_CELL_TYPES  {
  BORDERED = 'BORDERED',
  CARVED = 'CARVED',
  COMMON = 'COMMON',
  DEBUG = 'DEBUG',
  EGRESS = 'EGRESS',
}
enum MAZE_CELL_TYPES_COMMON {
  BASE = ' ',
  PERIMETER = '#',
  QUEUED = '⥁',
  UNVISITED = '◇',
  VISITED = '◆',
}
enum MAZE_CELL_TYPES_EGRESS {
  ENTRANCE = '🟢',
  EXIT = '🔵',
  UP = '⤣',
  DOWN = '⤥',
}
enum MAZE_CELL_TYPES_CARVED {
  PASSAGE = ' ', // '◻︎',
  SOLID = '◼︎' // ◼︎
}

// for use when developing the algorithms
enum MAZE_CELL_TYPES_DEBUG {
  BASE = '◻︎',
  CONSIDER = '⁇',
  CURRENT = '⟡',
  PATH = '◘',
}

enum MAZE_CELL_TYPES_CANVAS { // maps symbols to colors
  '◆' = 'rgba(0,125,125,.6)', // VISITED
  '◇' = 'rgba(125,0,125,.4)', // UNVISITED
  '🟢' = 'rgba(50,205,50,1)', // ENTRANCE
  '🔵' = 'rgba(50,50,205,1)', // EXIT
  '⤣' = 'rgba(50,150,150,1)', // UP
  '⤥' = 'rgba(50,50,50,1)', // DOWN
  '⥁' = 'rgba(125,0,125,1)', // QUEUED
  '#' = 'rgba(0,0,0,.8)', // PERIMETER
  '◼︎' = 'rgba(125,125,125,.95)', // SOLID
}

/** The `MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP` enum
 *  corresponds to which sides of the cell have a border:
 * > e.g.:
 * [0,0,0,0] => NO borders shown on tile
 * [1,1,1,1] => ALL sides display border
 * [0,1,1,0] => LEFT && RIGHT sides display border
 * > Usable with getters and setters. For example:
 * ```
 * const activeCellBorders = [0,1,0,1]
 * activeCellBorders[MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP.BOTTOM] // 1
 * activeCellBorders[MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP.TOP] // 0
 * activeCellBorders[MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP.TOP] // 1
 * activeCellBorders[MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP.TOP] // 1
 * ```
*/
enum MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP {
  TOP = 0, RIGHT = 1, BOTTOM = 2,  LEFT = 3, // in same order as css shorthand
}
/** The `MAZE_CELL_TYPES_BORDERED` enum acts as shorthand when using
 * the implementation given above.
 * > e.g.:
 * ```
 * const activeCellBorders = splitToInt(MAZE_CELL_TYPES_BORDERED.V)
 * activeCellBorders[MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP.LEFT] // 1
 * activeCellBorders[MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP.TOP] // 0
 * activeCellBorders[MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP.RIGHT] // 1
 * ```
 */
enum MAZE_CELL_TYPES_BORDERED {
  BL = '0,0,1,1', BR ='0,1,1,0',
  H = '1,0,1,0', // horizontal
  TL = '1,0,0,1', TR = '1,1,0,0',
  V = '0,1,0,1', // vertical,
  ALL = '1,1,1,1', NONE = '0,0,0,0'
}


const MAZE_CELL_TYPES_KEY_TO_ENUM_MAP =  {
  BORDERED: MAZE_CELL_TYPES_BORDERED,
  CARVED: MAZE_CELL_TYPES_CARVED,
  COMMON: MAZE_CELL_TYPES_COMMON,
  DEBUG: MAZE_CELL_TYPES_DEBUG,
  EGRESS: MAZE_CELL_TYPES_EGRESS,
}
const CELL:any = {}

for(let mCT in MAZE_CELL_TYPES) {
  CELL[mCT] = MAZE_CELL_TYPES_KEY_TO_ENUM_MAP[mCT as keyof typeof MAZE_CELL_TYPES_KEY_TO_ENUM_MAP]
}
CELL.BORDERED.INDEX = MAZE_CELL_TYPES_BORDERED_INDEX_DIRECTION_MAP
CELL.BORDERED.SYMBOL_TO_COLOR_MAP = MAZE_CELL_TYPES_CANVAS

// console.log('CELL: ', CELL)
export const MAZE_CELL = CELL