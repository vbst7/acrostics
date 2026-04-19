let puzzleData = null;
let selectedCell = null;
let selectedDirection = 'across';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('check_letter_button').addEventListener('click', checkLetter);
    document.getElementById('reveal_letter_button').addEventListener('click', revealLetter);
    document.getElementById('check_word_button').addEventListener('click', checkWord);
    document.getElementById('reveal_word_button').addEventListener('click', revealWord);
    document.getElementById('fileInput').addEventListener('change', handleFileImport);
    document.getElementById('check_solution_button').addEventListener('click', checkSolution);
    document.getElementById('clear_board_button').addEventListener('click', clearBoard);
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
    if (!isPuzzleValid(data)) {
        alert('Failed to load puzzle: The grid contains letters that do not belong to any word. Please fix it in the generator.');
        console.error('Invalid puzzle data:', data);
        return;
    }

    puzzleData = data;
    document.getElementById('credit').innerHTML = `${data.title} - by ${data.creator}`;
    document.getElementById('puzzle-container').hidden = false;
    
    renderGrid();
    renderClues();
    loadProgress();
    checkCompletionQuietly();
}

function isPuzzleValid(data) {
    if (!data || !data.grid || !data.words) return false;

    // Create a boolean grid to mark cells that are part of a word
    const accountedFor = data.grid.map(row => row.map(() => false));

    data.words.forEach(word => {
        for (let i = 0; i < word.word.length; i++) {
            const r = word.direction === 'across' ? word.row : word.row + i;
            const c = word.direction === 'across' ? word.col + i : word.col;
            if (accountedFor[r] && accountedFor[r][c] !== undefined) {
                accountedFor[r][c] = true;
            }
        }
    });

    // Check if any cell with a letter is not accounted for
    for (let r = 0; r < data.grid.length; r++) {
        for (let c = 0; c < data.grid[r].length; c++) {
            if (data.grid[r][c] !== null && !accountedFor[r][c]) {
                return false; // Found a letter in a "cross without a word"
            }
        }
    }

    return true;
}

function renderGrid() {
    const gridContainer = document.getElementById('crossword-grid');
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${puzzleData.grid[0].length}, 40px)`;
    
    // Set the height of the clue container based on the viewport, not the grid
    const cluesWrapper = document.querySelector('.clues-wrapper');
    // 90vh = 90% of viewport height. The 100px is a buffer for buttons, etc.
    if (cluesWrapper) cluesWrapper.style.maxHeight = `calc(90vh - 100px)`;

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

        if (word.explanation) {
            const expBtn = document.createElement('button');
            expBtn.className = 'explanation-button';
            expBtn.textContent = 'Explanation';
            expBtn.hidden = true;
            expBtn.style.marginLeft = '10px';
            expBtn.onclick = (e) => {
                e.stopPropagation(); // Prevent selecting the first cell of the word
                alert(word.explanation);
            };
            clueDiv.appendChild(expBtn);
        }
        
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
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // Find words at the current cell
    const acrossWord = findWordAt(row, col, 'across');
    const downWord = findWordAt(row, col, 'down');

    // --- New Direction Logic ---
    // If clicking the same cell, toggle direction if it's an intersection
    if (cell === selectedCell && acrossWord && downWord) {
        selectedDirection = selectedDirection === 'across' ? 'down' : 'across';
    } 
    // If it's an intersection, prefer the current direction. Otherwise, pick one.
    else if (acrossWord && downWord) {
        // Keep current direction if valid, otherwise default to across
        if (selectedDirection !== 'across' && selectedDirection !== 'down') {
            selectedDirection = 'across';
        }
    } 
    // If only one direction is possible, switch to it
    else if (acrossWord) {
        selectedDirection = 'across';
    } else if (downWord) {
        selectedDirection = 'down';
    }

    // Remove previous selection
    document.querySelectorAll('.crossword-cell').forEach(c => {
        c.classList.remove('selected', 'highlighted');
    });
    document.querySelectorAll('.clue-item').forEach(c => {
        c.classList.remove('active-clue');
    });

    selectedCell = cell;
    cell.classList.add('selected');

    // Highlight the current word
    const activeWord = selectedDirection === 'across' ? acrossWord : downWord;
    highlightWordAndClue(activeWord);

    // Focus the input
    const input = cell.querySelector('.cell-input');
    if (input) {
        input.focus();
        input.select();
    }
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

function highlightWordAndClue(word) {
    if (!word) return;

    highlightWord(word);

    // Highlight the clue and scroll it into view
    const clueElement = document.querySelector(`.clue-item[data-number="${word.number}"][data-direction="${word.direction}"]`);
    if (clueElement) {
        clueElement.classList.add('active-clue');
        // Scroll the clue to the top of its container, not the whole page.
        const cluesWrapper = clueElement.closest('.clues-wrapper');
        if (cluesWrapper) {
            // Scroll the active clue to the top of its (now sticky) container.
            // We calculate the clue's position relative to the wrapper's top border.
            const wrapperTop = cluesWrapper.getBoundingClientRect().top;
            const clueTop = clueElement.getBoundingClientRect().top;
            cluesWrapper.scrollTop += clueTop - wrapperTop;
        }
    }
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
    saveProgress();
}

function handleKeydown(e, row, col) {
    if (e.key === 'Backspace' && !e.target.value) {
        e.preventDefault();
        moveToPreviousCell(row, col, false);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        selectedDirection = 'across';
        moveToNextCell(row, col, false);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        selectedDirection = 'across';
        moveToPreviousCell(row, col, false);
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedDirection = 'down';
        moveToNextCell(row, col, false);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedDirection = 'down';
        moveToPreviousCell(row, col, false);
    } else if (e.key === ' ') {
        e.preventDefault();
        e.target.value = '';
        moveToNextCell(row, col);
        saveProgress();
    } else if (e.key === 'Tab') {
        e.preventDefault();
        moveToNextUnfinishedWord(!e.shiftKey);
    }
}

function isWordFinished(word) {
    for (let i = 0; i < word.word.length; i++) {
        const r = word.direction === 'across' ? word.row : word.row + i;
        const c = word.direction === 'across' ? word.col + i : word.col;
        const cell = document.querySelector(`.crossword-cell[data-row="${r}"][data-col="${c}"]`);
        const input = cell ? cell.querySelector('.cell-input') : null;
        if (input && !input.value) return false;
    }
    return true;
}

function moveToNextUnfinishedWord(forward = true) {
    if (!puzzleData || !puzzleData.words || puzzleData.words.length === 0) return;

    let currentWord;
    if (selectedCell) {
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        currentWord = findWordAt(row, col, selectedDirection);
    }

    const currentIndex = currentWord ? puzzleData.words.indexOf(currentWord) : -1;
    const wordCount = puzzleData.words.length;

    for (let i = 1; i <= wordCount; i++) {
        const index = forward 
            ? (currentIndex + i) % wordCount 
            : (currentIndex - i + wordCount) % wordCount;
        
        const word = puzzleData.words[index];
        if (!isWordFinished(word)) {
            const cell = document.querySelector(`.crossword-cell[data-row="${word.row}"][data-col="${word.col}"]`);
            if (cell) {
                selectedDirection = word.direction;
                selectCell(cell);
                return;
            }
        }
    }
}

function moveToNextCell(row, col, skipFinished = true) {
    const currentWord = findWordAt(row, col, selectedDirection);
    if (!currentWord) {
        const dr = selectedDirection === 'down' ? 1 : 0;
        const dc = selectedDirection === 'across' ? 1 : 0;
        moveInDirection(row, col, dr, dc);
        return;
    }

    // Check if we are at the last physical cell of the current word
    const isLastCell = (selectedDirection === 'across')
        ? (col === currentWord.col + currentWord.word.length - 1)
        : (row === currentWord.row + currentWord.word.length - 1);

    if (isLastCell) {
        // Find the next unfinished word in the list (wrapping around if needed)
        const currentIndex = puzzleData.words.indexOf(currentWord);
        for (let i = 1; i <= puzzleData.words.length; i++) {
            const nextIndex = (currentIndex + i) % puzzleData.words.length;
            const nextWord = puzzleData.words[nextIndex];
            
            if (nextWord.direction === selectedDirection && (!skipFinished || !isWordFinished(nextWord))) {
                const nextCell = document.querySelector(`.crossword-cell[data-row="${nextWord.row}"][data-col="${nextWord.col}"]`);
                if (nextCell) {
                    selectCell(nextCell);
                    return;
                }
            }
        }
    } else {
        // Otherwise, move to the next cell in the current word/direction
        const dr = selectedDirection === 'down' ? 1 : 0;
        const dc = selectedDirection === 'across' ? 1 : 0;
        moveInDirection(row, col, dr, dc);
    }
}

function moveToPreviousCell(row, col, skipFinished = true) {
    const currentWord = findWordAt(row, col, selectedDirection);
    if (!currentWord) {
        const dr = selectedDirection === 'down' ? -1 : 0;
        const dc = selectedDirection === 'across' ? -1 : 0;
        moveInDirection(row, col, dr, dc);
        return;
    }

    // Check if we are at the first physical cell of the current word
    const isFirstCell = (selectedDirection === 'across')
        ? (col === currentWord.col)
        : (row === currentWord.row);

    if (isFirstCell) {
        // Find the previous unfinished word in the list (wrapping around if needed)
        const currentIndex = puzzleData.words.indexOf(currentWord);
        for (let i = 1; i <= puzzleData.words.length; i++) {
            const prevIndex = (currentIndex - i + puzzleData.words.length) % puzzleData.words.length;
            const prevWord = puzzleData.words[prevIndex];
            
            if (prevWord.direction === selectedDirection && (!skipFinished || !isWordFinished(prevWord))) {
                // Calculate the coordinates of the last cell of the previous word
                const lastRow = prevWord.direction === 'across' ? prevWord.row : prevWord.row + prevWord.word.length - 1;
                const lastCol = prevWord.direction === 'across' ? prevWord.col + prevWord.word.length - 1 : prevWord.col;
                
                const lastCell = document.querySelector(`.crossword-cell[data-row="${lastRow}"][data-col="${lastCol}"]`);
                if (lastCell) {
                    selectCell(lastCell);
                    return;
                }
            }
        }
    } else {
        // Otherwise, move to the previous cell in the current word/direction
        const dr = selectedDirection === 'down' ? -1 : 0;
        const dc = selectedDirection === 'across' ? -1 : 0;
        moveInDirection(row, col, dr, dc);
    }
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
        document.querySelectorAll('.explanation-button').forEach(btn => btn.hidden = false);
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
    saveProgress();
    document.querySelectorAll('.explanation-button').forEach(btn => btn.hidden = false);
}

function checkCompletionQuietly() {
    if (!puzzleData) return;
    const cells = document.querySelectorAll('.crossword-cell:not(.black-cell)');
    if (cells.length === 0) return;

    let allCorrect = true;
    cells.forEach(cell => {
        const input = cell.querySelector('.cell-input');
        const solution = cell.dataset.solution;
        if (!input || !input.value || input.value.toUpperCase() !== solution) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        document.querySelectorAll('.explanation-button').forEach(btn => btn.hidden = false);
    }
}

function clearBoard() {
    if (!confirm('Are you sure you want to clear the entire board? This will delete all your progress.')) return;
    
    document.querySelectorAll('.crossword-cell:not(.black-cell)').forEach(cell => {
        const input = cell.querySelector('.cell-input');
        if (input) input.value = '';
        cell.classList.remove('correct', 'incorrect');
    });

    document.querySelectorAll('.explanation-button').forEach(btn => btn.hidden = true);
    
    const key = getProgressKey();
    if (key) localStorage.removeItem(key);
}

function checkLetter() {
    if (!selectedCell) return;
    checkCell(selectedCell);
}

function revealLetter() {
    if (!selectedCell) return;
    revealCell(selectedCell);
}

function checkWord() {
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);
    const word = findWordAt(row, col, selectedDirection);
    if (!word) return;

    for (let i = 0; i < word.word.length; i++) {
        const r = word.direction === 'across' ? word.row : word.row + i;
        const c = word.direction === 'across' ? word.col + i : word.col;
        const cell = document.querySelector(`.crossword-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) checkCell(cell);
    }
}

function revealWord() {
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);
    const word = findWordAt(row, col, selectedDirection);
    if (!word) return;

    for (let i = 0; i < word.word.length; i++) {
        const r = word.direction === 'across' ? word.row : word.row + i;
        const c = word.direction === 'across' ? word.col + i : word.col;
        const cell = document.querySelector(`.crossword-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) revealCell(cell);
    }
}

function checkCell(cell) {
    const input = cell.querySelector('.cell-input');
    const solution = cell.dataset.solution;
    
    cell.classList.remove('correct', 'incorrect');
    
    if (input.value.toUpperCase() === solution) {
        cell.classList.add('correct');
    } else if (input.value) {
        cell.classList.add('incorrect');
    }
}

function revealCell(cell) {
    const input = cell.querySelector('.cell-input');
    const solution = cell.dataset.solution;

    cell.classList.remove('incorrect');
    input.value = solution;
    cell.classList.add('correct');
    saveProgress();
}

function getProgressKey() {
    if (!puzzleData) return null;
    return `crossword_progress_${puzzleData.title}_${puzzleData.creator}`;
}

function saveProgress() {
    const key = getProgressKey();
    if (!key) return;

    const progress = [];
    document.querySelectorAll('.crossword-cell:not(.black-cell)').forEach(cell => {
        const input = cell.querySelector('.cell-input');
        if (input && input.value) {
            progress.push({
                r: parseInt(cell.dataset.row),
                c: parseInt(cell.dataset.col),
                v: input.value
            });
        }
    });
    localStorage.setItem(key, JSON.stringify(progress));
}

function loadProgress() {
    const key = getProgressKey();
    if (!key) return;

    const saved = localStorage.getItem(key);
    if (!saved) return;

    try {
        const progress = JSON.parse(saved);
        progress.forEach(item => {
            const cell = document.querySelector(`.crossword-cell[data-row="${item.r}"][data-col="${item.c}"]`);
            if (cell) {
                const input = cell.querySelector('.cell-input');
                if (input) input.value = item.v;
            }
        });
    } catch (e) {
        console.error('Error loading crossword progress:', e);
    }
}
