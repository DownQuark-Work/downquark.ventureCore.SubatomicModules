import { parse } from '∂'
import { ArrayGrid as arrGrid } from '@/iterables/array/grid.ts'

import * as ArrayGridType from '†/_utils/array-grid.d.ts'

// Deno CLI
/// Proofs: see `/examples/readme.md` for usage notes
const parsedArgs = parse(Deno.args)
if(!!Deno.args[0]){
  if(!(parsedArgs.w && parsedArgs.h)) { // width && height required
    console.log('ERROR: Argument `-w` and `-h` required')
    Deno.exit(1)
  }
  const grid:unknown[] = arrGrid.Grid.Create.Initial(parsedArgs.w,parsedArgs.h) || [],
        position:ArrayGridType.CurrentPositionType = arrGrid.Grid.Get.Position(),
        cells:unknown[] = arrGrid.Grid.Get.Cells() || [],
        perimeter:number[] = arrGrid.Grid.Get.Perimiter(),
        arrayGrid = JSON.stringify({grid, position, cells,perimeter,})

  if(parsedArgs['export-grid']) console.log(arrayGrid) // capture stdout to use in other functions/methods
}

export const ArrayGrid = arrGrid