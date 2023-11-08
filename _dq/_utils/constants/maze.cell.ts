enum MAZE_CELL_TYPES  {
  BORDERED = 'BORDERED',
  CARVED = 'CARVED',
  COMMON = 'COMMON',
  DEBUG = 'DEBUG',
  EGRESS = 'EGRESS',
}
enum MAZE_CELL_TYPES_COMMON {
  BASE = ' ',
  PERIMETER = '⨳',
  QUEUED = '⥁',
  UNVISITED = '◇',
  VISITED = '◆',
}
enum MAZE_CELL_TYPES_EGRESS {
  ENTRANCE = '○',
  EXIT = '✪',
  UP = '⤣',
  DOWN = '⤥',
}
enum MAZE_CELL_TYPES_CARVED {
  PASSAGE = ' ', // '◻︎',
  SOLID = '🀫' // ◼︎
}

// for use when developing the algorithms
enum MAZE_CELL_TYPES_DEBUG {
  BASE = '◻︎',
  CONSIDER = '⁇',
  CURRENT = '⟡',
  PATH = '◘',
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

console.log('CELL: ', CELL)
export const MAZE_CELL = CELL