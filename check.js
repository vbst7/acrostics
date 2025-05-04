function check(div){
    //if div has a non-empty text valule and it and solution do not match, change font to red on both it and its pair
    const char = div.querySelector('.character')
    if (!char) return false
    if (char.firstChild.data != div.solution){
        char.style.color = 'red'
        div.pair.querySelector('.character').style.color = 'red'
        return false
    }
    return true
}

function checkLetter(){
    check(selected)
}

function revealLetter(){
    const val = selected.solution;
    const index = selected.index;

    selected.style.color = 'black'
    selected.pair.style.color = 'black'
    selected.innerHTML = `<div class="number">${index}</div><div class="character">${val}</div>`;
    selected.pair.innerHTML = `<div class="number">${index}</div><div class="character">${val}</div>`;
}

function checkAnswer(){
    //if current selected is in the quote, set its pair to selected
    if (selected.grid === document.getElementById('quote_grid')) selected = selected.pair;
    //go thru all squares in selected's grid
    for (let i = 0; i < selected.grid.total; i++) {
        check(selected.grid.querySelector(`.square[data-location="${i}"]`))
    }
}

//goes through every squatre inth e wuote grid, checking each one. Iff every single one is correct, call celebrate
function checkSolution(){
    let solved = true
    //go thru all squares in the quote grid, checking each one
    const grid = document.getElementById('quote_grid')
    for (let i = 0; i < grid.total; i++) {
        solved = (solved && check(grid.querySelector(`.square[data-location="${i}"]`)))
    }
    if (solved) celebrate()
}

//reveal all explanation buttons, and show confetti
function celebrate(){
    // Select all explanation buttons, setting them to visible
    const parentDiv = document.getElementById('clues');
    const buttons = parentDiv.querySelectorAll('.explanation_button');
    buttons.forEach(button => {
        button.hidden = false;
});
    //TODO make confetti look good
    alert(`Congratulations! You've solved the accrostic! Feel free to press the Explanation buttons under each clue to see how they fit with their answer.`)
}