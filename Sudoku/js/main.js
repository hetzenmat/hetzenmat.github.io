class Sudoku {
    static get lineSeperator() {
        return '+---+---+---+';
    }
    static newGrid(value, rows = 9, cols = 9) {
        let grid = [];
        for (let row = 0; row < rows; row++) {
            let row_array = [];
            for (let col = 0; col < cols; col++) {
                row_array.push(value);
            }
            grid.push(row_array);
        }
        return grid;
    }
    static gridDeepCopy(grid, rows = 9, cols = 9) {
        let copy = [];
        for (let row = 0; row < 9; row++) {
            let copied_row = [];
            for (let col = 0; col < 9; col++) {
                copied_row.push(grid[row][col]);
            }
            copy.push(copied_row);
        }
        return copy;
    }
    static sudokuToString(grid, separations = true, placeholder = '.') {
        let result = '';
        for (let row = 0; row < 9; row++) {
            if (separations && row % 3 === 0) {
                result += Sudoku.lineSeperator + '\n';
            }
            for (let col = 0; col < 9; col++) {
                if (separations && col % 3 === 0)
                    result += '|';
                if (grid[row][col] !== 0)
                    result += grid[row][col];
                else
                    result += placeholder;
            }
            if (separations) {
                result += '|';
            }
            result += '\n';
        }
        if (separations) {
            result += Sudoku.lineSeperator + '\n';
        }
        return result;
    }
    parseSudoku(sudoku_string) {
        this.grid = Sudoku.newGrid(0);
        this.fixed = Sudoku.newGrid(false);
        let lines = sudoku_string.trim().split('\n');
        lines = lines.map(s => s.trim());
        if (lines.length !== 9)
            throw new Error('There must be 9 lines.');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length !== 9) {
                throw new Error(`There must be 9 characters in line ${i + 1}`);
            }
        }
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let value = parseInt(lines[row][col]);
                if (!isNaN(value) && value !== 0) {
                    let [success, conflictRow, conflictCol] = this.setNumber(row, col, value);
                    if (success) {
                        this.grid[row][col] = value;
                        this.fixed[row][col] = true;
                    }
                    else {
                        throw new Error(`Value at row ${row + 1} and column ${col + 1} conflicts with value at row ${conflictRow + 1} and column ${conflictCol + 1}.`);
                    }
                }
            }
        }
    }
    get Grid() {
        return this.grid;
    }
    get Fixed() {
        return this.fixed;
    }
    set Fixed(fixed) {
        this.fixed = fixed;
    }
    setNumber(row, col, number) {
        if (row < 0 || row > 8 || col < 0 || col > 8 || number < 1 || number > 9)
            throw new Error(`Row, col or number does not match the given constraints (${row}, ${col}, ${number} given).`);
        if (!this.legalNumber(row, col, number)) {
            let [r, c] = this.findConflictingNumber(row, col, number);
            return [false, r, c];
        }
        this.grid[row][col] = number;
        return [true, 0, 0];
    }
    resetNumber(row, col) {
        if (row < 0 || row > 8 || col < 0 || col > 9)
            return;
        this.grid[row][col] = 0;
    }
    toString() {
        let str = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                str += this.grid[i][j];
            }
            str += '\n';
        }
        return str.trim();
    }
    toFormattedString() {
        return Sudoku.sudokuToString(this.grid);
    }
    findConflictingNumber(row, col, number) {
        for (let i = 0; i < 9; i++) {
            if (i !== row && this.grid[i][col] === number)
                return [i, col];
            if (i !== col && this.grid[row][i] === number)
                return [row, i];
        }
        let row_start = row - row % 3;
        let col_start = col - col % 3;
        for (let r = row_start; r < row_start + 3; r++) {
            for (let c = col_start; c < col_start + 3; c++) {
                if (r === row && c === col)
                    continue;
                if (this.grid[r][c] === number) {
                    return [r, c];
                }
            }
        }
        return void 0;
    }
    legalNumber(row, col, number) {
        for (let i = 0; i < 9; i++) {
            if (i !== row && this.grid[i][col] === number)
                return false;
            if (i !== col && this.grid[row][i] === number)
                return false;
        }
        let row_start = row - row % 3;
        let col_start = col - col % 3;
        for (let r = row_start; r < row_start + 3; r++) {
            for (let c = col_start; c < col_start + 3; c++) {
                if (r === row && c === col)
                    continue;
                if (this.grid[r][c] === number) {
                    return false;
                }
            }
        }
        return true;
    }
    solve() {
        this.solutions = [];
        this.backtrack(0, 0);
        return this.solutions;
    }
    clear() {
        this.grid = Sudoku.newGrid(0);
        this.fixed = Sudoku.newGrid(false);
    }
    backtrack(row, col) {
        if (col === 9) {
            col = 0;
            row += 1;
        }
        if (row === 9) {
            return;
        }
        if (this.fixed[row][col]) {
            if (row === 8 && col === 8)
                this.solutions.push(Sudoku.gridDeepCopy(this.grid));
            else
                this.backtrack(row, col + 1);
            return;
        }
        for (let i = 1; i <= 9; i++) {
            let legal = this.legalNumber(row, col, i);
            if (!legal)
                continue;
            this.grid[row][col] = i;
            if (row == 8 && col == 8) {
                this.solutions.push(Sudoku.gridDeepCopy(this.grid));
                continue;
            }
            this.backtrack(row, col + 1);
            this.grid[row][col] = 0;
        }
    }
    constructor(sudoku_string) {
        if (sudoku_string) {
            this.parseSudoku(sudoku_string);
        }
        else {
            this.clear();
        }
    }
}
if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);
let grid;
let gridElements;
let resizeTimeout;
let sudoku;
let elementCache;
let solverWorker;
let solutions;
let currentSolution;
let solving = false;
function id(query) {
    if (elementCache.has(query)) {
        return elementCache.get(query);
    }
    let elem = document.getElementById(query);
    if (elem) {
        elementCache.set(query, elem);
    }
    return elem;
}
function stopWorker() {
    if (solverWorker)
        solverWorker.terminate();
    solverWorker = void 0;
}
function cleanUp() {
    sudoku = new Sudoku();
    solutions = void 0;
    stopWorker();
    clearSolutions();
    enableSolveButton();
    for (let row = 0; row < 9; row++)
        for (let col = 0; col < 9; col++) {
            if (sudoku.Fixed[row][col])
                continue;
            let elem = gridElements[row][col];
            elem.innerHTML = '';
            elem.classList.remove('td-fixed');
        }
}
function clearSolutions() {
    solutions = void 0;
    currentSolution = void 0;
    id('span-solution-text').innerHTML = '';
    id('button-previous-solution').style.display = 'none';
    id('button-next-solution').style.display = 'none';
    id('button-clear-solutions').style.display = 'none';
}
function enableSolveButton() {
    id('button-solve').removeAttribute('disabled');
    id('button-cancel').setAttribute('disabled', '');
    id('button-solve').value = 'Solve';
}
function documentReady() {
    elementCache = new Map();
    grid = id('grid');
    createGrid();
    sudoku = new Sudoku();
    window.onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateTable, 100);
    };
    id('button-new-sudoku').onclick = (mouseEvent) => {
        cleanUp();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                grid.childNodes[i].childNodes[j].innerHTML = '';
            }
        }
    };
    let modalCloseListener = (keyboardEvent) => {
        if (keyboardEvent.key === 'Escape') {
            let elems = document.querySelectorAll('.modal');
            for (let elem of elems) {
                elem.style.display = 'none';
            }
            document.removeEventListener('keydown', modalCloseListener);
            keyboardEvent.preventDefault();
        }
    };
    let closeSpans = document.querySelectorAll('.modal-content .close');
    for (let i = 0; i < closeSpans.length; i++) {
        let elem = closeSpans[i];
        elem.onclick = (e) => {
            elem.parentElement.parentElement.style.display = 'none';
            document.removeEventListener('keydown', modalCloseListener);
        };
    }
    id('button-import').onclick = (mouseEvent) => {
        id('modal-import').style.display = 'block';
        document.addEventListener('keydown', modalCloseListener);
        let errorElement = id('modal-import-error');
        errorElement.parentElement.style.display = 'none';
        id('button-import-ok').onclick = (mouseEvent) => {
            cleanUp();
            try {
                sudoku.parseSudoku(id('modal-import-textarea').value);
                document.removeEventListener('keydown', modalCloseListener);
                id('modal-import').style.display = 'none';
            }
            catch (error) {
                if (error instanceof Error) {
                    let message = error.message;
                    errorElement.innerHTML = message;
                    errorElement.parentElement.style.display = '';
                }
                sudoku.clear();
            }
            finally {
                renderSudoku();
            }
        };
    };
    id('button-export').onclick = (mouseEvent) => {
        id('modal-export').style.display = 'block';
        document.addEventListener('keydown', modalCloseListener);
        id('modal-export-textarea').value = sudoku.toString();
    };
    let buttonSolve = id('button-solve');
    let buttonCancel = id('button-cancel');
    buttonSolve.onclick = (mouseEvent) => {
        if (solutions)
            return;
        buttonSolve.setAttribute('disabled', '');
        buttonSolve.value = 'Solving...';
        buttonCancel.removeAttribute('disabled');
        solverWorker = new Worker('js/worker.js');
        solverWorker.onmessage = function (event) {
            switch (event.data.type) {
                case 'solutions':
                    enableSolveButton();
                    solutions = event.data.solutions;
                    sudoku.Fixed = event.data.fixed;
                    currentSolution = 0;
                    for (let solution of solutions) {
                        console.log(Sudoku.sudokuToString(solution, false));
                    }
                    id('button-clear-solutions').style.display = 'inherit';
                    if (solutions.length > 1) {
                        id('button-previous-solution').style.display = 'inherit';
                        id('button-next-solution').style.display = 'inherit';
                    }
                    renderSolution();
                    break;
            }
        };
        solverWorker.postMessage({
            sudokuString: sudoku.toString()
        });
    };
    buttonCancel.onclick = () => {
        stopWorker();
        enableSolveButton();
    };
    id('button-previous-solution').onclick = () => {
        currentSolution--;
        if (currentSolution < 0)
            currentSolution = solutions.length - 1;
        renderSolution();
    };
    id('button-next-solution').onclick = () => {
        currentSolution = (currentSolution + 1) % solutions.length;
        renderSolution();
    };
    id('button-clear-solutions').onclick = () => {
        clearSolutions();
        renderSudoku();
    };
}
function toID(row, col) {
    return `cell-${row}-${col}`;
}
function createGrid() {
    grid.innerHTML = '';
    gridElements = [];
    for (let row = 0; row < 9; row++) {
        let tr = document.createElement('tr');
        gridElements[row] = [];
        for (let col = 0; col < 9; col++) {
            let td = document.createElement('td');
            td.setAttribute('id', toID(row, col));
            td.tabIndex = row * 9 + col;
            td.onkeydown = (event) => {
                switch (event.key) {
                    case 'Backspace':
                    case ' ':
                        if (solutions) {
                            clearSolutions();
                            renderSudoku();
                        }
                        sudoku.resetNumber(row, col);
                        td.innerHTML = '';
                        td.classList.remove('td-fixed');
                        return;
                    case 'ArrowUp':
                        let newRow = row - 1;
                        if (newRow < 0)
                            newRow = 8;
                        gridElements[newRow][col].focus();
                        return;
                    case 'ArrowDown':
                        gridElements[(row + 1) % 9][col].focus();
                        return;
                    case 'ArrowLeft':
                        let newCol = col - 1;
                        if (newCol < 0)
                            newCol = 8;
                        gridElements[row][newCol].focus();
                        return;
                    case 'ArrowRight':
                        gridElements[row][(col + 1) % 9].focus();
                        return;
                }
                let key = parseInt(event.key);
                if (!isNaN(key) && key !== 0) {
                    let [success, conflictRow, conflictCol] = sudoku.setNumber(row, col, key);
                    if (success) {
                        td.innerHTML = '' + key;
                        td.classList.add('td-fixed');
                    }
                    else {
                        let conflictCell = id(toID(conflictRow, conflictCol));
                        conflictCell.style.boxShadow = '0 0 20px 10px red';
                        setTimeout(() => conflictCell.style.boxShadow = '', 3000);
                    }
                }
            };
            td.onfocus = () => td.style.boxShadow = '0 0 20px 10px #b3b3b3';
            td.onblur = () => td.style.boxShadow = '';
            if (col % 3 === 0) {
                td.classList.add('border-left');
            }
            else if (col === 8) {
                td.classList.add('border-right');
            }
            if (row % 3 === 0) {
                td.classList.add('border-top');
            }
            else if (row === 8) {
                td.classList.add('border-bottom');
            }
            gridElements[row][col] = td;
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
    updateTable();
}
function updateTable() {
    let em = 0.8;
    while (gridElements[0][0].offsetHeight !== gridElements[0][0].offsetWidth) {
        let cellWidth = gridElements[0][0].offsetWidth;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                gridElements[i][j].style.height = cellWidth + 'px';
                gridElements[i][j].style.fontSize = em + 'em';
            }
        }
        em -= 0.1;
    }
}
function renderSudoku() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let gridValue = sudoku.Grid[row][col];
            if (gridValue !== 0) {
                gridElements[row][col].innerHTML = '' + gridValue;
                gridElements[row][col].classList.add('td-fixed');
            }
            else {
                gridElements[row][col].innerHTML = '';
            }
        }
    }
}
function renderSolution() {
    if (solutions.length === 0) {
        id('span-solution-text').innerHTML = 'There are no solutions.';
        return;
    }
    id('span-solution-text').innerHTML = `Solution ${currentSolution + 1}/${solutions.length}`;
    let grid = solutions[currentSolution];
    for (let row = 0; row < 9; row++)
        for (let col = 0; col < 9; col++) {
            if (sudoku.Fixed[row][col])
                continue;
            gridElements[row][col].innerHTML = '' + grid[row][col];
        }
}
