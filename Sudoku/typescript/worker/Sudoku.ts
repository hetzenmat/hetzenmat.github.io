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

    validNumber(row: number, col: number, value: number): boolean {
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