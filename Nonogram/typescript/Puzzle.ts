/// <reference path="./types.ts"/>

interface LoggingFunction {
    (message: any): void;
}

interface CallbackFunction {
    (state: number[][]): void;
}

class Puzzle {
    
    static deep_copy_state(state: number[][]): number[][] {
        return state.map(row => row.map(i => i));
    }

    constraints: Constraints;
    log: LoggingFunction;
    nodes: number;
    maxRow: number;
    solutions: number[][][];
    processCallback: CallbackFunction;
    rowPermutations: number[][][];

    constructor(constraints: Constraints) {
        this.constraints = constraints;
        this.log = console.log.bind(console);
    }

    set_logger(log: LoggingFunction): void {
        this.log = log;
    }

    print(state: number[][]): void {
        let row_number_strings = this.constraints.rows.map(arr => arr.join(' '));
        let row_number_max_length = row_number_strings.map(str => str.length).reduce((prev, curr) => Math.max(prev, curr));
        row_number_strings = row_number_strings.map(str => ' '.repeat(row_number_max_length - str.length) + str);

        let column_number_strings = this.constraints.columns.map(arr => arr.join(' '));
        let column_number_max_length = column_number_strings.map(str => str.length).reduce((prev, curr) => Math.max(prev, curr));
        column_number_strings = column_number_strings.map(str => ' '.repeat(column_number_max_length - str.length) + str);

        let output = '';

        for (let i = 0; i < column_number_max_length; i++) {
            output += ' '.repeat(row_number_max_length);
            for (let j = 0; j < this.constraints.width; j++) {
                output += column_number_strings[j][i];
            }
            output += '\n';
        }

        for (let i = 0; i < this.constraints.height; i++) {
            output += row_number_strings[i];
            for (let j = 0; j < this.constraints.width; j++) {
                if (state[i][j] === EMPTY)
                    output += '.';
                else
                    output += '#';
            }
            output += '\n';
        }

        this.log(output);
    }

    print_row(row: number[]) {
        this.log(row.reduce((prev: string, curr: number) => {
            if (curr === BLOCK)
                return prev + '#';
            return prev + '.';
        }, ''));
    }

    generate_row_permutations(block_positions: number[], row: number[], block_index: number, store: number[][]): void {
        let positions_to_row = () => {
            let r = new Array<number>(this.constraints.width);
            r.fill(EMPTY);

            block_positions.forEach((value: number, index: number) => {
                r.fill(BLOCK, value, value + row[index]);
            });
            return r;
        };
        
        store.push(positions_to_row());
        
        if (block_index < 0)
            return;

        let can_shift = () => {
            if (block_index + 1 === row.length) {
                return block_positions[block_index] + row[block_index] < this.constraints.width;
            }

            // if there are two empty cells right to the block
            return block_positions[block_index] + row[block_index] + 1 < block_positions[block_index + 1];
        };
        
        // while current block can shift to the right
        while (can_shift()) {
            block_positions[block_index]++;
            this.generate_row_permutations(JSON.parse(JSON.stringify(block_positions)), row, block_index - 1, store);
        }
    }

    generate_permutations() {
        this.rowPermutations = new Array<number[][]>(this.constraints.height);

        for (let i = 0; i < this.constraints.height; i++) {
            
            // there are is only 1 case for an empty row
            if (this.constraints.rows[i].length === 1 && this.constraints.rows[i][0] === 0) {
                let empty = new Array<number>(this.constraints.width);
                empty.fill(EMPTY);
                this.rowPermutations[i] = [empty];
                continue;
            }
            
            // create initial state
            let block_positions = [0];
            for (let j = 1; j < this.constraints.rows[i].length; j++) {
                block_positions.push(block_positions[j - 1] + this.constraints.rows[i][j - 1] + 1);
            }
            
            // create permutations for the current row
            this.rowPermutations[i] = [];
            this.generate_row_permutations(block_positions, this.constraints.rows[i], this.constraints.rows[i].length - 1, this.rowPermutations[i]);
        }
    }

    validate(state: number[][]): boolean {
        let rows_completed = state.length;

        for (let i = 0; i < this.constraints.width; i++) {
            let column = this.constraints.columns[i];

            // edge case when there are no blocks in the column
            if (column.length === 1 && column[0] === 0) {
                for (let j = 0; j < rows_completed; j++) {
                    if (state[j][i] === BLOCK)
                        return false;
                }

                // column is valid
                continue;
            }

            let in_block = false;
            let num_blocks;
            let block_index = 0;
            for (let j = 0; j < rows_completed; j++) {
                if (state[j][i] === BLOCK) {
                    if (in_block) {
                        num_blocks--;
                        if (num_blocks < 0)
                            return false;
                    }
                    else {

                        if (block_index >= column.length)
                            return false;

                        num_blocks = column[block_index] - 1;
                        block_index++;
                        in_block = true;
                    }
                } else {
                    if (in_block) {
                        if (num_blocks !== 0)
                            return false;
                        in_block = false;
                    }
                }
            }

            // return false if not all blocks were found
            if (rows_completed === this.constraints.height && block_index !== column.length) {
                return false;
            }

            // check if the column can't be completed with the remaining blocks
            let remaining_blocks = this.constraints.height - rows_completed;
            if (column.slice(block_index).reduce((prev, curr) => prev + curr, 0) + 
                column.slice(block_index).length - 1 > remaining_blocks) {
                return false;
            }

        }

        return true;
    }
    
    dfs(row_index: number, state: number[][]): void {

        this.nodes += 1;

        // currently there are the most correct rows
        if (row_index > this.maxRow) {
            this.log('max row: ' + row_index + '\nnodes: ' + this.nodes);
            this.maxRow = row_index;

            if (this.processCallback) {
                this.processCallback(state);
                let now: number = new Date().getTime();
                while(new Date().getTime() < now + 100){ /* do nothing */ } 
            }
        }

        if (!this.validate(state)) {
            return;
        }

        if (row_index + 1 === this.constraints.height) {
            this.solutions.push(Puzzle.deep_copy_state(state));
            return;
        }

        let permutation_index = 0;
        while (true) {

            let next_height_state = Puzzle.deep_copy_state(state);
            next_height_state.push(this.rowPermutations[row_index + 1][permutation_index]);

            this.dfs(row_index + 1, next_height_state);

            permutation_index++;

            if (permutation_index === this.rowPermutations[row_index + 1].length)
                break;
        }
    }

    solve(processCallback: CallbackFunction): void {

        this.processCallback = processCallback;

        this.log('Generating permutations.');
        this.generate_permutations();

        this.solutions = [];
        
        // start with -1 because the first call to dfs isn't really a valid state
        this.nodes = -1;
        this.maxRow = 0;
        this.log('Solving.');
        this.dfs(-1, []);

        this.log('#Solutions: ' + this.solutions.length);

        this.solutions.forEach(s => {
            this.print(s);
        });
    }
}