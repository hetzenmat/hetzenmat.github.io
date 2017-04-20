class Example {
    constructor(width, height, rows, columns) {
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.columns = columns;
    }
}
let examples = {};
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
const EMPTY = 0;
const BLOCK = 1;
class UserInterface {
    constructor() {
        this.hover_background_color = '#b3b3b3';
    }
}
let UI = new UserInterface();
if (document.readyState !== 'loading')
    document_ready();
else
    document.addEventListener('DOMContentLoaded', document_ready);
let constraints;
let solutions;
let solving;
let solverWorker;
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
    let userPrompt = prompt('', constraints.rows[row].join(' '));
    if (!userPrompt)
        return;
    reset_solutions();
    let result = userPrompt.split(SPLITTER_REGEX).map(str => +str);
    result = check_constraints('row', result);
    if (result === false) {
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
    let userPrompt = prompt('', constraints.columns[column].join(' '));
    if (!userPrompt)
        return;
    reset_solutions();
    let result = userPrompt.split(SPLITTER_REGEX).map(str => +str);
    result = check_constraints('column', result);
    if (result === false) {
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
    for (let i = 0; i < constraints.height; i++) {
        html += '</tr>\n';
        for (let k = 0; k < max_constraints_row; k++) {
            let index = k - max_constraints_row + constraints.rows[i].length;
            let value;
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
        for (let j = 0; j < constraints.width; j++) {
            html += '<td id="' + i + '-' + j + '" class="row-' + i + ' column-' + j + '"></td>\n';
        }
        html += '</tr>\n';
    }
    UI.grid.innerHTML = html;
    UI.cells = document.querySelectorAll('#grid td');
    UI.columnElements = new Array(constraints.width);
    for (let i = 0; i < constraints.width; i++) {
        UI.columnElements[i] = document.getElementsByClassName('column-' + i);
    }
    UI.rowElements = new Array(constraints.height);
    for (let i = 0; i < constraints.height; i++) {
        UI.rowElements[i] = document.getElementsByClassName('row-' + i);
    }
    update_table();
}
function reset_solutions() {
    solutions = [];
    UI.solutionText.innerHTML = '';
    UI.buttonNextSolution.style.display = 'none';
    UI.buttonPreviousSolution.style.display = 'none';
    UI.currentSolution = undefined;
}
function create_nonogram() {
    if (solverWorker instanceof Worker)
        solverWorker.terminate();
    end_solving();
    solving = false;
    let width = +UI.inputWidth.value;
    let height = +UI.inputHeight.value;
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
        UI.currentSolution = undefined;
        render_solution();
    }
    numbers = numbers.filter(value => value !== 0);
    if (numbers.length === 0)
        return [0];
    let sum = numbers.reduce((prev, curr) => prev + curr) + numbers.length - 1;
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
    UI.buttonCreate = document.getElementById('button-create');
    UI.buttonCreate.onclick = () => {
        UI.createModal.style.display = 'none';
        create_nonogram();
    };
    UI.inputWidth = document.getElementById('input-width');
    UI.inputHeight = document.getElementById('input-height');
    UI.buttonSolve = document.getElementById('button-solve');
    UI.buttonSolve.onclick = solve_nonogram;
    UI.selectNonogram = document.getElementById('select-nonogram');
    UI.buttonLoad = document.getElementById('button-load');
    UI.buttonLoad.onclick = () => {
        UI.createModal.style.display = 'none';
        if (solverWorker instanceof Worker)
            solverWorker.terminate();
        solving = false;
        end_solving();
        let example = JSON.parse(JSON.stringify(examples[UI.selectNonogram.value]));
        constraints = example;
        reset_solutions();
        create_table();
    };
    UI.buttonPreviousSolution = document.getElementById('button-previous-solution');
    UI.buttonNextSolution = document.getElementById('button-next-solution');
    UI.buttonPreviousSolution.onclick = () => {
        UI.currentSolution--;
        if (UI.currentSolution < 0)
            UI.currentSolution = solutions.length - 1;
        UI.solutionText.innerHTML = `Solution ${UI.currentSolution + 1} / ${solutions.length}`;
        render_solution(solutions[UI.currentSolution]);
    };
    UI.buttonNextSolution.onclick = () => {
        UI.currentSolution = (UI.currentSolution + 1) % solutions.length;
        UI.solutionText.innerHTML = `Solution ${UI.currentSolution + 1} / ${solutions.length}`;
        render_solution(solutions[UI.currentSolution]);
    };
    UI.solutionText = document.getElementById('solution-text');
    UI.checkboxShowProgress = document.getElementById('checkbox-show-progress');
    UI.buttonImport = document.getElementById('button-import');
    UI.buttonImport.onclick = () => {
        let config_string = prompt('Paste configuration here:');
        let result;
        try {
            result = JSON.parse(config_string);
        }
        catch (error) {
            alert('Wrong format.');
            return;
        }
        let props = [
            'width',
            'height',
            'rows',
            'columns'
        ];
        if (!props.every(p => result.hasOwnProperty(p))) {
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
        let prevWidth = constraints.width;
        let prevHeight = constraints.height;
        constraints.width = result.width;
        constraints.height = result.height;
        for (let i = 0; i < result.rows.length; i++) {
            if (!check_constraints('row', result.rows[i])) {
                alert('Row ' + (i + 1) + ' is not valid.');
                constraints.width = prevWidth;
                constraints.height = prevHeight;
                return;
            }
        }
        for (let i = 0; i < result.columns.length; i++) {
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
    UI.buttonExport = document.getElementById('button-export');
    UI.buttonExport.onclick = () => {
        prompt('Copy the configuration and save it', JSON.stringify(constraints));
    };
    UI.createModal = document.getElementById('create-modal');
    UI.buttonOpenModal = document.getElementById('button-open-modal');
    UI.buttonOpenModal.onclick = () => {
        UI.createModal.style.display = 'block';
    };
    let span = document.querySelector('#create-modal .close');
    span.onclick = () => {
        UI.createModal.style.display = 'none';
    };
    window.onclick = event => {
        if (event.target === UI.createModal) {
            UI.createModal.style.display = "none";
        }
    };
    window.onresize = () => {
        clearTimeout(UI.resizeTimeout);
        UI.resizeTimeout = setTimeout(update_table, 100);
    };
    create_nonogram();
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
                    UI.solutionText.innerHTML = 'No Solution found.';
                    render_solution();
                }
                else if (solutions.length === 1) {
                    UI.solutionText.innerHTML = 'Solution 1 / 1';
                    render_solution(solutions[0]);
                }
                else {
                    UI.solutionText.innerHTML = 'Solution 1 / ' + solutions.length;
                    render_solution(solutions[0]);
                    UI.currentSolution = 0;
                    UI.buttonNextSolution.style.display = 'initial';
                    UI.buttonPreviousSolution.style.display = 'initial';
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
        callback: UI.checkboxShowProgress.checked
    });
}
function begin_solving() {
    let nodeList = document.querySelectorAll('#grid td[class^="constraint-"]');
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].setAttribute('solving', '');
    }
    UI.buttonSolve.setAttribute('disabled', 'true');
    UI.solutionText.innerHTML = 'Thinking . . .';
}
function end_solving() {
    let nodeList = document.querySelectorAll('#grid td[class^="constraint-"]');
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].removeAttribute('solving');
    }
    UI.buttonSolve.removeAttribute('disabled');
    if (UI.solutionText.innerHTML.startsWith('Thinking')) {
        UI.solutionText.innerHTML = '';
    }
}
