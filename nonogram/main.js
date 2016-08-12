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

'use strict';

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
        [0]
    ],
    columns: [
        [1],
        [1]
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
}

let puzzle1 = new Puzzle(config1);
let puzzle2 = new Puzzle(config2);
let simple1 = new Puzzle(simple);
let big = new Puzzle(bigger);