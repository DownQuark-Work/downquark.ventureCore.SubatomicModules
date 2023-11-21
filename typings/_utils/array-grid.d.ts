import { GetCellsType, GetCurrentPositionType } from '@/iterables/array/grid.ts'
import { GRID_DIRECTIONS } from '¢/iterables.array.grid.ts'

export type cellCoordArrayType = [number,number]
export type cellCoordObjectType = { X?:number, Y?:number }
export type cellCoordType = cellCoordArrayType | cellCoordObjectType
export type cellIndexType = number
export type cellLocationType = cellCoordType | cellIndexType
export type subCellCoordObjectType = { X:number, Y:number }

export type adjacentCellsObjectType = {[k in GRID_DIRECTIONS as string]:number}
export type CurrentPositionType = {
  _i:number,
  _coord:[number,number],
  ADJACENT?:adjacentCellsObjectType,
}
export type GridUtilsType = {
  _CELLS:Array<unknown>,
  INDEXES:number[],
  COLUMNS:number,
  DIMENSIONS?: {
    ARRAY:cellCoordArrayType,
    H:number,
    TOTAL_INDEX_LENGTH:number,
    W:number,
  }
  PERIMETER:number[],
  ROWS:number,
}

export type SetCellsReturnType = ReturnType<GetCellsType>
export interface SetCellsInterface {
  (location:cellLocationType,value:any):SetCellsReturnType // ([col,row],'Z')
  (location:subCellCoordObjectType,value:any):SetCellsReturnType // ({X:col,Y:row},'A')
  (location:number,value:any):SetCellsReturnType // (index,'i')
  (location:cellLocationType[],value:any):SetCellsReturnType // ([[col,row],[col,row]],'Z')
  (location:subCellCoordObjectType[],value:any):SetCellsReturnType // ([{X:col,Y:row},{X:col,Y:row}],'A')
  (location:number,loc:number,value:any):SetCellsReturnType // (index,index,'i')
  // (topLeft:any,bottomRight:any):SetCellsReturnType // (index,index)
}
export type SetCurrentPositionReturnType = ReturnType<GetCurrentPositionType>
export interface SetCurrentPositionInterface {
  (movement:cellCoordType):SetCurrentPositionReturnType // pass in [x,y] or {X,Y} - go to x,y
  (movement:GRID_DIRECTIONS, distance?:number):SetCurrentPositionReturnType // pass in direction and amount of cells to translate
  (movement:number):SetCurrentPositionReturnType // pass in index - go to index
}
export type CreateConsistentBoundsReturnType = {index:number[],coord:cellCoordArrayType[]}
export interface CreateConsistentBoundsInterface {
  (topLeft:cellCoordArrayType,bottomRight:cellCoordArrayType):CreateConsistentBoundsReturnType // ([col,row],[col,row])
  (topLeft:subCellCoordObjectType,bottomRight:subCellCoordObjectType):CreateConsistentBoundsReturnType // ({X:col,Y:row},{X:col,Y:row})
  (topLeft:number,bottomRight:number):CreateConsistentBoundsReturnType // (index,index)
  (topLeft:any,bottomRight:any):CreateConsistentBoundsReturnType // (index,index)
}
export type GetSubGridIndexesReturnType = {subGridDimensions:{w:number,h:number}, subGridIndexes:number[], subGridPerimeter:{applied:number[],isolated:number[]}}
export interface GetSubGridIndexesInterface {
  (topLeft:cellCoordArrayType,bottomRight:cellCoordArrayType):GetSubGridIndexesReturnType // ([col,row],[col,row])
  (topLeft:subCellCoordObjectType,bottomRight:subCellCoordObjectType):GetSubGridIndexesReturnType // ({X:col,Y:row},{X:col,Y:row})
  (topLeft:number,bottomRight:number):GetSubGridIndexesReturnType // (index,index)
}