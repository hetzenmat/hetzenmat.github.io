'use strict';

importScripts('../js/examples.js',
			  '../js/Puzzle.js',
			  'solutions.js');

onmessage = function (event) {
	if (event.data === 'start') {
		run_tests();
	}
}

function run_tests() {
	let count = 1;
	for (let name in solutions) {
		test_case(count, name);
		count++;
	}
	postMessage({
		type: 'finished'
	});
}

function append_text(text) {
	postMessage({
		type: 'append',
		text: text
	});
}

function test_case(count, name) {
	append_text(`<h2> ${count}. ${examples[name].width} x ${examples[name].height} ${name} </h2>`);
	append_text(`<p>Solving . . .</p>`);

	let start = new Date();

	let puzzle = new Puzzle(examples[name]);
	puzzle.solve();
	let duration = (new Date() - start) / 1000;

	append_text(`<p>Took ${duration} seconds</p>`);

	let passed = true;

	if (puzzle.solutions.length !== solutions[name].length) {
		append_text(`<p>Number of solutions are not equal (${solutions[name].count} should be ${puzzle.solutions.length})</p>`);
		passed = false;
	} else {
		for (let i = 0; i < puzzle.solutions.length; i++) {

			let solution_passed = false;
			for (let j = 0; j < solutions[name].length; j++) {
				if (compare_states(puzzle.solutions[i], solutions[name][j]))
					solution_passed = true;
			}

			if (solution_passed) {
				append_text(`<p>Solution ${i + 1} passed.</p>`);
			} else {
				append_text(`<p>Solution ${i + 1} did not pass.</p>`);
				passed = false;
			}
		}
	}

	if (passed) {
		append_text('<p style="font-weight: bold; color: green;">Testcase passed!</p>');

	} else {
		append_text('<p style="font-weight: bold; color: red;">Testcase did not pass!</p>');
	}

	postMessage({
		type: 'statistics',
		passed: passed
	});

	append_text('<hr>');
}

function compare_states(state1, state2) {
	if (state1.length !== state2.length)
		return false;

	for (let i = 0; i < state1.length; i++) {
		if (state1[i].length !== state2[i].length)
			return false;

		for (let j = 0; j < state1[i].length; j++) {
			if (state1[i][j] !== state2[i][j])
				return false;
		}
	}

	return true;
}