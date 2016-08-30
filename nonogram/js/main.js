'use strict';

if (document.readyState !== 'loading')
    document_ready();
else
    document.addEventListener('DOMContentLoaded', document_ready);

let UI = {
    hover_background_color: '#b3b3b3'
};

let constraints;
let solutions = [];

function get_coords(id) {
    let coords = id.split('-');
    return {
        row: +coords[0],
        column: + coords[1]
    };
}

function mouseenter_constraint(type, cell) {
     let elements = document.querySelectorAll('.constraint-' + type + '-' + cell.dataset[type]);

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.background = UI.hover_background_color;
    }
}

function mouseleave_constraint(type, cell) {
    let elements = document.querySelectorAll('.constraint-' + type + '-' + cell.dataset[type]);

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.background = 'white';
    }
}

function onclick_row_constraint(cell) {
    let row = +cell.dataset.rows;

    let result = prompt('', constraints.rows[row].join(' '));

    constraints.rows[row] = result.split(' ').map(str => +str);
    create_table();
}

function onclick_column_constraint(cell) {
    let column = +cell.dataset.columns;

    let result = prompt('', constraints.columns[column].join(' '));

    constraints.columns[column] = result.split(' ').map(str => +str);
    create_table();
}

function update_table() {
    let em = 1.5;
    while (UI.cells[0].offsetHeight !== UI.cells[0].offsetWidth) {
        let cell_width = UI.cells[0].offsetWidth;
        for (let i = 0; i < UI.cells.length; i++) {
            UI.cells[i].style.height = cell_width + 'px';
            UI.cells[i].style.fontSize = em + 'em';
        }

        em -= 0.1;
    }
}

function create_table() {
    let html = '';

    let max_constraints_column = constraints.columns.reduce((prev, curr) => Math.max(prev, curr.length), 0);
    let max_constraints_row = constraints.rows.reduce((prev, curr) => Math.max(prev, curr.length), 0);

    for (let k = 0; k < max_constraints_column; k++) {
        html += '<tr>\n';
        html += '<td></td>\n'.repeat(max_constraints_row);
        for (let i = 0; i < constraints.width; i++) {

            let index = k - max_constraints_column + constraints.columns[i].length;
            let value;
            if (index < 0) {
                value = '';
            } else {
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
    
    for (let i = 0; i < constraints.height; i++) {
        html += '</tr>\n';
        //html += '<td></td>\n'.repeat(max_constraints_column);
        for (let k = 0; k < max_constraints_row; k++) {
            let index = k - max_constraints_row + constraints.rows[i].length;
            let value;
            if (index < 0) {
                value = '';
            } else {
                value = constraints.rows[i][index];
            }

            html += '<td class="constraint-rows-' + i + '" '
                      + 'onclick="onclick_row_constraint(this)" '
                      + 'onmouseenter="mouseenter_constraint(\'rows\', this)" '
                      + 'onmouseleave="mouseleave_constraint(\'rows\', this)" '
                      + 'data-rows="' + i + '">' + value + '</td>\n';
        }
        
        for (let j = 0; j < constraints.width; j++) {
            html += '<td id="' + i + '-' + j + '" class="row-' + i + ' column-' + j + '"></td>\n';
        }
        html += '</tr>\n';
    }

    UI.grid.innerHTML = html;
    UI.cells = document.querySelectorAll('#grid td');

    UI.column_elements = new Array(constraints.width);
    for (let i = 0; i < constraints.width; i++) {
        UI.column_elements[i] = document.getElementsByClassName('column-' + i);
    }

    UI.row_elements = new Array(constraints.height);
    for (let i = 0; i < constraints.height; i++) {
        UI.row_elements[i] = document.getElementsByClassName('row-' + i);
    }

    update_table();
}

function create_nonogram() {
    let width = +UI.input_width.value;
    let height = +UI.input_height.value;

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

function document_ready() {
    UI.grid = document.getElementById('grid');

    UI.button_create = document.getElementById('button-create');
    UI.button_create.onclick = create_nonogram;

    UI.input_width = document.getElementById('input-width');
    UI.input_height = document.getElementById('input-height');

    UI.button_solve = document.getElementById('button-solve');
    UI.button_solve.onclick = solve_nonogram;

    UI.select_nonogram = document.getElementById('select-nonogram');

    UI.button_load = document.getElementById('button-load');
    UI.button_load.onclick = () => {

        let example = examples[UI.select_nonogram.value];

        constraints = example;
        create_table();
    };

    UI.button_previous_solution = document.getElementById('button-previous-solution');
    UI.button_next_solution     = document.getElementById('button-next-solution');
    UI.solution_text = document.getElementById('solution-text');

    create_nonogram();

    window.onresize = function() {
        clearTimeout(UI.resize_timeout);
        UI.resize_timeout = setTimeout(update_table, 100);
    };
}

function clear_board() {
    let elements = document.querySelectorAll('td[class^="row-"]');

    for (let i = 0; i < elements.length; i++) {
        elements.style.background = 'white';
    }
}

function render_solution(solution) {

    for (let i = 0; i < UI.cells.length; i++) {
        UI.cells[i].style.background = 'white';
    }

    for (let i = 0; i < solution.length; i++) {
        for (let j = 0; j < solution[0].length; j++) {
            let cell = document.getElementById(i + '-' + j);
            if (solution[i][j] === BLOCK)
                cell.style.background = 'black';
        }
    }
}

function solve_nonogram() {

    let solverWorker = new Worker('js/solver_worker.js');
    solverWorker.onmessage = function(event) {
        switch (event.data.type) {
            case 'progress':
                render_solution(event.data.state);
                break;

            case 'solutions':
                solutions = event.data.solutions;
                UI.solution_text.style.display = 'initial';
                if (solutions.length === 0) {
                    UI.solution_text.innerHTML = 'No Solution found.';
                } else if (solutions.length === 1) {
                    render_solution(solutions[0]);
                } else {
                    render_solution(solutions[0]);
                    UI.current_solution = 0;
                    UI.button_next_solution.style.display = 'initial';
                    UI.button_previous_solution.style.display = 'initial';
                }
                break;

            case 'log':
                console.log(event.data.message);
                break;
        }
    };
    
    solverWorker.onerror = function(event){
        throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
    };

    solverWorker.postMessage({
        type: 'constraints',
        constraints: constraints
    });

    solverWorker.postMessage({
        type: 'start',
        callback: true
    });
}

// http://www.janko.at/Raetsel/Nonogramme/1622.a.htm

/*
 * Algorithm:
 * 
 * 1. pre-calculate all possible permutations of the rows
 * 2. DFS:
 *    2.1 move to the next permutation for the current row
 *    2.2 validate the columns
 *        valid partial solution -> proceed with DFS with next row
 *        not valid -> go to step 2.1
 */