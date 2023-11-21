export type NpmDownloadsRawKeyValueType = { downloads: number, day: string }
export type NpmDownloadsType = {
  _kv: NpmDownloadsRawKeyValueType[],
  _pkg:string,
  _totalDownloads:number
  byDate:Record<string, number>,
  byDownloadAmount:Record<string, string[]>,
  daysDownloaded?:number,
  range?:[string,string],
}