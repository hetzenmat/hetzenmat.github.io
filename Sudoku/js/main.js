if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);
var grid;
var gridElements;
var resizeTimeout;
function documentReady() {
    grid = document.getElementById('grid');
    createGrid();
    window.onresize = function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateTable, 100);
    };
}
function toID(row, col) {
    return row + "|" + col;
}
function createGrid() {
    grid.innerHTML = '';
    gridElements = [];
    for (var row = 0; row < 9; row++) {
        var tr = document.createElement('tr');
        gridElements[row] = [];
        var _loop_1 = function (col) {
            var td = document.createElement('td');
            td.tabIndex = row * 9 + col;
            td.onkeydown = function (event) {
                if (event.key === 'Backspace') {
                    td.innerHTML = '';
                    return;
                }
                var key = parseInt(event.key);
                if (!isNaN(key)) {
                    td.innerHTML = key.toString();
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
            td.setAttribute('id', toID(row, col));
            gridElements[row][col] = td;
            tr.appendChild(td);
        };
        for (var col = 0; col < 9; col++) {
            _loop_1(col);
        }
        grid.appendChild(tr);
    }
    updateTable();
}
function updateTable() {
    var em = 1;
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
