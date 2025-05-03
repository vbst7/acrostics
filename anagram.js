
function getRandomNumber(n) {
    return Math.floor(Math.random() * (n));
}

// Remove non-alphabetical characters and capitalize
function alpha(input) {
    return input.replace(/[^a-zA-Z]/g, '').toUpperCase();
}

//Checks if the letters in all the answers are an anagram of the letters in the quote. If not, it displays which letters are under and over represented. If it is, it returns true 
function isAnagram(){
    const clues = document.getElementById('clueTable').querySelector('tbody').rows
    let ans = ''
    let quote = alpha(document.getElementById('quote').value)

    for (let row of clues) {
        let answer = row.children[0].children[0].value
        ans += alpha(answer)
    }

    const results = document.getElementById('anagram_results')
    results.innerHTML = compareLetters(ans, quote)    
    return (results.innerHTML == `Letters overrepresented in answers: none<br>Letters underrepresented in answers: none`)
}

function compareLetters(A, Q) {
    const countA = {};
    const countQ = {};

    // Count capital letters in string Answers
    for (const char of A) {
        if (char >= 'A' && char <= 'Z') {
            countA[char] = (countA[char] || 0) + 1;
        }
    }

    // Count capital letters in string Quote
    for (const char of Q) {
        if (char >= 'A' && char <= 'Z') {
            countQ[char] = (countQ[char] || 0) + 1;
        }
    }

    // Find letters in A more than Q
    const moreInAnswers = {};
    for (const char in countA) {
        if (countA[char] > (countQ[char] || 0)) {
            moreInAnswers[char] = countA[char];
        }
    }

    // Find letters in Q more than A
    const moreInQuote = {};
    for (const char in countQ) {
        if (countQ[char] > (countA[char] || 0)) {
            moreInQuote[char] = countQ[char];
        }
    }

    let i = 0
    const answers = Object.entries(moreInAnswers).sort()
    let overAnswers = ''
    while (i < answers.length){
        overAnswers += answers[i][0] + " (" + answers[i][1] + ") "
        i+=1
    }
    i = 0
    const quotes = Object.entries(moreInQuote).sort()
    let overQuote = ''
    while (i < quotes.length){
        overQuote += quotes[i][0] + " (" + quotes[i][1] + ") "
        i+=1
    }
        

    return `Letters overrepresented in answers: ${overAnswers || 'none'}<br>Letters underrepresented in answers: ${overQuote || 'none'}`;
}

// Tries to find character c in string quote. Starts at a random index and loops around looking for a match
// Returns the index a match was found at. If no match was found, returns -1
function findMatch(c, quote, l){
    console.log("Finding match for " + c)
    const start = getRandomNumber(l)
    let i = start
    do {
        console.log("quote[i] = " + quote[i])
        console.log(quote)
        if (quote[i] === c){
            return i;
        }
        i++
        if (i === l) i = 0
    }
    while (i != start)
    return -1;
}

function generate(){
    if (!isAnagram()) return

    const clues = document.getElementById('clueTable').querySelector('tbody').rows
    let ans = []
    let quote = alpha(document.getElementById('quote').value)
    const l = quote.length

    for (let row of clues) {
        let cells = row.children;
        let answer = cells[0].children[0].value
        let alphaAns = alpha(answer)
        let indices = []

        for (let char in alphaAns){
            let index = findMatch(alphaAns[char], quote, l)
            if (index == -1) return false
            quote = quote.slice(0, index) + 0 + quote.slice(index + 1); //change quote
            indices.push(index)
        }

        var q = {
            clue:cells[1].children[0].value,
            explanation:cells[2].children[0].value,
            answer:answer,
            indices:indices
        }
        ans.push(q)
    }

    // Define a JavaScript object
    const final = {
        creator:document.getElementById('creator').value,
        title:document.getElementById('title').value,
        quote:document.getElementById('quote').value,
        answers:ans
    };
    download_json(final, document.getElementById('title').value)
}