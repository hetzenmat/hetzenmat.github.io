document.title = 'Nonogram Tests';
if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);
var content_element;
var statistics_element;
var button_start_tests;
var overall_cases, passed_cases;
function documentReady() {
    content_element = document.getElementById('content');
    statistics_element = document.getElementById('statistics');
    button_start_tests = document.getElementById('button-start-tests');
    console.log(button_start_tests);
    button_start_tests.onclick = start_button_click;
}
function start_button_click() {
    button_start_tests.setAttribute('disabled', '');
    button_start_tests.value = 'Working . . .';
    clear_content();
    overall_cases = 0;
    passed_cases = 0;
    var testWorker = new Worker('test_worker.js');
    testWorker.onmessage = function (event) {
        switch (event.data.type) {
            case 'append':
                append_text(event.data.text);
                break;
            case 'statistics':
                overall_cases++;
                if (event.data.passed) {
                    passed_cases++;
                }
                statistics_element.innerHTML = passed_cases + " / " + overall_cases + " Testcases passed (" + passed_cases / overall_cases * 100 + " %)";
                break;
            case 'finished':
                button_start_tests.removeAttribute('disabled');
                button_start_tests.value = 'Start Tests';
                break;
        }
    };
    testWorker.postMessage('start');
}
function clear_content() {
    content_element.innerHTML = '';
}
function append_text(text) {
    content_element.innerHTML += text;
}
