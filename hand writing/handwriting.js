var canvasWidth = 800;
var canvasHeight = canvasWidth;

// 状态参数
var isMouseDown = false;
var lastLocation = { x: 0, y: 0 };
var recentTime;
var recentLineWidth = 0;
var penColor = "#000";

// 初始化画布
var canvas = document.getElementById("canvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var context = canvas.getContext("2d");

window.onload = function() {
    drawGrid(context);

    // clear button的点击事件
    document.getElementById("clear-btn").onclick = function() {
        drawGrid(context);
    };

    // 初始化颜色选择器
    var links = document.querySelectorAll("#panel>a");
    for (var i = 0; i < links.length; i++) {
        // 设置背景颜色
        links[i].style.background = links[i].innerHTML;
        // 点击link变换笔画颜色并改变当前激活按钮
        links[i].onclick = function() {
            var activeColor = document.querySelectorAll(".active");
            for (var i = 0; i < activeColor.length; i++) {
                activeColor[i].setAttribute("class", "");
            }
            penColor = this.innerHTML;
            this.setAttribute("class", "active")
        }
    }

    // canvas的鼠标事件
    canvas.onmousedown = function(event) {
        event.preventDefault();
        beginStroke(event.offsetX, event.offsetY);
    }
    canvas.onmousemove = function(event) {
        event.preventDefault();
        if (isMouseDown) {
            strokeProcess(event.offsetX, event.offsetY);
        }
    }
    canvas.onmouseup = function(event) {
        event.preventDefault();
        endStroke();
    }
    canvas.onmouseout = function(event) {
        event.preventDefault();
        endStroke();
    }

    // canvas的触控事件
    canvas.addEventListener("touchstart", function(event) {
        event.preventDefault();
        // 获取第一个触控点(默认为多点触控)
        var touch = event.touches[0];
        var canvasBCR = canvas.getBoundingClientRect();
        beginStroke(touch.pageX - canvasBCR.left, touch.pageY - canvasBCR.top);
    });
    canvas.addEventListener("touchmove", function(event) {
        event.preventDefault();
        var touch = event.touches[0];
        if (isMouseDown) {
            var canvasBCR = canvas.getBoundingClientRect();
            strokeProcess(touch.pageX - canvasBCR.left, touch.pageY - canvasBCR.top);
        }
    });
    canvas.addEventListener("touchend", function(event) {
        event.preventDefault();
        endStroke();
    });
}

// 触发绘制事件
function beginStroke(x, y) {
    isMouseDown = true;
    lastLocation = getMousePosition(x, y, canvas);
    recentTime = new Date().getTime();
}

// 绘制进程
function strokeProcess(x, y) {
    // 获取当前绘制信息
    var currentLocation = getMousePosition(x, y, canvas);
    var currentTime = new Date().getTime();
    var time = currentTime - recentTime;
    var lineWidth = getLineWidth(currentLocation, time);
    // 进行绘制
    draw(context, currentLocation, penColor, lineWidth);
    // 更新数据
    lastLocation = currentLocation;
    recentTime = currentTime;
    recentLineWidth = lineWidth;
}

// 绘制结束
function endStroke() {
    isMouseDown = false;
}

// 计算笔画粗细
function getLineWidth(currentLocation, time) {
    var minLineWidth = 10;
    var maxLineWidth = 34;
    var transitionPara = 24;
    var soomthPara = 0.6;
    var lineWidth = distance(currentLocation.x, currentLocation.y, lastLocation.x, lastLocation.y) / time;
    lineWidth = minLineWidth + transitionPara / lineWidth;
    lineWidth = lineWidth > maxLineWidth ? maxLineWidth : lineWidth;
    lineWidth = (1 - soomthPara) * recentLineWidth + soomthPara * lineWidth;
    return lineWidth;
}

// 绘制笔画
function draw(ctx, currentLocation, color, lineWidth) {
    // 状态设置
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    // 连接两点的直线
    ctx.beginPath();
    ctx.moveTo(lastLocation.x, lastLocation.y);
    ctx.lineTo(currentLocation.x, currentLocation.y);
    ctx.stroke();
}

// 两点间距离公式
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

// 获取鼠标当前位置
function getMousePosition(x, y, canvas) {
    // 获取画布显示宽度
    var canvasCssWidth = canvas.offsetWidth;
    var canvasCssHeight = canvas.offsetHeight;
    // 获取鼠标在画布内的像素位置
    x = x * canvas.width / canvasCssWidth;
    y = y * canvas.height / canvasCssHeight;
    // 浮点数四舍五入
    x = Math.round(x);
    y = Math.round(y);
    return {
        x: x,
        y: y
    };
}

// 绘制米字格
function drawGrid(ctx) {
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = "rgb(230,11,9)";
    // 绘制边框路径
    ctx.beginPath();
    ctx.moveTo(3, 3);
    ctx.lineTo(canvasWidth - 3, 3);
    ctx.lineTo(canvasWidth - 3, canvasHeight - 3);
    ctx.lineTo(3, canvasHeight - 3);
    ctx.closePath();
    // 绘制边框
    ctx.lineWidth = 6;
    ctx.stroke();
    // 绘制米字路径
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.moveTo(canvasWidth, 0);
    ctx.lineTo(0, canvasHeight);
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    // 绘制米字
    if (ctx.setLineDash) {
        ctx.setLineDash([20, 10]);
    }
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}
