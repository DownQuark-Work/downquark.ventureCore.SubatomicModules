import * as Parse from './parser.ts'

export type SeedPointerType = {
  autoAdvance:boolean,
  indx: number,
  name: string,
  seedIndex: number,
  _seedIndex: number,
  choose: (options:string|{RANGE:[number,number]}|unknown[]) => unknown,
  dec: (indexVal:boolean) => number,
  inc: (indexVal:boolean) => number,
  setPointer: (pointerPosition:number) => number,
}

const seedPointersIndexMap:Array<{pointerName:string}> = [], // holds reference to the `pointerName` stored on the weakmap
      SeedPointersMap = new WeakMap()

export const pointer = (name:string='seed-pointer') => { console.log('POINTING: ',name) }

export const registerSeedPointer = (
  pointerName:string,
  registerAsCurrentPointer = true, // allows for automatic setup with `parser.ts`
  currentSeedPointerIndex = 13, // starting position within the seed for all instance logic
  autoAdvance = true, // auto advance the seed pointer
  
) => {
  if(seedPointersIndexMap.length) pointerName = pointerName+'-'+seedPointersIndexMap.length.toString()
else pointerName = '_BASE_SEED_POINTER' // force name for initial seed pointer
  const seedPointer:Partial<SeedPointerType> = {
    autoAdvance,
    indx: seedPointersIndexMap.length,
    name: pointerName,
    seedIndex: currentSeedPointerIndex,
    _seedIndex: currentSeedPointerIndex,
    choose: (options:any) => Parse.parseOptionWithSeedValue(options),
    dec: (indexVal:boolean) => Parse.parseSeedAtPos(-1,indexVal),
    inc: (indexVal:boolean) => Parse.parseSeedAtPos(1,indexVal),
  }
  
  // allows index pointer to be incremented each time `seedPointer.seedIndex` is accessed
  Object.defineProperty(seedPointer, 'seedIndex',{set(indx) { this._seedIndex = indx }})
  Object.defineProperty(seedPointer, 'seedIndex',{get()
    { if(this.autoAdvance) this._seedIndex += 1; return this._seedIndex }})

  seedPointersIndexMap.push({pointerName})
  SeedPointersMap.set((seedPointersIndexMap.at(-1) as {pointerName:string}), seedPointer)
  
  registerAsCurrentPointer &&
    Parse.setCurrentPointer((seedPointer as SeedPointerType))
  return SeedPointersMap.get(seedPointersIndexMap.at(-1) as {pointerName:string})
}

// `opts` is an array of valid values to be returned based on current seeded value
interface DeregisterSeedPointerInterface {
  (keypos:number,):boolean
  (keypos:string):boolean
}

export const deregisterSeedPointer:DeregisterSeedPointerInterface = keypos => {
  if(typeof keypos === 'undefined')
    throw new Error('deregisterSeedPointer must include a seed pointer to remove')
  if(keypos===0||keypos==='BASE_SEED_POINTER') throw new Error('cannot deregister BASE_SEED_POINTER')

  let seedDeregistered = false,
      indexByPointName = null
  if (typeof keypos === 'number'){
    seedDeregistered = SeedPointersMap.delete((seedPointersIndexMap.at(keypos) as {pointerName:string}))
  }
  else if (typeof keypos === 'string'){
    seedPointersIndexMap.forEach((iMap,i) => {
      if (iMap.pointerName === keypos){indexByPointName = i; return}
    })
    if(indexByPointName) {
      seedDeregistered = SeedPointersMap.delete((seedPointersIndexMap.at(indexByPointName) as {pointerName:string}))
    }
  }
  else throw new Error('invalid prop type passed ot deregisterSeedPointer')
  
  // console.log('seedPointersIndexMap: A', ...seedPointersIndexMap)
  if(seedDeregistered){
    seedPointersIndexMap.splice((indexByPointName as unknown as number)||(keypos as number),1)
  }
  // console.log('seedPointersIndexMap: Z', ...seedPointersIndexMap)

  // seedDeregistered will be false when no seed found with specified prop.
  return seedDeregistered // There may be valid resons for this, do not throw
}