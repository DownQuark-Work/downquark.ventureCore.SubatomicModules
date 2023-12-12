import { parse } from '∂'
import * as Game from '¿/Gaming.ts'

import { initCli } from './_base.cli.ts'
import { initMod } from './_base.mod.ts'

const parsedArgs:any = parse(Deno.args)
if(!!Deno.args[0]){
  if(!(parsedArgs.w && parsedArgs.h)) { // width && height required
    console.log('ERROR: Argument `-w` and `-h` required')
    Deno.exit(1)
  }
}

// console.log('parsedArgs: ', parsedArgs._)
// map args to config
const [engine, mazeType, algorithm] = parsedArgs._

// configurations should be outside of `Gaming` to allow customizations for each use
const onProcGenComplete // callback to be triggered after initial layout is fully parsed
        = engine === 'cli' ? initCli : initMod,
      gridConfig = {
        FILL_CHARACTER:Game.MAZE.CELL.COMMON.UNVISITED,
        GRID_HEIGHT:parsedArgs.h as number,GRID_WIDTH:parsedArgs.w as number
      },
      seedConfig:Game.SeedConfigType = {
        requiredLength:Math.ceil(parsedArgs.w * parsedArgs.h*1.25),
        shaSeed: parsedArgs.seeded,// '1313',`
      },
      mazeConfig = {
        animationStepDelay: parsedArgs.anim || -1, // omit to receive only the end result. Any other delay (including 0) will show the maze generation
        algorithm: {
          base: Game.MAZE.ALGORITHM._BASE[(mazeType as string).toUpperCase()],
          formula: {
            _name:Game.MAZE.ALGORITHM[(algorithm as string).toUpperCase()],
            args: {
              _note: 'custom per each formula .. see inidividual files within: `/_dq/algorithms/procedural-generation/maze/algorithms`',
            }
          },
        },
        callback: { onProcGenComplete, },
        exportPath: parsedArgs['export-path']
      },
      gameConfig = {
        Grid:gridConfig, Maze:mazeConfig, Seed:seedConfig
      }

await Game.initGame(gameConfig)

// if(engine === 'mod') initMod(Game,gridConfig,parsedArgs)
// if(engine === 'cli') initCli(Game,gridConfig)
