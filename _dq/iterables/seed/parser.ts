import {PARSE_RANDOM} from '¢/iterables.seed.ts';

import type { SeedPointerType } from './pointer.ts';

// `opts` is an array of valid values to be returned based on current seeded value
interface ParseOptionWithSeedValueInterface {
  (opts:keyof typeof PARSE_RANDOM,sp?:SeedPointerType,):unknown // 'DIR' -> PARSE_RANDOM.DIR, etc
  (opts:{RANGE:[number,number]},sp?:SeedPointerType,):unknown // {RANGE:[min,max)}
  (opts:unknown[],sp?:SeedPointerType,):unknown // ['Array','of','possible values']
}

let _currentPointer:SeedPointerType
export const setCurrentPointer = (pointer:SeedPointerType) => _currentPointer = pointer

// magic numbers
const CURRENT_POS = 0
const SEED_VALUE = { FIRST:0, LAST:9 }

//exports allow for one off usage outside of a SeedPointer object
export const parseSeedAtPos = (offset:number=CURRENT_POS,indexVal=false,sp?:SeedPointerType) => {
  const pointer = sp || _currentPointer
  let sI = pointer.seedIndex
  if(!''._Seed?.length) return sI+=offset
  if(offset) sI+=offset
  if(sI<0) {sI = ''._Seed!.length-1; pointer.seedIndex = sI}
  if(sI>=''._Seed!.length) {sI = 0; pointer.seedIndex = sI}
  
  if(indexVal) return sI // return index of current pointer
  return parseInt(''._Seed.at(sI),10) // return value of seeded string at current pointer index
}

export const parseOptionWithSeedValue:ParseOptionWithSeedValueInterface = (opts,sp) => {
  const pointer = sp || _currentPointer
  const curOpt = Array.isArray(opts)
    ? opts
    : opts.RANGE || PARSE_RANDOM[opts]
  if(!Array.isArray(curOpt))
    throw new Error('options property must be valid array, `procgen/_constants.ts` key or have shape of {RANGE:[min,max]}')
  if(!curOpt.length)
    throw new Error('options property must have a length')
  
  const optionsAmt = opts.RANGE ? curOpt[1] - curOpt[0] : curOpt.length
  let availableOpts = new Array(optionsAmt).fill(undefined).map((_,i)=>i)
  while(availableOpts.length>10){
    const retVal = [availableOpts.splice(0,Math.floor(availableOpts.length/2)),availableOpts]
    availableOpts = retVal[parseSeedAtPos()%2]
    if(_currentPointer) _currentPointer.inc()
  }
  const MIN_MAX = [parseSeedAtPos(),parseSeedAtPos()].sort(),
        NUM_DENOM = MIN_MAX[0]/(MIN_MAX[1]+1) // 1 to ensure we do not divide by zero, and that the denom will be larger so we do not have `1` as a value
  const selectedIndex = availableOpts[Math.floor((NUM_DENOM*SEED_VALUE.LAST)*(availableOpts.length/SEED_VALUE.LAST))]
  return opts.RANGE ? curOpt[0] + selectedIndex : curOpt[selectedIndex]
  /**
   * Proof of concept to run in console
   * availableOpts = new Array(379).fill(undefined).map((_,i)=>i)
    while(availableOpts.length>10){
      console.log('availableOpts.length: ', availableOpts.length)
      const retVal = [availableOpts.splice(0,Math.floor(availableOpts.length/2)),availableOpts]
      availableOpts = retVal[choose()%2]
    } console.log(availableOpts)
  const selectedIndex = availableOpts[Math.floor((Math.random()*9)*(availableOpts.length/9))]; console.log(selectedIndex)
   */
}