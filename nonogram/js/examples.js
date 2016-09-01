'use strict';

let examples = {
    'simple_multiple': {
        width: 2,
        height: 2,
        rows: [
            [1], [1]
        ],
        columns: [
            [1], [1]
        ]
    },
    'smile': {
        width: 5,
        height: 5,
        rows: [
            [2, 2], [2, 2], [0], [1, 1], [3]
        ],
        columns: [
            [2, 1], [2, 1], [1], [2, 1], [2, 1]
        ]
    },
    'hourglass': {
        width: 5,
        height: 5,
        rows: [
            [5], [3], [1], [1, 1], [5]
        ],
        columns: [
            [1, 1], [2, 2], [3, 1], [2, 2], [1, 1]
        ]
    },
    'face': {
        width: 10,
        height: 10,
        rows: [
            [5], [8], [2, 6], [1, 2, 1], [1, 1, 1], [2, 2, 1], [7, 1], [10], [9], [7]
        ],
        columns: [
            [7], [2, 5], [1, 4], [2, 1, 4], [3, 5], [10], [4, 4], [3, 1, 3], [2, 2], [2, 2] 
        ]
    },
    'dolphin': {
        width: 15,
        height: 15,
        rows: [
            [2], [2], [9], [10, 1], [12, 1], [15], [7, 2, 4], [3, 2, 2], [2, 1], [1], [2, 2], [1, 2, 1, 1, 1], [2, 2, 1, 2], [1, 2, 2, 3], [3, 3, 3, 3]
        ],
        columns: [
            [6, 1], [5, 2, 1], [5, 2], [4, 1], [5, 1, 1], [5, 2], [1, 5, 3], [6, 1, 2], [7, 1, 2], [5, 3], [4, 1, 1], [5, 2], [1, 4, 4], [1, 4, 1, 2], [3, 2, 1]
        ]
    },
    'chicken': {
        width: 15,
        height: 15,
        rows: [
            [15], [10, 2], [1, 7, 1], [1, 1, 1], [1], [1, 3, 1], [1, 5, 2], [2, 6, 3], [3, 5, 3], [4, 3], [6, 1, 3, 2], [6, 1, 5], [5, 4], [15], [15]
        ],
        columns: [
            [15], [2, 8], [3, 7], [3, 6], [3, 2, 5], [3, 3, 2, 2], [3, 3, 2], [3, 4, 2, 2], [3, 4, 2], [2, 3, 2, 2], [1, 2, 2], [1, 6], [1, 1, 3, 4], [2, 9], [4, 4, 1, 3] 
        ]
    },
    'cocktail': {
        width: 10,
        height: 10,
        rows: [
            [1], [1], [10], [2, 1, 2], [2, 1, 2], [6], [2], [2], [2], [4]
        ],
        columns: [
            [2], [3], [1, 2], [1, 1, 1], [1, 5], [1, 6], [2, 1, 1], [2, 2], [1, 3], [2]
        ]
    },
    'fish': {
        width: 20,
        height: 20,
        rows: [
            [1, 6], [1, 8], [1, 10], [3, 3], [3, 1, 1, 1, 3],
            [15], [8, 5], [7], [1, 9], [12],
            [6, 4], [8, 3], [2, 7, 3], [2, 1, 6, 3], [4, 6, 2],
            [3, 6], [9], [7], [3], [4]
        ],
        columns: [
            [1, 1], [1, 2, 1], [3, 2], [1, 1, 1, 6], [3, 4],
            [3, 2], [3, 1, 2, 2], [1, 2, 1, 2, 3], [2, 3, 3, 4], [4, 2, 9],
            [7, 9], [4, 2, 9], [3, 1, 9], [3, 2, 8], [4, 5, 3],
            [10, 1], [10], [10], [9], [3]
        ]
    },
    'lion': {
        width: 25,
        height: 25,
        rows: [
            [0], [5], [9], [13], [14],
            [16], [2, 7, 2, 1], [2, 9, 3, 1], [3, 3, 5, 3], [4, 1, 1, 1, 4, 5],
            [4, 1, 5, 6], [2, 3, 4, 6], [3, 1, 4, 5], [4, 3, 4, 2], [5, 7, 3],
            [16, 3], [17, 1], [1, 2, 12, 1], [3, 13, 2], [4, 16],
            [4, 15], [4, 5, 8], [4, 6, 10], [4, 4, 9], [0]
        ],
        columns: [
            [3, 2, 2, 2], [13, 3], [3, 8, 5], [4, 4, 4, 6], [6, 8],
            [7, 1, 3, 3, 2], [8, 1, 1, 3, 3], [13, 3, 5], [8, 1, 1, 2, 6], [7, 1, 9],
            [6, 9], [4, 4, 8, 1], [3, 13, 2], [18, 2], [20],
            [1, 2, 3, 10], [9], [8], [2, 8], [4, 8],
            [6, 6], [4, 2, 4], [5, 2, 2], [4, 4], [5]
        ]
    },
    'heraldic_animal': {
        width: 30,
        height: 40,
        rows: [
            [5, 6], [2, 2, 2, 2], [1, 1, 2, 2], [1, 2, 1, 1], [1, 1, 1, 1], [1, 2, 2, 1], [2, 5, 7, 5, 1], [3, 14, 3], [29], [27], [24], [21], [3, 15, 3], [7, 13, 6], [3, 1, 4, 4, 1, 2], [2, 6, 3, 3, 6, 1], [10, 2, 2, 9], [5, 2, 2, 2, 2, 4], [2, 1, 1, 1, 1, 2], [5, 1, 1, 5], [5, 1, 1, 5], [7, 6], [5, 5], [4, 4], [4, 4], [3, 3], [2, 3], [1, 1], [11], [3, 3], [1, 1], [1, 2, 2, 1], [2, 2, 2, 2], [2, 2], [2, 3, 2], [1, 9, 1], [2, 5, 2], [4, 4], [7, 7], [10, 10]
        ],
        columns: [
            [6, 4, 5], [2, 3, 5, 4], [1, 3, 3, 2, 3], [4, 3, 2, 3, 3], [2, 2, 3, 2, 3, 2], [1, 1, 4, 1, 3, 2], [2, 4, 1, 2, 2], [1, 4, 8, 1], [1, 5, 8, 1], [8, 1, 7, 5, 1], [9, 12, 3], [9, 8, 2, 2], [12, 4, 1, 2, 1], [16, 1, 2, 2], [8, 1, 3], [8, 1, 3], [8, 1, 3], [16, 1, 2, 2], [12, 4, 1, 2, 1], [9, 8, 2, 2], [9, 12, 3, 1], [8, 1, 8, 5, 1], [1, 7, 8, 1], [2, 1, 4, 7, 2], [3, 2, 4, 1, 2, 2], [1, 4, 4, 1, 3, 2], [1, 3, 2, 3, 3], [2, 4, 2, 3, 3], [2, 3, 3, 2, 4], [7, 4, 5]
        ]
    }
};