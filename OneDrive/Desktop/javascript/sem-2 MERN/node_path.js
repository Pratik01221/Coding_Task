// path module
const path = require('path');

console.log("last part of the path: " + path.basename(__filename));
console.log("directory name: " + path.dirname(__filename));
console.log("file extension: " + path.extname(__filename));
console.log("Is absolute path: " + path.isAbsolute(__filename));
console.log("realative path: " + path.relative(__dirname, __filename));
console.log("parse path: " + path.parse(__filename));

