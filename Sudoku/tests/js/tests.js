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
    Sudoku.sudokuToString = function (grid, separations, placeholder) {
        if (separations === void 0) { separations = true; }
        if (placeholder === void 0) { placeholder = '.'; }
        var result = '';
        for (var row = 0; row < 9; row++) {
            if (separations && row % 3 === 0) {
                result += Sudoku.lineSeperator + '\n';
            }
            for (var col = 0; col < 9; col++) {
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
    };
    Sudoku.prototype.parseSudoku = function (sudoku_string) {
        this.clear();
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
    Sudoku.prototype.clear = function () {
        this.grid = Sudoku.newGrid(0);
        this.candidates = Sudoku.newGrid('123456789');
        this.fixed = Sudoku.newGrid(false);
    };
    Sudoku.prototype.solve = function () {
        this.solutions = [];
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                if (this.Fixed[row][col] && !this.assign(row, col, '' + this.grid[row][col])) {
                    return [];
                }
            }
        }
        var solved = true;
        for (var row = 0; solved && row < 9; row++) {
            for (var col = 0; solved && col < 9; col++) {
                if (!this.fixed[row][col]) {
                    solved = false;
                }
            }
        }
        if (solved) {
            var solution = Sudoku.newGrid(0);
            for (var row = 0; row < 9; row++) {
                for (var col = 0; col < 9; col++) {
                    solution[row][col] = parseInt(this.candidates[row][col]);
                }
            }
            return [solution];
        }
        this.backtrack(0, 0);
        return this.solutions;
    };
    Sudoku.prototype.assign = function (row, col, value) {
        if (this.candidates[row][col].indexOf(value) === -1) {
            return false;
        }
        this.candidates[row][col] = value;
        for (var i = 0; i < 9; i++) {
            if (i !== row && this.candidates[i][col].indexOf(value) !== -1) {
                this.candidates[i][col] = this.candidates[i][col].replace(value, '');
                if (this.candidates[i][col].length === 1) {
                    this.fixed[i][col] = true;
                    this.grid[i][col] = parseInt(this.candidates[i][col]);
                    if (!this.assign(i, col, this.candidates[i][col])) {
                        return false;
                    }
                }
            }
            if (i !== col && this.candidates[row][i].indexOf(value) !== -1) {
                this.candidates[row][i] = this.candidates[row][i].replace(value, '');
                if (this.candidates[row][i].length === 1) {
                    this.fixed[row][i] = true;
                    this.grid[row][i] = parseInt(this.candidates[row][i]);
                    if (!this.assign(row, i, this.candidates[row][i])) {
                        return false;
                    }
                }
            }
        }
        var row_start = row - row % 3;
        var col_start = col - col % 3;
        for (var r = row_start; r < row_start + 3; r++) {
            for (var c = col_start; c < col_start + 3; c++) {
                if ((r === row && c === col) || this.candidates[r][c].indexOf(value) === -1)
                    continue;
                this.candidates[r][c] = this.candidates[r][c].replace(value, '');
                if (this.candidates[r][c].length === 1) {
                    this.fixed[r][c] = true;
                    this.grid[r][c] = parseInt(this.candidates[r][c]);
                    if (!this.assign(r, c, this.candidates[r][c])) {
                        return false;
                    }
                }
            }
        }
        return true;
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
var testStrings = [
    '906070403\n000400200\n070023010\n500000100\n040208060\n003000005\n030700050\n007005000\n405010708',
    '003020600\n900305001\n001806400\n008102900\n700000008\n006708200\n002609500\n800203009\n005010300',
    '200080300\n060070084\n030500209\n000105408\n000000000\n402706000\n301007040\n720040060\n004010003',
    '000000907\n000420180\n000705026\n100904000\n050000040\n000507009\n920108000\n034059000\n507000000',
    '030050040\n008010500\n460000012\n070502080\n000603000\n040109030\n250000098\n001020600\n080060020',
    '020810740\n700003100\n090002805\n009040087\n400208003\n160030200\n302700060\n005600008\n076051090'
];
var testSolutions = [
    ['926571483\n351486279\n874923516\n582367194\n149258367\n763149825\n238794651\n617835942\n495612738', '926571483\n351486279\n874923516\n582367194\n149258367\n763194825\n238749651\n617835942\n495612738'],
    ['483921657\n967345821\n251876493\n548132976\n729564138\n136798245\n372689514\n814253769\n695417382'],
    ['245981376\n169273584\n837564219\n976125438\n513498627\n482736951\n391657842\n728349165\n654812793'],
    ['462831957\n795426183\n381795426\n173984265\n659312748\n248567319\n926178534\n834259671\n517643892'],
    ['137256849\n928314567\n465897312\n673542981\n819673254\n542189736\n256731498\n391428675\n784965123'],
    ['523816749\n784593126\n691472835\n239145687\n457268913\n168937254\n342789561\n915624378\n876351492']
];
function testSudoku(value, testIndex) {
    var sudoku = new Sudoku(value);
    var solutions = sudoku.solve();
    var matched = 0;
    for (var _i = 0, _a = solutions.map(function (s) { return Sudoku.sudokuToString(s, false); }); _i < _a.length; _i++) {
        var str = _a[_i];
        for (var _b = 0, _c = testSolutions[testIndex]; _b < _c.length; _b++) {
            var testStr = _c[_b];
            if (str.trim() === testStr.trim()) {
                matched++;
            }
        }
    }
    return matched === testSolutions[testIndex].length;
}
var passedTests = testStrings.map(testSudoku).map(Number).reduce(function (prev, curr) { return prev + curr; });
console.log(passedTests, passedTests === testStrings.length);
