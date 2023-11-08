const _Maze:{
  BaseGrid:{
    cells:number[]
    height:number
    perimeter:number[]
    width:number
  },
  Bordered:{Initial:number[]},
  Carved:{Initial:number[]},
} = {
  BaseGrid: {cells:[],height:0,perimeter:[],width:0},
  Bordered:{Initial:[]},
  Carved:{Initial:[]},
}

const createMazeBaseBordered = () => {
  _Maze.Bordered.Initial = [..._Maze.BaseGrid.cells] // clone array for future usage
},
createMazeBaseCarved = () => {
  // create new array of non-perimeter indexes
    // splice top and bottom rows for efficiency
  let initialBaseCarvedIndexes = _Maze.BaseGrid.cells.toSpliced(_Maze.BaseGrid.perimeter[0]-_Maze.BaseGrid.width,_Maze.BaseGrid.perimeter[0])
      initialBaseCarvedIndexes.splice(0,_Maze.BaseGrid.width+1)
    for(let perimeterIndex = _Maze.BaseGrid.width+1; perimeterIndex < _Maze.BaseGrid.perimeter.length-_Maze.BaseGrid.width-1; perimeterIndex++){
      const rawIndex = _Maze.BaseGrid.perimeter[perimeterIndex],
            adjustedIndex = initialBaseCarvedIndexes[rawIndex-(_Maze.BaseGrid.width+1)]
      if(rawIndex === adjustedIndex) {
        initialBaseCarvedIndexes.splice(rawIndex-(_Maze.BaseGrid.width+1)-2,3)
      }
    }
  _Maze.Carved.Initial = initialBaseCarvedIndexes
},
setGridInfo = (gridInfo: typeof _Maze.BaseGrid) => {
  _Maze.BaseGrid = gridInfo
}

export const Maze = { // was UtilsGrid - update where applicable
  Create: {
    Initial: {
      Bordered: createMazeBaseBordered,
      Carved: createMazeBaseCarved,
    },
  },
  Get: {
    Initial: {
      Bordered:() => _Maze.Bordered.Initial,
      Carved:() => _Maze.Carved.Initial,
    }
  },
  Set: {
    MutableGridValues: setGridInfo,
  }
}