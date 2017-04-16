/// <reference path="Puzzle.ts"/>

let puzzle : Puzzle;

function log(message: any): void {
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
				callback = function(state: any) {
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