// function Count_occ_characters(str) {
//     var count = {};
//     for (var i = 0; i < str.length; i++) {
//         var char = str[i];
//         if (count[char]) {
//             count[char]++;
//         } else {
//             count[char] = 1;
//         }
//     }   
//     return count;
// }

// console.log(Count_occ_characters("hello world"));



function Count_occ_characters(str) {
    const returnObject = {};

    for (let i = 0; i < str.length; i++) {

        if (returnObject.hasOwnProperty(str[i])) {
            returnObject[str[i]] += 1;
        }
        else {
            returnObject[str[i]] = 1;
        }
    }
    return returnObject;
}

console.log(Count_occ_characters("hello world"));