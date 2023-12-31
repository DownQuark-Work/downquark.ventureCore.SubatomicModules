import { ArrayGrid } from '»/array.grid.ts'
import { GRID_DIRECTIONS } from '¢/iterables.array.grid.ts'

const { Grid } = ArrayGrid

Grid.Create.Config({FILL_CHARACTER:'x'})

console.log('UtilsGrid.: ', Grid.Create.Initial(42,13))
console.log('--------------------------------------------')
console.log('Grid.Get.Position(): ', Grid.Get.Position())
console.log('Grid.Set.Position([13,10]): ', Grid.Set.Position([13,10]))
console.log('Grid.Set.Position(69): ', Grid.Set.Position(69))
console.log('Grid.Set.Position(85): ', Grid.Set.Position(85))
console.log('Grid.Set.Position(GRID_DIRECTIONS.SE,2): ', Grid.Set.Position(GRID_DIRECTIONS.SE,2))
console.log('Grid.Set.Position(GRID_DIRECTIONS.S): ', Grid.Set.Position(GRID_DIRECTIONS.S))
console.log('Grid.Get.Position(): ', Grid.Get.Position())
console.log('--------------------------------------------')
console.log('Grid.Create.SubGrid([3,3],[5,5])): ', Grid.Create.SubGrid([3,3],[5,5]))
console.log('Grid.Create.SubGrid([10,10],[13,12])): ', Grid.Create.SubGrid([10,10],[13,12]))
console.log('Grid.Create.SubGrid({X:13,Y:4},{X:18,Y:9})): ', Grid.Create.SubGrid({X:13,Y:4},{X:18,Y:9}))
console.log('Grid.Create.SubGrid(181,396)): ', Grid.Create.SubGrid(181,396))
console.log('--------------------------------------------')
console.log(`
  NOTE: The next call gives odd results because the index does NOT specify a TOP_LEFT & BOTTOM_RIGHT
  Using arguments: 69, 85
  Results in the coordinates being: [ 27, 1 ], [ 1, 2 ]
  Which makes the positions TOP_RIGHT & BOTTOM_LEFT
  > This is intentional to allow all use cases
  > It is expected if this were to cause problems that it would be handled in the
  >   implementation _outside_ of the submodule.
`)
console.log('Grid.Create.SubGrid(69,85)): ', Grid.Create.SubGrid(69,85))
console.log('--------------------------------------------')
console.log('Grid Cells: ', Grid.Get.Cells())
console.log('Grid Perimeter: ', Grid.Get.Perimiter())
console.log('--------------------------------------------')
const subGridToSet = Grid.Create.SubGrid([10,10],[13,12])
console.log('subGridToSet: Grid.Create.SubGrid([10,10],[13,12])', subGridToSet)
console.log('--------------------------------------------')
Grid.Set.Cells({location:[6,9],value:['aBc',[1,2,3]]})
Grid.Set.Cells({location:[[3,3]],value:'xyz'})
Grid.Set.Cells({location:[[3,3],[4,3],[1,1]],value:[' 1  ',' 1  ',' 1  ']})
Grid.Set.Cells({location:[{X:3,Y:3},{X:2,Y:3},{X:1,Y:1}],value:['  1 ',' 2  ',' 3  ']})
console.log('Grid.Render(): ', Grid.Render())
console.log('--------------------------------------------')
Grid.Set.Cells({location:[{X:11,Y:8}], value:' '})
Grid.Set.Cells({location:[{X:3,Y:3}],value:'_'})
console.log('Grid.Render(): ', Grid.Render())
console.log('--------------------------------------------')
const subGrid = Grid.Create.SubGrid([5,4],[10,7])
Grid.Set.Cells({location:subGrid.subGridIndexes,value:' '})
const setGridCells = Grid.Set.Cells({location:subGrid.subGridPerimeter.applied,value:subGrid.subGridPerimeter.isolated})
Grid.Render()
console.log('------------------------x--------------------')
console.log('setGridCells: ', new Set([...setGridCells]))
