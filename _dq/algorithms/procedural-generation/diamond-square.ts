/*
scratch - but initial setup is complete
// > This should give us a good starting place for the square diamond algo
// the below sets the initial vals

let rndHeightOffset = 30
let arr = [...new Array(25).fill(0)]

let crnrIndxs = []
let edgelen = Math.ceil(arr.length/4)

let crnrIndxOffset = Math.ceil((arr.length-1)/4)

arr[0] = Math.ceil(Math.random()*24)

// first run - average teh diamond move first
let cntrGridPt = Math.floor(arr.length/2)
let centerGridValue = arr[0]+Math.ceil(Math.random(rndHeightOffset))
console.log(arr[0],Math.ceil(Math.random(rndHeightOffset)))

for(i=1;i<=4;i++){arr[crnrIndxOffset*i]=arr[0]}
arr[cntrGridPt] = rndHeightOffset

rndHeightOffset = Math.round(centerGridValue*.8)
*/

/*
https://jmecom.github.io/blog/2015/diamond-square/
https://learn.64bitdragon.com/articles/computer-science/procedural-generation/the-diamond-square-algorithm

https://www.youtube.com/watch?v=slTEz6555Ts&list=PL8NAsjaVlA78V7IyxTeIab-5JqLHm8EvX
- https://github.com/klaytonkowalski/example-diamond-square

https://web.archive.org/web/20161030122232/http://www.paulboxley.com/blog/2011/03/terrain-generation-mark-one
- https://web.archive.org/web/20160618013742/http://www.paulboxley.com/blog/2011/03/terrain-generation-source
  - https://web.archive.org/web/20180611001013/https://github.com/baxter/csterrain
*/