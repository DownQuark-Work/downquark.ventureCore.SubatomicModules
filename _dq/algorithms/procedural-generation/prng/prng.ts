import { crypto, encodeHex, type DigestAlgorithm } from '∂'

import { SeedConfigType } from '»/prng.seed.ts'

declare global {
  interface String {
    _Seed?: string;
    raw?: string;
    numerical?: string;
  }
}

let _seedConfig:Partial<SeedConfigType> = {}

export const createHashForSeed = async () => {
    const encoder = new TextEncoder(),
    encodedSeed = encoder.encode(_seedConfig.shaSeed),
    raw = await crypto.subtle.digest(
      ('SHA-256' as DigestAlgorithm), encodedSeed)
      .then(ui8Arr => encodeHex(ui8Arr))
  return {
    raw,
    numerical: await createNumericalHashForSeed(raw),
  }
}

const createNumericalHashForSeed = (validatedHash:string):string => {
  // console.log('validatedHash: ', validatedHash)
  const baseSeedHash = validatedHash.replace(/\D/g,'') // create digit-only string
  return (validatedHash
            .replace(/\d/g,'') // remove all digits from string
            .split('') // to array
            .map((str,i) => Math.round(str.charCodeAt(0)/(i%7+1))) // replace convert alpha to digit
            .join('')  // convert `number[]` to `string` of digit-only chars
            + baseSeedHash // ensure more than 64 chars
          ).substring(0,64) // limit to 64 chars
}

// Mulberry32, a fast high quality PRNG: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
export const mb32 = (seed:number=3668340011) => (t:number) => (seed=seed+1831565813|0,t=Math.imul(seed^seed>>>15,1|seed),t=t+Math.imul(t^t>>>7,61|t)^t,(t^t>>>14)>>>0)/2**32;

// Very odd "chaotic" PRNG using a counter with variable output.
// args default to golden ratios
/**
 * Usage:
 * ```
 * const next = v3b(seed, 2654435769, 1013904242, 3668340011)
 * // OR with defaults:
 * const next = v3b()
 * for(let i = 0; i < 50; i++) console.log(next());
 * ```
 * @param seed 
 * @param b 
 * @param c 
 * @param d 
 * @returns Pseudo Random Number
 */
const v3b = async(seedStr:string, b:number = 2654435769, c:number = 1013904242, d:number = 3668340011):Promise<()=>number> => {
  let seed = parseInt(seedStr,10)
  // console.log('seedV3B:::: ', seed)
  let out:number, pos = 0, seed0 = 0, b0 = b, c0 = c, d0 = d;
  return Promise.resolve(function() {
    if(pos === 0) {
      seed += d; seed = seed << 21 | seed >>> 11; b = (b << 12 | b >>> 20) + c;
      c ^= seed; d ^= b; seed += d; seed = seed << 19 | seed >>> 13; b = (b << 24 | b >>> 8) + c;
      c ^= seed; d ^= b; seed += d; seed = seed << 7 | seed >>> 25; b = (b << 12 | b >>> 20) + c;
      c ^= seed; d ^= b; seed += d; seed = seed << 27 | seed >>> 5; b = (b << 17 | b >>> 15) + c;
      c ^= seed; d ^= b; seed += seed0; b += b0; c += c0; d += d0; seed0++; pos = 4;
    }
    switch(--pos) {
      case 0: out = seed; break; case 1: out = b; break;
      case 2: out = c; break; case 3: out = d; break;
    }
    return out >>> 0;
  })
}

let next = () => 0 // will be overwritten via `PsuedoSeed` function - allows for input customization
const v3bOffsets = _seedConfig.v3b || [2654435769, 1013904242, 3668340011] // defaults to golden ratio
const createPseudoSeed = async (seedStr:string,requiredLength:number=0):Promise<string> => {
  seedStr += ''+next()
  
  if(seedStr.length>requiredLength) {_seedConfig.seed = seedStr; return seedStr}
  return createPseudoSeed(seedStr,requiredLength)
}

export const PsuedoSeed = async (configSeed:Partial<SeedConfigType>={}) => {
  const {requiredLength} = configSeed
  // requiredLength should be (at minimum) the total number of cells in the grid
  if(!requiredLength || typeof requiredLength !== 'number') throw new Error('Must specify length when calling PseudoSeed')
  
  _seedConfig = {..._seedConfig,...configSeed}
  if(!_seedConfig.shaSeed) _seedConfig.shaSeed = crypto.randomUUID()
  if(!_seedConfig.hash) _seedConfig.hash = await createHashForSeed()
  const v3bOffsets = _seedConfig.v3b || [2654435769, 1013904242, 3668340011] // defaults to golden ratio
  next = await v3b(_seedConfig.hash.numerical, ...v3bOffsets) // overwrite function using user input if applicable
  _seedConfig.seed = '' // reset if exists
  const baseSeed = _seedConfig.seed.length?_seedConfig.seed:_seedConfig.hash!.numerical
  await createPseudoSeed(baseSeed,requiredLength)
  
  String.prototype._Seed = _seedConfig.seed
  return _seedConfig
}