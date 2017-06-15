#!/bin/bash

echo "Building Project Sudoku"

tsc --project ./Sudoku/typescript/main/
tsc --project ./Sudoku/typescript/worker/

echo "Finished"