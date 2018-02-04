/// <reference path="../Sudoku.ts"/>

if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);

let grid: HTMLTableElement;
let gridElements: HTMLTableCellElement[][];
let resizeTimeout: number;
let sudoku: Sudoku;
/**
 * Cache used for the {@link id} function to cache the retrieved DOM elements.
 */
let elementCache: Map<string, HTMLElement>;
let solverWorker: Worker;
let solutions: number[][][];
let currentSolution: number;
let solving: boolean = false;

/**
 * Searches the DOM for an element with the given ID.
 * @param {string} query The ID to search for.
 * @returns {HTMLElement} The element if it was found or 'null'.
 */
function id(query: string): HTMLElement {
    if (elementCache.has(query)) {
        return elementCache.get(query);
    }

    let elem = document.getElementById(query);
    if (elem) {
        elementCache.set(query, elem);
    }
    return elem;
}

/**
 * Stops and resets the global solver worker.
 */
function stopWorker(): void {
    if (solverWorker)
        solverWorker.terminate();
    solverWorker = void 0;
}

/**
 * Performs a number of steps to clear the current state:
 *   - Create a new Suoku instance.
 *   - Reset the current solutions.
 *   - Reset the solve and cancel buttons.
 *   - Clear the contents of the table cells.
 */
function cleanUp(): void {
    sudoku = new Sudoku();
    solutions = void 0;
    stopWorker();
    clearSolutions();
    enableSolveButton();

    for (let row = 0; row < 9; row++)
        for (let col = 0; col < 9; col++) {
            if (sudoku.Fixed[row][col])
                continue;

            let elem = gridElements[row][col];
            elem.innerHTML = '';
            elem.classList.remove('td-fixed');
        }
}

function clearSolutions(): void {
    solutions = void 0;
    currentSolution = void 0;
    id('span-solution-text').innerHTML = '';
    id('button-previous-solution').style.display = 'none';
    id('button-next-solution').style.display = 'none';
    id('button-clear-solutions').style.display = 'none';
}

function enableSolveButton(): void {
    id('button-solve').removeAttribute('disabled');
    id('button-cancel').setAttribute('disabled', '');
    (<HTMLButtonElement>id('button-solve')).value = 'Solve';
}

function documentReady(): void {
    elementCache = new Map<string, HTMLElement>();
    grid = <HTMLTableElement>id('grid');
    createGrid();
    sudoku = new Sudoku();

    window.onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateTable, 100);
    };

    id('button-new-sudoku').onclick = (mouseEvent: MouseEvent) => {
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

    id('button-import').onclick = (mouseEvent: MouseEvent) => {
        id('modal-import').style.display = 'block';
        document.addEventListener('keydown', modalCloseListener);
        let errorElement = id('modal-import-error');
        errorElement.parentElement.style.display = 'none';

        id('button-import-ok').onclick = (mouseEvent: MouseEvent) => {
            cleanUp();
            try {
                sudoku.parseSudoku((<HTMLTextAreaElement>id('modal-import-textarea')).value);
                document.removeEventListener('keydown', modalCloseListener);
                id('modal-import').style.display = 'none';
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

    id('button-export').onclick = (mouseEvent: MouseEvent) => {
        id('modal-export').style.display = 'block';
        document.addEventListener('keydown', modalCloseListener);
        (<HTMLTextAreaElement>id('modal-export-textarea')).value = sudoku.toString();
    };

    let buttonSolve = <HTMLButtonElement>id('button-solve');
    let buttonCancel = <HTMLButtonElement>id('button-cancel');
    buttonSolve.onclick = (mouseEvent: MouseEvent) => {
        if (solutions)
            return;

        buttonSolve.setAttribute('disabled', '');
        buttonSolve.value = 'Solving...';
        buttonCancel.removeAttribute('disabled');

        solverWorker = new Worker('js/worker.js');
        solverWorker.onmessage = function(event: MessageEvent) {
            switch (event.data.type) {
                case 'solutions':
                    enableSolveButton();

                    solutions = event.data.solutions;
                    sudoku.Fixed = event.data.fixed;
                    currentSolution = 0;

                    for (let solution of solutions) {
                        console.log(Sudoku.sudokuToString(solution, false));
                    }

                    id('button-clear-solutions').style.display = 'inherit';
                    if (solutions.length > 1) {
                        id('button-previous-solution').style.display = 'inherit';
                        id('button-next-solution').style.display = 'inherit';
                    }

                    renderSolution();
                    break;                
            }
        };

        solverWorker.postMessage({
            sudokuString: sudoku.toString()
        });
    };

    buttonCancel.onclick = () => {
        stopWorker();

        enableSolveButton();
    };

    id('button-previous-solution').onclick = () => {
        currentSolution--;
        if (currentSolution < 0)
            currentSolution = solutions.length - 1;
        renderSolution();
    };

    id('button-next-solution').onclick = () => {
        currentSolution = (currentSolution + 1) % solutions.length;
        renderSolution();
    };

    id('button-clear-solutions').onclick = () => {
        clearSolutions();
        renderSudoku();
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
                        if (solutions) {
                            clearSolutions();
                            renderSudoku();
                        }

                        sudoku.resetNumber(row, col);
                        td.innerHTML = '';
                        td.classList.remove('td-fixed');
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
                        td.innerHTML = '' + key;
                        td.classList.add('td-fixed');
                    } else {
                        // mark conflicting cell
                        let conflictCell = id(toID(conflictRow, conflictCol));
                        conflictCell.style.boxShadow = '0 0 20px 10px red';

                        // reset the style after 3 seconds
                        setTimeout(() => conflictCell.style.boxShadow = '', 3000);
                    }
                }
            };
            td.onfocus = () => td.style.boxShadow = '0 0 20px 10px #b3b3b3';
            td.onblur = () => td.style.boxShadow = '';

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
                gridElements[row][col].innerHTML = '' + gridValue;
                gridElements[row][col].classList.add('td-fixed');
            } else {
                gridElements[row][col].innerHTML = '';
            }
        }
    }
}

function renderSolution(): void {

    if (solutions.length === 0) {
        id('span-solution-text').innerHTML = 'There are no solutions.';
        return;
    }

    id('span-solution-text').innerHTML = `Solution ${currentSolution + 1}/${solutions.length}`;

    let grid = solutions[currentSolution];

    for (let row = 0; row < 9; row++)
        for (let col = 0; col < 9; col++) {
            if (sudoku.Fixed[row][col])
                continue;

            gridElements[row][col].innerHTML = '' + grid[row][col];
        }
}