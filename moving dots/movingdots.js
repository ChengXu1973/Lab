var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var dotsNumber = 100;
var maxDistance = 80;
var maxDotRadius = 10;
var dots = [];
var movingDotIntervalId;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

window.onload = function() {
    startMovingDots();
}

window.onresize = function() {
    clearInterval(movingDotIntervalId);
    startMovingDots();
}

function startMovingDots() {
    // 自适应
    CANVAS_WIDTH = document.body.clientWidth * 2;
    CANVAS_HEIGHT = document.body.clientHeight * 2;
    // 初始化
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;
    dotsNumber = Math.max(CANVAS_WIDTH / 20, CANVAS_HEIGHT / 20);
    dotsNumber = dotsNumber > 300 ? 300 : dotsNumber;
    maxDistance = Math.min(CANVAS_WIDTH / 7, CANVAS_HEIGHT / 7);
    maxDotRadius = Math.min(CANVAS_WIDTH / 100, CANVAS_HEIGHT / 100);
    maxDotRadius = maxDotRadius > 9 ? 9 : maxDotRadius;
    dots = [];
    addDots();
    // 每50ms秒绘制一次
    movingDotIntervalId = setInterval(function() {
        update();
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        renderDots(context);
        connectDots(context);
    }, 50);
}

// 初始化dots对象
function addDots() {
    for (var i = 0; i < dotsNumber; i++) {
        var singleDot = {};
        singleDot.r = Math.round(Math.random() * maxDotRadius) + 1;
        singleDot.x = Math.floor(Math.random() * (CANVAS_WIDTH - 2 * singleDot.r)) + singleDot.r;
        singleDot.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 2 * singleDot.r)) + singleDot.r;
        singleDot.vx = (Math.round(Math.random()) * 2 - 1) *
            Math.round((Math.random() + 1) * CANVAS_WIDTH / dotsNumber / 12);
        singleDot.vy = (Math.round(Math.random()) * 2 - 1) *
            Math.round((Math.random() + 1) * CANVAS_HEIGHT / dotsNumber / 12);
        dots.push(singleDot);
    }
}

// 渲染小球
function renderDots(ctx) {
    renderBackground(ctx, "#e6e6e6");
    for (var i = 0; i < dotsNumber; i++) {
        for (var r = 0; r < dots[i].r; r++) {
            ctx.beginPath();
            ctx.arc(dots[i].x, dots[i].y, r, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(166,166,166," + (1 - r / dots[i].r) + ")";
            ctx.fill();
        }
    }
}

// 渲染直线
function connectDots(ctx) {
    ctx.strokeStyle = "#a6a6a6";
    ctx.lineWidth = 1;
    for (var i = 0; i < dotsNumber; i++) {
        for (var j = 0; j < i; j++) {
            if (distance(dots[i], dots[j]) < maxDistance) {
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }
}

// 渲染背景
function renderBackground(ctx, backgroundColor) {
    ctx.beginPath();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// 更新小球状态
function update() {
    for (var i = 0; i < dotsNumber; i++) {
        dots[i].x += dots[i].vx;
        dots[i].y += dots[i].vy;
        // 碰撞检测
        if (dots[i].x < dots[i].r) {
            dots[i].x = dots[i].r;
            dots[i].vx = -dots[i].vx;
        } else if (dots[i].x > CANVAS_WIDTH - dots[i].r) {
            dots[i].x = CANVAS_WIDTH - dots[i].r;
            dots[i].vx = -dots[i].vx;
        } else if (dots[i].y < dots[i].r) {
            dots[i].y = dots[i].r;
            dots[i].vy = -dots[i].vy;
        } else if (dots[i].y > CANVAS_HEIGHT - dots[i].r) {
            dots[i].y = CANVAS_HEIGHT - dots[i].r;
            dots[i].vy = -dots[i].vy;
        }
    }
}

// 计算两个小球距离
function distance(dot1, dot2) {
    return Math.sqrt(Math.pow((dot1.x - dot2.x), 2) + Math.pow((dot1.y - dot2.y), 2));
}
