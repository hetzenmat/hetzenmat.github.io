class Sudoku {

    private grid: number[][];
    private fixed: boolean[][];
    private solutions: number[][][];

    private static get lineSeperator(): string {
        return '+---+---+---+';
    }

    private static newGrid(value: any, rows=9, cols=9): any[][] {
        let grid: any[][] = [];

        for (let row = 0; row < rows; row++) {
            let row_array: any[] = [];
            for (let col = 0; col < cols; col++) {
                row_array.push(value);
            }
            grid.push(row_array);
        }

        return grid;
    }

    private static gridDeepCopy<T>(grid: T[][], rows=9, cols=9): T[][] {
        let copy: T[][] = [];

        for (let row = 0; row < 9; row++) {
            let copied_row: T[] = [];
            for (let col = 0; col < 9; col++) {
                copied_row.push(grid[row][col]);
            }
            copy.push(copied_row);
        }

        return copy;
    }

    public static sudokuToString(grid: number[][], placeholder='.'): string {
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

    public parseSudoku(sudoku_string: string): void {
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

    public get Grid(): number[][] {
        return Sudoku.gridDeepCopy<number>(this.grid);
    }

    public setNumber(row: number, col: number, number: number): [boolean, number, number] {
        if (row < 0 || row > 8 || col < 0 || col > 8 || number < 1 || number > 9)
            throw new Error(`Row, col or number does not match the given constraints (${row}, ${col}, ${number} given).`);

        if (!this.legalNumber(row, col, number)) {
            let [r, c] = this.findConflictingNumber(row, col, number);
            return [false, r, c];
        }

        this.grid[row][col] = number;
        return [true, 0, 0];
    }

    public resetNumber(row: number, col: number): void {
        if (row < 0 || row > 8 || col < 0 || col > 9)
            return;

        this.grid[row][col] = 0;
    }

    public toString(): string {
        return Sudoku.sudokuToString(this.grid);
    }

    private findConflictingNumber(row: number, col: number, number: number): [number, number] {
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

    private legalNumber(row: number, col: number, number: number): boolean {
        // check rows and columns
        for (let i = 0; i < 9; i++) {
            if (i !== row && this.grid[i][col] === number)
                return false;
            if (i !== col && this.grid[row][i] === number)
                return false;
        }

        // check the block
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

    public solve(): number[][][] {
        this.solutions = [];
        this.backtrack(0, 0);
        return this.solutions;
    }

    private backtrack(row: number, col: number): void {
        if (col === 9) {
            col = 0;
            row += 1;
        }

        if (row === 9) {
            return;
        }

        if (this.fixed[row][col]) {
            if (row === 8 && col === 8)
                this.solutions.push(Sudoku.gridDeepCopy<number>(this.grid));
            else
                this.backtrack(row, col+1);
            return;
        }

        for (let i = 1; i <= 9; i++) {
            let legal = this.legalNumber(row, col, i);

            if (!legal)
                continue;

            this.grid[row][col] = i;
            if (row == 8 && col == 8) {
                this.solutions.push(Sudoku.gridDeepCopy<number>(this.grid));
                continue;
            }

            this.backtrack(row, col+1);
            this.grid[row][col] = 0;
        }
    }

    constructor(sudoku_string?: string) {
        if (sudoku_string) {
            this.parseSudoku(sudoku_string);
        } else {
            this.grid = Sudoku.newGrid(0);
        }
    }
}
