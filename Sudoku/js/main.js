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
    return "cell-" + row + "-" + col;
}
function createGrid() {
    grid.innerHTML = '';
    gridElements = [];
    var _loop_1 = function (row) {
        var tr = document.createElement('tr');
        gridElements[row] = [];
        var _loop_2 = function (col) {
            var td = document.createElement('td');
            td.setAttribute('id', "cell-" + row + "-" + col);
            td.tabIndex = row * 9 + col;
            td.onkeydown = function (event) {
                console.log(row + " " + col + " click");
                console.log(event);
                switch (event.key) {
                    case 'Backspace':
                        td.innerHTML = '';
                        return;
                    case 'ArrowUp':
                        var newRow = row - 1;
                        if (newRow < 0)
                            newRow = 8;
                        document.getElementById(toID(newRow, col)).focus();
                        return;
                    case 'ArrowDown':
                        document.getElementById(toID((row + 1) % 9, col)).focus();
                        return;
                    case 'ArrowLeft':
                        var newCol = col - 1;
                        if (newCol < 0)
                            newCol = 8;
                        document.getElementById(toID(row, newCol)).focus();
                        return;
                    case 'ArrowRight':
                        document.getElementById(toID(row, (col + 1) % 9)).focus();
                        return;
                }
                var key = parseInt(event.key);
                if (!isNaN(key) && key !== 0) {
                    td.innerHTML = '<b>' + key.toString() + '</b>';
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
            _loop_2(col);
        }
        grid.appendChild(tr);
    };
    for (var row = 0; row < 9; row++) {
        _loop_1(row);
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
