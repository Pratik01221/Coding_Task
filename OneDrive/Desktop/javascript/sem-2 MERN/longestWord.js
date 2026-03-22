function longestWord(str) {
    var arrya1 = str.match(/\w[a-z]{0,}/gi);
    var result = arrya1[0];
    for (var i = 1; i < arrya1.length; i++) {
        if (result.length < arrya1[i].length) {
            result = arrya1[i];
        }
    }
    return result;
}


console.log(longestWord("The quick brown fox jumped over the lazy dog"));
