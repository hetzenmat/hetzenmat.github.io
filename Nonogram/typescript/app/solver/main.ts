/// <reference path="../../types.ts"/>

// examples from example.ts
declare var examples: any;

class UserInterface {
    hover_background_color: string;
    cells: NodeListOf<HTMLElement>;
    grid: HTMLElement;
    columnElements: HTMLCollectionOf<Element>[];
    rowElements: HTMLCollectionOf<Element>[];
    solutionText: HTMLElement;
    buttonNextSolution: HTMLButtonElement;
    buttonPreviousSolution: HTMLButtonElement;
    inputWidth: HTMLInputElement;
    inputHeight: HTMLInputElement;
    buttonCreate: HTMLButtonElement;
    createModal: HTMLElement;
    buttonSolve: HTMLButtonElement;
    selectNonogram: HTMLSelectElement;
    buttonLoad: HTMLButtonElement;
    checkboxShowProgress: HTMLInputElement;
    buttonImport: HTMLButtonElement;
    currentSolution: number;
    buttonExport: HTMLButtonElement;
    buttonOpenModal: HTMLButtonElement;
    resizeTimeout: number;

    constructor() {
        this.hover_background_color = '#b3b3b3';
    }
}

let UI = new UserInterface();

if (document.readyState !== 'loading')
    document_ready();
else
    document.addEventListener('DOMContentLoaded', document_ready);

let constraints: Constraints;
let solutions: number[][][];
let solving: boolean;
let solverWorker: Worker;

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

function mouseenter_constraint(type: string, cell: HTMLElement) {
     let elements = <NodeListOf<HTMLElement>>document.querySelectorAll('.constraint-' + type + '-' + cell.dataset[type]);

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.background = UI.hover_background_color;
    }
}

function mouseleave_constraint(type: string, cell: HTMLElement) {
    let elements = <NodeListOf<HTMLElement>>document.querySelectorAll('.constraint-' + type + '-' + cell.dataset[type]);

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.background = 'white';
    }
}

function onclick_row_constraint(cell: HTMLElement) {

    if (solving)
        return;

    let row = +cell.dataset.rows;

    let userPrompt: string = prompt('', constraints.rows[row].join(' '));

    if (!userPrompt)
        return;

    reset_solutions();

    let result: false | number[] = userPrompt.split(SPLITTER_REGEX).map(str => +str);
    result = check_constraints('row', result);

    if (result === false) {
        alert('Constraints not valid.');
        return;
    }

    constraints.rows[row] = result;
    create_table();
}

function onclick_column_constraint(cell: HTMLElement) {

    if (solving)
        return;

    let column = +cell.dataset.columns;

    let userPrompt = prompt('', constraints.columns[column].join(' '));

    if (!userPrompt)
        return;

    reset_solutions();

    let result: false | number[] = userPrompt.split(SPLITTER_REGEX).map(str => +str);
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
    UI.cells = <NodeListOf<HTMLElement>>document.querySelectorAll('#grid td');

    UI.columnElements = new Array<HTMLCollectionOf<Element>>(constraints.width);
    for (let i = 0; i < constraints.width; i++) {
        UI.columnElements[i] = document.getElementsByClassName('column-' + i);
    }

    UI.rowElements = new Array<HTMLCollectionOf<Element>>(constraints.height);
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

function check_constraints(type: string, numbers: number[]) {
    if (solutions) {
        solutions = undefined;
        UI.currentSolution = undefined;
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

    UI.buttonCreate = <HTMLButtonElement>document.getElementById('button-create');
    UI.buttonCreate.onclick = () => {
        UI.createModal.style.display = 'none';
        create_nonogram();
    };

    UI.inputWidth = <HTMLInputElement>document.getElementById('input-width');
    UI.inputHeight = <HTMLInputElement>document.getElementById('input-height');

    UI.buttonSolve = <HTMLButtonElement>document.getElementById('button-solve');
    UI.buttonSolve.onclick = solve_nonogram;

    UI.selectNonogram = <HTMLSelectElement>document.getElementById('select-nonogram');

    UI.buttonLoad = <HTMLButtonElement>document.getElementById('button-load');
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

    UI.buttonPreviousSolution = <HTMLButtonElement>document.getElementById('button-previous-solution');
    UI.buttonNextSolution     = <HTMLButtonElement>document.getElementById('button-next-solution');
    
    UI.buttonPreviousSolution.onclick = () => {
        UI.currentSolution--;
        if (UI.currentSolution < 0)
            UI.currentSolution = solutions.length - 1;

        UI.solutionText.innerHTML = `Solution ${UI.currentSolution + 1} / ${solutions.length}`

        render_solution(solutions[UI.currentSolution]);
    };

    UI.buttonNextSolution.onclick = () => {
        UI.currentSolution = (UI.currentSolution + 1) % solutions.length;

        UI.solutionText.innerHTML = `Solution ${UI.currentSolution + 1} / ${solutions.length}`

        render_solution(solutions[UI.currentSolution]);
    };

    UI.solutionText = document.getElementById('solution-text');

    UI.checkboxShowProgress = <HTMLInputElement>document.getElementById('checkbox-show-progress');

    UI.buttonImport = <HTMLButtonElement>document.getElementById('button-import');
    UI.buttonImport.onclick = () => {
        let config_string = prompt('Paste configuration here:');
        let result: Constraints;
        try {
            result = JSON.parse(config_string);
        } catch (error) {
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
    UI.buttonExport = <HTMLButtonElement>document.getElementById('button-export');
    UI.buttonExport.onclick = () => {
        prompt('Copy the configuration and save it', JSON.stringify(constraints));
    };

    /*
     * Create Modal
     */
    UI.createModal = document.getElementById('create-modal');
    UI.buttonOpenModal = <HTMLButtonElement>document.getElementById('button-open-modal');
    UI.buttonOpenModal.onclick = () => {
        UI.createModal.style.display = 'block';
    };
    let span = <HTMLElement>document.querySelector('#create-modal .close');
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

function render_solution(solution?: number[][]) {

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
    solverWorker.onmessage = function(event) {
        switch (event.data.type) {
            case 'progress':
                render_solution(event.data.state);
                break;

            case 'solutions':
                solutions = event.data.solutions;
                if (solutions.length === 0) {
                    UI.solutionText.innerHTML = 'No Solution found.';
                    render_solution();
                } else if (solutions.length === 1) {
                    UI.solutionText.innerHTML = 'Solution 1 / 1';
                    render_solution(solutions[0]);
                } else {
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
    
    solverWorker.onerror = function(event){
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
    // disable clicking on constraints
    let nodeList = document.querySelectorAll('#grid td[class^="constraint-"]');
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].setAttribute('solving', '');
    }
    UI.buttonSolve.setAttribute('disabled', 'true');

    UI.solutionText.innerHTML = 'Thinking . . .'
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