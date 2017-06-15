/// <reference path="../Sudoku.ts"/>

let sudoku: Sudoku;

onmessage = function (event: MessageEvent) {
    sudoku = new Sudoku(event.data.sudokuString);
    postMessage(event.data.sudokuString);
    let solutions: number[][][];
    
    solutions = sudoku.solve();

    postMessage({
        type: 'solutions',
        solutions,
        fixed: sudoku.Fixed
    })
};