function activateSquare(div) {
	deactivateInputs();
	div.style.backgroundColor = 'yellow';
    selected = div
	div.pair.style.backgroundColor = 'cyan';
	const index = parseInt(div.index);
    const location = parseInt(div.dataset.location);
	if (div.querySelector('input')) return;

    const value = div.innerHTML;
	const input = document.createElement('input');
	input.className = 'char-input';
    input.style.caretColor = 'transparent'
	input.maxLength = 1;
	div.appendChild(input);
	input.focus();

    input.addEventListener('check', (e) => {
        if (e.detail === 0) check(div)
        else if (e.detail === 1) checkAnswer(div)
    });

	input.addEventListener('input', () => {
	if (input.value.length === 1) moveToRelativeSquare(location, 1, div.grid);
	});

	input.addEventListener('keydown', (e) => {
	if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault(); 
        div.style.color = 'black'
        div.pair.style.color = 'black'
        div.innerHTML = `<div class="number">${index}`
        div.pair.innerHTML = `<div class="number">${index}</div>`;
        activateSquare(div)
	}
	if (e.key === "ArrowRight") moveToRelativeSquare(location, 1, div.grid);
	if (e.key === "Backspace" || e.key === "ArrowLeft"){
        e.preventDefault(); 
        moveToRelativeSquare(location, -1, div.grid);
    }
    if (e.key === "Tab") {
        e.preventDefault(); 
        if (e.shiftKey) moveToRelativeGrid(div.grid, -1);
        else moveToRelativeGrid(div.grid, 1);
    }
    if (e.key === "ArrowUp") moveToRelativeGrid(div.grid, -1);
    if (e.key === "ArrowDown") moveToRelativeGrid(div.grid, 1);
	});

	input.addEventListener('blur', () => {
	div.style.backgroundColor = 'white';
	div.pair.style.backgroundColor = 'white';
	const val = input.value.charAt(0).toUpperCase();
	div.removeChild(input);
    if (val !== ''){
        div.style.color = 'black'
        div.pair.style.color = 'black'
        div.innerHTML = `<div class="number">${index}</div><div class="character">${val || ''}</div>`;
        div.pair.innerHTML = `<div class="number">${index}</div><div class="character">${val || ''}</div>`;
    }
    else div.innerHTML = value;
	});
}

function deactivateInputs() {
	document.querySelectorAll('.char-input').forEach(input => input.blur());
}

function moveToRelativeSquare(currentLocation, offset, grid) {
	let nextLocation = currentLocation + offset;
	if (nextLocation < 0){
        let newGrid = document.querySelector(`.grid[data-location='${(parseInt(grid.dataset.location) - 1)}']`)
        if (newGrid) grid = newGrid;
        nextLocation = grid.total - 1;
    }
	else if (nextLocation >= grid.total){ 
        nextLocation = 0;
        let newGrid = document.querySelector(`.grid[data-location='${(parseInt(grid.dataset.location) + 1)}']`)
        if (newGrid) grid = newGrid; 
        else grid = document.querySelector(`.grid[data-location='0']`)
    }
    const next = grid.querySelector(`.square[data-location="${nextLocation}"]`);
	if (next) activateSquare(next);
}

function moveToRelativeGrid(currentGrid, offset){
    let newGrid = document.querySelector(`.grid[data-location='${(parseInt(currentGrid.dataset.location) + offset)}']`)
    if (newGrid) {
        const next = newGrid.querySelector(`.square[data-location="0"]`);
	    activateSquare(next);
    }
    else {
        const next = currentGrid.querySelector(`.square[data-location="0"]`);
	    activateSquare(next);
    }
}