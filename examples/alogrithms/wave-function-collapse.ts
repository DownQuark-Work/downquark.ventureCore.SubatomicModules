"use strict";
// deno run alogrithms/wave-function-collapse.ts -v -w 15 -h 15 --seeded 131342 --anim 40

import { parse } from '∂'
import { WaveFunctionCollapse } from '@/algorithms/procedural-generation/wave-function-collapse.ts';

const parsedArgs = parse(Deno.args)
if(!!Deno.args[0]){
  if(!(parsedArgs.w && parsedArgs.h)) { // width && height required
    console.log('ERROR: Argument `-w` and `-h` required')
    Deno.exit(1)
  }
} else {
  console.log('ERROR: Argument `-w` and `-h` required')
  Deno.exit(1)
}

WaveFunctionCollapse(parsedArgs as any)