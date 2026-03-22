// create use defined module


exports.add = function (x,y) {
    return x + y;
}


exports.sub = function (x, y) {
    return x - y;
}

exports.mul = function (x, y) {
    return x * y;
}

exports.div = function (x, y) {
    return x / y;
}   

const hello =(name) => {
    return `Hello ${name}`;
}

const goodbye =(name) => {
    return `Goodbye ${name}`;
}

module.exports = {
     sayHello: hello,
     sayGoodbye: goodbye
}

 