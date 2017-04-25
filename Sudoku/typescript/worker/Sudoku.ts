class Sudoku {
    grid: number[][];

    constructor() {
        this.clear();
    }

    clear() {
        this.grid = [];
        for (let i = 0; i < 9; i++) {
            let row: number[] = [];
            for (let j = 0; j < 9; j++) {
                row.push(0);
            }
            this.grid.push(row);
        }
    }

    parse(input: string): void {
        this.clear();
        let rows = input.trim().split('\n');

        if (rows.length !== 9) {
            throw new Error(`9 rows required (${rows.length} given).`);
        }

        for (let row = 0; row < 9; row++) {
            if (rows[row].length < 9) {
                throw new Error(`Length of row ${row + 1} needs to be at least 9 characters (${rows[row].length} given).`);
            }

            for (let col = 0; col < 9; col++) {
                let value = parseInt(rows[row][col]);

                if (!this.validNumber(row, col, value)) {
                    throw new Error(`Number in row ${row + 1} and column ${col + 1} cannot be placed, because it does not satisfy the Sudoku constraints.`);
                }

                this.grid[row][col] = value;
            }
        }
    }

    validNumber(row: number, col: number, value: number): boolean {

        if (isNaN(value) || value <= 0 || value > 9)
            return false;

        // check the row and the column
        for (let i = 0; i < 9; i++) {
            if (this.grid[row][i] === value)
                return false;

            if (this.grid[i][col] === value)
                return false;
        }

        // check 3*3 block
        let rowStart = row - row % 3;
        let colStart = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grid[rowStart + i][colStart + j] === value)
                    return false;
            }
        }

        return true;
    }
}