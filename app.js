'use strict';
const fs = require('fs');
const src = fs.createReadStream('./popu-pref.csv', 'utf8');
const readline = require('readline');
const rl = readline.createInterface({
  input: src,
  output:{}
});
let prefectureDataMap=new Map();
//key=prefecture,value={old10_14,old15_19,change}
rl.on('line',(line)=>{
  const data = line.split(',');
  let year = parseInt(data[0]);
  let Prefecture = data[2];
  let old15_19= parseInt(data[7]);
  if(year==2015||year==2010){
    let value=prefectureDataMap.get(Prefecture);
    if(!value){
     value={
        num2010:0,
        num2015:0,
        change:null,
     };
    }
    if(year==2015){
      value.num2015+=old15_19;
    }else if(year==2010){
      value.num2010+=old15_19;
    }
    prefectureDataMap.set(Prefecture,value);
  }
  
});

rl.on('close',()=>{
  for(let [key,value] of prefectureDataMap){
    value.change=value.num2015/value.num2010;
  }
  const rankingArray=Array.from(prefectureDataMap).sort((pair1, pair2) => {
    console.log(pair1[0]) ;
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value]) => {
    return key + ': ' + value.num2010 + '=>' + value.num2015 + ' 変化率:' + value.change;
  });
  console.log(rankingStrings);

});
