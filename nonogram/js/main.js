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
let solving;

const SPLITTER = [
    ',',
    '\\.',
    '/',
    '\\\\',
    ';',
    ' ',
    '\\|'
];

const SPLITTER_REGEX = new RegExp(`(${SPLITTER.join('|')})+`, 'g');

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

    if (solving)
        return;

    let row = +cell.dataset.rows;

    let result = prompt('', constraints.rows[row].join(' '));

    if (!result)
        return;

    reset_solutions();

    result = result.split(SPLITTER_REGEX).map(str => +str);
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

    let column = +cell.dataset.columns;

    let result = prompt('', constraints.columns[column].join(' '));

    if (!result)
        return;

    reset_solutions();

    result = result.split(SPLITTER_REGEX).map(str => +str);
    result = check_constraints('column', result);

    if (!result) {
        alert('Constraints not valid.');
        return;
    }

    constraints.columns[column] = result;
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

function reset_solutions() {
    solutions = [];
    UI.solution_text.innerHTML = '';
    UI.button_next_solution.style.display = 'none';
    UI.button_previous_solution.style.display = 'none';
    UI.current_solution = undefined;      
}

function create_nonogram() {

    solving = false;

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

function check_constraints(type, numbers) {
    if (solutions) {
        solutions = undefined;
        UI.current_solution = undefined;
        render_solution();
    }

    // remove zeros
    numbers = numbers.filter(value => value !== 0);
    if (numbers.length === 0)
        return [0];

    let sum = numbers.reduce((prev, curr) => prev + curr) + numbers.length -1;
    switch(type) {
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
    UI.button_create.onclick = create_nonogram;

    UI.input_width = document.getElementById('input-width');
    UI.input_height = document.getElementById('input-height');

    UI.button_solve = document.getElementById('button-solve');
    UI.button_solve.onclick = solve_nonogram;

    UI.select_nonogram = document.getElementById('select-nonogram');

    UI.button_load = document.getElementById('button-load');
    UI.button_load.onclick = () => {

        let example = JSON.parse(JSON.stringify(examples[UI.select_nonogram.value]));

        constraints = example;
        create_table();
    };

    UI.button_previous_solution = document.getElementById('button-previous-solution');
    UI.button_next_solution     = document.getElementById('button-next-solution');
    
    UI.button_previous_solution.onclick = () => {
        UI.current_solution--;
        if (UI.current_solution < 0)
            UI.current_solution = solutions.length - 1;

        UI.solution_text.innerHTML = `Solution ${UI.current_solution + 1} / ${solutions.length}`

        render_solution(solutions[UI.current_solution]);
    };

    UI.button_next_solution.onclick = () => {
        UI.current_solution = (UI.current_solution + 1) % solutions.length;

        UI.solution_text.innerHTML = `Solution ${UI.current_solution + 1} / ${solutions.length}`

        render_solution(solutions[UI.current_solution]);
    };

    UI.solution_text = document.getElementById('solution-text');

    UI.checkbox_show_progress = document.getElementById('checkbox-show-progress');

    create_nonogram();

    window.onresize = function() {
        clearTimeout(UI.resize_timeout);
        UI.resize_timeout = setTimeout(update_table, 100);
    };
}

function render_solution(solution) {

    for (let i = 0; i < UI.cells.length; i++) {
        UI.cells[i].style.background = 'white';
    }

    if (solution) {
        for (let i = 0; i < solution.length; i++) {
            for (let j = 0; j < solution[0].length; j++) {
                let cell = document.getElementById(i + '-' + j);
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

    // disable clicking on constraints
    let nodeList = document.querySelectorAll('#grid td[class^="constraint-"]');
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].setAttribute('solving', '');
    }

    UI.solution_text.innerHTML = 'Thinking . . .'

    let solverWorker = new Worker('js/solver_worker.js');
    solverWorker.onmessage = function(event) {
        switch (event.data.type) {
            case 'progress':
                render_solution(event.data.state);
                break;

            case 'solutions':
                solutions = event.data.solutions;
                if (solutions.length === 0) {
                    UI.solution_text.innerHTML = 'No Solution found.';
                    render_solution();
                } else if (solutions.length === 1) {
                    UI.solution_text.innerHTML = 'Solution 1 / 1';
                    render_solution(solutions[0]);
                } else {
                    UI.solution_text.innerHTML = 'Solution 1 / ' + solutions.length;
                    render_solution(solutions[0]);
                    UI.current_solution = 0;
                    UI.button_next_solution.style.display = 'initial';
                    UI.button_previous_solution.style.display = 'initial';
                }

                for (let i = 0; i < nodeList.length; i++) {
                    nodeList[i].removeAttribute('solving');
                }

                solving = false;

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
        callback: UI.checkbox_show_progress.checked
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