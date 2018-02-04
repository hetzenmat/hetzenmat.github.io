importScripts('../js/examples.js',
              './solutions.js',
              '../js/Puzzle.js');

declare var solutions: any;
declare var examples: any;
declare var Puzzle: any;

onmessage = function (event : MessageEvent) : void {
    if (event.data === 'start') {
        runTests();
    }
}

function runTests() : void {
    let count : number = 1;
    for (let name in solutions) {
        testCase(count, name);
        count++;
    }
    postMessage({
        type: 'finished'
    });
}

function append_text(text : number|string) : void {
    postMessage({
        type: 'append',
        text: text
    });
}

function testCase(count : number, name : string) : void {
    append_text(`<h2> ${count}. ${examples[name].width} x ${examples[name].height} ${name} </h2>`);
    append_text(`<p>Solving . . .</p>`);

    let start = new Date().getTime();

    let puzzle = new Puzzle(examples[name]);
    puzzle.solve(void 0);
    let duration = (new Date().getTime() - start) / 1000;

    append_text(`<p>Took ${duration} seconds</p>`);

    let passed = true;

    if (puzzle.solutions.length !== solutions[name].length) {
        append_text(`<p>Number of solutions are not equal (${solutions[name].length} should be ${puzzle.solutions.length})</p>`);
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

function compare_states(state1: number[][], state2: number[][]) : boolean {
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