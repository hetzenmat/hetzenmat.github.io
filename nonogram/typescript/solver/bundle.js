var Example = (function () {
    function Example(width, height, rows, columns) {
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.columns = columns;
    }
    return Example;
}());
var examples = {};
examples['simple_multiple'] = new Example(2, 2, [
    [1], [1]
], [
    [1], [1]
]);
examples['smile'] = new Example(5, 5, [
    [2, 2], [2, 2], [0], [1, 1], [3]
], [
    [2, 1], [2, 1], [1], [2, 1], [2, 1]
]);
examples['hourglass'] = new Example(5, 5, [
    [5], [3], [1], [1, 1], [5]
], [
    [1, 1], [2, 2], [3, 1], [2, 2], [1, 1]
]);
examples['face'] = new Example(10, 10, [
    [5], [8], [2, 6], [1, 2, 1], [1, 1, 1], [2, 2, 1], [7, 1], [10], [9], [7]
], [
    [7], [2, 5], [1, 4], [2, 1, 4], [3, 5], [10], [4, 4], [3, 1, 3], [2, 2], [2, 2]
]);
examples['dolphin'] = new Example(15, 15, [
    [2], [2], [9], [10, 1], [12, 1], [15], [7, 2, 4], [3, 2, 2], [2, 1], [1], [2, 2], [1, 2, 1, 1, 1], [2, 2, 1, 2], [1, 2, 2, 3], [3, 3, 3, 3]
], [
    [6, 1], [5, 2, 1], [5, 2], [4, 1], [5, 1, 1], [5, 2], [1, 5, 3], [6, 1, 2], [7, 1, 2], [5, 3], [4, 1, 1], [5, 2], [1, 4, 4], [1, 4, 1, 2], [3, 2, 1]
]);
examples['chicken'] = new Example(15, 15, [
    [15], [10, 2], [1, 7, 1], [1, 1, 1], [1], [1, 3, 1], [1, 5, 2], [2, 6, 3], [3, 5, 3], [4, 3], [6, 1, 3, 2], [6, 1, 5], [5, 4], [15], [15]
], [
    [15], [2, 8], [3, 7], [3, 6], [3, 2, 5], [3, 3, 2, 2], [3, 3, 2], [3, 4, 2, 2], [3, 4, 2], [2, 3, 2, 2], [1, 2, 2], [1, 6], [1, 1, 3, 4], [2, 9], [4, 4, 1, 3]
]);
examples['cocktail'] = new Example(10, 10, [
    [1], [1], [10], [2, 1, 2], [2, 1, 2], [6], [2], [2], [2], [4]
], [
    [2], [3], [1, 2], [1, 1, 1], [1, 5], [1, 6], [2, 1, 1], [2, 2], [1, 3], [2]
]);
examples['fish'] = new Example(20, 20, [
    [1, 6], [1, 8], [1, 10], [3, 3], [3, 1, 1, 1, 3], [15], [8, 5], [7], [1, 9], [12], [6, 4], [8, 3], [2, 7, 3], [2, 1, 6, 3], [4, 6, 2], [3, 6], [9], [7], [3], [4]
], [
    [1, 1], [1, 2, 1], [3, 2], [1, 1, 1, 6], [3, 4], [3, 2], [3, 1, 2, 2], [1, 2, 1, 2, 3], [2, 3, 3, 4], [4, 2, 9], [7, 9], [4, 2, 9], [3, 1, 9], [3, 2, 8], [4, 5, 3], [10, 1], [10], [10], [9], [3]
]);
examples['lion'] = new Example(25, 25, [
    [0], [5], [9], [13], [14], [16], [2, 7, 2, 1], [2, 9, 3, 1], [3, 3, 5, 3], [4, 1, 1, 1, 4, 5], [4, 1, 5, 6], [2, 3, 4, 6], [3, 1, 4, 5], [4, 3, 4, 2], [5, 7, 3], [16, 3], [17, 1], [1, 2, 12, 1], [3, 13, 2], [4, 16], [4, 15], [4, 5, 8], [4, 6, 10], [4, 4, 9], [0]
], [
    [3, 2, 2, 2], [13, 3], [3, 8, 5], [4, 4, 4, 6], [6, 8], [7, 1, 3, 3, 2], [8, 1, 1, 3, 3], [13, 3, 5], [8, 1, 1, 2, 6], [7, 1, 9], [6, 9], [4, 4, 8, 1], [3, 13, 2], [18, 2], [20], [1, 2, 3, 10], [9], [8], [2, 8], [4, 8], [6, 6], [4, 2, 4], [5, 2, 2], [4, 4], [5]
]);
examples['heraldic_animal'] = new Example(30, 40, [
    [5, 6], [2, 2, 2, 2], [1, 1, 2, 2], [1, 2, 1, 1], [1, 1, 1, 1], [1, 2, 2, 1], [2, 5, 7, 5, 1], [3, 14, 3], [29], [27], [24], [21], [3, 15, 3], [7, 13, 6], [3, 1, 4, 4, 1, 2], [2, 6, 3, 3, 6, 1], [10, 2, 2, 9], [5, 2, 2, 2, 2, 4], [2, 1, 1, 1, 1, 2], [5, 1, 1, 5], [5, 1, 1, 5], [7, 6], [5, 5], [4, 4], [4, 4], [3, 3], [2, 3], [1, 1], [11], [3, 3], [1, 1], [1, 2, 2, 1], [2, 2, 2, 2], [2, 2], [2, 3, 2], [1, 9, 1], [2, 5, 2], [4, 4], [7, 7], [10, 10]
], [
    [6, 4, 5], [2, 3, 5, 4], [1, 3, 3, 2, 3], [4, 3, 2, 3, 3], [2, 2, 3, 2, 3, 2], [1, 1, 4, 1, 3, 2], [2, 4, 1, 2, 2], [1, 4, 8, 1], [1, 5, 8, 1], [8, 1, 7, 5, 1], [9, 12, 3], [9, 8, 2, 2], [12, 4, 1, 2, 1], [16, 1, 2, 2], [8, 1, 3], [8, 1, 3], [8, 1, 3], [16, 1, 2, 2], [12, 4, 1, 2, 1], [9, 8, 2, 2], [9, 12, 3, 1], [8, 1, 8, 5, 1], [1, 7, 8, 1], [2, 1, 4, 7, 2], [3, 2, 4, 1, 2, 2], [1, 4, 4, 1, 3, 2], [1, 3, 2, 3, 3], [2, 4, 2, 3, 3], [2, 3, 3, 2, 4], [7, 4, 5]
]);
'use strict';
if (document.readyState !== 'loading')
    document_ready();
else
    document.addEventListener('DOMContentLoaded', document_ready);
var UI = {
    hover_background_color: '#b3b3b3'
};
var constraints;
var solutions = [];
var solving;
var solverWorker;
var SPLITTER = [
    ',',
    '\\.',
    '/',
    '\\\\',
    ';',
    ' ',
    '\\|'
];
var SPLITTER_REGEX = new RegExp("(" + SPLITTER.join('|') + ")+", 'g');
function mouseenter_constraint(type, cell) {
    var elements = document.querySelectorAll('.constraint-' + type + '-' + cell.dataset[type]);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.background = UI.hover_background_color;
    }
}
function mouseleave_constraint(type, cell) {
    var elements = document.querySelectorAll('.constraint-' + type + '-' + cell.dataset[type]);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.background = 'white';
    }
}
function onclick_row_constraint(cell) {
    if (solving)
        return;
    var row = +cell.dataset.rows;
    var result = prompt('', constraints.rows[row].join(' '));
    if (!result)
        return;
    reset_solutions();
    result = result.split(SPLITTER_REGEX).map(function (str) { return +str; });
    result = check_constraints('row', result);
    if (!result) {
        alert('Constraints not valid.');
        return;
    }
    constraints.rows[row] = result;
    create_table();
}
function onclick_column_constraint(cell) {
    if (solving)
        return;
    var column = +cell.dataset.columns;
    var result = prompt('', constraints.columns[column].join(' '));
    if (!result)
        return;
    reset_solutions();
    result = result.split(SPLITTER_REGEX).map(function (str) { return +str; });
    result = check_constraints('column', result);
    if (!result) {
        alert('Constraints not valid.');
        return;
    }
    constraints.columns[column] = result;
    create_table();
}
function update_table() {
    var em = 1.5;
    while (UI.cells[0].offsetHeight !== UI.cells[0].offsetWidth) {
        var cell_width = UI.cells[0].offsetWidth;
        for (var i = 0; i < UI.cells.length; i++) {
            UI.cells[i].style.height = cell_width + 'px';
            UI.cells[i].style.fontSize = em + 'em';
        }
        em -= 0.1;
    }
}
function create_table() {
    var html = '';
    var max_constraints_column = constraints.columns.reduce(function (prev, curr) { return Math.max(prev, curr.length); }, 0);
    var max_constraints_row = constraints.rows.reduce(function (prev, curr) { return Math.max(prev, curr.length); }, 0);
    for (var k = 0; k < max_constraints_column; k++) {
        html += '<tr>\n';
        html += '<td></td>\n'.repeat(max_constraints_row);
        for (var i = 0; i < constraints.width; i++) {
            var index = k - max_constraints_column + constraints.columns[i].length;
            var value = void 0;
            if (index < 0) {
                value = '';
            }
            else {
                value = constraints.columns[i][index];
            }
            html += '<td class="constraint-columns-' + i + '" '
                + 'onclick="onclick_column_constraint(this)" '
                + 'onmouseenter="mouseenter_constraint(\'columns\', this)" '
                + 'onmouseleave="mouseleave_constraint(\'columns\', this)" '
                + 'data-columns="' + i + '">' + value + '</td>\n';
        }
        html += '</tr>\n';
    }
    for (var i = 0; i < constraints.height; i++) {
        html += '</tr>\n';
        for (var k = 0; k < max_constraints_row; k++) {
            var index = k - max_constraints_row + constraints.rows[i].length;
            var value = void 0;
            if (index < 0) {
                value = '';
            }
            else {
                value = constraints.rows[i][index];
            }
            html += '<td class="constraint-rows-' + i + '" '
                + 'onclick="onclick_row_constraint(this)" '
                + 'onmouseenter="mouseenter_constraint(\'rows\', this)" '
                + 'onmouseleave="mouseleave_constraint(\'rows\', this)" '
                + 'data-rows="' + i + '">' + value + '</td>\n';
        }
        for (var j = 0; j < constraints.width; j++) {
            html += '<td id="' + i + '-' + j + '" class="row-' + i + ' column-' + j + '"></td>\n';
        }
        html += '</tr>\n';
    }
    UI.grid.innerHTML = html;
    UI.cells = document.querySelectorAll('#grid td');
    UI.column_elements = new Array(constraints.width);
    for (var i = 0; i < constraints.width; i++) {
        UI.column_elements[i] = document.getElementsByClassName('column-' + i);
    }
    UI.row_elements = new Array(constraints.height);
    for (var i = 0; i < constraints.height; i++) {
        UI.row_elements[i] = document.getElementsByClassName('row-' + i);
    }
    update_table();
}
function reset_solutions() {
    solutions = [];
    UI.solution_text.innerHTML = '';
    UI.button_next_solution.style.display = 'none';
    UI.button_previous_solution.style.display = 'none';
    UI.current_solution = undefined;
}
function create_nonogram() {
    if (solverWorker instanceof Worker)
        solverWorker.terminate();
    end_solving();
    solving = false;
    var width = +UI.input_width.value;
    var height = +UI.input_height.value;
    constraints = {
        width: width,
        height: height,
        rows: new Array(height),
        columns: new Array(width)
    };
    constraints.rows.fill([0]);
    constraints.columns.fill([0]);
    create_table();
}
function check_constraints(type, numbers) {
    if (solutions) {
        solutions = undefined;
        UI.current_solution = undefined;
        render_solution();
    }
    numbers = numbers.filter(function (value) { return value !== 0; });
    if (numbers.length === 0)
        return [0];
    var sum = numbers.reduce(function (prev, curr) { return prev + curr; }) + numbers.length - 1;
    switch (type) {
        case 'row':
            if (sum > constraints.width)
                return false;
            break;
        case 'column':
            if (sum > constraints.height)
                return false;
            break;
    }
    return numbers;
}
function document_ready() {
    UI.grid = document.getElementById('grid');
    UI.button_create = document.getElementById('button-create');
    UI.button_create.onclick = function () {
        UI.create_modal.style.display = 'none';
        create_nonogram();
    };
    UI.input_width = document.getElementById('input-width');
    UI.input_height = document.getElementById('input-height');
    UI.button_solve = document.getElementById('button-solve');
    UI.button_solve.onclick = solve_nonogram;
    UI.select_nonogram = document.getElementById('select-nonogram');
    UI.button_load = document.getElementById('button-load');
    UI.button_load.onclick = function () {
        UI.create_modal.style.display = 'none';
        if (solverWorker instanceof Worker)
            solverWorker.terminate();
        solving = false;
        end_solving();
        var example = JSON.parse(JSON.stringify(examples[UI.select_nonogram.value]));
        constraints = example;
        reset_solutions();
        create_table();
    };
    UI.button_previous_solution = document.getElementById('button-previous-solution');
    UI.button_next_solution = document.getElementById('button-next-solution');
    UI.button_previous_solution.onclick = function () {
        UI.current_solution--;
        if (UI.current_solution < 0)
            UI.current_solution = solutions.length - 1;
        UI.solution_text.innerHTML = "Solution " + (UI.current_solution + 1) + " / " + solutions.length;
        render_solution(solutions[UI.current_solution]);
    };
    UI.button_next_solution.onclick = function () {
        UI.current_solution = (UI.current_solution + 1) % solutions.length;
        UI.solution_text.innerHTML = "Solution " + (UI.current_solution + 1) + " / " + solutions.length;
        render_solution(solutions[UI.current_solution]);
    };
    UI.solution_text = document.getElementById('solution-text');
    UI.checkbox_show_progress = document.getElementById('checkbox-show-progress');
    UI.button_import = document.getElementById('button-import');
    UI.button_import.onclick = function () {
        var result = prompt('Paste configuration here:');
        try {
            result = JSON.parse(result);
        }
        catch (error) {
            alert('Wrong format.');
            return;
        }
        var props = [
            'width',
            'height',
            'rows',
            'columns'
        ];
        if (!props.every(function (p) { return result.hasOwnProperty(p); })) {
            alert('Property is missing.');
            return;
        }
        if (typeof result.width !== 'number') {
            alert('Width must be a number.');
            return;
        }
        if (typeof result.height !== 'number') {
            alert('Height must be a number.');
            return;
        }
        if (!Array.isArray(result.rows)) {
            alert('Rows must be an array.');
            return;
        }
        if (!Array.isArray(result.columns)) {
            alert('Columns must be an array');
            return;
        }
        var prevWidth = constraints.width;
        var prevHeight = constraints.height;
        constraints.width = result.width;
        constraints.height = result.height;
        for (var i = 0; i < result.rows.length; i++) {
            if (!check_constraints('row', result.rows[i])) {
                alert('Row ' + (i + 1) + ' is not valid.');
                constraints.width = prevWidth;
                constraints.height = prevHeight;
                return;
            }
        }
        for (var i = 0; i < result.columns.length; i++) {
            if (!check_constraints('column', result.columns[i])) {
                alert('Column ' + (i + 1) + ' is not valid.');
                constraints.width = prevWidth;
                constraints.height = prevHeight;
                return;
            }
        }
        constraints.rows = result.rows;
        constraints.columns = result.columns;
        create_table();
    };
    UI.button_export = document.getElementById('button-export');
    UI.button_export.onclick = function () {
        prompt('Copy the configuration and save it', JSON.stringify(constraints));
    };
    UI.create_modal = document.getElementById('create-modal');
    UI.button_open_modal = document.getElementById('button-open-modal');
    UI.button_open_modal.onclick = function () {
        UI.create_modal.style.display = 'block';
    };
    var span = document.querySelector('#create-modal .close');
    span.onclick = function () {
        UI.create_modal.style.display = 'none';
    };
    window.onclick = function (event) {
        if (event.target === UI.create_modal) {
            UI.create_modal.style.display = "none";
        }
    };
    window.onresize = function () {
        clearTimeout(UI.resize_timeout);
        UI.resize_timeout = setTimeout(update_table, 100);
    };
    create_nonogram();
}
function render_solution(solution) {
    for (var i = 0; i < UI.cells.length; i++) {
        UI.cells[i].style.background = 'white';
    }
    if (solution) {
        for (var i = 0; i < solution.length; i++) {
            for (var j = 0; j < solution[0].length; j++) {
                var cell = document.getElementById(i + '-' + j);
                if (solution[i][j] === BLOCK)
                    cell.style.background = 'black';
            }
        }
    }
}
function solve_nonogram() {
    if (solving)
        return;
    solving = true;
    begin_solving();
    solverWorker = new Worker('js/solver_worker.js');
    solverWorker.onmessage = function (event) {
        switch (event.data.type) {
            case 'progress':
                render_solution(event.data.state);
                break;
            case 'solutions':
                solutions = event.data.solutions;
                if (solutions.length === 0) {
                    UI.solution_text.innerHTML = 'No Solution found.';
                    render_solution();
                }
                else if (solutions.length === 1) {
                    UI.solution_text.innerHTML = 'Solution 1 / 1';
                    render_solution(solutions[0]);
                }
                else {
                    UI.solution_text.innerHTML = 'Solution 1 / ' + solutions.length;
                    render_solution(solutions[0]);
                    UI.current_solution = 0;
                    UI.button_next_solution.style.display = 'initial';
                    UI.button_previous_solution.style.display = 'initial';
                }
                end_solving();
                solving = false;
                break;
            case 'log':
                console.log(event.data.message);
                break;
        }
    };
    solverWorker.onerror = function (event) {
        throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
    };
    solverWorker.postMessage({
        type: 'constraints',
        constraints: constraints
    });
    solverWorker.postMessage({
        type: 'start',
        callback: UI.checkbox_show_progress.checked
    });
}
function begin_solving() {
    var nodeList = document.querySelectorAll('#grid td[class^="constraint-"]');
    for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].setAttribute('solving', '');
    }
    UI.button_solve.setAttribute('disabled', 'true');
    UI.solution_text.innerHTML = 'Thinking . . .';
}
function end_solving() {
    var nodeList = document.querySelectorAll('#grid td[class^="constraint-"]');
    for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].removeAttribute('solving');
    }
    UI.button_solve.removeAttribute('disabled');
    if (UI.solution_text.innerHTML.startsWith('Thinking')) {
        UI.solution_text.innerHTML = '';
    }
}
'use strict';
var BLOCK = 1;
var EMPTY = 0;
var Puzzle = (function () {
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
            return block_positions[block_index] + row[block_index] + 1 < block_positions[block_index + 1];
        };
        while (can_shift()) {
            block_positions[block_index]++;
            this.generate_row_permutations(JSON.parse(JSON.stringify(block_positions)), row, block_index - 1, store);
        }
    };
    Puzzle.prototype.generate_permutations = function () {
        this.row_permutations = new Array(this.height);
        for (var i = 0; i < this.height; i++) {
            if (this.rows[i].length === 1 && this.rows[i][0] === 0) {
                var empty = new Array(this.width);
                empty.fill(EMPTY);
                this.row_permutations[i] = [empty];
                continue;
            }
            var block_positions = [0];
            for (var j = 1; j < this.rows[i].length; j++) {
                block_positions.push(block_positions[j - 1] + this.rows[i][j - 1] + 1);
            }
            this.row_permutations[i] = [];
            this.generate_row_permutations(block_positions, this.rows[i], this.rows[i].length - 1, this.row_permutations[i]);
        }
    };
    Puzzle.prototype.validate = function (state) {
        var rows_completed = state.length;
        for (var i = 0; i < this.width; i++) {
            var column = this.columns[i];
            if (column.length === 1 && column[0] === 0) {
                for (var j = 0; j < rows_completed; j++) {
                    if (state[j][i] === BLOCK)
                        return false;
                }
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
            if (rows_completed === this.height && block_index !== column.length) {
                return false;
            }
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
//# sourceMappingURL=bundle.js.map