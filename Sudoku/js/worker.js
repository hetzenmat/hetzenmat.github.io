var Sudoku = (function () {
    function Sudoku(sudoku_string) {
        if (sudoku_string) {
            this.parse_sudoku(sudoku_string);
        }
    }
    Object.defineProperty(Sudoku, "line_seperator", {
        get: function () {
            return '+---+---+---+';
        },
        enumerable: true,
        configurable: true
    });
    Sudoku.new_grid = function (value, rows, cols) {
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
    Sudoku.grid_deep_copy = function (grid, rows, cols) {
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
    Sudoku.sudoku_to_string = function (grid, placeholder) {
        if (placeholder === void 0) { placeholder = '.'; }
        var result = '';
        for (var row = 0; row < 9; row++) {
            if (row % 3 === 0)
                result += Sudoku.line_seperator + '\n';
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
        result += Sudoku.line_seperator + '\n';
        return result;
    };
    Sudoku.prototype.parse_sudoku = function (sudoku_string) {
        this.grid = Sudoku.new_grid(0);
        this.fixed = Sudoku.new_grid(false);
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
    Sudoku.prototype.legal_number = function (row, col, number) {
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
                this.solutions.push(Sudoku.grid_deep_copy(this.grid));
            else
                this.backtrack(row, col + 1);
            return;
        }
        for (var i = 1; i <= 9; i++) {
            var legal = this.legal_number(row, col, i);
            if (!legal)
                continue;
            this.grid[row][col] = i;
            if (row == 8 && col == 8) {
                this.solutions.push(Sudoku.grid_deep_copy(this.grid));
                continue;
            }
            this.backtrack(row, col + 1);
            this.grid[row][col] = 0;
        }
    };
    return Sudoku;
}());
