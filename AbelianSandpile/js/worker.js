let timeoutID;
onmessage = (event) => {
    let eventData = event.data;
    switch (event.data.type) {
        case 'start':
            iterate();
            break;
        case 'stop':
            clearTimeout(timeoutID);
            break;
    }
};
let maxSize = 0;
let map = new Map();
let spills;
let COLORS = [
    Math.floor(255 * 2 / 3),
    Math.floor(255 * 1 / 3),
    0
];
function getValue(value) {
    if (value === undefined)
        value = 0;
    return value;
}
function coordinateToString(x, y) {
    return `${x}|${y}`;
}
function processPoint(x, y) {
    maxSize = Math.max(x, maxSize);
    let value = getValue(map.get(coordinateToString(x, y))) + 1;
    if (value === 4) {
        value = 0;
        spills.push([x, y]);
    }
    map.set(coordinateToString(x, y), value);
}
function sendSVG() {
    let str = `<g style="stroke-width:0;">`;
    for (let i = -maxSize; i <= maxSize; i++) {
        for (let j = -maxSize; j <= maxSize; j++) {
            let value = getValue(map.get(coordinateToString(i, j)));
            if (value > 0) {
                let color = Array(3).fill(COLORS[value - 1]).join(',');
                str += `<rect x="${i}" y="${j}" width="1" height="1" style="fill:rgb(${color})" />\n`;
            }
        }
    }
    str += '</g>';
    postMessage({
        type: 'svg',
        viewBox: `${-maxSize} ${-maxSize} ${2 * maxSize + 1} ${2 * maxSize + 1}`,
        svg: str
    });
}
function log() {
    let str = '';
    for (let i = -maxSize; i <= maxSize; i++) {
        for (let j = -maxSize; j <= maxSize; j++) {
            let value = getValue(map.get(coordinateToString(i, j)));
            if (value === 0) {
                value = '.';
            }
            str += value;
        }
        str += '\n';
    }
    postMessage({
        type: 'log',
        message: str
    });
}
function iterate() {
    let value = getValue(map.get(coordinateToString(0, 0))) + 1;
    spills = [];
    if (value === 4) {
        value = 0;
        spills.push([0, 0]);
    }
    map.set(coordinateToString(0, 0), value);
    while (spills.length > 0) {
        let [x, y] = spills.pop();
        processPoint(x + 1, y);
        processPoint(x - 1, y);
        processPoint(x, y + 1);
        processPoint(x, y - 1);
    }
    sendSVG();
    log();
    timeoutID = setTimeout(iterate, 10);
}
