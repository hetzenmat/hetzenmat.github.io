'use strict';

let Board = {};

Board.GameType = {
    AgainstPlayer:   1,
    AgainstComputer: 2
};

Board.new = (rows, columns, N, gameType, currentPlayer) => {
    let board = {};
    board.rows = rows;
    board.columns = columns;
    board.N = N;
    board.currentPlayer = currentPlayer;
    board.gameType = gameType;
    board.currentPlayer = currentPlayer;

    board.column = new Array(2);
    board.column[0] = new Array(columns);
    board.column[1] = new Array(columns);
    
    for (let j = 0; j < columns; j++) {
        board.column[0][j] = 0;
        board.column[1][j] = 0;
    }
    

    return board;
};

Board.getNextPlayer = (board) => {
    return (board.currentPlayer + 1) % 2;
};

Board.isSet = (board, row, column) => {
    return !!((board.column[0][column] & (1 << row))
           || (board.column[1][column] & (1 << row))); 
};

Board.isSetPlayer = (board, player, row, column) => {
    return !!(board.column[player][column] & (1 << row));
};

/**
 * returns the row of the move
 */
Board.move = (board, player, column) => {
    for (let i = 0; i < board.rows; i++) {
        if (!Board.isSet(board, i, column)) {
            board.column[player][column] |= (1 << i);
            return i;
        }
    }

    throw new Error('No valid move at column ' + column + ' for player ' + player + '.');
};

/**
 * reverts the last move of the given column
 */
Board.undoMove = (board, column) => {
    for (let i = board.rows - 1; i >= 0; i--) {
        if (Board.isSet(board, i, column)) {
            board.column[0][column] &= ~(1 << i);
            board.column[1][column] &= ~(1 << i);
            return;
        }
    }
};

Board.toString = (board) => {
    let str = '';
    for (let row = board.rows - 1; row >= 0; row--) {
        for (let column = 0; column < board.columns; column++) {
            if (board.column[0][column] & (1 << row)) {
                str += '0';
            }
            else if (board.column[1][column] & (1 << row)) {
                str += '1';
            } else {
                str += '.';
            }
        }
        str += '\n';
    }

    return str;
};

Board.isValidMove = (board, column) => {
    return !Board.isSet(board, board.rows - 1, column);
};

Board.legalMoves = (board) => {
    
    let moves = [];
    for (let i = 0; i < board.columns; i++) {
        if (!Board.isSet(board, board.rows - 1, i)) {
            moves.push(i);
        }
    }

    return moves;
};

Board.deepCopy = (board) => {
    let newBoard = {};
    ['rows', 'columns', 'N', 'currentPlayer', 'gameType', 'rows'].forEach(v => newBoard[v] = board[v]);
    
    newBoard.column = new Array(2);
    newBoard.column[0] = new Array(newBoard.columns);
    newBoard.column[1] = new Array(newBoard.columns);
    
    for (let j = 0; j < newBoard.columns; j++) {
        newBoard.column[0][j] = board.column[0][j];
        newBoard.column[1][j] = board.column[1][j];
    }
    
    return newBoard;
};

Board.won = (board, player) => {

    let pattern = (1 << board.N) - 1;

    for (let column = 0; column < board.columns; column++) {
        for (let shift = 0; shift < board.rows - board.N; shift++) {
            if ((board.column[player][column] & (pattern << shift)) === (pattern << shift)) {
                return true;
            }
        }
    }

    for (let column = 0; column <= board.columns - board.N; column++) {
        for (let row = 0; row < board.rows; row++) {
            let consecutive = true;
            for (let i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row, column + i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive)
                return true;
        }
    }

    for (let column = 0; column < board.columns - board.N; column++) {
        for (let row = 0; row < board.rows - board.N; row++) {
            let consecutive = true;
            for (let i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row + i, column + i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive)
                return true;
        }
    }

    for (let column = board.columns - 1; column >= board.N - 1; column--) {
        for (let row = 0; row <= board.rows - board.N; row++) {
            let consecutive = true;
            for (let i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row + i, column - i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive)
                return true;
        }
    }

    return false;
};

Board.getWinningMoves = (board, player) => {
    let pattern = (1 << board.N) - 1;
    let moves = [];

    for (let column = 0; column < board.columns; column++) {
        for (let shift = 0; shift < board.rows - board.N; shift++) {
            if ((board.column[player][column] & (pattern << shift)) === (pattern << shift)) {
                for (let i = 0; i < board.N; i++) {
                    moves.push({
                        row: shift + i,
                        column: column
                    });
                }
                return moves;
            }
        }
    }

    for (let column = 0; column <= board.columns - board.N; column++) {
        for (let row = 0; row < board.rows; row++) {
            let consecutive = true;
            for (let i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row, column + i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive) {
                for (let i = 0; i < board.N; i++) {
                    moves.push({
                        row: row,
                        column: column + i
                    });
                }
                return moves;
            }
        }
    }

    for (let column = 0; column < board.columns - board.N; column++) {
        for (let row = 0; row < board.rows - board.N; row++) {
            let consecutive = true;
            for (let i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row + i, column + i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive) {
                for (let i = 0; i < board.N; i++) {
                    moves.push({
                        row:    row + i,
                        column: column + i
                    });
                }
                return moves;
            }
        }
    }

    for (let column = board.columns - 1; column >= board.N - 1; column--) {
        for (let row = 0; row < board.rows - board.N; row++) {
            let consecutive = true;
            for (let i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row + i, column - i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive) {
                for (let i = 0; i < board.N; i++) {
                    moves.push({
                        row: row + i,
                        column: column - i
                    });
                }
                return moves;
            }
        }
    }

    return [];
};

Board.isGameOver = (board) => {
    if (Board.legalMoves(board).length === 0)
        return true;
    if (Board.won(board, 0) || Board.won(board, 1))
        return true;
    return false;
};