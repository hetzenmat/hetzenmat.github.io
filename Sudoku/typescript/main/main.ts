/// <reference path="../Sudoku.ts"/>

if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);

let grid: HTMLTableElement;
let gridElements: HTMLTableCellElement[][];
let resizeTimeout: number;
let sudoku: Sudoku;
let elementCache: Map<string, HTMLElement>;
let solverWorker: Worker;
let solutions: number[][][];
let currentSolution: number;

function getElement(query: string): HTMLElement {
    if (elementCache.has(query))
        return elementCache.get(query);

    let elem = document.getElementById(query);
    elementCache.set(query, elem);
    return elem;
}

function cleanUp() {
    sudoku = new Sudoku();
    solutions = void 0;
    if (solverWorker)
        solverWorker.terminate();
    solverWorker = void 0;
    getElement('span-solution-text').innerHTML = '';
    getElement('button-previous-solution').style.display = 'none';
    getElement('button-next-solution').style.display = 'none';
    getElement('button-solve').removeAttribute('disabled');
}

function documentReady(): void {
    elementCache = new Map<string, HTMLElement>();
    grid = <HTMLTableElement>getElement('grid');
    createGrid();
    sudoku = new Sudoku();

    window.onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateTable, 100);
    };

    getElement('button-new-sudoku').onclick = (mouseEvent: MouseEvent) => {
        
        cleanUp();

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                (<HTMLElement>grid.childNodes[i].childNodes[j]).innerHTML = '';
            }
        }
    };

    let modalCloseListener = (keyboardEvent: KeyboardEvent) => {
        if (keyboardEvent.key === 'Escape') {
            let elems = document.querySelectorAll('.modal');
            for (let elem of elems) {
                (<HTMLElement>elem).style.display = 'none';
            }
            document.removeEventListener('keydown', modalCloseListener);
            keyboardEvent.preventDefault();
        }
    };

    let closeSpans = document.querySelectorAll('.modal-content .close');
    for (let i = 0; i < closeSpans.length; i++) {
        let elem = <HTMLElement>closeSpans[i];
        elem.onclick = (e) => {
            elem.parentElement.parentElement.style.display = 'none';
            document.removeEventListener('keydown', modalCloseListener);
        };
    }

    getElement('button-import').onclick = (mouseEvent: MouseEvent) => {
        getElement('modal-import').style.display = 'block';
        document.addEventListener('keydown', modalCloseListener);
        let errorElement = getElement('modal-import-error');
        errorElement.parentElement.style.display = 'none';

        getElement('button-import-ok').onclick = (mouseEvent: MouseEvent) => {
            cleanUp();
            try {
                sudoku.parseSudoku((<HTMLTextAreaElement>getElement('modal-import-textarea')).value);
                document.removeEventListener('keydown', modalCloseListener);
                getElement('modal-import').style.display = 'none';
            } catch (error) {
                if (error instanceof Error) {
                    let message = (<Error>error).message;
                    
                    errorElement.innerHTML = message;
                    errorElement.parentElement.style.display = '';
                }
                sudoku.clear();
            } finally {
                renderSudoku();
            }
        };
    };

    getElement('button-export').onclick = (mouseEvent: MouseEvent) => {
        getElement('modal-export').style.display = 'block';
        document.addEventListener('keydown', modalCloseListener);
        (<HTMLTextAreaElement>getElement('modal-export-textarea')).value = sudoku.toString();
    };

    let buttonSolve = getElement('button-solve');
    buttonSolve.onclick = (mouseEvent: MouseEvent) => {
        if (solutions)
            return;

        buttonSolve.setAttribute('disabled', '');

        solverWorker = new Worker('js/worker.js');
        solverWorker.onmessage = function(event: MessageEvent) {
            console.log(event.data);
            switch (event.data.type) {
                case 'candidate':
                    let grid: number[][] = event.data.grid;
                    for (let row = 0; row < 9; row++)
                        for (let col = 0; col < 9; col++) {
                            if (sudoku.Fixed[row][col])
                                continue;
                            
                            gridElements[row][col].innerHTML = '' + grid[row][col];
                        }
                    break;

                case 'solutions':
                    solutions = event.data.solutions;
                    currentSolution = 0;
                    if (solutions.length > 1) {
                        getElement('button-previous-solution').style.display = 'inherit';
                        getElement('button-next-solution').style.display = 'inherit';
                    }

                    renderSolution();

                    buttonSolve.removeAttribute('disabled');
                    break;                
            }
        };

        solverWorker.postMessage({
            sudokuString: sudoku.toString()
        });
    };

    getElement('button-previous-solution').onclick = (mouseEvent: MouseEvent) => {
        currentSolution--;
        if (currentSolution < 0)
            currentSolution = solutions.length - 1;
        renderSolution();
    };

    getElement('button-next-solution').onclick = (mouseEvent: MouseEvent) => {
        currentSolution = (currentSolution + 1) % solutions.length;
        renderSolution();
    };
}

function toID(row: number, col: number): string {
    return `cell-${row}-${col}`;
}

function createGrid(): void {
    grid.innerHTML = '';
    gridElements = [];

    for (let row = 0; row < 9; row++) {
        let tr = document.createElement('tr');
        gridElements[row] = [];

        for (let col = 0; col < 9; col++) {
            let td = document.createElement('td');
            td.setAttribute('id', toID(row, col));
            td.tabIndex = row * 9 + col;
            td.onkeydown = (event: KeyboardEvent) => {

                switch (event.key) {
                    case 'Backspace':
                    case ' ':
                        sudoku.resetNumber(row, col);
                        td.innerHTML = '';
                        return;

                    case 'ArrowUp':
                        let newRow = row - 1;
                        if (newRow < 0)
                            newRow = 8;
                        gridElements[newRow][col].focus();
                        return;

                    case 'ArrowDown':
                        gridElements[(row + 1) % 9][col].focus();
                        return;

                    case 'ArrowLeft':
                        let newCol = col - 1;
                        if (newCol < 0)
                            newCol = 8;
                        gridElements[row][newCol].focus();
                        return;

                    case 'ArrowRight':
                        gridElements[row][(col + 1) % 9].focus();
                        return;
                }

                let key = parseInt(event.key);
                if (!isNaN(key) && key !== 0) {

                    let [success, conflictRow, conflictCol] = sudoku.setNumber(row, col, key);
                    if (success) {
                        td.innerHTML = `<span style="font-weight: 900">${key}</span>`;
                    } else {
                        // mark conflicting cell
                        let conflictCell = getElement(toID(conflictRow, conflictCol));
                        conflictCell.style.backgroundColor = 'red';

                        // reset the style after 3 seconds
                        setTimeout(() => conflictCell.style.backgroundColor = '', 3000);
                    }
                }
            };
            td.onfocus = () => td.style.backgroundColor = '#b3b3b3';
            td.onblur = () => td.style.backgroundColor = '';

            if (col % 3 === 0) {
                td.classList.add('border-left');
            } else if (col === 8) {
                td.classList.add('border-right');
            }

            if (row % 3 === 0) {
                td.classList.add('border-top');
            } else if (row === 8) {
                td.classList.add('border-bottom');
            }

            gridElements[row][col] = td;
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }

    updateTable();
}

function updateTable(): void {
    let em = 0.8;
    while (gridElements[0][0].offsetHeight !== gridElements[0][0].offsetWidth) {
        let cellWidth = gridElements[0][0].offsetWidth;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                gridElements[i][j].style.height = cellWidth + 'px';
                gridElements[i][j].style.fontSize = em + 'em';
            }
        }

        em -= 0.1;
    }
}

function renderSudoku(): void {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let gridValue = sudoku.Grid[row][col];
            if (gridValue !== 0) {
                gridElements[row][col].innerHTML = `<span style="font-weight: 900;">${gridValue}</span>`;
            } else {
                gridElements[row][col].innerHTML = '';
            }
        }
    }
}

function renderSolution(): void {

    getElement('span-solution-text').innerHTML = `Solution ${currentSolution + 1}/${solutions.length}`;

    let grid = solutions[currentSolution];

    for (let row = 0; row < 9; row++)
        for (let col = 0; col < 9; col++) {
            if (sudoku.Fixed[row][col])
                continue;

            gridElements[row][col].innerHTML = '' + grid[row][col];
        }
}