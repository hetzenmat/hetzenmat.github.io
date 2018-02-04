if (document.readyState !== 'loading')
    documentReady();
else
    document.addEventListener('DOMContentLoaded', documentReady);

let resizeTimeout: number;
let dropInterval: number;
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let content: HTMLDivElement;
let drops = {
    in: 0,
    total: 0
};
let pi: HTMLParagraphElement;


function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function documentReady(): void {

    content = <HTMLDivElement>document.getElementById('content');
    pi = <HTMLParagraphElement>document.getElementById('pi');

    canvas = <HTMLCanvasElement>document.getElementById('canvas');
    context = canvas.getContext('2d');

    context.beginPath();

    context.arc(0, 0, canvas.width, 0, 1.5 * Math.PI);

    context.strokeStyle = 'black';
    context.stroke();

    dropInterval = setInterval(next_drops, 50);
}

function next_drops(): void {

    for (let i = 0; i < 10; i++) {
        let x = random(0, canvas.width);
        let y = random(0, canvas.height);

        if (x*x + y*y <= canvas.width*canvas.width) {
            context.fillStyle = "green";
            drops.in++;
        } else {
            context.fillStyle = "red";    
        }

        drops.total++;

        context.fillRect(x, y, 1, 1);

        let approximation = (4 * drops.in / drops.total).toString();

        // fix approximation to 10 decimal places
        while (approximation.length < 12) {
            approximation += '0';
        }
        approximation = approximation.substring(0, 13);

        pi.innerHTML = approximation;
    }
}