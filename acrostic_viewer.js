var selected

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileContent = e.target.result; // File content as text
                
                //Check if the content is valid JSON
                try {
                    const jsonObject = JSON.parse(fileContent); // Convert to object
                    fill_in(jsonObject); // Successfully parsed JSON
                } catch (error) {
                    console.error('Invalid JSON:', error); // Handle error
                }
            };
            reader.readAsText(file); // Read the file as text
        }
        else {
            console.log('No file selected.'); // Handle case where no file is selected
        }
    });
    document.getElementById('check_solution_button').addEventListener('click', checkSolution);
    document.getElementById('check_answer_button').addEventListener('click', checkAnswer);
    document.getElementById('check_letter_button').addEventListener('click', checkLetter);
    document.getElementById('reveal_letter_button').addEventListener('click', revealLetter);
    document.getElementById('generate_page_button').addEventListener('click', function() {
        window.location.href = 'https://vbst7.github.io/acrostics/generator.html';
      });
    document.getElementById('about_page_button').addEventListener('click', function() {
        window.location.href = 'https://vbst7.github.io/acrostics/about.html';
      });

    //import the file in the url, if any
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search);
    import_params(params.get('file'))
});

function import_params(url){
    const fileUrl = `/acrostics/` + url
    fetch(fileUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        fill_in(data)
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function fill_in(file){
    const quote_grid = document.getElementById('quote_grid')
    document.getElementById('credit').innerHTML = `${file.title} - by ${file.creator}`
    const sticky = document.getElementById('sticky')
    sticky.style.position = "sticky"
    sticky.style.top = 0;
    sticky.style.zIndex = 9999;
    sticky.hidden = false;
    quote_grid.innerHTML = ''
    insertSquares(file.quote.toUpperCase(), quote_grid);
    selected = quote_grid.querySelector('square') //selectes an arbitrary square so the check buttons do something 

    //delete all previous questions
    const div = document.getElementById('clues');
    div.innerHTML = ''

    //fill in new rows from import
    let i = 0;
    while (i < file.answers.length) {
        const clueElement = document.createElement('div');
        clueElement.innerHTML = `<p style="width: 100%;">${file.answers[i].clue}</p>`; 

        const answer_grid = document.createElement('grid')
        answer_grid.className = 'grid';
        answer_grid.dataset.location = `${i + 1}`;
        insertSquaresAnswers(file.answers[i].answer.replace(/[^a-zA-Z]/g, '').toUpperCase(), file.answers[i].indices, answer_grid);

        const button = document.createElement('button');
        button.className = 'explanation_button';
        button.textContent = 'Explanation';
        button.hidden = 'true';
        let explanation = file.answers[i].explanation
        button.onclick = () => alert(explanation);

        div.appendChild(clueElement);
        div.appendChild(answer_grid);
        div.appendChild(button); 
        i++;
    }
}

function insertSquaresAnswers(ans, indices, grid){
    grid.total = Math.min(ans.length,indices.length);
    for (let i = 0; i < grid.total; i++) {
        const div = document.createElement('div');
        div.className = 'square';
        div.index = indices[i];
        div.solution = ans[i];
        div.dataset.location = i;
        div.innerHTML = `<div class="number">${indices[i]}</div>`;
        div.grid = grid;
        //add pair
        const quote_grid = document.getElementById("quote_grid")
        const pair = quote_grid.querySelector(`.square[data-location="${indices[i]}"]`)
        div.pair = pair
        div.pair.pair = div
        div.onclick = () => activateSquare(div);
        grid.appendChild(div);
    }
}

function insertSquares(quote, grid){
    let i = 0;
    for (let l = 0; l < quote.length; l++) {
        const div = document.createElement('div');
        div.className = 'square';

        if (/^[A-Za-z]$/.test(quote[l])){
            div.index = i;
            div.solution = quote[l]
            div.dataset.location = i;
            div.innerHTML = `<div class="number">${i}</div>`;
            div.grid = grid;
            div.onclick = () => activateSquare(div);
            i++;
        }
        else{
            if (/\s/.test(quote[l])){
                div.style.backgroundColor = 'black';
            }
            div.innerHTML = `<div class="character">${quote[l]}</div>`
            div.contentEditable = 'false'
        }
        grid.appendChild(div);
    }
    grid.total = i;
}