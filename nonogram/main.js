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

let puzzle1 = new Puzzle(config1);