'use strict';

const BLOCK = 1; //Symbol('BLOCK');
const EMPTY = 0; //Symbol('EMPTY');

// TODO
function deep_copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

class Puzzle {
    
    /**
     * Checks the given config for errors.
     * Returns an array of Error objects if errors were found and undefined otherwise.
     *
     * @param config
     */
    static error_config(config) {

        let errors = [];

        let check_positive_number = (prop) => {
            if (!config.hasOwnProperty(prop)) {
                return new Error('Property ' + prop + ' is missing.');
            }

            if (typeof config[prop] !== 'number') {
                let converted = parseInt(config[prop]);
                if (isNaN(converted)) {
                    return new Error('Property ' + prop + ' is not valid number.');
                }
                config[prop] = converted;
            }

            if (config[prop] < 0) {
                return new Error('Property ' + prop + ' needs to be greater than 0.');
            }
        };

        let check_array = (prop) => {

            if (!config.hasOwnProperty(prop)) {
                return new Error('Property ' + prop + ' is missing');
            }

            if (!Array.isArray(config[prop])) {
                return new Error('Property ' + prop + ' has to be an array');
            }

            let errors = [];

            for (let i = 0; i < config[prop].length; i++) {
                for (let j = 0; j < config[prop][i].length; j++) {
                    if (typeof config[prop][i][j] !== 'number') {
                        let converted = parseInt(config[prop][i]);
                        if (isNaN(converted)) {
                            errors.push(new Error('Value for property ' + prop + ' at index (' + i + ', ' + j + ') is not a valid number.'));
                        } else {
                            config[prop][i][j] = converted;
                        }
                    }

                    if (config[prop][i][j] <= 0) {
                        errors.push(new Error('Number of property ' + prop + ' at index (' + i + ', ' + j + ') has to be greater or equal to 0.'));
                    }
                }
            }

            if (errors.length > 0)
                return errors;
        };

        let ret = check_positive_number('width');
        if (ret)
            errors.push(ret);

        ret = check_positive_number('height');
        if (ret)
            errors.push(ret);

        if (errors.length > 0)
            return errors;

        ret = check_array('rows');
        if (ret)
            errors.concat(ret);

        ret = check_array('columns');
        if (ret)
            errors.concat(ret);

        if (config.width !== config.columns.length) {
            errors.push(new Error('Properties width must be the same as the length of columns.'));
        } else {
            for (let i = 0; i < config.width; i++) {
                if (config.columns[i].reduce((prev, curr) => prev + curr) + config.columns[i].length - 1 > config.height) {
                    errors.push(new Error('The numbers in column ' + i + ' are too large for the board.'));
                }
            }
        }

        if (config.height !== config.rows.length) {
            errors.push(new Error('Properties height must be the same as the length of rows.'));
        } else {
            for (let i = 0; i < config.height; i++) {
                if (config.rows[i].reduce((prev, curr) => prev + curr) + config.rows[i].length - 1 > config.width) {
                    errors.push(new Error('The numbers in row ' + i + ' are too large for the board.'));
                }
            }
        }

        if (errors.length > 0)
            return errors;
    }

    constructor(config, state) {
        let errors = Puzzle.error_config(config);
        if (errors)
            throw errors;

        this.width = config.width;
        this.height = config.height;

        this.rows = config.rows;
        this.columns = config.columns;

        this.solution = ["...#####..",
                         ".########.",
                         "##..######",
                         "#....##..#",
                         "#..#.#....",
                         "##..##.#..",
                         "#######..#",
                         "##########",
                         "#########.",
                         ".#######.."];
        
        this.solution = this.solution.map(row => Util.stringToArray(row).map(block => block === '#' ? BLOCK : EMPTY));
    }

    print(state) {
        let row_number_strings = this.rows.map(arr => arr.join(' '));
        let row_number_max_length = row_number_strings.map(str => str.length).reduce((prev, curr) => Math.max(prev, curr));
        row_number_strings = row_number_strings.map(str => ' '.repeat(row_number_max_length - str.length) + str);

        let column_number_strings = this.columns.map(arr => arr.join(' '));
        let column_number_max_length = column_number_strings.map(str => str.length).reduce((prev, curr) => Math.max(prev, curr));
        column_number_strings = column_number_strings.map(str => ' '.repeat(column_number_max_length - str.length) + str);

        let output = '';

        for (let i = 0; i < column_number_max_length; i++) {
            output += ' '.repeat(row_number_max_length);
            for (let j = 0; j < this.width; j++) {
                output += column_number_strings[j][i];
            }
            output += '\n';
        }

        for (let i = 0; i < this.width; i++) {
            output += row_number_strings[i];
            for (let j = 0; j  < this.height; j++) {

                try {
                    if (state[i][j] === EMPTY)
                        output += '.';
                    else
                        output += '#';
                } catch(err) {
                    output += '_';
                }
            }
            output += '\n';
        }

        console.log(output);
    }

    print_row(row) {
        console.log(row.reduce((prev, curr) => {
            if (curr === BLOCK)
                return prev + '#';
            return prev + '.';
        }, ''));
    }

    generate_row_permutations(block_positions, row, block_index, store) {
        let positions_to_row = () => {
            let r = new Array(this.width);
            r.fill(EMPTY);
            block_positions.forEach((value, index) => {
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
        }

        return true;
    }
    
    dfs(row_index, state) {
        
        if (!this.validate(state)) {
            return;
        }

        if (row_index + 1 === this.height) {
            this.solutions.push(deep_copy(state));
            return;
        }

        let permutation_index = 0;
        while (true) {

            let next_height_state = deep_copy(state);
            next_height_state.push(this.row_permutations[row_index + 1][permutation_index]);

            this.dfs(row_index + 1, next_height_state);

            permutation_index++;

            if (permutation_index === this.row_permutations[row_index + 1].length)
                break;
        }
    }

    solve() {
        this.generate_permutations();

        this.solutions = [];

        this.dfs(-1, []);

        console.log(this.solutions.length);

        this.solutions.forEach(s => {
            this.print(s);
        });
    }
}