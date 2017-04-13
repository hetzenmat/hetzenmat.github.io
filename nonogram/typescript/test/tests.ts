document.title = 'Nonogram Tests';

if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);

let content_element : HTMLElement;
let statistics_element : HTMLElement;
let button_start_tests : HTMLButtonElement;
let overall_cases : number, passed_cases : number;

function documentReady() : void {
    content_element = document.getElementById('content');
    statistics_element = document.getElementById('statistics');
    button_start_tests = <HTMLButtonElement>document.getElementById('button-start-tests');
    console.log(button_start_tests);
    button_start_tests.onclick = start_button_click;
}

function start_button_click() : void {
    button_start_tests.setAttribute('disabled', '');
    button_start_tests.value = 'Working . . .';
    clear_content();
    overall_cases = 0;
    passed_cases = 0;
    let testWorker : Worker = new Worker('test_worker.js');

    testWorker.onmessage = function(event : MessageEvent) : void {
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

function clear_content() : void {
    content_element.innerHTML = '';
}

function append_text(text : string|number) : void {
    content_element.innerHTML += text;
}