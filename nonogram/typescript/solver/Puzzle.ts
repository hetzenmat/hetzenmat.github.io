const BLOCK = 1;
const EMPTY = 0;

interface LoggingFunction {
    (message: any): void;
}

interface Constraints {
    width:   number;
    height:  number;
    rows:    number[][];
    columns: number[][];
}

class Puzzle {
    
    static deep_copy_state(state) {
        return state.map(row => row.map(i => i));
    }

    constraints: Constraints;
    log: LoggingFunction;

    constructor(constraints) {
        this.constraints = constraints;
        this.log = console.log.bind(console);
    }

    set_logger(log: LoggingFunction): void {
        this.log = log;
    }

    print(state): void {
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

    // TODO
    generate_row_permutations(block_positions, row, block_index, store) {
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
                return block_positions[block_index] + row[block_index] < this.width;
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
        this.row_permutations = new Array(this.height);

        for (let i = 0; i < this.height; i++) {
            
            // there are is only 1 case for an empty row
            if (this.rows[i].length === 1 && this.rows[i][0] === 0) {
                let empty = new Array(this.width);
                empty.fill(EMPTY);
                this.row_permutations[i] = [empty];
                continue;
            }
            
            // create initial state
            let block_positions = [0];
            for (let j = 1; j < this.rows[i].length; j++) {
                block_positions.push(block_positions[j - 1] + this.rows[i][j - 1] + 1);
            }
            
            // create permutations for the current row
            this.row_permutations[i] = [];
            this.generate_row_permutations(block_positions, this.rows[i], this.rows[i].length - 1, this.row_permutations[i]);
        }
    }

    validate(state) {
        let rows_completed = state.length;

        for (let i = 0; i < this.width; i++) {
            let column = this.columns[i];

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
            if (rows_completed === this.height && block_index !== column.length) {
                return false;
            }

            // check if the column can't be completed with the remaining blocks
            let remaining_blocks = this.height - rows_completed;
            if (column.slice(block_index).reduce((prev, curr) => prev + curr, 0) + 
                column.slice(block_index).length - 1 > remaining_blocks) {
                return false;
            }

        }

        return true;
    }
    
    dfs(row_index, state) {

        this.nodes += 1;

        // currently there are the most correct rows
        if (row_index > this.maxRow) {
            this.log('max row: ' + row_index + '\nnodes: ' + this.nodes);
            this.maxRow = row_index;

            if (this.processCallback) {
                this.processCallback(state);
                var now = new Date().getTime();
                while(new Date().getTime() < now + 100){ /* do nothing */ } 
            }
        }

        if (!this.validate(state)) {
            return;
        }

        if (row_index + 1 === this.height) {
            this.solutions.push(Puzzle.deep_copy_state(state));
            return;
        }

        let permutation_index = 0;
        while (true) {

            let next_height_state = Puzzle.deep_copy_state(state);
            next_height_state.push(this.row_permutations[row_index + 1][permutation_index]);

            this.dfs(row_index + 1, next_height_state);

            permutation_index++;

            if (permutation_index === this.row_permutations[row_index + 1].length)
                break;
        }
    }

    solve(processCallback) {

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