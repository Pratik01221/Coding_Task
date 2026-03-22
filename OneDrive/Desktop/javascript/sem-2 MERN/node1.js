var Clr=require("colors");

console.log(Clr.bgWhite("hello world").red);
console.log(Clr.bgWhite("hello world").blue);
console.log(Clr.bgWhite("hello world").green);
console.log(Clr.bgWhite("hello world").yellow);


Clr.setTheme({
   info: 'blue',
   warn: 'yellow',
   error: 'red',
success: 'green'
}); 


setTimeout(function() {
    console.log(Clr.info("This is an info message"));
    console.log(Clr.warn("This is a warning message"));
    console.log(Clr.error("This is an error message"));
    console.log(Clr.success("This is a success message"));
}, 2000);


