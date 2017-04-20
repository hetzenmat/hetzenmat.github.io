if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);

let grid: HTMLTableElement;
let gridElements: HTMLTableCellElement[][];
let resizeTimeout: number;

function documentReady(): void {
    grid = <HTMLTableElement>document.getElementById('grid');
    createGrid();

    window.onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateTable, 100);
    };
}

function toID(row: number, col: number): string {
    return `${row}|${col}`;
}

function createGrid(): void {
    grid.innerHTML = '';
    gridElements = [];

    for (let row = 0; row < 9; row++) {
        let tr = document.createElement('tr');
        gridElements[row] = [];

        for (let col = 0; col < 9; col++) {
            let td = document.createElement('td');
            td.tabIndex = row * 9 + col;
            td.onkeydown = (event: KeyboardEvent) => {

                if (event.key === 'Backspace') {
                    td.innerHTML = '';
                    return;
                }

                let key = parseInt(event.key);
                if (!isNaN(key)) {
                    td.innerHTML = key.toString();
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

            td.setAttribute('id', toID(row, col));
            gridElements[row][col] = td;
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }

    updateTable();
}

function updateTable(): void {
    let em = 1;
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