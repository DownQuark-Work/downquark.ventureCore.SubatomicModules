import { parse } from '∂'
import * as API from '¿/Api.ts'

const parsedArgs = parse(Deno.args),
      runCmd:string = parsedArgs._[0] as string

if(!parsedArgs.pkg?.length){ // package required
  console.log('ERROR: Argument `--pkg`required')
  Deno.exit(1)
}
if(!runCmd?.length){
  console.log('ERROR: Argument `-- <RUN COMMAND>`required')
  Deno.exit(1)
}

// API.NPM.pkgStatsDownloaded(<package>, <run command>)
(API.NPM as {[k:string]:(_:string)=>void})[runCmd](parsedArgs.pkg)