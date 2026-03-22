const myos = require('os');

console.log("Operating System: " + myos.platform());
console.log("Total Memory: " + (myos.totalmem()));
console.log("Free Memory: " + (myos.freemem()));
console.log("Home Directory: " + myos.homedir());
console.log("Hostname: " + myos.hostname());
console.log("OS Type: " + myos.type());
console.log("Order in which bytes are stored: " + myos.endianness());
console.log("temporary directory: " + myos.tmpdir());
console.log("Describes each CPU/core installed: " + JSON.stringify(myos.cpus()));
console.log("Relese date of OS: " + myos.release());
console.log("syatem uptime in seconds: " + myos.uptime());