const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const turnText = document.getElementById('turn-text');
const debugText = document.getElementById('debug-info');

const HEX_SIZE = 40;       // 格子更大一点
const MAP_RADIUS = 50;     // 这是一个巨大的地图！(直径 101 格)
const MOVE_RANGE = 3;
// 游戏状态
// 摄像机位置 (代表世界坐标中心点)
const camera = { x: 0, y: 0 };
let map = new Map();
let units = [];
let currentPlayer = 1;
let selectedUnit = null;
let validMoves = [];
//鼠标输入状态
const input = {
    isDragging: false,
    startX: 0,
    startY: 0,
    camStartX: 0,
    camStartY: 0,
    dragThreshold: 5, // 移动超过5像素视为拖拽，否则视为点击
    hasMoved: false
};
// 坐标转换系统
//六角网格坐标 (q,r) -> 世界像素坐标 (WorldX, WorldY)
function hexToWorld(q, r) {
    const x = HEX_SIZE * (3/2 * q);
    const y = HEX_SIZE * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return { x, y };
}
//世界像素坐标 -> 屏幕渲染坐标
function worldToScreen(wx, wy) {
    return {
        x: wx - camera.x + canvas.width / 2,
        y: wy - camera.y + canvas.height / 2
    };
}
//屏幕坐标 (鼠标) -> 六角网格坐标 (q,r)
function screenToHex(screenX, screenY) {
    // 转回世界坐标
    const worldX = screenX - canvas.width / 2 + camera.x;
    const worldY = screenY - canvas.height / 2 + camera.y;
    //世界坐标转 Hex
    const q = (2/3 * worldX) / HEX_SIZE;
    const r = (-1/3 * worldX + Math.sqrt(3)/3 * worldY) / HEX_SIZE;
    return hexRound(q, r);
}
// 四舍五入算法
function hexRound(q, r) {
    let s = -q - r;
    let roundQ = Math.round(q);
    let roundR = Math.round(r);
    let roundS = Math.round(s);
    const qDiff = Math.abs(roundQ - q);
    const rDiff = Math.abs(roundR - r);
    const sDiff = Math.abs(roundS - s);
    if (qDiff > rDiff && qDiff > sDiff) roundQ = -roundR - roundS;
    else if (rDiff > sDiff) roundR = -roundQ - roundS;
    return { q: roundQ, r: roundR };
}
function getKey(q, r) { return `${q},${r}`; }
function getDistance(h1, h2) {
    return (Math.abs(h1.q - h2.q) + Math.abs(h1.q + h1.r - h2.q - h2.r) + Math.abs(h1.r - h2.r)) / 2;
}
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw(); // 重绘
}
function generateMap() {
    console.time("MapGen");
    for (let q = -MAP_RADIUS; q <= MAP_RADIUS; q++) {
        let r1 = Math.max(-MAP_RADIUS, -q - MAP_RADIUS);
        let r2 = Math.min(MAP_RADIUS, -q + MAP_RADIUS);
        for (let r = r1; r <= r2; r++) {
            map.set(getKey(q, r), { q, r });
        }
    }
    console.timeEnd("MapGen");
}
function spawnUnits() {
    // 在中心生成一些
    units.push({ id: 1, owner: 1, q: -2, r: 0 });
    units.push({ id: 2, owner: 2, q: 2, r: 0 });

    // 在很远的地方生成一些，测试大地图移动
    units.push({ id: 3, owner: 1, q: -10, r: 5 });
    units.push({ id: 4, owner: 2, q: 10, r: -5 });
}
// 渲染循环 (Render Loop)
function loop() {
    draw();
    requestAnimationFrame(loop);
}
function draw() {
    // 清空屏幕
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // --- 优化核心：视锥剔除 (Culling) ---
    // 我们需要判断一个格子是否在屏幕范围内，如果在屏幕外，就不画它。
    // 为了简单，我们给屏幕加一个 padding 缓冲
    const viewPadding = HEX_SIZE * 2;
    const viewLeft = -viewPadding;
    const viewTop = -viewPadding;
    const viewRight = canvas.width + viewPadding;
    const viewBottom = canvas.height + viewPadding;
    let renderedTiles = 0;
    //绘制地图
    map.forEach(tile => {
        // 获取世界坐标
        const worldPos = hexToWorld(tile.q, tile.r);
        // 转换为屏幕坐标
        const screenPos = worldToScreen(worldPos.x, worldPos.y);

        // !! 视锥剔除检查 !!
        if (screenPos.x < viewLeft || screenPos.x > viewRight ||
            screenPos.y < viewTop || screenPos.y > viewBottom) {
            return; // 跳过绘制
        }
        renderedTiles++;
        // 确定颜色
        let color = "#34495e"; // 默认地块颜色
        let stroke = "#2c3e50";
        // 高亮移动范围
        const isMoveTarget = validMoves.some(m => m.q === tile.q && m.r === tile.r);
        if (isMoveTarget) {
            color = "#16a085"; // 绿色
        }
        drawHexagon(screenPos.x, screenPos.y, HEX_SIZE - 2, color, stroke);
        // 调试：显示坐标 (仅在缩放合适时显示，防止密集恐惧症)
        // ctx.fillStyle = "rgba(255,255,255,0.1)";
        // ctx.fillText(`${tile.q},${tile.r}`, screenPos.x - 10, screenPos.y);
    });
    //绘制选中高亮
    if (selectedUnit) {
        const wPos = hexToWorld(selectedUnit.q, selectedUnit.r);
        const sPos = worldToScreen(wPos.x, wPos.y);
        // 简单检查是否在屏幕内
        if (sPos.x > viewLeft && sPos.x < viewRight && sPos.y > viewTop && sPos.y < viewBottom) {
            drawHexagon(sPos.x, sPos.y, HEX_SIZE + 2, "rgba(241, 196, 15, 0.4)", "gold", 2);
        }
    }
    //绘制单位
    units.forEach(unit => {
        const wPos = hexToWorld(unit.q, unit.r);
        const sPos = worldToScreen(wPos.x, wPos.y);
        // 剔除
        if (sPos.x < viewLeft || sPos.x > viewRight || sPos.y < viewTop || sPos.y > viewBottom) return;
        const color = unit.owner === 1 ? "#e74c3c" : "#3498db";
        ctx.beginPath();
        ctx.arc(sPos.x, sPos.y, HEX_SIZE * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        // 血条背景
        ctx.fillStyle = "#222";
        ctx.fillRect(sPos.x - 15, sPos.y + 10, 30, 6);
        // 血量
        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(sPos.x - 14, sPos.y + 11, 28, 4);
    });
    // 更新 UI 调试信息
    debugText.textContent = `Camera: ${Math.round(camera.x)}, ${Math.round(camera.y)} | Rendered: ${renderedTiles} tiles`;
}
function drawHexagon(x, y, size, color, strokeColor, lineWidth = 1) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i;
        const angle_rad = Math.PI / 180 * angle_deg;
        ctx.lineTo(x + size * Math.cos(angle_rad), y + size * Math.sin(angle_rad));
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}
// 输入处理 (Input Handling)
// 鼠标按下：开始记录
canvas.addEventListener('mousedown', e => {
    input.isDragging = true;
    input.hasMoved = false; // 重置移动标记
    input.startX = e.clientX;
    input.startY = e.clientY;
    input.camStartX = camera.x;
    input.camStartY = camera.y;
    canvas.style.cursor = 'grabbing';
});
// 鼠标移动：如果是拖拽模式，更新摄像机
canvas.addEventListener('mousemove', e => {
    if (!input.isDragging) return;
    const dx = e.clientX - input.startX;
    const dy = e.clientY - input.startY;
    // 判断是否超过了“点击抖动”的阈值
    if (Math.abs(dx) > input.dragThreshold || Math.abs(dy) > input.dragThreshold) {
        input.hasMoved = true;
    }
    // 摄像机移动方向与鼠标相反（类似拖拽地图）
    camera.x = input.camStartX - dx;
    camera.y = input.camStartY - dy;
});
// 鼠标松开：判断是 拖拽结束 还是 点击事件
canvas.addEventListener('mouseup', e => {
    input.isDragging = false;
    canvas.style.cursor = 'default';
    if (!input.hasMoved) {
        // 如果没怎么移动，说明是【点击】
        const hex = screenToHex(e.clientX, e.clientY);
        if (map.has(getKey(hex.q, hex.r))) {
            handleGameClick(hex);
        }
    }
});
// 鼠标离开窗口
canvas.addEventListener('mouseleave', () => {
    input.isDragging = false;
});
// 游戏点击逻辑 (与之前相同)
function handleGameClick(hex) {
    const clickedUnit = units.find(u => u.q === hex.q && u.r === hex.r);
    if (clickedUnit && clickedUnit.owner === currentPlayer) {
        selectedUnit = clickedUnit;
        calculateValidMoves(clickedUnit);
    } else if (selectedUnit && !clickedUnit) {
        const isValid = validMoves.some(m => m.q === hex.q && m.r === hex.r);
        if (isValid) {
            // 移动单位
            selectedUnit.q = hex.q;
            selectedUnit.r = hex.r;
            selectedUnit = null;
            validMoves = [];
            // 换人
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            turnText.textContent = currentPlayer === 1 ? "红方回合" : "蓝方回合";
            turnText.style.color = currentPlayer === 1 ? "#e74c3c" : "#3498db";
        } else {
            selectedUnit = null;
            validMoves = [];
        }
    }
}
function calculateValidMoves(unit) {
    validMoves = [];
    map.forEach(tile => {
        const dist = getDistance(unit, tile);
        if (dist <= MOVE_RANGE && dist > 0) {
            const isOccupied = units.some(u => u.q === tile.q && u.r === tile.r);
            if (!isOccupied) validMoves.push(tile);
        }
    });
}

// 设置 Canvas 全屏
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
// 生成地图
generateMap();
spawnUnits();
// 启动循环
requestAnimationFrame(loop);
