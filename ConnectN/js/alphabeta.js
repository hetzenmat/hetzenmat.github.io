function randomMove(board, player) {
    var legalMoves = Board.legalMoves(board);

    var column = legalMoves[Math.floor(Math.random() * legalMoves.length)];

    var row = Board.move(board, player, column);

    return {
        row:    row,
        column: column
    };
}