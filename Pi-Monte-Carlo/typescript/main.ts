if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);

let resizeTimeout: number;
let dropInterval: number;
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function resizeCanvas(): void {
    canvas.height = canvas.width;
}

function documentReady(): void {

    canvas = <HTMLCanvasElement>document.getElementById('canvas');
    context = canvas.getContext('2d');

    resizeCanvas();

    context.beginPath();

    context.arc(0, 0, canvas.width, 0, 1.5 * Math.PI);

    context.strokeStyle = 'black';
    context.stroke();

    window.onresize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100);
    }

    dropInterval = setInterval(next_drop, 25);
}

function next_drop(): void {
    let x = random(0, canvas.width);
    let y = random(0, canvas.height);

    if (x*x + y*y <= canvas.width*canvas.width) {
        context.fillStyle = "blue";
    } else {
        context.fillStyle = "red";
    }

    context.fillRect(x, y, 1, 1);
}