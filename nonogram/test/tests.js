'use strict';

document.title = 'Nonogram Tests';

if (document.readyState !== 'loading')
    document_ready();
else
    document.addEventListener('DOMContentLoaded', document_ready);

let content_element;

function document_ready() {
	content_element = document.getElementById('content');
}

function clear_content() {
	content_element.innerHTML = '';
}

function append_text(text) {
	content_element.innerHTML += text;
}

function start_button_click() {
	
	clear_content();
	let testWorker = new Worker('test_worker.js');

	testWorker.onmessage = function(event) {
		append_text(event.data);
	};

	testWorker.postMessage('start');
}