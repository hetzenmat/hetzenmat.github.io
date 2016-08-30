'use strict';

importScripts('Puzzle.js');

let puzzle;

function log(message) {
	postMessage({
		type: 'log',
		message: message
	});
}

onmessage = function (event) {

	switch (event.data.type) {
		case 'start':
			let callback;
			if (event.data.callback) {
				callback = function(state) {
					postMessage({
						type: 'progress',
						state: state
					});
				}
			}

			puzzle.solve(callback);
			postMessage({
				type: 'solutions',
				solutions: puzzle.solutions
			});
			break;
		case 'constraints':
			puzzle = new Puzzle(event.data.constraints);
			puzzle.set_logger(log);
			break;
	}
}