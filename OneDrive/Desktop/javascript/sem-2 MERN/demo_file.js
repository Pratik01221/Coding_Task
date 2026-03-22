 const fs=require('fs');
 const data=fs.readFileSync('demo.txt','utf-8');
 console.log(data);
 
 // line count
 const linecount=data.split('\n').length;
 console.log(linecount);
 
 // word count
 const wordcount=data.split(' ').length;
 console.log(wordcount);

 // character count
const charcount=data.length;
console.log(charcount);

// print alternate characters
let altchar=''; 
for(let i=0;i<data.length;i+=2){
    altchar+=data[i];
}
console.log(altchar);


// find and replace a word
const newdata=data.replace(/hello/g,'hi');
console.log(newdata);


