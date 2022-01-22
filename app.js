var WIDTH;
var HEIGHT;
var canvas;
var con;
var g;
var fireflies = new Array();
var rint = 50;

WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;
canvas = document.getElementById('fireflies');

canvas.setAttribute("width", WIDTH + 'px');
canvas.setAttribute("height", HEIGHT + 'px');

ctx = canvas.getContext('2d');


initFireflies(50);
setInterval(draw, rint);

function initFireflies(countFireflies = 50) {
    for (var i = 0; i < countFireflies; i++) {
        fireflies[i] = new Firefly();
        fireflies[i].reset();
    }
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (var i = 0; i < fireflies.length; i++) {
        fireflies[i].fade();
        fireflies[i].move();
        fireflies[i].draw();
    }
}

function Firefly() {
    this.s = { ttl: 8000, xmax: 5, ymax: 2, rmax: 10, rt: 1, xdef: 960, ydef: 540, random: true, blink: true };

    this.reset = function () {
        this.x = (this.s.random ? WIDTH * Math.random() : this.s.xdef);
        this.y = (this.s.random ? HEIGHT * Math.random() : this.s.ydef);
        this.r = ((this.s.rmax - 1) * Math.random()) + 1;
        this.dx = (Math.random() * this.s.xmax) * (Math.random() < .5 ? -1 : 1);
        this.dy = (Math.random() * this.s.ymax) * (Math.random() < .5 ? -1 : 1);
        this.half_life = (this.s.ttl / rint) * (this.r / this.s.rmax);
        this.rt = Math.random() * this.half_life;
        this.s.rt = Math.random() + 1;
        this.stop = Math.random() * .2 + .4;
    }

    this.fade = function () {
        this.rt += this.s.rt;
    }

    this.draw = function () {
        if (this.s.blink && (this.rt <= 0 || this.rt >= this.half_life)) this.s.rt = this.s.rt * -1;
        else if (this.rt >= this.half_life) this.reset();
        var newo = 1 - (this.rt / this.half_life);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        var cr = this.r * newo;
        g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr <= 0 ? 1 : cr));
        g.addColorStop(0.0, 'rgba(238,180,28,' + newo + ')');
        g.addColorStop(this.stop, 'rgba(238,180,28,' + (newo * .2) + ')');
        g.addColorStop(1.0, 'rgba(238,180,28,0)');
        ctx.fillStyle = g;
        ctx.fill();
    }

    this.move = function () {
        this.x += (this.rt / this.half_life) * this.dx;
        this.y += (this.rt / this.half_life) * this.dy;
        if (this.x > WIDTH || this.x < 0) this.dx *= -1;
        if (this.y > HEIGHT || this.y < 0) this.dy *= -1;
    }

}