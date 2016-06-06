var Board = {};

Board.GameType = {
    AgainstPlayer:   Symbol('AgainstPlayer'),
    AgainstComputer: Symbol('AgainstComputer')
};

Board.new = (rows, columns, N, gameType, currentPlayer) => {
    var b = {};
    b.rows = rows;
    b.columns = columns;
    b.N = N;
    b.currentPlayer = currentPlayer;
    b.gameType = gameType;
    b.currentPlayer = currentPlayer;

    b.column = [];
    for (var i = 0; i < 2; i++) {
        b.column[i] = [];
        for (var j = 0; j < columns; j++) {
            b.column[i][j] = 0;
            b.column[i][j] = 0;
        }
    }

    return b;
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
Board.move = (board, column) => {
    for (var i = 0; i < board.rows; i++) {
        if (!Board.isSet(board, i, column)) {
            board.column[board.currentPlayer][column] |= (1 << i);
            return i;
        }
    }

    throw new Error('No valid move at column ' + column + ' for player ' + player + '.');
};

Board.toString = (board) => {
    var str = '';
    for (var row = board.rows - 1; row >= 0; row--) {
        for (var column = 0; column < board.columns; column++) {
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
    
    var moves = [];
    for (var i = 0; i < board.columns; i++) {
        if (!Board.isSet(board, board.rows - 1, i)) {
            moves.push(i);
        }
    }

    return moves;
};

Board.won = (board, player) => {

    var pattern = (1 << board.N) - 1;

    for (var column = 0; column < board.columns; column++) {
        for (var shift = 0; shift < board.rows - board.N; shift++) {
            if ((board.column[player][column] & (pattern << shift)) === (pattern << shift)) {
                return true;
            }
        }
    }

    for (var column = 0; column <= board.columns - board.N; column++) {
        for (var row = 0; row < board.rows; row++) {
            var consecutive = true;
            for (var i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row, column + i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive)
                return true;
        }
    }

    for (var column = 0; column < board.columns - board.N; column++) {
        for (var row = 0; row < board.rows - board.N; row++) {
            var consecutive = true;
            for (var i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row + i, column + i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive)
                return true;
        }
    }

    for (var column = board.columns - 1; column >= board.N; column--) {
        for (var row = 0; row < board.rows - board.N; row++) {
            var consecutive = true;
            for (var i = 0; i < board.N; i++) {
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
    var pattern = (1 << board.N) - 1;
    var moves = [];

    for (var column = 0; column < board.columns; column++) {
        for (var shift = 0; shift < board.rows - board.N; shift++) {
            if ((board.column[player][column] & (pattern << shift)) === (pattern << shift)) {
                for (var i = 0; i < board.N; i++) {
                    moves.push({
                        row: shift + i,
                        column: column
                    });
                }
                return moves;
            }
        }
    }

    for (var column = 0; column <= board.columns - board.N; column++) {
        for (var row = 0; row < board.rows; row++) {
            var consecutive = true;
            for (var i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row, column + i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive) {
                for (var i = 0; i < board.N; i++) {
                    moves.push({
                        row: row,
                        column: column + i
                    });
                }
                return moves;
            }
        }
    }

    for (var column = 0; column < board.columns - board.N; column++) {
        for (var row = 0; row < board.rows - board.N; row++) {
            var consecutive = true;
            for (var i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row + i, column + i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive)
                return true;
        }
    }

    for (var column = board.columns - 1; column >= board.N; column--) {
        for (var row = 0; row < board.rows - board.N; row++) {
            var consecutive = true;
            for (var i = 0; i < board.N; i++) {
                if (!Board.isSetPlayer(board, player, row + i, column - i)) {
                    consecutive = false;
                    break;
                }
            }

            if (consecutive)
                return true;
        }
    }
};

Board.isGameOver = (board) => {
    if (Board.legalMoves(board).length === 0)
        return true;
    if (Board.won(board, 0) || Board.won(board, 1))
        return true;
    return false;
};