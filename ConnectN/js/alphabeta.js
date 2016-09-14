'use strict';

function randomMove(board, player) {
    var legalMoves = Board.legalMoves(board);

    var column = legalMoves[Math.floor(Math.random() * legalMoves.length)];

    var row = Board.move(board, player, column);

    return {
        row:    row,
        column: column
    };
}

const MAX_TIME = 1000; // 5 seconds
let stagedMove;
let bestMove;
let maxDepth;
let startTime;
let nodes;

function calculateMove(board) {
	
	console.log(Board.toString(board));
	console.log(Board.legalMoves(board));

	window.board = board;

	nodes = 0;
	maxDepth = 2;
	bestMove = null;
	stagedMove = null;

	startTime = Date.now();

	while (Date.now() - startTime < MAX_TIME) {

		if (bestMove != null) {
			stagedMove = bestMove;
			console.log(maxDepth + ': ' + stagedMove);
		}
		bestMove = null;

		max(Board.deepCopy(board), 0, -Infinity, Infinity);
		maxDepth++;
	}

	console.log("nodes: " + nodes);
	return stagedMove;
}

/*
 * board.currentPlayer stays the same for the duration of the search
 * it always represents the maximizing player
 */

function max(board, depth, alpha, beta) {
	
	nodes++;	

	if (Board.won(board, board.currentPlayer)) {
		return 1000;
	}
	if (Board.won(board, Board.getNextPlayer(board))) {
		return -1000;
	}
	if (Board.legalMoves(board).length === 0) {
		return 0;
	}
	if (depth === maxDepth) {
		return evaluate(board);
	}
	if (Date.now() - startTime >= MAX_TIME) {
		return null;
	}

	let maxValue = alpha;

	let moves = Board.legalMoves(board);
	while (moves.length > 0) {
		let column = moves.pop();
		Board.move(board, board.currentPlayer, column);

		let value = min(Board.deepCopy(board), depth + 1, maxValue, beta);
		if (value == null)
			break;

		Board.undoMove(board, column);

		if (value > maxValue) {
			maxValue = value;
			if (maxValue >= beta)
				break;
			if (depth === 0) {
				console.log( maxDepth + "set " + column);
				bestMove = column;
			}
		}
	}

	return maxValue;
}

function min(board, depth, alpha, beta) {

	nodes++;

	if (Board.won(board, board.currentPlayer)) {
		return 1000;
	}
	if (Board.won(board, Board.getNextPlayer(board))) {
		return -1000;
	}
	if (Board.legalMoves(board).length === 0) {
		return 0;
	}
	if (depth === maxDepth) {
		return evaluate(board);
	}
	if (Date.now() - startTime >= MAX_TIME) {
		return null;
	}

	let minValue = beta;

	let moves = Board.legalMoves(board);

	while (moves.length > 0) {
		let column = moves.pop();
		Board.move(board, Board.getNextPlayer(board), column);

		let value = max(Board.deepCopy(board), depth + 1, alpha, minValue);
		if (value == null)
			break;

		Board.undoMove(board, column);

		if (value < minValue) {
			minValue = value;
			if (minValue <= alpha)
				break;
		}
	}

	return minValue;
}

function evaluate(board) {
	return 0;
}