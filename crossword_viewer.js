let puzzleData = null;
let selectedCell = null;
let selectedDirection = 'across';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileInput').addEventListener('change', handleFileImport);
    document.getElementById('check_solution_button').addEventListener('click', checkSolution);
    document.getElementById('reveal_solution_button').addEventListener('click', revealSolution);
    document.getElementById('generate_page_button').addEventListener('click', function() {
        window.location.href = 'crossword_generator.html';
    });
    document.getElementById('about_page_button').addEventListener('click', function() {
        window.location.href = 'about.html';
    });
    document.getElementById('acrostic_page_button').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Import from URL parameter if present
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const file = params.get('file');
    if (file) importFromURL(file);
});

function handleFileImport(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonObject = JSON.parse(e.target.result);
                loadPuzzle(jsonObject);
            } catch (error) {
                console.error('Invalid JSON:', error);
                alert('Invalid puzzle file!');
            }
        };
        reader.readAsText(file);
    }
}

function importFromURL(filename) {
    const fileUrl = `/acrostics/crosswords/` + filename;
    fetch(fileUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => loadPuzzle(data))
        .catch(error => {
            console.error('Error loading puzzle:', error);
        });
}

function loadPuzzle(data) {
    puzzleData = data;
    document.getElementById('credit').innerHTML = `${data.title} - by ${data.creator}`;
    document.getElementById('puzzle-container').hidden = false;
    
    renderGrid();
    renderClues();
}

function renderGrid() {
    const gridContainer = document.getElementById('crossword-grid');
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${puzzleData.grid[0].length}, 40px)`;
    
    puzzleData.grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            const cellDiv = document.createElement('div');
            
            if (cell === null) {
                cellDiv.className = 'crossword-cell black-cell';
            } else {
                cellDiv.className = 'crossword-cell';
                cellDiv.dataset.row = r;
                cellDiv.dataset.col = c;
                cellDiv.dataset.solution = cell;
                
                // Add number if this is the start of a word
                const wordStart = puzzleData.words.find(w => w.row === r && w.col === c);
                if (wordStart) {
                    const number = document.createElement('div');
                    number.className = 'cell-number';
                    number.textContent = wordStart.number;
                    cellDiv.appendChild(number);
                }
                
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'cell-input';
                cellDiv.appendChild(input);
                
                cellDiv.addEventListener('click', () => selectCell(cellDiv));
                input.addEventListener('input', (e) => handleInput(e, r, c));
                input.addEventListener('keydown', (e) => handleKeydown(e, r, c));
            }
            
            gridContainer.appendChild(cellDiv);
        });
    });
}

function renderClues() {
    const acrossContainer = document.getElementById('across-clues');
    const downContainer = document.getElementById('down-clues');
    
    acrossContainer.innerHTML = '';
    downContainer.innerHTML = '';
    
    puzzleData.words.forEach(word => {
        const clueDiv = document.createElement('div');
        clueDiv.className = 'clue-item';
        clueDiv.innerHTML = `<strong>${word.number}.</strong> ${word.clue}`;
        clueDiv.dataset.number = word.number;
        clueDiv.dataset.direction = word.direction;
        
        clueDiv.addEventListener('click', () => {
            const cell = document.querySelector(`.crossword-cell[data-row="${word.row}"][data-col="${word.col}"]`);
            if (cell) {
                selectedDirection = word.direction;
                selectCell(cell);
            }
        });
        
        if (word.direction === 'across') {
            acrossContainer.appendChild(clueDiv);
        } else {
            downContainer.appendChild(clueDiv);
        }
    });
}

function selectCell(cell) {
    // Remove previous selection
    document.querySelectorAll('.crossword-cell').forEach(c => {
        c.classList.remove('selected', 'highlighted');
    });
    document.querySelectorAll('.clue-item').forEach(c => {
        c.classList.remove('active-clue');
    });
    
    selectedCell = cell;
    cell.classList.add('selected');
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // Highlight the current word
    const word = findWordAt(row, col, selectedDirection);
    if (word) {
        highlightWord(word);
        
        // Highlight the clue
        const clue = document.querySelector(`.clue-item[data-number="${word.number}"][data-direction="${word.direction}"]`);
        if (clue) clue.classList.add('active-clue');
    }
    
    // Focus the input
    const input = cell.querySelector('.cell-input');
    if (input) input.focus();
}

function findWordAt(row, col, direction) {
    return puzzleData.words.find(w => {
        if (w.direction !== direction) return false;
        if (direction === 'across') {
            return w.row === row && col >= w.col && col < w.col + w.word.length;
        } else {
            return w.col === col && row >= w.row && row < w.row + w.word.length;
        }
    });
}

function highlightWord(word) {
    for (let i = 0; i < word.word.length; i++) {
        const r = word.direction === 'across' ? word.row : word.row + i;
        const c = word.direction === 'across' ? word.col + i : word.col;
        const cell = document.querySelector(`.crossword-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) cell.classList.add('highlighted');
    }
}

function handleInput(e, row, col) {
    const input = e.target;
    if (input.value) {
        input.value = input.value.toUpperCase();
        moveToNextCell(row, col);
    }
}

function handleKeydown(e, row, col) {
    if (e.key === 'Backspace' && !e.target.value) {
        e.preventDefault();
        moveToPreviousCell(row, col);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        selectedDirection = 'across';
        moveInDirection(row, col, 0, 1);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        selectedDirection = 'across';
        moveInDirection(row, col, 0, -1);
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedDirection = 'down';
        moveInDirection(row, col, 1, 0);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedDirection = 'down';
        moveInDirection(row, col, -1, 0);
    } else if (e.key === ' ') {
        e.preventDefault();
        selectedDirection = selectedDirection === 'across' ? 'down' : 'across';
        selectCell(selectedCell);
    }
}

function moveToNextCell(row, col) {
    const dr = selectedDirection === 'down' ? 1 : 0;
    const dc = selectedDirection === 'across' ? 1 : 0;
    moveInDirection(row, col, dr, dc);
}

function moveToPreviousCell(row, col) {
    const dr = selectedDirection === 'down' ? -1 : 0;
    const dc = selectedDirection === 'across' ? -1 : 0;
    moveInDirection(row, col, dr, dc);
}

function moveInDirection(row, col, dr, dc) {
    let newRow = row + dr;
    let newCol = col + dc;
    
    // Find next valid cell in direction
    while (newRow >= 0 && newRow < puzzleData.grid.length && 
           newCol >= 0 && newCol < puzzleData.grid[0].length) {
        if (puzzleData.grid[newRow][newCol] !== null) {
            const cell = document.querySelector(`.crossword-cell[data-row="${newRow}"][data-col="${newCol}"]`);
            if (cell) {
                selectCell(cell);
                return;
            }
        }
        newRow += dr;
        newCol += dc;
    }
}

function checkSolution() {
    let correct = 0;
    let total = 0;
    
    document.querySelectorAll('.crossword-cell:not(.black-cell)').forEach(cell => {
        const input = cell.querySelector('.cell-input');
        const solution = cell.dataset.solution;
        
        total++;
        cell.classList.remove('correct', 'incorrect');
        
        if (input.value.toUpperCase() === solution) {
            correct++;
            cell.classList.add('correct');
        } else if (input.value) {
            cell.classList.add('incorrect');
        }
    });
    
    if (correct === total) {
        alert(`🎉 Congratulations! You solved the puzzle!`);
    } else {
        alert(`You have ${correct} out of ${total} letters correct.`);
    }
}

function revealSolution() {
    if (!confirm('Are you sure you want to reveal the solution?')) return;
    
    document.querySelectorAll('.crossword-cell:not(.black-cell)').forEach(cell => {
        const input = cell.querySelector('.cell-input');
        input.value = cell.dataset.solution;
        cell.classList.add('correct');
    });
}