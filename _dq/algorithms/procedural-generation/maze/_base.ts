const _Maze:{
  BaseGrid:{
    cells:number[]
    height:number
    perimeter:number[]
    width:number
  },
  Bordered:{Initial:number[]},
  Carved:{
    ActiveIndexes:Record<string,number[]>
    Initial:number[]
  },
} = {
  BaseGrid: {cells:[],height:0,perimeter:[],width:0},
  Bordered:{Initial:[]},
  Carved:{
    ActiveIndexes:{},
    Initial:[]
  },
}

const createMazeBaseBordered = () => {
  _Maze.Bordered.Initial = [..._Maze.BaseGrid.cells] // clone array for future usage
},
createMazeBaseCarved = (fullW:boolean) => { // fullW will allow border to border access (useful for certain grid types such as `Sidewinder`)
  // create new array of non-perimeter indexes
    // splice top and bottom rows for efficiency
  let initialBaseCarvedIndexes = _Maze.BaseGrid.cells.toSpliced(_Maze.BaseGrid.perimeter[0]-_Maze.BaseGrid.width,_Maze.BaseGrid.perimeter[0])
      initialBaseCarvedIndexes.splice(0,_Maze.BaseGrid.width+1)
    for(let perimeterIndex = _Maze.BaseGrid.width+1; perimeterIndex < _Maze.BaseGrid.perimeter.length-_Maze.BaseGrid.width-1; perimeterIndex++){
      const rawIndex = _Maze.BaseGrid.perimeter[perimeterIndex],
            adjustedIndex = initialBaseCarvedIndexes[rawIndex-(_Maze.BaseGrid.width+1)]
      if(fullW) continue
      if(rawIndex === adjustedIndex)
        initialBaseCarvedIndexes.splice(rawIndex-(_Maze.BaseGrid.width+1)-2,3)
    }
  _Maze.Carved.Initial = initialBaseCarvedIndexes
},
setGridInfo = (gridInfo: typeof _Maze.BaseGrid) => {
  _Maze.BaseGrid = gridInfo
},
setActiveIndexes = (activeIndexes: typeof _Maze.Carved.ActiveIndexes) => {
  _Maze.Carved.ActiveIndexes = activeIndexes
}


export const Maze = { // was UtilsGrid - update where applicable
  Create: {
    Initial: {
      Bordered: createMazeBaseBordered,
      Carved: createMazeBaseCarved,
    },
  },
  Get: {
    Carved: {
      Indexes:() => _Maze.Carved.ActiveIndexes,
    },
    Initial: {
      Bordered:() => _Maze.Bordered.Initial,
      Carved:(fullWidth=false) => _Maze.Carved.Initial,
    },
  },
  Set: {
    CarvedActiveIndexes: setActiveIndexes,
    MutableGridValues: setGridInfo,
  }
}