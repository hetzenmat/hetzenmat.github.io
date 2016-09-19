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
let positionTable = null;

function calculateMove(board) {
	console.clear();
	nodes = 0;
	maxDepth = 1;
	bestMove = null;
	stagedMove = null;

	if (positionTable === null || positionTable.length !== board.rows || positionTable[0].length !== board.columns) {
		positionTable = Gaussian2D.createDistributionTable(20, board.rows, board.columns);
	}

	startTime = Date.now();

	while (Date.now() - startTime < MAX_TIME) {

		if (bestMove != null) {
			stagedMove = bestMove;
		}
		bestMove = null;
		max(Board.deepCopy(board), 0, -Infinity, Infinity, true);
		maxDepth++;
		console.log(maxDepth);
	}

	console.log("nodes: " + nodes);
	return stagedMove;
}

/*
 * board.currentPlayer stays the same for the duration of the search
 * it always represents the maximizing player
 */

function max(board, depth, alpha, beta) {
	
	if (Date.now() - startTime >= MAX_TIME) {
		return null;
	}

	nodes++;	

	if (Board.won(board, board.currentPlayer)) {
		return 1000 * (maxDepth - depth + 1);
	}
	if (Board.won(board, Board.getNextPlayer(board))) {
		return -1000 * (maxDepth - depth + 1);
	}
	if (Board.legalMoves(board).length === 0) {
		return 0;
	}
	if (depth === maxDepth) {
		return evaluate(board);
	}

	let maxValue = alpha;

	let moves = Board.legalMoves(board);
	while (moves.length > 0) {
		let column = moves.pop();
		Board.move(board, board.currentPlayer, column);

		let value = min(board, depth + 1, maxValue, beta);
		if (value == null)
			return null;

		Board.undoMove(board, column);

		if (value > maxValue) {
			maxValue = value;
			if (maxValue >= beta)
				break;
			if (depth === 0) {
				bestMove = column;
				console.log('set ' + maxDepth + ': ' + bestMove + ' value: ' + maxValue);
			}
		}
	}

	return maxValue;
}

function min(board, depth, alpha, beta) {

	if (Date.now() - startTime >= MAX_TIME) {
		return null;
	}

	nodes++;

	if (Board.won(board, board.currentPlayer)) {
		return 1000 * (maxDepth - depth + 1);
	}
	if (Board.won(board, Board.getNextPlayer(board))) {
		return -1000 * (maxDepth - depth + 1);
	}
	if (Board.legalMoves(board).length === 0) {
		return 0;
	}
	if (depth === maxDepth) {
		return evaluate(board);
	}

	let minValue = beta;

	let moves = Board.legalMoves(board);

	while (moves.length > 0) {
		let column = moves.pop();
		Board.move(board, Board.getNextPlayer(board), column);

		let value = max(board, depth + 1, alpha, minValue);
		if (value == null)
			return null;

		Board.undoMove(board, column);

		if (value < minValue) {
			minValue = value;
			if (minValue <= alpha)
				break;
		}
	}

	return minValue;
}

function alphaBeta(board, depth, alpha, beta, maximizingPlayer) {
	if (Date.now() - startTime >= MAX_TIME) {
		return null;
	}

	nodes++;

	if (Board.won(board, board.currentPlayer)) {
		return maximizingPlayer ? 1000 : -1000;
	}
	if (Board.won(board, Board.getNextPlayer(board))) {
		return maximizingPlayer ? -1000 : 1000;
	}
	if (Board.legalMoves(board).length === 0) {
		return 0;
	}
	if (depth === maxDepth) {
		let score = evaluate(board);
		return maximizingPlayer ? score : -score;
	}

	let maxValue = alpha;
	let moves = Board.legalMoves(board);

	while (moves.length > 0) {
		let column = moves.pop();

		if (maximizingPlayer) {
			Board.move(board, board.currentPlayer, column);
		} else {
			Board.move(board, Board.getNextPlayer(board), column);
		}

		let value = -alphaBeta(board, depth + 1, -beta, -maxValue, !maximizingPlayer);
		if (value == null)
			return null;

		Board.undoMove(board, column);
		if (value > maxValue) {
			maxValue = value;
			if (maxValue >= beta)
				break;
			if (depth === 0) {
				bestMove = column;
			}
		}
	}

	return maxValue;
}

function evaluate(board) {
	let score = 0;

	for (let i = 0; i < board.rows; i++) {
		for (let j = 0; j < board.columns; j++) {
			if (Board.isSetPlayer(board, board.currentPlayer, i, j)) {
				score += positionTable[i][j];
			} else if (Board.isSetPlayer(board, Board.getNextPlayer(board), i, j)) {
				score -= positionTable[i][j];
			}
		}
	}
	if (isNaN(score))
		console.log(score);
	return score;
}