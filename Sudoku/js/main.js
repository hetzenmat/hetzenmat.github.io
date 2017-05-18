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
    static sudokuToString(grid, placeholder = '.') {
        let result = '';
        for (let row = 0; row < 9; row++) {
            if (row % 3 === 0)
                result += Sudoku.lineSeperator + '\n';
            for (let col = 0; col < 9; col++) {
                if (col % 3 === 0)
                    result += '|';
                if (grid[row][col] !== 0)
                    result += grid[row][col];
                else
                    result += placeholder;
            }
            result += '\n';
        }
        result += Sudoku.lineSeperator + '\n';
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
                    this.grid[row][col] = value;
                    this.fixed[row][col] = true;
                }
            }
        }
    }
    get Grid() {
        return Sudoku.gridDeepCopy(this.grid);
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
            this.grid = Sudoku.newGrid(0);
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
function getElement(query) {
    if (elementCache.has(query))
        return elementCache.get(query);
    let elem = document.getElementById(query);
    elementCache.set(query, elem);
    return elem;
}
function documentReady() {
    elementCache = new Map();
    grid = getElement('grid');
    createGrid();
    sudoku = new Sudoku();
    window.onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateTable, 100);
    };
    getElement('button-new-sudoku').onclick = (mouseEvent) => {
        sudoku = new Sudoku();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                grid.childNodes[i].childNodes[j].innerHTML = '';
            }
        }
    };
    let closeSpans = document.querySelectorAll('.modal-content .close');
    for (let i = 0; i < closeSpans.length; i++) {
        let elem = closeSpans[i];
        elem.onclick = (e) => elem.parentElement.parentElement.style.display = 'none';
    }
    getElement('button-import').onclick = (mouseEvent) => {
    };
    getElement('button-export').onclick = (mouseEvent) => {
        getElement('export-modal').style.display = 'block';
        let s = sudoku.toString();
        document.querySelector('#export-modal textarea').value = s;
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
            td.setAttribute('id', `cell-${row}-${col}`);
            td.tabIndex = row * 9 + col;
            td.onkeydown = (event) => {
                switch (event.key) {
                    case 'Backspace':
                    case ' ':
                        sudoku.resetNumber(row, col);
                        td.innerHTML = '';
                        return;
                    case 'ArrowUp':
                        let newRow = row - 1;
                        if (newRow < 0)
                            newRow = 8;
                        getElement(toID(newRow, col)).focus();
                        return;
                    case 'ArrowDown':
                        getElement(toID((row + 1) % 9, col)).focus();
                        return;
                    case 'ArrowLeft':
                        let newCol = col - 1;
                        if (newCol < 0)
                            newCol = 8;
                        getElement(toID(row, newCol)).focus();
                        return;
                    case 'ArrowRight':
                        getElement(toID(row, (col + 1) % 9)).focus();
                        return;
                }
                let key = parseInt(event.key);
                if (!isNaN(key) && key !== 0) {
                    let [success, conflictRow, conflictCol] = sudoku.setNumber(row, col, key);
                    if (success) {
                        td.innerHTML = `<b>${key}</b>`;
                    }
                    else {
                        let conflictCell = getElement(toID(conflictRow, conflictCol));
                        conflictCell.style.backgroundColor = 'red';
                        setTimeout(() => conflictCell.style.backgroundColor = '', 3000);
                    }
                }
            };
            td.onfocus = () => td.style.backgroundColor = '#b3b3b3';
            td.onblur = () => td.style.backgroundColor = '';
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
