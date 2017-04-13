'use strict';
//const BLOCK = Symbol('BLOCK');
//const EMPTY = Symbol('EMPTY');
var BLOCK = 1;
var EMPTY = 0;
var Puzzle = (function () {
    /**
     * Checks the given constraints for errors.
     * Returns an array of Error objects if errors were found and undefined otherwise.
     *
     * @param constraints
    error_constraints(constraints) {

        let errors = [];

        let check_array = (prop) => {

            if (!constraints.hasOwnProperty(prop)) {
                return new Error('Property ' + prop + ' is missing');
            }

            if (!Array.isArray(constraints[prop])) {
                return new Error('Property ' + prop + ' has to be an array');
            }

            let errors = [];

            for (let i = 0; i < constraints[prop].length; i++) {
                for (let j = 0; j < constraints[prop][i].length; j++) {
                    if (typeof constraints[prop][i][j] !== 'number') {
                        let converted = parseInt(constraints[prop][i]);
                        if (isNaN(converted)) {
                            errors.push(new Error('Value for property ' + prop + ' at index (' + i + ', ' + j + ') is not a valid number.'));
                        } else {
                            constraints[prop][i][j] = converted;
                        }
                    }

                    if (constraints[prop][i][j] <= 0) {
                        errors.push(new Error('Number of property ' + prop + ' at index (' + i + ', ' + j + ') has to be greater or equal to 0.'));
                    }
                }
            }

            if (errors.length > 0)
                return errors;
        };

        let ret = check_array('rows');
        if (ret)
            errors.concat(ret);

        ret = check_array('columns');
        if (ret)
            errors.concat(ret);

        if (this.width !== constraints.columns.length) {
            errors.push(new Error('Properties width must be the same as the length of columns.'));
        } else {
            for (let i = 0; i < constraints.width; i++) {
                if (constraints.columns[i].reduce((prev, curr) => prev + curr) + constraints.columns[i].length - 1 > constraints.height) {
                    errors.push(new Error('The numbers in column ' + i + ' are too large for the board.'));
                }
            }
        }

        if (this.height !== constraints.rows.length) {
            errors.push(new Error('Properties height must be the same as the length of rows.'));
        } else {
            for (let i = 0; i < constraints.height; i++) {
                if (constraints.rows[i].reduce((prev, curr) => prev + curr) + constraints.rows[i].length - 1 > constraints.width) {
                    errors.push(new Error('The numbers in row ' + i + ' are too large for the board.'));
                }
            }
        }

        if (errors.length > 0)
            return errors;
    }*/
    function Puzzle(constraints) {
        this.width = constraints.width;
        this.height = constraints.height;
        this.rows = constraints.rows;
        this.columns = constraints.columns;
        this.log = console.log.bind(console);
    }
    Puzzle.deep_copy_state = function (state) {
        return state.map(function (row) { return row.map(function (i) { return i; }); });
    };
    Puzzle.prototype.set_logger = function (log) {
        this.log = log;
    };
    Puzzle.prototype.print = function (state) {
        var row_number_strings = this.rows.map(function (arr) { return arr.join(' '); });
        var row_number_max_length = row_number_strings.map(function (str) { return str.length; }).reduce(function (prev, curr) { return Math.max(prev, curr); });
        row_number_strings = row_number_strings.map(function (str) { return ' '.repeat(row_number_max_length - str.length) + str; });
        var column_number_strings = this.columns.map(function (arr) { return arr.join(' '); });
        var column_number_max_length = column_number_strings.map(function (str) { return str.length; }).reduce(function (prev, curr) { return Math.max(prev, curr); });
        column_number_strings = column_number_strings.map(function (str) { return ' '.repeat(column_number_max_length - str.length) + str; });
        var output = '';
        for (var i = 0; i < column_number_max_length; i++) {
            output += ' '.repeat(row_number_max_length);
            for (var j = 0; j < this.width; j++) {
                output += column_number_strings[j][i];
            }
            output += '\n';
        }
        for (var i = 0; i < this.height; i++) {
            output += row_number_strings[i];
            for (var j = 0; j < this.width; j++) {
                if (state[i][j] === EMPTY)
                    output += '.';
                else
                    output += '#';
            }
            output += '\n';
        }
        this.log(output);
    };
    Puzzle.prototype.print_row = function (row) {
        this.log(row.reduce(function (prev, curr) {
            if (curr === BLOCK)
                return prev + '#';
            return prev + '.';
        }, ''));
    };
    Puzzle.prototype.generate_row_permutations = function (block_positions, row, block_index, store) {
        var _this = this;
        var positions_to_row = function () {
            var r = new Array(_this.width);
            r.fill(EMPTY);
            block_positions.forEach(function (value, index) {
                r.fill(BLOCK, value, value + row[index]);
            });
            return r;
        };
        store.push(positions_to_row());
        if (block_index < 0)
            return;
        var can_shift = function () {
            if (block_index + 1 === row.length) {
                return block_positions[block_index] + row[block_index] < _this.width;
            }
            // if there are two empty cells right to the block
            return block_positions[block_index] + row[block_index] + 1 < block_positions[block_index + 1];
        };
        // while current block can shift to the right
        while (can_shift()) {
            block_positions[block_index]++;
            this.generate_row_permutations(JSON.parse(JSON.stringify(block_positions)), row, block_index - 1, store);
        }
    };
    Puzzle.prototype.generate_permutations = function () {
        this.row_permutations = new Array(this.height);
        for (var i = 0; i < this.height; i++) {
            // there are is only 1 case for an empty row
            if (this.rows[i].length === 1 && this.rows[i][0] === 0) {
                var empty = new Array(this.width);
                empty.fill(EMPTY);
                this.row_permutations[i] = [empty];
                continue;
            }
            // create initial state
            var block_positions = [0];
            for (var j = 1; j < this.rows[i].length; j++) {
                block_positions.push(block_positions[j - 1] + this.rows[i][j - 1] + 1);
            }
            // create permutations for the current row
            this.row_permutations[i] = [];
            this.generate_row_permutations(block_positions, this.rows[i], this.rows[i].length - 1, this.row_permutations[i]);
        }
    };
    Puzzle.prototype.validate = function (state) {
        var rows_completed = state.length;
        for (var i = 0; i < this.width; i++) {
            var column = this.columns[i];
            // edge case when there are no blocks in the column
            if (column.length === 1 && column[0] === 0) {
                for (var j = 0; j < rows_completed; j++) {
                    if (state[j][i] === BLOCK)
                        return false;
                }
                // column is valid
                continue;
            }
            var in_block = false;
            var num_blocks = void 0;
            var block_index = 0;
            for (var j = 0; j < rows_completed; j++) {
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
                }
                else {
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
            var remaining_blocks = this.height - rows_completed;
            if (column.slice(block_index).reduce(function (prev, curr) { return prev + curr; }, 0) +
                column.slice(block_index).length - 1 > remaining_blocks) {
                return false;
            }
        }
        return true;
    };
    Puzzle.prototype.dfs = function (row_index, state) {
        this.nodes += 1;
        // currently there are the most correct rows
        if (row_index > this.maxRow) {
            this.log('max row: ' + row_index + '\nnodes: ' + this.nodes);
            this.maxRow = row_index;
            if (this.processCallback) {
                this.processCallback(state);
                var now = new Date().getTime();
                while (new Date().getTime() < now + 100) { }
            }
        }
        if (!this.validate(state)) {
            return;
        }
        if (row_index + 1 === this.height) {
            this.solutions.push(Puzzle.deep_copy_state(state));
            return;
        }
        var permutation_index = 0;
        while (true) {
            var next_height_state = Puzzle.deep_copy_state(state);
            next_height_state.push(this.row_permutations[row_index + 1][permutation_index]);
            this.dfs(row_index + 1, next_height_state);
            permutation_index++;
            if (permutation_index === this.row_permutations[row_index + 1].length)
                break;
        }
    };
    Puzzle.prototype.solve = function (processCallback) {
        var _this = this;
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
        this.solutions.forEach(function (s) {
            _this.print(s);
        });
    };
    return Puzzle;
}());
