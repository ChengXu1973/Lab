// 常量
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_LEFT = 30;
var MARGIN_TOP = 60;
//当前时间
var hour, min, sec;
var oldHour = 0,
    oldMin = 0,
    oldSec = 0;
// 小球
var balls = [];
var colors = ["#33B5E5", "#09C", "#A6C", "#93C", "#9C0", "#690", "#FB3", "#F80", "#F44", "#C00"];

window.onload = function() {
    // 自适应
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);

    // 初始化
    var canvas = document.getElementById("canvas");
    canvas.height = WINDOW_HEIGHT;
    canvas.width = WINDOW_WIDTH;
    var context = canvas.getContext("2d");
    // 每50ms秒绘制一次当前时间
    setInterval(function() {
        update();
        render(context, hour, min, sec);
    }, 50);
}

// 数据更新
function update() {
    var rightNow = new Date();
    hour = rightNow.getHours();
    min = rightNow.getMinutes();
    sec = rightNow.getSeconds();
    if (oldSec !== sec) { //时间发生变化
        if (parseInt(oldHour / 10) != parseInt(hour / 10)) {
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(hour / 10));
        }
        if (parseInt(oldHour % 10) != parseInt(hour % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hour % 10));
        }
        if (parseInt(oldMin / 10) != parseInt(min / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(min / 10));
        }
        if (parseInt(oldMin % 10) != parseInt(min % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(min % 10));
        }
        if (parseInt(oldSec / 10) != parseInt(sec / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(sec / 10));
        }
        if (parseInt(oldSec % 10) != parseInt(sec % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(sec % 10));
        }
        oldHour = hour;
        oldMin = min;
        oldSec = sec;
    }
    updateBalls();
}
// 添加小球函数
function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                var oneBall = {
                    x: x + 2 * (RADIUS + 1) * j + (RADIUS + 1),
                    y: y + 2 * (RADIUS + 1) * i + (RADIUS + 1),
                    g: 1.5 + Math.random(), // 1.5——2.5
                    vx: Math.pow(-1, Math.ceil(Math.random() * 100)) * 4, // 正负4
                    vy: -5,
                    color: colors[parseInt(Math.random() * colors.length + 1)]
                };
                balls.push(oneBall);
            }
        }
    }
}
// 更新小球状态
function updateBalls() {
    // 计算小球当前位置速度信息
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.7;
        }
    }
    // 将离开画布的小球从balls中删除
    var count = 0;
    var temp = [];
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
            temp.push(balls[i]);
        }
    }
    balls = temp;
}
// 绘制给定时间
function render(context, hours, minutes, seconds) {
    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), context);
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), context);
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, context);
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), context);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), context);
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, context);
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), context);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), context);
    // 绘制小球
    for (var i = 0; i < balls.length; i++) {
        context.fillStyle = balls[i].color;
        context.beginPath();
        context.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
    }
}
// 绘制每个数字
function renderDigit(x, y, num, context) {
    context.fillStyle = "rgb(0, 102, 153)";
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                context.beginPath();
                context.arc(x + 2 * (RADIUS + 1) * j + (RADIUS + 1), y + 2 * (RADIUS + 1) * i + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                context.fill();
            }
        }
    }
}
