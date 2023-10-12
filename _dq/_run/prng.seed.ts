import { parse } from '∂'
import { PsuedoSeed } from '@/algorithms/procedural-generation/prng/prng.ts'

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
if(!!Deno.args[0]){
const parsedArgs = parse(Deno.args)
const {parsedSeed:seed, seed:shaSeed, v3b:v3bArray, DEMO:boolean} = parsedArgs
const v3b = v3bArray ? v3bArray.split(',').map((v3:string) => parseInt(v3,10)) : undefined
const pseudoSeedConfig:SeedConfigType = {
  requiredLength:parseInt(Deno.args[0],10),
  shaSeed,
  seed,
  v3b
}
// See `/examples/readme.md` for usage notes
const pseudoSeed = await PsuedoSeed(pseudoSeedConfig)
console.log(JSON.stringify(pseudoSeed))
}

// handles access via module
export const createPseudoSeed = async (seedConfig:SeedConfigType) => await PsuedoSeed(seedConfig)