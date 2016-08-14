'use strict';

if (document.readyState !== 'loading')
    document_ready();
else
    document.addEventListener('DOMContentLoaded', document_ready);

let UI = {
    hover_background_color: '#b3b3b3'
};

let grid, cells, button_create, input_width, input_height, column_elements, row_elements;
let resize_timeout;

function get_column_index(column_class) {
    let column_index = +column_class.split('-')[1];

    return column_index;
}

function get_coords(id) {
    let coords = id.split('-');
    return {
        row: +coords[0],
        column: + coords[1]
    };
}

function mouseenter_cell(cell) {
    let coords = get_coords(cell.id);

    for (let i = 0; i < column_elements[coords.column].length; i++) {
        column_elements[coords.column][i].style.background = UI.hover_background_color;
    }

    for (let i = 0; i < row_elements[coords.row].length; i++) {
        row_elements[coords.row][i].style.background = UI.hover_background_color;
    }
}

function mouseleave_cell(cell) {
    let coords = get_coords(cell.id);

    for (let i = 0; i < column_elements[coords.column].length; i++) {
        column_elements[coords.column][i].style.background = 'white';
    }

    for (let i = 0; i < row_elements[coords.row].length; i++) {
        row_elements[coords.row][i].style.background = 'white';
    }
}

function onclick_row_constraint(cell) {
    // TODO
}

function onclick_column_constraint(cell) {
    // TODO
}

function update_table() {
    let cell_width = cells[0].offsetWidth;
    cells.forEach(cell => cell.style.height = cell_width + 'px');
}

function create_nonogram() {
    let width = +input_width.value;
    let height = +input_height.value;

    let html = '<tr>\n<td></td>\n';

    for (let i = 0; i < width; i++) {
        html += '<td class="constraint-column-' + i + '" onclick="onclick_column_constraint(this)"></td>\n';
    }

    html += '</tr>\n';
    for (let i = 0; i < height; i++) {
        html += '<tr>\n<td class="constraint-row-' + i + '" onclick="onclick_row_constraint(this)"></td>\n';
        for (let j = 0; j < width; j++) {
            html += '<td id="' + i + '-' + j + '" class="row-' + i + ' column-' + j + '" onmouseenter="mouseenter_cell(this)" onmouseleave="mouseleave_cell(this)"></td>\n';
        }
        html += '</tr>\n';
    }

    grid.innerHTML = html;
    cells = document.querySelectorAll('#grid td');

    column_elements = new Array(width);
    for (let i = 0; i < width; i++) {
        column_elements[i] = document.getElementsByClassName('column-' + i);
    }
    row_elements = new Array(height);
    for (let i = 0; i < height; i++) {
        row_elements[i] = document.getElementsByClassName('row-' + i);
    }

    update_table();
}

function document_ready() {
    grid = document.getElementById('grid');
    cells = document.querySelectorAll('#grid td');

    button_create = document.getElementById('button-create');
    button_create.onclick = create_nonogram;

    input_width = document.getElementById('input-width');
    input_height = document.getElementById('input-height');

    update_table();

    window.onresize = function() {
        clearTimeout(resize_timeout);
        resize_timeout = setTimeout(update_table, 100);
    };

    create_nonogram();
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

// TODO column 0

let config1 = {
    width: 10,
    height: 10,
    rows: [
        [5],
        [8],
        [2, 6],
        [1, 2, 1],
        [1, 1, 1],
        [2, 2, 1],
        [7, 1],
        [10],
        [9],
        [7]
    ],
    columns: [
        [7],
        [2, 5],
        [1, 4],
        [2, 1, 4],
        [3, 5],
        [10],
        [4, 4],
        [3, 1, 3],
        [2, 2],
        [2, 2]
    ]
};

let config2 = {
    width: 10,
    height: 10,
    rows: [
        [1],
        [1],
        [10],
        [2, 1, 2],
        [2, 1, 2],
        [6],
        [2],
        [2],
        [2],
        [4]
    ],
    columns: [
        [2],
        [3],
        [1, 2],
        [1, 1, 1],
        [1, 5],
        [1, 6],
        [2, 1, 1],
        [2, 2],
        [1, 3],
        [2]
    ]
};

let simple = {
    width: 2,
    height: 2,
    rows: [
        [2],
        [1]
    ],
    columns: [
        [1],
        [2]
    ]
    
};

let bigger = {
    width: 15,
    height: 15,
    rows: [
        [15],
        [10, 2],
        [1, 7, 1],
        [1, 1, 1],
        [1],
        [1, 3, 1],
        [1, 5, 2],
        [2, 6, 3],
        [3, 5, 3],
        [4, 3],
        [6, 1, 3, 2],
        [6, 1, 5],
        [5, 4],
        [15],
        [15]
    ],
    columns: [
        [15],
        [2, 8],
        [3, 7],
        [3, 6],
        [3, 2, 5],
        [3, 3, 2, 2],
        [3, 3, 2],
        [3, 4, 2, 2],
        [3, 4, 2],
        [2, 3, 2, 2],
        [1, 2, 2],
        [1, 6],
        [1, 1, 3, 4],
        [2, 9],
        [4, 4, 1, 3]
    ]
};

let wappentier = {
    width: 30,
    height: 40,
    rows: [
        [5, 6],
        [2, 2, 2, 2],
        [1, 1, 2, 2],
        [1, 2, 1, 1],
        [1, 1, 1, 1],
        [1, 2, 2, 1],
        [2, 5, 7, 5, 1],
        [3, 14, 3],
        [29],
        [27],
        [24],
        [21],
        [3, 15, 3],
        [7, 13, 6],
        [3, 1, 4, 4, 1, 2],
        [2, 6, 3, 3, 6, 1],
        [10, 2, 2, 9],
        [5, 2, 2, 2, 2, 4],
        [2, 1, 1, 1, 1, 2],
        [5, 1, 1, 5],
        [5, 1, 1, 5],
        [7, 6],
        [5, 5],
        [4, 4],
        [4, 4],
        [3, 3],
        [2, 3],
        [1, 1],
        [11],
        [3, 3],
        [1, 1],
        [1, 2, 2, 1],
        [2, 2, 2, 2],
        [2, 2],
        [2, 3, 2],
        [1, 9, 1],
        [2, 5, 2],
        [4, 4],
        [7, 7],
        [10, 10]
    ],
    columns: [
        [6, 4, 5],
        [2, 3, 5, 4],
        [1, 3, 3, 2, 3],
        [4, 3, 2, 3, 3],
        [2, 2, 3, 2, 3, 2],
        [1, 1, 4, 1, 3, 2],
        [2, 4, 1, 2, 2],
        [1, 4, 8, 1],
        [1, 5, 8, 1],
        [8, 1, 7, 5, 1],
        [9, 12, 3],
        [9, 8, 2, 2],
        [12, 4, 1, 2, 1],
        [16, 1, 2, 2],
        [8, 1, 3],
        [8, 1, 3],
        [8, 1, 3],
        [16, 1, 2, 2],
        [12, 4, 1, 2, 1],
        [9, 8, 2, 2],
        [9, 12, 3, 1],
        [8, 1, 8, 5, 1],
        [1, 7, 8, 1],
        [2, 1, 4, 7, 2],
        [3, 2, 4, 1, 2, 2],
        [1, 4, 4, 1, 3, 2],
        [1, 3, 2, 3, 3],
        [2, 4, 2, 3, 3],
        [2, 3, 3, 2, 4],
        [7, 4, 5]
    ]
};

let puzzle1 = new Puzzle(config1);
let puzzle2 = new Puzzle(config2);
let simple1 = new Puzzle(simple);
let big = new Puzzle(bigger);
let wappen = new Puzzle(wappentier);