import type { NpmDownloadsType, NpmDownloadsRawKeyValueType } from '†/run/npm-stats-package.d.ts'
const downloads:NpmDownloadsType = {
  _kv:[],
  _pkg:'',
  _totalDownloads:0,
  byDate:{},
  byDownloadAmount:{},
}

const displayStats = () => {
  downloads._kv.forEach(dl => {
    if(downloads.byDownloadAmount[dl.downloads])
      downloads.byDownloadAmount[dl.downloads].push(dl.day)
    else
    downloads.byDownloadAmount[dl.downloads] = [dl.day]
  })
  console.clear()
  console.log(downloads)
}

const makeEndDate = (dt:number|Date) => new Date(dt).toISOString().replace(/T.+$/,''),
      pkgData = await fetch('https://registry.npmjs.com/'+Deno.args[1]).then(resp => resp.json()),
      pkgCreation = pkgData.time?.created?.replace(/T.+$/,''),
      pkgCreationMs = new Date(pkgCreation).getTime(),
      now = makeEndDate(Date.now()),
      dayInMs = 1000 * 60 *60 *24


downloads.range = [pkgCreation, now]


const downloadBatch = async (start:string,end:string) => {
  const downloadQry = await fetch('https://api.npmjs.org/downloads/range/'+start+':'+end+'/'+Deno.args[1]).then(resp => resp.json()),
        curDownloads = downloadQry.downloads?.filter((itm:NpmDownloadsRawKeyValueType) => {
    if(itm.downloads > 0){
      downloads._totalDownloads += itm.downloads
      downloads.byDate[itm.day]= itm.downloads
      return true
    }
    return false
  })
  curDownloads?.length && downloads._kv.push(...curDownloads)
  if(new Date(downloadQry.start).getTime() > pkgCreationMs)
    downloadBatch(pkgCreation,makeEndDate(new Date(new Date(downloadQry.start).getTime()-dayInMs)))
  else{
    downloads.daysDownloaded = downloads._kv.length ?? 0
    displayStats()
  }
}

export const retrieveNpmStats = (pkg:string) => {
  console.log('gathering stats for: ', pkg,'\n\tplease be patient')
  downloads._pkg = pkg
  downloadBatch(pkgCreation,now)
}
