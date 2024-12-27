
function drawCircle(ctx, x, y, r, color="black") {
    let tempFillStyle = ctx.fillStyle;
    let tempStrokeStyle = ctx.strokeStyle;
    let tempSize = ctx.lineWidth;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = tempFillStyle;
    ctx.strokeStyle = tempStrokeStyle;
    ctx.lineWidth = tempSize;
}

function drawLine(ctx, x, y, length, angle=0, size=2, color="black"){
    let tempColor = ctx.strokeStyle;
    let tempSize = ctx.lineWidth;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    let x2 = x + length * Math.cos(angle);
    let y2 = y - length * Math.sin(angle);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = tempColor;
    ctx.lineWidth = tempSize;
    return [x2, y2];
}

function movePen(x, y, length, angle=0) {
    let x2 = x + length * Math.cos(angle);
    let y2 = y - length * Math.sin(angle);
    return [x2, y2];
}
