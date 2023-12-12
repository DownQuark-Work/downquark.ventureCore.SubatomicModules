import { Grid, Seed } from '¿/Gaming.ts'
let Game:any, curPointer:any, grid:any;

const poc = () => {
  console.clear()
  Grid.Render()
  console.log('\n\trendered from: _base.cli.ts')
  console.log('\n\t\twith seed: ',Seed.Seeded().shaSeed)
}
export const initCli = (stringifiedMazeJSON:string) => {
  console.clear()
  console.log('CLI :: stringifiedMazeJSON: ', stringifiedMazeJSON)
  poc()
}

function debug(override=false) {
if(override){ // debug
  console.clear()
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
}