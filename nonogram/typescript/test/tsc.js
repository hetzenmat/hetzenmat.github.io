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
var Example = (function () {
    function Example(width, height, rows, columns) {
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.columns = columns;
    }
    return Example;
}());
var examples = {};
examples['simple_multiple'] = new Example(2, 2, [
    [1], [1]
], [
    [1], [1]
]);
examples['smile'] = new Example(5, 5, [
    [2, 2], [2, 2], [0], [1, 1], [3]
], [
    [2, 1], [2, 1], [1], [2, 1], [2, 1]
]);
examples['hourglass'] = new Example(5, 5, [
    [5], [3], [1], [1, 1], [5]
], [
    [1, 1], [2, 2], [3, 1], [2, 2], [1, 1]
]);
examples['face'] = new Example(10, 10, [
    [5], [8], [2, 6], [1, 2, 1], [1, 1, 1], [2, 2, 1], [7, 1], [10], [9], [7]
], [
    [7], [2, 5], [1, 4], [2, 1, 4], [3, 5], [10], [4, 4], [3, 1, 3], [2, 2], [2, 2]
]);
examples['dolphin'] = new Example(15, 15, [
    [2], [2], [9], [10, 1], [12, 1], [15], [7, 2, 4], [3, 2, 2], [2, 1], [1], [2, 2], [1, 2, 1, 1, 1], [2, 2, 1, 2], [1, 2, 2, 3], [3, 3, 3, 3]
], [
    [6, 1], [5, 2, 1], [5, 2], [4, 1], [5, 1, 1], [5, 2], [1, 5, 3], [6, 1, 2], [7, 1, 2], [5, 3], [4, 1, 1], [5, 2], [1, 4, 4], [1, 4, 1, 2], [3, 2, 1]
]);
examples['chicken'] = new Example(15, 15, [
    [15], [10, 2], [1, 7, 1], [1, 1, 1], [1], [1, 3, 1], [1, 5, 2], [2, 6, 3], [3, 5, 3], [4, 3], [6, 1, 3, 2], [6, 1, 5], [5, 4], [15], [15]
], [
    [15], [2, 8], [3, 7], [3, 6], [3, 2, 5], [3, 3, 2, 2], [3, 3, 2], [3, 4, 2, 2], [3, 4, 2], [2, 3, 2, 2], [1, 2, 2], [1, 6], [1, 1, 3, 4], [2, 9], [4, 4, 1, 3]
]);
examples['cocktail'] = new Example(10, 10, [
    [1], [1], [10], [2, 1, 2], [2, 1, 2], [6], [2], [2], [2], [4]
], [
    [2], [3], [1, 2], [1, 1, 1], [1, 5], [1, 6], [2, 1, 1], [2, 2], [1, 3], [2]
]);
examples['fish'] = new Example(20, 20, [
    [1, 6], [1, 8], [1, 10], [3, 3], [3, 1, 1, 1, 3], [15], [8, 5], [7], [1, 9], [12], [6, 4], [8, 3], [2, 7, 3], [2, 1, 6, 3], [4, 6, 2], [3, 6], [9], [7], [3], [4]
], [
    [1, 1], [1, 2, 1], [3, 2], [1, 1, 1, 6], [3, 4], [3, 2], [3, 1, 2, 2], [1, 2, 1, 2, 3], [2, 3, 3, 4], [4, 2, 9], [7, 9], [4, 2, 9], [3, 1, 9], [3, 2, 8], [4, 5, 3], [10, 1], [10], [10], [9], [3]
]);
examples['lion'] = new Example(25, 25, [
    [0], [5], [9], [13], [14], [16], [2, 7, 2, 1], [2, 9, 3, 1], [3, 3, 5, 3], [4, 1, 1, 1, 4, 5], [4, 1, 5, 6], [2, 3, 4, 6], [3, 1, 4, 5], [4, 3, 4, 2], [5, 7, 3], [16, 3], [17, 1], [1, 2, 12, 1], [3, 13, 2], [4, 16], [4, 15], [4, 5, 8], [4, 6, 10], [4, 4, 9], [0]
], [
    [3, 2, 2, 2], [13, 3], [3, 8, 5], [4, 4, 4, 6], [6, 8], [7, 1, 3, 3, 2], [8, 1, 1, 3, 3], [13, 3, 5], [8, 1, 1, 2, 6], [7, 1, 9], [6, 9], [4, 4, 8, 1], [3, 13, 2], [18, 2], [20], [1, 2, 3, 10], [9], [8], [2, 8], [4, 8], [6, 6], [4, 2, 4], [5, 2, 2], [4, 4], [5]
]);
examples['heraldic_animal'] = new Example(30, 40, [
    [5, 6], [2, 2, 2, 2], [1, 1, 2, 2], [1, 2, 1, 1], [1, 1, 1, 1], [1, 2, 2, 1], [2, 5, 7, 5, 1], [3, 14, 3], [29], [27], [24], [21], [3, 15, 3], [7, 13, 6], [3, 1, 4, 4, 1, 2], [2, 6, 3, 3, 6, 1], [10, 2, 2, 9], [5, 2, 2, 2, 2, 4], [2, 1, 1, 1, 1, 2], [5, 1, 1, 5], [5, 1, 1, 5], [7, 6], [5, 5], [4, 4], [4, 4], [3, 3], [2, 3], [1, 1], [11], [3, 3], [1, 1], [1, 2, 2, 1], [2, 2, 2, 2], [2, 2], [2, 3, 2], [1, 9, 1], [2, 5, 2], [4, 4], [7, 7], [10, 10]
], [
    [6, 4, 5], [2, 3, 5, 4], [1, 3, 3, 2, 3], [4, 3, 2, 3, 3], [2, 2, 3, 2, 3, 2], [1, 1, 4, 1, 3, 2], [2, 4, 1, 2, 2], [1, 4, 8, 1], [1, 5, 8, 1], [8, 1, 7, 5, 1], [9, 12, 3], [9, 8, 2, 2], [12, 4, 1, 2, 1], [16, 1, 2, 2], [8, 1, 3], [8, 1, 3], [8, 1, 3], [16, 1, 2, 2], [12, 4, 1, 2, 1], [9, 8, 2, 2], [9, 12, 3, 1], [8, 1, 8, 5, 1], [1, 7, 8, 1], [2, 1, 4, 7, 2], [3, 2, 4, 1, 2, 2], [1, 4, 4, 1, 3, 2], [1, 3, 2, 3, 3], [2, 4, 2, 3, 3], [2, 3, 3, 2, 4], [7, 4, 5]
]);
var EMPTY = 0;
var BLOCK = 1;
;
var Solution = (function () {
    function Solution(length, solutions) {
        this.length = length;
        this.solutions = solutions;
    }
    return Solution;
}());
var solutions = {};
solutions['simple_multiple'] = new Solution(2, [
    [[EMPTY, BLOCK],
        [BLOCK, EMPTY]],
    [[BLOCK, EMPTY],
        [EMPTY, BLOCK]]
]);
solutions['smile'] = new Solution(1, [[
        [BLOCK, BLOCK, EMPTY, BLOCK, BLOCK],
        [BLOCK, BLOCK, EMPTY, BLOCK, BLOCK],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [BLOCK, EMPTY, EMPTY, EMPTY, BLOCK],
        [EMPTY, BLOCK, BLOCK, BLOCK, EMPTY]
    ]]);
solutions['hourglass'] = new Solution(1, [[
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK],
        [EMPTY, BLOCK, BLOCK, BLOCK, EMPTY],
        [EMPTY, EMPTY, BLOCK, EMPTY, EMPTY],
        [EMPTY, BLOCK, EMPTY, BLOCK, EMPTY],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK]
    ]]);
solutions['face'] = new Solution(1, [[
        [EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY],
        [EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY],
        [BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK],
        [BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK],
        [BLOCK, EMPTY, EMPTY, BLOCK, EMPTY, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY],
        [BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, EMPTY, BLOCK, EMPTY, EMPTY],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY],
        [EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY]
    ]]);
solutions['chicken'] = new Solution(1, [[
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK],
        [BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK],
        [BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, EMPTY, BLOCK],
        [BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK],
        [BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK],
        [BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK],
        [BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK],
        [BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK]
    ]]);
solutions['lion'] = new Solution(1, [[
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK],
        [BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK],
        [EMPTY, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK],
        [BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, EMPTY, BLOCK, EMPTY, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK],
        [BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK],
        [EMPTY, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY],
        [BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY],
        [BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY],
        [EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY],
        [EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, BLOCK, EMPTY, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, EMPTY],
        [EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, EMPTY],
        [EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY],
        [EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY],
        [EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY],
        [BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY],
        [BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, BLOCK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
    ]]);
//# sourceMappingURL=tsc.js.map