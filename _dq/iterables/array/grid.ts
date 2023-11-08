import { OneOrMany } from '†/common.d.ts'
import { GRID_DIRECTIONS } from '¢/iterables.array.grid.ts'

import * as ArrayGridType from '†/_utils/array-grid.d.ts'

const _GRID_DEFAULTS:{[k:string]:any} = {
  FILL_CHARACTER:0, // if nullish (??) the index value will be rendered
  GRID_HEIGHT:13,
  GRID_WIDTH:42,
  INIT_POSITION: {
    INDEX:0,
    COORDINATES:[0,0],
  }
}

// variables
const _GridUtils:ArrayGridType.GridUtilsType = {
  _CELLS:[],
  INDEXES:[],
  COLUMNS:0,
  PERIMETER:[],
  ROWS:0,
}

const _CURRENT_POSITION:ArrayGridType.CurrentPositionType = { // main pointer for traversal/observation/mutation
  _i:0,
  _coord:[0,0],
}

// methods
const coordsAsArray = (coords:ArrayGridType.cellCoordType) => {
  if(Array.isArray(coords)) return coords // if as-is if an array
  const curCoords:[number,number] = [..._CURRENT_POSITION._coord]
  const coordObj = coords as ArrayGridType.cellCoordObjectType // if not, it is an object with optional X,Y values
  if(coordObj.X) curCoords[0] = coordObj.X
  if(coordObj.Y) curCoords[1] = coordObj.Y
  return curCoords
}
  // translations
  const parseCoordFromIndex = (index?:number):ArrayGridType.cellCoordArrayType => {
    if(!_GridUtils.DIMENSIONS) return [0,0]
    const indexedCell = index || _CURRENT_POSITION._i
    return [indexedCell % _GridUtils.DIMENSIONS.W, Math.floor(indexedCell / _GridUtils.DIMENSIONS.W)]
  }
const parseIndexFromCoord = (coord?:ArrayGridType.cellCoordArrayType) => {
  if(!_GridUtils.DIMENSIONS) return 0
  const cellToIndex = coord || _CURRENT_POSITION._coord
  return (cellToIndex[1] * _GridUtils.DIMENSIONS.W) + cellToIndex[0] // (amtCellsInRow * numRows) + numCols
}
const updatePosition = (dir:GRID_DIRECTIONS,distance=1) => {
  const rowOffset = _GridUtils.DIMENSIONS?.W || 0
  let curLoc = _CURRENT_POSITION._i
    if(dir.includes(GRID_DIRECTIONS.E)) curLoc += distance
    if(dir.includes(GRID_DIRECTIONS.W)) curLoc -= distance
    if(dir.includes(GRID_DIRECTIONS.N)) curLoc -= (rowOffset*distance)
    if(dir.includes(GRID_DIRECTIONS.S)) curLoc += (rowOffset*distance)
    return curLoc
}

  // observations
const createConsistentBounds:ArrayGridType.CreateConsistentBoundsInterface = (tl,br) => {
  return [tl,br].reduce((a:any,c) => {
    // this parses and returns both the index and coordinates of the sub-area corners
    if(typeof c === 'number') {
      a.index.push(c)
      a.coord.push(parseCoordFromIndex(c))
      return a
    }
    a.index.push(parseIndexFromCoord(coordsAsArray(c)))
    a.coord.push(coordsAsArray(c))
    return a
  },{index:[],coord:[]})
}
const fillGrid = (arrLen:number=_GridUtils._CELLS.length,filler?:unknown,asIndex=false) => {
  let grd = new Array(arrLen).fill(filler||_GRID_DEFAULTS.FILL_CHARACTER)
  if(asIndex) grd = grd.map((_,i) => i)
  return grd
}

/**
 * The utility functionality expects that valid values are supplied. IThere is no error checking within it.
 * If a location is not supplied and the value is:
 * - an array then the original grid will be replaced with the value
 * - not an array then original grid will be filled with the specified value
 * 
 * METHOD:  `getCells
 * Supplied locations are handled as described below:
 * - `42` - 42nd index (0 based) will have the given value applied
 * - `[12,16]` - careful! this will apply changes to the 12th, and 16th index
 * - `{X:12,Y:16}` - A single 0 based coordinate will be affected
 * - `[[12,16], [31,52]]` - 2 indexes (determined by their coordinates will be affected)
 * - `[{X:2,Y:6}, {X:23,Y:64}, {X:56,Y:76}]` - 3 indexes (determined by their coordinates will be affected)
 * If `returnIndexes` is specified then the result will be the index values of the main grid
 * Otherwise it will be the value stored at that index
 * 
 * METHOD:  `setCells
 * The final application available is using arrays for both the location and value keys.
 * - The full location will be looped through, and a one-to-one mapping will be applied during the iteration.
 *   - If a single (non-array) value was supplied then that value will be applied to each affected index.
 *   - If there are fewer indexes on the value key then non-existent/undefined data will still attempt to be accessed
 *   - If there are more, they will be ignored
 * 
 * > NOTE: A concious decision was made to omit the ability to parse anything
 * > other than index values and coordinates the get/set cell functions.
 */
const getCells = (cellGetter?:{location:OneOrMany<ArrayGridType.cellLocationType>,returnIndexes?:boolean}) => {
  if(!cellGetter?.location) // if not specified, return all
  return _GridUtils._CELLS
  
  const {location,returnIndexes} = cellGetter
  const retCell = (loc:number) => {
    return returnIndexes ? loc : _GridUtils._CELLS[loc]
  } 
    switch(typeof location) {
      case 'string': // not supported, return nothing
        return []
      case 'number': // easiest to handle this instance as a one-off
        return [retCell(location)]
      default: // array
        if(!Array.isArray(location)) return // sanity
        if(typeof location[0] === 'number') // array of indexes
          return location.map(c => retCell(c as number))
        // else an array of [[x,y]] or [{x,y}]
        return location.map(loc => retCell(parseIndexFromCoord(coordsAsArray(loc as ArrayGridType.cellCoordType))))
    }
}
const setCells:any = (cellSetter:{location:OneOrMany<ArrayGridType.cellLocationType>,value:OneOrMany<unknown>}) => {
  const {location,value} = cellSetter
  if(!location) { // if no location specified
    if(Array.isArray(value)) // and value is an array
      _GridUtils._CELLS = value as Array<string|number> // replace the grid with the new array
    else // if value is anything other than an array
      fillGrid(_GridUtils._CELLS.length,value) // fill all cells
  }

  const cellIndexes = getCells({location,returnIndexes:true})
  cellIndexes &&
    cellIndexes.forEach((cI,indx) => {
    if(typeof cI === 'number'){
      _GridUtils._CELLS[cI] = Array.isArray(value) ? value[indx] : value
    }
  })
  return _GridUtils._CELLS
}

const getSubGridIndexes:ArrayGridType.GetSubGridIndexesInterface = (topLeft,bottomRight) => {
  const subGridBoundaries:ArrayGridType.CreateConsistentBoundsReturnType = createConsistentBounds(topLeft,bottomRight) 
  console.log('topLeft,bottomRight: ', topLeft,bottomRight)
  console.log('subGridBoundaries: ', subGridBoundaries)
  const subH = Math.abs(subGridBoundaries.coord[0][1] - subGridBoundaries.coord[1][1]),
        subW = Math.abs(subGridBoundaries.coord[0][0] - subGridBoundaries.coord[1][0]) + 1, // +1 makes inclusive
        subGridDimensions = {w:subW, h:subH+1}
  const subGridIndexes:number[] = [],
        parentW = _GridUtils.DIMENSIONS?.W || 0
  for(let i:number = 0; i<=subH; i++) { // `<=` makes inclusive
    let fillIndexes = fillGrid(subW).map((_,indx) => subGridBoundaries.index[0]+(i*parentW)+indx) // custom mapping needed
    subGridIndexes.push(...fillIndexes)
  }
  
  /**
   * isolated perimeter contains indexes relative to the subgrid, where top left is [0,0]
   * applied contains the indexes relative to the main Grid, where top left is set when calling this method
   */
  const isolated = determineGridPerimeter({rowLen:subW,totalIndexAmt:subGridIndexes.length}),
        applied = isolated.map(iso => subGridIndexes[iso]),
        subGridPerimeter = { applied, isolated, }
  return {subGridBoundaries,subGridDimensions, subGridIndexes, subGridPerimeter}
}

const getCurrentPosition = () => { // future scalability?
  return _CURRENT_POSITION
}
const setCurrentPosition:ArrayGridType.SetCurrentPositionInterface = (movement,distance:number=1) => {
  switch (typeof movement) {
    case 'object': // coordinates
        _CURRENT_POSITION._coord = coordsAsArray(movement)
        _CURRENT_POSITION._i = parseIndexFromCoord()
      break
    case 'number': // index
      _CURRENT_POSITION._i = movement
      _CURRENT_POSITION._coord = parseCoordFromIndex()
      break
    default: // enum
        const movementEnum = movement as GRID_DIRECTIONS
        _CURRENT_POSITION._i = updatePosition(movementEnum,distance)
        _CURRENT_POSITION._coord = parseCoordFromIndex()
  }

  _CURRENT_POSITION.ADJACENT = determineCurPositionAdjacentCells()
  // auto return updated values
  return getCurrentPosition()
}

/**
 * allows negative/invalid indexes to be returned
 * - handling the return should be done outside of the utility 
 *   as there may be wrapping or other implementations where invalid
 *   indexes are valid values
 */
const determineCurPositionAdjacentCells = () => {
  const adjacentCellIds:ArrayGridType.adjacentCellsObjectType = {}
  for(const gD in GRID_DIRECTIONS)
    adjacentCellIds[gD] = _GridUtils.DIMENSIONS ? updatePosition(gD as GRID_DIRECTIONS) : 0
  return adjacentCellIds
}
const determineGridPerimeter = (fullGridArray?:{rowLen:number,totalIndexAmt:number}) => {
  const gridArrayLength = fullGridArray ? fullGridArray.totalIndexAmt : _GridUtils.DIMENSIONS?.TOTAL_INDEX_LENGTH,
        gridPerimeter:number[] = [],
        gridRowLength = fullGridArray ? fullGridArray.rowLen : _GridUtils.DIMENSIONS?.W

  if(!gridArrayLength || !gridRowLength) return gridPerimeter // sanity

  for(let i=gridArrayLength-1;i>=0;--i){
    if ( i<gridRowLength // omit first row
      || i>=gridArrayLength - gridRowLength // omit last row
      || i%gridRowLength === 0 // omit first column
      || i%gridRowLength === (gridRowLength-1) // omit last column
    )
      gridPerimeter.push(i)
  }
  return gridPerimeter
}

let _pristineConfig = true
const CONFIG = (defaults:Partial<typeof _GRID_DEFAULTS>) => {
  // if(!_pristineConfig) throw new Error('CONFIG is only allowed to be updated a single time, before calling InitGrid.')
  _pristineConfig = false
  const INIT_POSITION = { ..._GRID_DEFAULTS.INIT_POSITION, ...defaults.INIT_POSITION}
  const compiledConfig = {
    ..._GRID_DEFAULTS,
    ...defaults,
    INIT_POSITION,
  }
  Object.entries(compiledConfig).forEach(def => {
    _GRID_DEFAULTS[def[0]] = def[1]
  })
}
const InitGrid = (width?:number, height?:number, initFillVal?:string|number) => {
  if(_pristineConfig){
    CONFIG({
      FILL_CHARACTER:initFillVal || _GRID_DEFAULTS.FILL_CHARACTER, // if nullish (??) the index value will be rendered
      GRID_HEIGHT:height || _GRID_DEFAULTS.GRID_HEIGHT,
      GRID_WIDTH:width || _GRID_DEFAULTS.GRID_WIDTH,
    })
    _pristineConfig = false
  }

  _GridUtils.COLUMNS = _GRID_DEFAULTS.GRID_WIDTH
  _GridUtils.ROWS = _GRID_DEFAULTS.GRID_HEIGHT
  const TOTAL_INDEX_LENGTH = _GRID_DEFAULTS.GRID_WIDTH*_GRID_DEFAULTS.GRID_HEIGHT
  _GridUtils.DIMENSIONS = {
    ARRAY:[_GridUtils.COLUMNS,_GridUtils.ROWS],
    H:_GridUtils.ROWS,
    TOTAL_INDEX_LENGTH,
    W:_GridUtils.COLUMNS,
  }
  
  _GridUtils.INDEXES = fillGrid(TOTAL_INDEX_LENGTH,_GRID_DEFAULTS.FILL_CHARACTER,true)
  _GridUtils.PERIMETER = determineGridPerimeter()
  const cellsValues = fillGrid(TOTAL_INDEX_LENGTH,_GRID_DEFAULTS.FILL_CHARACTER??[..._GridUtils.INDEXES])
  setCells({value:cellsValues})

  getCurrentPosition()
  return getCells()
}

// debug
// debugDisplayAsGrid(1,1)
// debugDisplayAsGrid(1)
const debugDisplayAsGrid = (showIndex=0,showFullIndex=0) => {
  if(!_GridUtils.DIMENSIONS) return

  let debugDisplayAsGridString = ''
  for(let i=0;i<_GridUtils.DIMENSIONS.TOTAL_INDEX_LENGTH;i++)
  {
    if(showIndex)
      debugDisplayAsGridString += showFullIndex ? `[${i}]` : (''+i).slice(-1)+' '
    else
      debugDisplayAsGridString += `${_GridUtils._CELLS[i]}`
    if(((i+1)%_GridUtils.DIMENSIONS.W) === 0)
      debugDisplayAsGridString += '\n'
  }
  console.log(debugDisplayAsGridString)
}

export const ArrayGrid = { // was UtilsGrid - update where applicable
  Grid: {
    Create: {
      Config: CONFIG,
      Initial: InitGrid,
      SubGrid: getSubGridIndexes,
    },
    Get: {
      Cells: getCells,
      Perimiter: () => _GridUtils.PERIMETER,
      Position: getCurrentPosition,
    },
    Render: (showIndex=0,showFullIndex=0) => debugDisplayAsGrid(showIndex,showFullIndex), // remove ability to adjust args
    Set: {
      Cells: setCells,
      Position: setCurrentPosition,
    }
  }
}

export type GetCellsType = typeof getCells
export type GetCurrentPositionType = typeof getCurrentPosition