/// <reference path="../Sudoku.ts"/>

let sudoku: Sudoku;

function reportCandidate(number: number, row: number, col: number): void {
    postMessage({
        type: 'candidate',
        number,
        row,
        col
    });
}

onmessage = function (event: MessageEvent) {
    sudoku = new Sudoku(event.data.sudokuString);
    postMessage(event.data.sudokuString);
    let solutions: number[][][];
    if (event.data.viewProgress) {
        solutions = sudoku.solve(reportCandidate);
    } else {
        solutions = sudoku.solve();
    }

    postMessage({
        type: 'solutions',
        solutions,
        fixed: sudoku.Fixed
    })
};