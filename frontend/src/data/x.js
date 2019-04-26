
const fs = require('fs');
let fileData = fs.readFileSync("./names.txt").toString();

let parts = fileData.split("\n");
let names = [];
parts.forEach((part)=>{
    console.log("X " + part, "    ----    ", part.indexOf(" "));
    names.push(part.substr(0, part.indexOf(" ")).toLowerCase());
})
let json = JSON.stringify(names);
fs.writeFileSync('./names.json', json);