/// <reference path="../types.ts"/>

let spanIteration = <HTMLSpanElement>document.getElementById('iteration');
let iterations = 0;
let svg = document.getElementsByTagName('svg')[0];

let buttonStart = <HTMLButtonElement>document.getElementById('button-start');
let buttonStop = <HTMLButtonElement>document.getElementById('button-stop');

let running = false;

let worker = new Worker('js/worker.js');
worker.onmessage = (event: MessageEvent): void => {
    let eventData = <EventData>event.data;

    switch(eventData.type) {
        case 'svg':
            svg.setAttribute('viewBox', eventData.viewBox);
            svg.innerHTML = eventData.svg;
            spanIteration.innerHTML = (++iterations).toString();
            break;

        case 'log':
            console.log('Iteration: ' + iterations);
            console.log(eventData.message);
            break;
    }
};

buttonStart.onclick = () => {
    if (running)
        return;

    running = true;

    worker.postMessage({
        type: 'start'
    });
};

buttonStop.onclick = () => {

    if (!running)
        return;

    running = false;

    worker.postMessage({
        type: 'stop'
    });
};