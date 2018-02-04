/// <reference path="../../typescript/Sudoku.ts"/>



let testStrings = [
    '906070403\n000400200\n070023010\n500000100\n040208060\n003000005\n030700050\n007005000\n405010708',
    // norvig easy
    '003020600\n900305001\n001806400\n008102900\n700000008\n006708200\n002609500\n800203009\n005010300',
    '200080300\n060070084\n030500209\n000105408\n000000000\n402706000\n301007040\n720040060\n004010003',
    '000000907\n000420180\n000705026\n100904000\n050000040\n000507009\n920108000\n034059000\n507000000',
    '030050040\n008010500\n460000012\n070502080\n000603000\n040109030\n250000098\n001020600\n080060020',
    '020810740\n700003100\n090002805\n009040087\n400208003\n160030200\n302700060\n005600008\n076051090'
    // norvig hard
    //'4.....8.5\n.3.......\n...7.....\n.2.....6.\n....8.4..\n....1....\n...6.3.7.\n5..2.....\n1.4......'
];

let testSolutions = [
    ['926571483\n351486279\n874923516\n582367194\n149258367\n763149825\n238794651\n617835942\n495612738', '926571483\n351486279\n874923516\n582367194\n149258367\n763194825\n238749651\n617835942\n495612738'],
    // norvig easy
    ['483921657\n967345821\n251876493\n548132976\n729564138\n136798245\n372689514\n814253769\n695417382'],
    ['245981376\n169273584\n837564219\n976125438\n513498627\n482736951\n391657842\n728349165\n654812793'],
    ['462831957\n795426183\n381795426\n173984265\n659312748\n248567319\n926178534\n834259671\n517643892'],
    ['137256849\n928314567\n465897312\n673542981\n819673254\n542189736\n256731498\n391428675\n784965123'],
    ['523816749\n784593126\n691472835\n239145687\n457268913\n168937254\n342789561\n915624378\n876351492']
    // norvig hard
    //['417369825\n632158947\n958724316\n825437169\n791586432\n346912758\n289643571\n573291684\n164875293']
];

function testSudoku(value: string, testIndex: number): boolean {

    let sudoku = new Sudoku(value); 
    let solutions = sudoku.solve();
    
    let matched = 0;
    for (let str of solutions.map(s => Sudoku.sudokuToString(s, false))) {
        for (let testStr of testSolutions[testIndex]) {
            if (str.trim() === testStr.trim()) {
                matched++;
            }
        }
    }

    return matched === testSolutions[testIndex].length;
} 

function runTest(index: number): void {
    let li = document.getElementById('li-test-' + index);
    li.classList.add('test-initial');
    li.classList.remove('test-success', 'test-failure');
    
    li.classList.remove('test-initial');
    li.classList.add('test-success');
}

let passedTests = testStrings.map(testSudoku).map(Number).reduce((prev, curr) => prev + curr);

const LONG_DOUBLE_ARROW_HTML_ENTITY = '&#10238;';

window.addEventListener('load', () => {
    let testList = document.getElementById('ol-test-cases');
    
    for (let i = 0; i < testStrings.length; i++) {
        let innerHTML = '<li class="test-initial" id="li-test-' + i + '" ><div>';
        innerHTML += '<div class="padding-2em"><input type="button" value="Run" onclick="runTest(' + i + ');"></div>';
        innerHTML += '<div class="padding-2em"><code>' + testStrings[i].replace(/\n/g, '<br>') + '</code></div>';
        innerHTML += '<div class="padding-2em" style="display: flex; align-items: center;">' + LONG_DOUBLE_ARROW_HTML_ENTITY + '</div>';

        for (let solution of testSolutions[i]) {
            innerHTML += '<div class="padding-2em"><code>' + solution.replace(/\n/g, '<br>') + '</code></div>';
        }

        
        innerHTML += '</div></li><div style="clear: both;"></div>';
        testList.innerHTML += innerHTML;
    }
});

console.log(passedTests, passedTests === testStrings.length)