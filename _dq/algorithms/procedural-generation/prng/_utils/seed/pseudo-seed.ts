import {parse} from '../../_deps.ts';
import {PsuedoSeed} from '../../prng.ts'

export type SeedConfigType = {
  hash?:{
    raw:string,
    numerical:string,
  },
  requiredLength:number,
  shaSeed?:string
  seed?:string,
  v3b?:[number,number,number]
}

// handles access via CLI
const parsedArgs = parse(Deno.args)
const {parsedSeed:seed, seed:shaSeed, v3b:v3bArray} = parsedArgs
const v3b = v3bArray ? v3bArray.split(',').map((v3:string) => parseInt(v3,10)) : undefined
const pseudoSeedConfig:SeedConfigType = {
  requiredLength:parseInt(Deno.args[0],10),
  shaSeed,
  seed,
  v3b
}
const pseudoSeed = await PsuedoSeed(pseudoSeedConfig)

/*// Proofs
// `% deno run prng/_utils/seed/pseudo-seed.ts 230`
// `% deno run prng/_utils/seed/pseudo-seed.ts 230 --seed 13`
// `% deno run prng/_utils/seed/pseudo-seed.ts 230 --seed 13 --v3b 13,42`
import * as Parser from './parser.ts';
import * as Pointer from './pointer.ts';

console.log('pseudoSeed: ', pseudoSeed)
console.log('_: ', ''._Seed)

const curPointer = Pointer.registerSeedPointer('_BASE_SEED_POINTER')
console.log('curPointer: ', curPointer)
console.log('curPointer.seedIndex: ', curPointer.seedIndex)
console.log('curPointer.seedIndex: ', curPointer.seedIndex)
console.log('curPointer.seedIndex: ', curPointer.seedIndex)
console.log('Pp>',Parser.parseSeedAtPos())
console.log('Pp>',Parser.parseSeedAtPos())
console.log('curPointer.seedIndex: ', curPointer.seedIndex)

console.log('opt selection: ',Parser.parseOptionWithSeedValue(['a','b','c','d','e','f','g']))
console.log('opt selection: ',Parser.parseOptionWithSeedValue({RANGE:[13,42]}))
console.log('opt selection: ',Parser.parseOptionWithSeedValue('BOOL'))
console.log('opt selection: ',Parser.parseOptionWithSeedValue('DIR'))
/* */

// handles access via module
export const createPseudoSeed = async (seedConfig:SeedConfigType) => await PsuedoSeed(pseudoSeedConfig)