var Sudoku = (function () {
    function Sudoku(sudoku_string) {
        if (sudoku_string) {
            this.parseSudoku(sudoku_string);
        }
        else {
            this.grid = Sudoku.newGrid(0);
        }
    }
    Object.defineProperty(Sudoku, "lineSeperator", {
        get: function () {
            return '+---+---+---+';
        },
        enumerable: true,
        configurable: true
    });
    Sudoku.newGrid = function (value, rows, cols) {
        if (rows === void 0) { rows = 9; }
        if (cols === void 0) { cols = 9; }
        var grid = [];
        for (var row = 0; row < rows; row++) {
            var row_array = [];
            for (var col = 0; col < cols; col++) {
                row_array.push(value);
            }
            grid.push(row_array);
        }
        return grid;
    };
    Sudoku.gridDeepCopy = function (grid, rows, cols) {
        if (rows === void 0) { rows = 9; }
        if (cols === void 0) { cols = 9; }
        var copy = [];
        for (var row = 0; row < 9; row++) {
            var copied_row = [];
            for (var col = 0; col < 9; col++) {
                copied_row.push(grid[row][col]);
            }
            copy.push(copied_row);
        }
        return copy;
    };
    Sudoku.sudokuToString = function (grid, placeholder) {
        if (placeholder === void 0) { placeholder = '.'; }
        var result = '';
        for (var row = 0; row < 9; row++) {
            if (row % 3 === 0)
                result += Sudoku.lineSeperator + '\n';
            for (var col = 0; col < 9; col++) {
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
    };
    Sudoku.prototype.parseSudoku = function (sudoku_string) {
        this.grid = Sudoku.newGrid(0);
        this.fixed = Sudoku.newGrid(false);
        var lines = sudoku_string.trim().split('\n');
        lines = lines.map(function (s) { return s.trim(); });
        if (lines.length !== 9)
            throw new Error('There must be 9 lines.');
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].length !== 9) {
                throw new Error("There must be 9 characters in line " + (i + 1));
            }
        }
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                var value = parseInt(lines[row][col]);
                if (!isNaN(value) && value !== 0) {
                    this.grid[row][col] = value;
                    this.fixed[row][col] = true;
                }
            }
        }
    };
    Object.defineProperty(Sudoku.prototype, "Grid", {
        get: function () {
            return Sudoku.gridDeepCopy(this.grid);
        },
        enumerable: true,
        configurable: true
    });
    Sudoku.prototype.setNumber = function (row, col, number) {
        if (row < 0 || row > 8 || col < 0 || col > 8 || number < 1 || number > 9)
            throw new Error("Row, col or number does not match the given constraints (" + row + ", " + col + ", " + number + " given).");
        if (!this.legalNumber(row, col, number)) {
            var _a = this.findConflictingNumber(row, col, number), r = _a[0], c = _a[1];
            return [false, r, c];
        }
        this.grid[row][col] = number;
        return [true, 0, 0];
    };
    Sudoku.prototype.resetNumber = function (row, col) {
        if (row < 0 || row > 8 || col < 0 || col > 9)
            return;
        this.grid[row][col] = 0;
    };
    Sudoku.prototype.findConflictingNumber = function (row, col, number) {
        for (var i = 0; i < 9; i++) {
            if (i !== row && this.grid[i][col] === number)
                return [i, col];
            if (i !== col && this.grid[row][i] === number)
                return [row, i];
        }
        var row_start = row - row % 3;
        var col_start = col - col % 3;
        for (var r = row_start; r < row_start + 3; r++) {
            for (var c = col_start; c < col_start + 3; c++) {
                if (r === row && c === col)
                    continue;
                if (this.grid[r][c] === number) {
                    return [r, c];
                }
            }
        }
        return void 0;
    };
    Sudoku.prototype.legalNumber = function (row, col, number) {
        for (var i = 0; i < 9; i++) {
            if (i !== row && this.grid[i][col] === number)
                return false;
            if (i !== col && this.grid[row][i] === number)
                return false;
        }
        var row_start = row - row % 3;
        var col_start = col - col % 3;
        for (var r = row_start; r < row_start + 3; r++) {
            for (var c = col_start; c < col_start + 3; c++) {
                if (r === row && c === col)
                    continue;
                if (this.grid[r][c] === number) {
                    return false;
                }
            }
        }
        return true;
    };
    Sudoku.prototype.solve = function () {
        this.solutions = [];
        this.backtrack(0, 0);
        return this.solutions;
    };
    Sudoku.prototype.backtrack = function (row, col) {
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
        for (var i = 1; i <= 9; i++) {
            var legal = this.legalNumber(row, col, i);
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
    };
    return Sudoku;
}());
if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);
var grid;
var gridElements;
var resizeTimeout;
var sudoku;
function documentReady() {
    grid = document.getElementById('grid');
    createGrid();
    window.onresize = function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateTable, 100);
    };
    newSudoku();
}
function newSudoku() {
    sudoku = new Sudoku();
}
function toID(row, col) {
    return "cell-" + row + "-" + col;
}
function createGrid() {
    grid.innerHTML = '';
    gridElements = [];
    var _loop_1 = function (row) {
        var tr = document.createElement('tr');
        gridElements[row] = [];
        var _loop_2 = function (col) {
            var td = document.createElement('td');
            td.setAttribute('id', "cell-" + row + "-" + col);
            td.tabIndex = row * 9 + col;
            td.onkeydown = function (event) {
                switch (event.key) {
                    case 'Backspace':
                    case ' ':
                        sudoku.resetNumber(row, col);
                        td.innerHTML = '';
                        return;
                    case 'ArrowUp':
                        var newRow = row - 1;
                        if (newRow < 0)
                            newRow = 8;
                        document.getElementById(toID(newRow, col)).focus();
                        return;
                    case 'ArrowDown':
                        document.getElementById(toID((row + 1) % 9, col)).focus();
                        return;
                    case 'ArrowLeft':
                        var newCol = col - 1;
                        if (newCol < 0)
                            newCol = 8;
                        document.getElementById(toID(row, newCol)).focus();
                        return;
                    case 'ArrowRight':
                        document.getElementById(toID(row, (col + 1) % 9)).focus();
                        return;
                }
                var key = parseInt(event.key);
                if (!isNaN(key) && key !== 0) {
                    var _a = sudoku.setNumber(row, col, key), success = _a[0], conflictRow = _a[1], conflictCol = _a[2];
                    if (success) {
                        td.innerHTML = "<b>" + key + "</b>";
                    }
                    else {
                        var conflictCell_1 = document.getElementById(toID(conflictRow, conflictCol));
                        conflictCell_1.style.backgroundColor = 'red';
                        setTimeout(function () { return conflictCell_1.style.backgroundColor = ''; }, 3000);
                    }
                }
            };
            td.onfocus = function () { return td.style.backgroundColor = '#b3b3b3'; };
            td.onblur = function () { return td.style.backgroundColor = ''; };
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
        };
        for (var col = 0; col < 9; col++) {
            _loop_2(col);
        }
        grid.appendChild(tr);
    };
    for (var row = 0; row < 9; row++) {
        _loop_1(row);
    }
    updateTable();
}
function updateTable() {
    var em = 0.8;
    while (gridElements[0][0].offsetHeight !== gridElements[0][0].offsetWidth) {
        var cellWidth = gridElements[0][0].offsetWidth;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                gridElements[i][j].style.height = cellWidth + 'px';
                gridElements[i][j].style.fontSize = em + 'em';
            }
        }
        em -= 0.1;
    }
}
