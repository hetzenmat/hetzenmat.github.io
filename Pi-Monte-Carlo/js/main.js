if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);
let resizeTimeout;
let dropInterval;
let canvas;
let context;
let content;
let drops = {
    in: 0,
    total: 0
};
let pi;
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function documentReady() {
    content = document.getElementById('content');
    pi = document.getElementById('pi');
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.beginPath();
    context.arc(0, 0, canvas.width, 0, 1.5 * Math.PI);
    context.strokeStyle = 'black';
    context.stroke();
    dropInterval = setInterval(next_drops, 50);
}
function next_drops() {
    for (let i = 0; i < 10; i++) {
        let x = random(0, canvas.width);
        let y = random(0, canvas.height);
        if (x * x + y * y <= canvas.width * canvas.width) {
            context.fillStyle = "green";
            drops.in++;
        }
        else {
            context.fillStyle = "red";
        }
        drops.total++;
        context.fillRect(x, y, 1, 1);
        let approximation = (4 * drops.in / drops.total).toString();
        while (approximation.length < 12) {
            approximation += '0';
        }
        approximation = approximation.substring(0, 13);
        pi.innerHTML = approximation;
    }
}
