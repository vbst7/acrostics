//Connect buttons
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

    const tableBody = document.getElementById('clueTable').getElementsByTagName('tbody')[0];
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-button')) {
            // Get the row of the clicked button
            const row = event.target.closest('tr');
            // Remove the row from the table
            if (row) {
                row.parentNode.removeChild(row);
            }
        }
    });   
    
    document.getElementById('add_button').addEventListener('click', addRow);
    document.getElementById('check_button').addEventListener('click', isAnagram);
    document.getElementById('save_button').addEventListener('click', generate_wip); 
    document.getElementById('randomize_button').addEventListener('click', randomize); 
    document.getElementById('generate_button').addEventListener('click', generate); 
    document.getElementById('back_page_button').addEventListener('click', function() {
        window.location.href = 'https://vbst7.github.io/acrostics/index.html';
      });
    document.getElementById('about_page_button').addEventListener('click', function() {
        window.location.href = 'https://vbst7.github.io/acrostics/about.html';
    });
})

//adds an empty row to the bottom of the clue table
function addRow() {
    const table = document.getElementById('clueTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><input type="text" placeholder="Answer"></td>
        <td><textarea placeholder="Clue" style="width: 100%;"></textarea></td>
        <td><textarea placeholder="Explanation" style="width: 100%;"></textarea></td>
        <td><button class="remove-button">X</button></td>
    `;
}

function generate_wip(){
    const clues = document.getElementById('clueTable').querySelector('tbody').rows
    let ans = []

    for (let row of clues) {
        let cells = row.children;
        var q = {
            clue:cells[1].children[0].value,
            explanation:cells[2].children[0].value,
            answer:cells[0].children[0].value
        }
        ans.push(q)
    }

    // Define a JavaScript object
    const wip = {
        creator:document.getElementById('creator').value,
        title:document.getElementById('title').value,
        quote:document.getElementById('quote').value,
        answers:ans
    };
    download_json(wip, document.getElementById('title').value)


}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//randomizes the order of the questions
function randomize(){
    //go thru each answer and save it
    const clues = document.getElementById('clueTable').querySelector('tbody').rows
    let ans = []
    for (let row of clues) {
        let cells = row.children;
        var q = {
            clue:cells[1].children[0].value,
            explanation:cells[2].children[0].value,
            answer:cells[0].children[0].value
        }
        ans.push(q)
    }

    shuffleArray(ans)

    //fill in each answer
    let i = 0
    for (let row of clues) {
        let cells = row.children;
        cells[0].children[0].value = ans[i].answer
        cells[1].children[0].value = ans[i].clue
        cells[2].children[0].value = ans[i].explanation
        i += 1
    }
}

function download_json(savedObject, name){
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(savedObject, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name + '.json'; // Set the file name

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}

function fill_in(file){
    document.getElementById('quote').value = file.quote;
    document.getElementById('title').value = file.title;
    document.getElementById('creator').value = file.creator;

    //delete all rows
    const table = document.getElementById('clueTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''

    //fill in new rows from import
    let i = 0;
    while (i < file.answers.length) {
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td><input type="text" value="${file.answers[i].answer}"></td>
            <td><textarea style="width: 100%;">${file.answers[i].clue}</textarea></td>
            <td><textarea style="width: 100%;">${file.answers[i].explanation}</textarea></td>
            <td><button class="remove-button">X</button></td>
        `;
        i++;
    }
}