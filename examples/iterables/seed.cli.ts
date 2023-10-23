import * as Parser from '@/iterables/seed/parser.ts'
import * as Pointer from '@/iterables/seed/pointer.ts'

console.log('handling raw output from `/_dq/_run/prng.seed.ts`')
const pseudoSeed = JSON.parse(Deno.args[0])

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