// O[n] parsing
// example usage: `deno run --allow-read parser.ts corpus.txt 'show stats'`

type CurParserType = {
  indx:number[],
  words:string[],
}
type MarkovType = {[k:string]:{[k:string]:string[]}}
type StatsType = {
  abc?:string[],
  '123'?:Array<[string,number]>,
  keyLen?:{[k:string]:{[k:string]:number}},
  lenKey?:MarkovType,
  markovLength?:number,
}

const FAILSAFE_WORD_LIMIT = 2500
const nGram = 3,
      curParser:CurParserType = {
        indx:[0,nGram*2],
        words: [],
      },
      markov:MarkovType = {},
      stats:StatsType= {}

let corpus:string[] = []

const iterateMarkov = () => {
  // console.log('mkv curParser: ', curParser)
  
  let keyStr = '', valArr:string[] = [], valObj:{[k:string]:string} = {}
  for(let i:number=0; i<nGram; i++) {
    valArr = []
    keyStr += ' ' + curParser.words[i]

    let valStr = ''
    for(let h:number=i+1; h<i+nGram+1; h++) {
      const curWord = curParser.words[h]
      valStr += ' ' + curParser.words[h]
      valArr.push(valStr.trim())
      valObj[h-i] = valStr.trim()
      if(!markov[keyStr.trim()])
        markov[keyStr.trim()] = {}
      if(!markov[keyStr.trim()]?.[h-i])
        markov[keyStr.trim()][h-i] = []
    
      markov[keyStr.trim()][h-i].push(valStr.trim())
    }
  }
  iterateCorpus()
}

const makeStats = () => {
  // console.log('markov: ', markov)
  // console.log('Object.keys(markov): ', Object.keys(markov).length)
  // return
  const abc = Object.keys(markov).sort((a,b) => a > b ? -1 : 1)
  const alphabetical:MarkovType = {}
  abc.forEach(alph => {
    alphabetical[alph] = {...markov[alph]}
  })
  const keyLen:{[k:string]:{[k:string]:number}}={}, lenKey:MarkovType={}
  Object.entries(alphabetical).forEach(ent => {
    keyLen[ent[0]] = {total:0}
    Object.entries(ent[1]).forEach(en => {
      keyLen[ent[0]][en[0]] = en[1].length
      keyLen[ent[0]].total = keyLen[ent[0]].total + en[1].length
    })
  })
  const numrclArr:Array<[string,number][]> = []
  Object.entries(keyLen).sort((a,b) => {
    return a[0] < b[0] ?-1:1
  }).forEach(numrcl => {
    const numrclIndx = numrcl[1].total/nGram
    if(!numrclArr[numrclIndx]) numrclArr[numrclIndx] = []
    numrclArr[numrclIndx].push([numrcl[0], numrclIndx])
  })

    lenKey['*']={}
    for(let lk=1; lk<=nGram;lk++) lenKey[lk]={}
    for(const k in keyLen) {
        const lenTot = keyLen[k].total,
              lenNGram = k.split(' ').length
      if(!lenKey['*'][lenTot]) lenKey['*'][lenTot] = []
      if(!lenKey[lenNGram][lenTot/nGram]) lenKey[lenNGram][lenTot/nGram] = []
      lenKey['*'][lenTot].push(k)
      lenKey[lenNGram][lenTot/nGram].push(k)
    }
    stats.abc = abc
    stats['123'] = numrclArr.flat()
    stats.markovLength = Object.keys(markov).length
    stats.keyLen = keyLen
    stats.lenKey = lenKey
  Deno.args[1] && console.log('stats: ', stats)
}

const iterateCorpus = () => {
  curParser.indx[0]++
  curParser.indx[1]++
  curParser.words = corpus.slice(curParser.indx[0],curParser.indx[1])
  
  if(curParser.indx[1] > FAILSAFE_WORD_LIMIT || curParser.indx[1] > corpus.length) {
    makeStats()
    return
  }
  iterateMarkov()
} 

// inits below text block
const corpusRaw = Deno.readTextFileSync(Deno.args[0])

corpus = corpusRaw.replace(/\n/gi,' ').replace(/,—/g,', ').split(' ')
curParser.words = corpus.slice(0,(nGram*2))
iterateMarkov()