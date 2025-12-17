let generatedGrid = null;
let generatedWords = null;
let manualMode = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileInput').addEventListener('change', handleFileImport);
    
    const tableBody = document.getElementById('clueTable').getElementsByTagName('tbody')[0];
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-button')) {
            const row = event.target.closest('tr');
            if (row) row.parentNode.removeChild(row);
        }
    });
    
    document.getElementById('add_button').addEventListener('click', addRow);
    document.getElementById('auto_generate_button').addEventListener('click', autoGenerate);
    document.getElementById('manual_mode_button').addEventListener('click', toggleManualMode);
    document.getElementById('save_button').addEventListener('click', saveDraft);
    document.getElementById('generate_button').addEventListener('click', generatePuzzle);
    document.getElementById('back_page_button').addEventListener('click', function() {
        window.location.href = 'crossword.html';
    });
    document.getElementById('about_page_button').addEventListener('click', function() {
        window.location.href = 'about.html';
    });
    document.getElementById('acrostic_page_button').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});

function addRow() {
    const table = document.getElementById('clueTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><textarea placeholder="Clue" style="width: 100%;"></textarea></td>
        <td><input type="text" placeholder="Answer"></td>
        <td><textarea placeholder="Explanation (optional)" style="width: 100%;"></textarea></td>
        <td><button class="remove-button">X</button></td>
    `;
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonObject = JSON.parse(e.target.result);
                fillInForm(jsonObject);
            } catch (error) {
                console.error('Invalid JSON:', error);
                alert('Invalid file!');
            }
        };
        reader.readAsText(file);
    }
}

function fillInForm(data) {
    document.getElementById('title').value = data.title || '';
    document.getElementById('creator').value = data.creator || '';
    
    const table = document.getElementById('clueTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    
    if (data.entries) {
        data.entries.forEach(entry => {
            const newRow = table.insertRow();
            newRow.innerHTML = `
                <td><textarea style="width: 100%;">${entry.clue || ''}</textarea></td>
                <td><input type="text" value="${entry.answer || ''}"></td>
                <td><textarea style="width: 100%;">${entry.explanation || ''}</textarea></td>
                <td><button class="remove-button">X</button></td>
            `;
        });
    }
}

function getEntries() {
    const rows = document.getElementById('clueTable').querySelector('tbody').rows;
    const entries = [];
    
    for (let row of rows) {
        const cells = row.children;
        const clue = cells[0].children[0].value.trim();
        const answer = cells[1].children[0].value.trim().replace(/\s+/g, '').toUpperCase();
        const explanation = cells[2].children[0].value.trim();
        
        if (clue && answer) {
            entries.push({ clue, answer, explanation });
        }
    }
    
    return entries;
}

function autoGenerate() {
    const entries = getEntries();
    if (entries.length === 0) {
        alert('Please add some clues and answers first!');
        return;
    }
    
    const status = document.getElementById('generation-status');
    status.textContent = 'Generating crossword...';
    
    // Try to generate multiple times and pick the best
    let bestResult = null;
    let bestScore = 0;
    
    for (let attempt = 0; attempt < 5; attempt++) {
        const result = generateCrosswordGrid(entries);
        const score = result.placed.length;
        
        if (score > bestScore) {
            bestScore = score;
            bestResult = result;
        }
        
        if (score === entries.length) break;
    }
    
    if (bestResult && bestResult.placed.length > 0) {
        generatedGrid = bestResult.grid;
        generatedWords = bestResult.placed;
        
        status.textContent = `Successfully placed ${bestResult.placed.length} out of ${entries.length} words!`;
        if (bestResult.placed.length < entries.length) {
            status.textContent += ' Try adding more connecting words or simplify some answers.';
        }
        
        showPreview();
    } else {
        status.textContent = 'Could not generate crossword. Try different words or add more entries.';
    }
}

function generateCrosswordGrid(entries) {
    entries.sort((a, b) => b.answer.length - a.answer.length);
    
    const gridSize = 50;
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    const placed = [];
    
    // Place first word
    const firstEntry = entries[0];
    const startRow = Math.floor(gridSize / 2);
    const startCol = Math.floor((gridSize - firstEntry.answer.length) / 2);
    
    placeWord(grid, firstEntry.answer, startRow, startCol, 'across');
    placed.push({
        word: firstEntry.answer,
        clue: firstEntry.clue,
        explanation: firstEntry.explanation,
        row: startRow,
        col: startCol,
        direction: 'across',
        number: 1
    });
    
    // Try to place remaining words
    for (let i = 1; i < entries.length; i++) {
        const entry = entries[i];
        let bestPlacement = null;
        let bestIntersections = 0;
        
        for (let attempt = 0; attempt < 100; attempt++) {
            const existingWord = placed[Math.floor(Math.random() * placed.length)];
            
            for (let j = 0; j < entry.answer.length; j++) {
                for (let k = 0; k < existingWord.word.length; k++) {
                    if (entry.answer[j] === existingWord.word[k]) {
                        let newRow, newCol, newDir;
                        
                        if (existingWord.direction === 'across') {
                            newDir = 'down';
                            newRow = existingWord.row - j;
                            newCol = existingWord.col + k;
                        } else {
                            newDir = 'across';
                            newRow = existingWord.row + k;
                            newCol = existingWord.col - j;
                        }
                        
                        if (canPlaceWord(grid, entry.answer, newRow, newCol, newDir)) {
                            const intersections = countIntersections(grid, entry.answer, newRow, newCol, newDir);
                            if (intersections > bestIntersections) {
                                bestIntersections = intersections;
                                bestPlacement = { row: newRow, col: newCol, dir: newDir };
                            }
                        }
                    }
                }
            }
        }
        
        if (bestPlacement) {
            placeWord(grid, entry.answer, bestPlacement.row, bestPlacement.col, bestPlacement.dir);
            placed.push({
                word: entry.answer,
                clue: entry.clue,
                explanation: entry.explanation,
                row: bestPlacement.row,
                col: bestPlacement.col,
                direction: bestPlacement.dir,
                number: placed.length + 1
            });
        }
    }
    
    return compactGrid(grid, placed);
}

function canPlaceWord(grid, word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        const r = direction === 'across' ? row : row + i;
        const c = direction === 'across' ? col + i : col;
        
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return false;
        
        const cell = grid[r][c];
        if (cell !== null && cell !== word[i]) return false;
        
        // Check perpendicular cells
        if (direction === 'across') {
            const above = r > 0 ? grid[r - 1][c] : null;
            const below = r < grid.length - 1 ? grid[r + 1][c] : null;
            
            if (cell === null && (above !== null || below !== null)) return false;
            
            if (i === 0 && c > 0 && grid[r][c - 1] !== null) return false;
            if (i === word.length - 1 && c < grid[0].length - 1 && grid[r][c + 1] !== null) return false;
        } else {
            const left = c > 0 ? grid[r][c - 1] : null;
            const right = c < grid[0].length - 1 ? grid[r][c + 1] : null;
            
            if (cell === null && (left !== null || right !== null)) return false;
            
            if (i === 0 && r > 0 && grid[r - 1][c] !== null) return false;
            if (i === word.length - 1 && r < grid.length - 1 && grid[r + 1][c] !== null) return false;
        }
    }
    return true;
}

function countIntersections(grid, word, row, col, direction) {
    let count = 0;
    for (let i = 0; i < word.length; i++) {
        const r = direction === 'across' ? row : row + i;
        const c = direction === 'across' ? col + i : col;
        if (grid[r][c] === word[i]) count++;
    }
    return count;
}

function placeWord(grid, word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        const r = direction === 'across' ? row : row + i;
        const c = direction === 'across' ? col + i : col;
        grid[r][c] = word[i];
    }
}

function compactGrid(grid, placed) {
    let minRow = Infinity, minCol = Infinity;
    let maxRow = -Infinity, maxCol = -Infinity;
    
    placed.forEach(p => {
        minRow = Math.min(minRow, p.row);
        minCol = Math.min(minCol, p.col);
        const endRow = p.direction === 'down' ? p.row + p.word.length - 1 : p.row;
        const endCol = p.direction === 'across' ? p.col + p.word.length - 1 : p.col;
        maxRow = Math.max(maxRow, endRow);
        maxCol = Math.max(maxCol, endCol);
    });
    
    const newGrid = [];
    for (let r = minRow; r <= maxRow; r++) {
        const newRow = [];
        for (let c = minCol; c <= maxCol; c++) {
            newRow.push(grid[r][c]);
        }
        newGrid.push(newRow);
    }
    
    const newPlaced = placed.map(p => ({
        ...p,
        row: p.row - minRow,
        col: p.col - minCol
    })).sort((a, b) => a.row * 1000 + a.col - (b.row * 1000 + b.col));
    
    newPlaced.forEach((p, i) => p.number = i + 1);
    
    return { grid: newGrid, placed: newPlaced };
}

function showPreview() {
    document.getElementById('preview-container').hidden = false;
    
    const gridContainer = document.getElementById('crossword-preview');
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${generatedGrid[0].length}, 30px)`;
    
    generatedGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = cell === null ? 'preview-cell black' : 'preview-cell';
            
            if (cell !== null) {
                const wordStart = generatedWords.find(w => w.row === r && w.col === c);
                if (wordStart) {
                    const num = document.createElement('div');
                    num.className = 'preview-number';
                    num.textContent = wordStart.number;
                    cellDiv.appendChild(num);
                }
                cellDiv.textContent += cell;
            }
            
            gridContainer.appendChild(cellDiv);
        });
    });
    
    const acrossContainer = document.getElementById('across-preview');
    const downContainer = document.getElementById('down-preview');
    
    acrossContainer.innerHTML = '';
    downContainer.innerHTML = '';
    
    generatedWords.forEach(word => {
        const clueDiv = document.createElement('div');
        clueDiv.innerHTML = `<strong>${word.number}.</strong> ${word.clue}`;
        
        if (word.direction === 'across') {
            acrossContainer.appendChild(clueDiv);
        } else {
            downContainer.appendChild(clueDiv);
        }
    });
}

function toggleManualMode() {
    manualMode = !manualMode;
    document.getElementById('manual-editor').hidden = !manualMode;
    document.getElementById('manual_mode_button').textContent = manualMode ? 'Auto-Generate Mode' : 'Manual Grid Layout';
}

function saveDraft() {
    const entries = getEntries();
    const draft = {
        title: document.getElementById('title').value,
        creator: document.getElementById('creator').value,
        entries: entries
    };
    
    downloadJSON(draft, document.getElementById('title').value || 'crossword_draft');
}

function generatePuzzle() {
    if (!generatedGrid || !generatedWords) {
        alert('Please generate a grid first using Auto-Generate!');
        return;
    }
    
    const puzzle = {
        title: document.getElementById('title').value,
        creator: document.getElementById('creator').value,
        grid: generatedGrid,
        words: generatedWords
    };
    
    downloadJSON(puzzle, document.getElementById('title').value || 'crossword');
}

function downloadJSON(obj, name) {
    const jsonString = JSON.stringify(obj, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}