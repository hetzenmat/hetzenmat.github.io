var Sudoku = (function () {
    function Sudoku(sudoku_string) {
        if (sudoku_string) {
            this.parseSudoku(sudoku_string);
        }
        else {
            this.clear();
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
                    var _a = this.setNumber(row, col, value), success = _a[0], conflictRow = _a[1], conflictCol = _a[2];
                    if (success) {
                        this.grid[row][col] = value;
                        this.fixed[row][col] = true;
                    }
                    else {
                        throw new Error("Value at row " + (row + 1) + " and column " + (col + 1) + " conflicts with value at row " + (conflictRow + 1) + " and column " + (conflictCol + 1) + ".");
                    }
                }
            }
        }
    };
    Object.defineProperty(Sudoku.prototype, "Grid", {
        get: function () {
            return this.grid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sudoku.prototype, "Fixed", {
        get: function () {
            return this.fixed;
        },
        set: function (fixed) {
            this.fixed = fixed;
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
    Sudoku.prototype.toString = function () {
        var str = '';
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                str += this.grid[i][j];
            }
            str += '\n';
        }
        return str.trim();
    };
    Sudoku.prototype.toFormattedString = function () {
        return Sudoku.sudokuToString(this.grid);
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
    Sudoku.prototype.clear = function () {
        this.grid = Sudoku.newGrid(0);
        this.fixed = Sudoku.newGrid(false);
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
var sudoku;
onmessage = function (event) {
    sudoku = new Sudoku(event.data.sudokuString);
    postMessage(event.data.sudokuString);
    var solutions;
    solutions = sudoku.solve();
    postMessage({
        type: 'solutions',
        solutions: solutions,
        fixed: sudoku.Fixed
    });
};
