'use strict';

let content = document.querySelector('.content');
let span_iteration = document.getElementById('iteration');
let svg = document.querySelector('svg');

let button_start = document.getElementById('button-start');
let button_stop = document.getElementById('button-stop');

let running = false;

let worker = new Worker('js/sand-pile.js');
worker.onmessage = (event) => {
	switch (event.data.type) {
		case 'svg':
			svg.setAttribute('viewBox', event.data.viewBox);
			svg.innerHTML = event.data.svg;
			span_iteration.innerHTML = (+span_iteration.innerHTML) + 1;
			break;

		case 'log':
			console.log('Iteration: ' + span_iteration.innerHTML);
			console.log(event.data.message);
			break;
	}
};

button_start.onclick = () => {

	if (running)
		return;

	running = true;

	worker.postMessage({
		type: 'start'
	});
};

button_stop.onclick = () => {

	if (!running)
		return;

	running = false;

	worker.postMessage({
		type: 'stop'
	});
};