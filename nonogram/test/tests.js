'use strict';

document.title = 'Nonogram Tests';

if (document.readyState !== 'loading')
    document_ready();
else
    document.addEventListener('DOMContentLoaded', document_ready);

let content_element;
let statistics_element;
let button_start_tests;
let overall_cases, passed_cases;

function document_ready() {
	content_element = document.getElementById('content');
	statistics_element = document.getElementById('statistics');
	button_start_tests = document.getElementById('button-start-tests');
	button_start_tests.onclick = start_button_click;
}

function clear_content() {
	content_element.innerHTML = '';
}

function append_text(text) {
	content_element.innerHTML += text;
}

function start_button_click() {

	button_start_tests.setAttribute('disabled', '');
	button_start_tests.value = 'Working . . .';
	clear_content();
	overall_cases = 0;
	passed_cases = 0;
	let testWorker = new Worker('test_worker.js');

	testWorker.onmessage = function(event) {
		switch (event.data.type) {
			case 'append':
				append_text(event.data.text);
				break;

			case 'statistics':
				overall_cases++;
				if (event.data.passed) {
					passed_cases++;
				}

				statistics_element.innerHTML = `${passed_cases} / ${overall_cases} Testcases passed (${passed_cases / overall_cases * 100} %)`;
				break;

			case 'finished':
				button_start_tests.removeAttribute('disabled');
				button_start_tests.value = 'Start Tests';
				break;
		}
		
	};

	testWorker.postMessage('start');
}