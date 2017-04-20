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
let max_size = 0;
let map = new Map();
let spills;
let COLORS = [
    Math.floor(255 * 2 / 3),
    Math.floor(255 * 1 / 3),
    0
];
function coordinateToString(x, y) {
    return `${x}|${y}`;
}
function process_point(x, y) {
    max_size = Math.max(x, max_size);
    let value = map.get(coordinateToString(x, y)) + 1;
    if (value === 4) {
        value = 0;
        spills.push([x, y]);
    }
    map.set(coordinateToString(x, y), value);
}
function send_svg() {
    let str = `<g style="stroke-width:0;">`;
    for (let i = -max_size; i <= max_size; i++) {
        for (let j = -max_size; j <= max_size; j++) {
            let value = map.get(coordinateToString(i, j));
            if (value > 0) {
                let color = Array(3).fill(COLORS[value - 1]).join(',');
                str += `<rect x="${i}" y="${j}" width="1" height="1" style="fill:rgb(${color})" />\n`;
            }
        }
    }
    str += '</g>';
    postMessage({
        type: 'svg',
        viewBox: `${-max_size} ${-max_size} ${2 * max_size + 1} ${2 * max_size + 1}`,
        svg: str
    });
}
function log() {
    let str = '';
    for (let i = -max_size; i <= max_size; i++) {
        for (let j = -max_size; j <= max_size; j++) {
            let value = map.get(coordinateToString(i, j));
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
    let value = map.get(coordinateToString(0, 0)) + 1;
    spills = [];
    if (value === 4) {
        value = 0;
        spills.push([0, 0]);
    }
    map.set(coordinateToString(0, 0), value);
    while (spills.length > 0) {
        let [x, y] = spills.pop();
        process_point(x + 1, y);
        process_point(x - 1, y);
        process_point(x, y + 1);
        process_point(x, y - 1);
    }
    send_svg();
    log();
    postMessage({
        type: 'log',
        message: map.toString()
    });
    timeoutID = setTimeout(iterate, 10);
}
