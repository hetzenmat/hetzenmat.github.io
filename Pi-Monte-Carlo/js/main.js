if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);
let resizeTimeout;
let dropInterval;
let canvas;
let context;
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function resizeCanvas() {
    canvas.height = canvas.width;
}
function documentReady() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    resizeCanvas();
    context.beginPath();
    context.arc(0, 0, canvas.width, 0, 1.5 * Math.PI);
    context.strokeStyle = 'black';
    context.stroke();
    window.onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100);
    };
    dropInterval = setInterval(next_drop, 25);
}
function next_drop() {
    let x = random(0, canvas.width);
    let y = random(0, canvas.height);
    if (x * x + y * y <= canvas.width * canvas.width) {
        context.fillStyle = "blue";
    }
    else {
        context.fillStyle = "red";
    }
    context.fillRect(x, y, 1, 1);
}
