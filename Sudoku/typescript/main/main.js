/// <reference path="../Sudoku.ts"/>
if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);
var grid;
var gridElements;
var resizeTimeout;
var sudoku;
var elementCache;
function getElement(query) {
    if (elementCache.has(query))
        return elementCache.get(query);
    var elem = document.getElementById(query);
    elementCache.set(query, elem);
    return elem;
}
function documentReady() {
    elementCache = new Map();
    grid = getElement('grid');
    createGrid();
    sudoku = new Sudoku();
    window.onresize = function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateTable, 100);
    };
    getElement('button-new-sudoku').onclick = function (mouseEvent) {
        sudoku = new Sudoku();
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                grid.childNodes[i].childNodes[j].innerHTML = '';
            }
        }
    };
    var modalCloseListener = function (keyboardEvent) {
        if (keyboardEvent.key === 'Escape') {
            var elems = document.querySelectorAll('.modal');
            for (var _i = 0, elems_1 = elems; _i < elems_1.length; _i++) {
                var elem = elems_1[_i];
                elem.style.display = 'none';
            }
            document.removeEventListener('keydown', modalCloseListener);
            keyboardEvent.preventDefault();
        }
    };
    var closeSpans = document.querySelectorAll('.modal-content .close');
    var _loop_1 = function (i) {
        var elem = closeSpans[i];
        elem.onclick = function (e) {
            elem.parentElement.parentElement.style.display = 'none';
            document.removeEventListener('keydown', modalCloseListener);
        };
    };
    for (var i = 0; i < closeSpans.length; i++) {
        _loop_1(i);
    }
    getElement('button-import').onclick = function (mouseEvent) {
        getElement('modal-import').style.display = 'block';
        document.addEventListener('keydown', modalCloseListener);
        var errorElement = getElement('modal-import-error');
        errorElement.parentElement.style.display = 'none';
        getElement('button-import-ok').onclick = function (mouseEvent) {
            try {
                sudoku.parseSudoku(getElement('modal-import-textarea').value);
                document.removeEventListener('keydown', modalCloseListener);
                getElement('modal-import').style.display = 'none';
            }
            catch (error) {
                if (error instanceof Error) {
                    var message = error.message;
                    errorElement.innerHTML = message;
                    errorElement.parentElement.style.display = '';
                }
                sudoku.clear();
            }
            finally {
                renderSudoku();
            }
        };
    };
    getElement('button-export').onclick = function (mouseEvent) {
        getElement('modal-export').style.display = 'block';
        document.addEventListener('keydown', modalCloseListener);
        getElement('modal-export-textarea').value = sudoku.toString();
    };
    var buttonSolve = getElement('button-solve');
    buttonSolve.onclick = function (mouseEvent) {
        console.log('click');
        var worker = new Worker('js/worker.js');
        worker.onmessage = function (event) {
            console.log(event.data);
            switch (event.data.type) {
                case 'candidate':
                    gridElements[event.data.row][event.data.col].innerHTML = '' + event.data.number;
                    break;
                case 'solutions':
                    break;
            }
        };
        worker.postMessage({ sudokuString: sudoku.toString() });
    };
}
function toID(row, col) {
    return "cell-" + row + "-" + col;
}
function createGrid() {
    grid.innerHTML = '';
    gridElements = [];
    var _loop_2 = function (row) {
        var tr = document.createElement('tr');
        gridElements[row] = [];
        var _loop_3 = function (col) {
            var td = document.createElement('td');
            td.setAttribute('id', toID(row, col));
            td.tabIndex = row * 9 + col;
            td.onkeydown = function (event) {
                switch (event.key) {
                    case 'Backspace':
                    case ' ':
                        sudoku.resetNumber(row, col);
                        td.innerHTML = '';
                        return;
                    case 'ArrowUp':
                        var newRow = row - 1;
                        if (newRow < 0)
                            newRow = 8;
                        gridElements[newRow][col].focus();
                        return;
                    case 'ArrowDown':
                        gridElements[(row + 1) % 9][col].focus();
                        return;
                    case 'ArrowLeft':
                        var newCol = col - 1;
                        if (newCol < 0)
                            newCol = 8;
                        gridElements[row][newCol].focus();
                        return;
                    case 'ArrowRight':
                        gridElements[row][(col + 1) % 9].focus();
                        return;
                }
                var key = parseInt(event.key);
                if (!isNaN(key) && key !== 0) {
                    var _a = sudoku.setNumber(row, col, key), success = _a[0], conflictRow = _a[1], conflictCol = _a[2];
                    if (success) {
                        td.innerHTML = "<b>" + key + "</b>";
                    }
                    else {
                        // mark conflicting cell
                        var conflictCell_1 = getElement(toID(conflictRow, conflictCol));
                        conflictCell_1.style.backgroundColor = 'red';
                        // reset the style after 3 seconds
                        setTimeout(function () { return conflictCell_1.style.backgroundColor = ''; }, 3000);
                    }
                }
            };
            td.onfocus = function () { return td.style.backgroundColor = '#b3b3b3'; };
            td.onblur = function () { return td.style.backgroundColor = ''; };
            if (col % 3 === 0) {
                td.classList.add('border-left');
            }
            else if (col === 8) {
                td.classList.add('border-right');
            }
            if (row % 3 === 0) {
                td.classList.add('border-top');
            }
            else if (row === 8) {
                td.classList.add('border-bottom');
            }
            gridElements[row][col] = td;
            tr.appendChild(td);
        };
        for (var col = 0; col < 9; col++) {
            _loop_3(col);
        }
        grid.appendChild(tr);
    };
    for (var row = 0; row < 9; row++) {
        _loop_2(row);
    }
    updateTable();
}
function updateTable() {
    var em = 0.8;
    while (gridElements[0][0].offsetHeight !== gridElements[0][0].offsetWidth) {
        var cellWidth = gridElements[0][0].offsetWidth;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                gridElements[i][j].style.height = cellWidth + 'px';
                gridElements[i][j].style.fontSize = em + 'em';
            }
        }
        em -= 0.1;
    }
}
function renderSudoku() {
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            var gridValue = sudoku.Grid[row][col];
            if (gridValue !== 0) {
                gridElements[row][col].innerHTML = "<b>" + gridValue + "</b>";
            }
            else {
                gridElements[row][col].innerHTML = '';
            }
        }
    }
}
