function isPallindrom(str){
    var reverse=str.split('').reverse().join('');
    if (reverse===str){
        return true;
    }else{
        return false;
    }
}


function longPall(str){
    let longest = "";

    for(let i = 0; i < str.length; i++){
        for(let j = i + 1; j <= str.length; j++){
            let substr = str.substring(i, j);

            if(isPallindrom(substr) && substr.length > longest.length){
                longest = substr;
            }
        }
    }

    return longest;
}


console.log(longPall("babad"));   // Output: "bab" or "aba"
console.log(longPall("cbbd"));    // Output: "bb"

console.log(isPallindrom("the racecar is fast madam"));  // Output: false
console.log(isPallindrom("racecar"));                // Output: trueṇ


console.log(isPallindrom("madam"));        // Output: true