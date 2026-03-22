// const input = "hello world";
// const uppercase = input.toUpperCase();
// console.log(uppercase);


// convert a string to uppercase first letter of each word

function char_toUpperCase(str) {
    var arrya1 = str.split(" ");
    var new_array1=[];
    for (var i = 0; i < arrya1.length; i++) {
        new_array1.push(arrya1[i].charAt(0).toUpperCase() + arrya1[i].slice(1));
    }
    console.log(new_array1);
    return new_array1.join(" ");
}

console.log(char_toUpperCase("hello world"));

