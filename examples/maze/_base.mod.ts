import { parse } from '∂'
import * as Game from '¿/Gaming.ts'

const parsedArgs = parse(Deno.args)
if(!!Deno.args[0]){
  if(!(parsedArgs.w && parsedArgs.h)) { // width && height required
    console.log('ERROR: Argument `-w` and `-h` required')
    Deno.exit(1)
  }
}

// configurations should be outside of `Gaming` to allow customizations for each use
const gridConfig = {
        FILL_CHARACTER:Game.MAZE.CELL.COMMON.UNVISITED,
        GRID_HEIGHT:parsedArgs.h as number,GRID_WIDTH:parsedArgs.w as number
      },
      seedConfig:Game.SeedConfigType = {
        requiredLength:parsedArgs.w * parsedArgs.h*1.25, // shaSeed:'13',
      },
      mazeConfig = {
        algorithm: {
          base: Game.MAZE.ALGORITHM._BASE.BORDERED,
          // base: Game.MAZE.ALGORITHM._BASE.CARVED,
          formula: Game.MAZE.ALGORITHM.SIDEWINDER,
        }
      },
      gameConfig = {
        Grid:gridConfig, Maze:mazeConfig, Seed:seedConfig
      }
await Game.initGame(gameConfig)


const {curPointer} = Game.Seed?.Seeded() as {curPointer:{seedIndex:number}}

Game.Grid.Export.JSON(parsedArgs['export-path'])



if(false){ // debug
  console.log('._Seed: ', ''._Seed)
  console.log('-=-=-=-=-=--=-');
  console.log('curPointer: ', curPointer)
    console.log('curPointer.seedIndex: ', curPointer.seedIndex)
    console.log('curPointer.seedIndex: ', curPointer.seedIndex)
    console.log('curPointer.seedIndex: ', curPointer.seedIndex)
    console.log('Pp>',Game.Seed.Parser.parseSeedAtPos())
    console.log('Pp>',Game.Seed.Parser.parseSeedAtPos())
    console.log('Pp>',Game.Seed.Parser.parseSeedAtPos())
    console.log('curPointer.seedIndex: ', curPointer.seedIndex)
    console.log('opt selection: ',Game.Seed.Parser.parseOptionWithSeedValue(['a','b','c','d','e','f','g']))
    console.log('opt selection: ',Game.Seed.Parser.parseOptionWithSeedValue({RANGE:[13,42]}))
    console.log('opt selection: ',Game.Seed.Parser.parseOptionWithSeedValue('BOOL'))
    console.log('opt selection: ',Game.Seed.Parser.parseOptionWithSeedValue('DIR'))
  }