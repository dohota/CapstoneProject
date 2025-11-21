/**
 * 六角格战棋核心逻辑
 * 使用轴坐标系 (Axial Coordinates: q, r)
 * s = -q - r
 */
const canvas = document.getElementById('hexCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('statusText');
// 配置参数
const HEX_SIZE = 30;       // 六边形半径
const MAP_RADIUS = 5;      // 地图大小
const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;
const MOVE_RANGE = 2;      // 单位移动距离
// 游戏状态
let map = new Map();       // 存储所有格子 key: "q,r", value: TileObject
let units = [];            // 存储所有单位
let currentPlayer = 1;     // 1 = 红方, 2 = 蓝方
let selectedUnit = null;   // 当前选中的单位
let validMoves = [];       // 当前合法的移动格子坐标
// 基础数学工具
// 将 hex(q,r) 转换为像素 (x,y)
function hexToPixel(q, r) {
    const x = HEX_SIZE * (3/2 * q);
    const y = HEX_SIZE * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return { x: x + CENTER_X, y: y + CENTER_Y };
}
// 将像素 (x,y) 转换为 hex(q,r) - 用于鼠标点击
function pixelToHex(x, y) {
    x -= CENTER_X;
    y -= CENTER_Y;
    const q = (2/3 * x) / HEX_SIZE;
    const r = (-1/3 * x + Math.sqrt(3)/3 * y) / HEX_SIZE;
    return hexRound(q, r);
}
// 坐标四舍五入算法
function hexRound(q, r) {
    let s = -q - r;
    let roundQ = Math.round(q);
    let roundR = Math.round(r);
    let roundS = Math.round(s);
    const qDiff = Math.abs(roundQ - q);
    const rDiff = Math.abs(roundR - r);
    const sDiff = Math.abs(roundS - s);
    if (qDiff > rDiff && qDiff > sDiff) {
        roundQ = -roundR - roundS;
    } else if (rDiff > sDiff) {
        roundR = -roundQ - roundS;
    }
    return { q: roundQ, r: roundR };
}
// 计算两个六角格之间的距离
function getDistance(h1, h2) {
    return (Math.abs(h1.q - h2.q) + Math.abs(h1.q + h1.r - h2.q - h2.r) + Math.abs(h1.r - h2.r)) / 2;
}
// 生成 key 字符串
function getKey(q, r) {
    return `${q},${r}`;
}
//游戏初始化
function initGame() {
    createMap();
    spawnUnits();
    draw();
}
function createMap() {
    // 生成六边形地图
    for (let q = -MAP_RADIUS; q <= MAP_RADIUS; q++) {
        let r1 = Math.max(-MAP_RADIUS, -q - MAP_RADIUS);
        let r2 = Math.min(MAP_RADIUS, -q + MAP_RADIUS);
        for (let r = r1; r <= r2; r++) {
            map.set(getKey(q, r), { q, r, type: 'grass' });
        }
    }
}
function spawnUnits() {
    // 简单的生成逻辑：两边对称
    units.push({ id: 1, owner: 1, q: -4, r: 0, hp: 10 });
    units.push({ id: 2, owner: 1, q: -3, r: -1, hp: 10 });
    units.push({ id: 3, owner: 1, q: -3, r: 1, hp: 10 });

    units.push({ id: 4, owner: 2, q: 4, r: 0, hp: 10 });
    units.push({ id: 5, owner: 2, q: 3, r: -1, hp: 10 });
    units.push({ id: 6, owner: 2, q: 3, r: 1, hp: 10 });
}
//绘图逻辑
function drawHexagon(ctx, x, y, size, color, strokeColor = "#bdc3c7", lineWidth = 1) {
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
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制地图
    map.forEach(tile => {
        const pos = hexToPixel(tile.q, tile.r);
        let color = "#ffffff"; // 默认白色
        // 如果是有效移动范围，高亮绿色
        const isMoveTarget = validMoves.some(m => m.q === tile.q && m.r === tile.r);
        if (isMoveTarget) {
            color = "#a9dfbf"; // 绿色高亮
        }
        drawHexagon(ctx, pos.x, pos.y, HEX_SIZE - 1, color);
        // 调试：显示坐标
        // ctx.fillStyle = "#ccc";
        // ctx.font = "10px Arial";
        // ctx.fillText(`${tile.q},${tile.r}`, pos.x - 10, pos.y);
    });
    // 绘制选中单位的高亮圈
    if (selectedUnit) {
        const pos = hexToPixel(selectedUnit.q, selectedUnit.r);
        drawHexagon(ctx, pos.x, pos.y, HEX_SIZE + 2, "rgba(241, 196, 15, 0.5)", "gold", 3);
    }
    // 绘制单位
    units.forEach(unit => {
        const pos = hexToPixel(unit.q, unit.r);
        const color = unit.owner === 1 ? "#e74c3c" : "#3498db";
        // 绘制圆形代表单位
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, HEX_SIZE * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        // 绘制血条
        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(pos.x - 10, pos.y + 10, 20, 4);
    });
}

//交互逻辑
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 计算点击了哪个格子
    const hex = pixelToHex(mouseX, mouseY);

    // 检查点击是否在地图内
    if (!map.has(getKey(hex.q, hex.r))) return;

    handleHexClick(hex);
});

function handleHexClick(hex) {
    // 1. 检查是否点击了单位
    const clickedUnit = units.find(u => u.q === hex.q && u.r === hex.r);

    // 如果点击的是当前玩家的单位 -> 选中
    if (clickedUnit && clickedUnit.owner === currentPlayer) {
        selectedUnit = clickedUnit;
        calculateValidMoves(clickedUnit);
        draw();
        return;
    }

    // 2. 如果已经选中了单位，且点击的是空地 -> 尝试移动
    if (selectedUnit && !clickedUnit) {
        // 检查移动是否合法（在 validMoves 列表中）
        const isValid = validMoves.some(m => m.q === hex.q && m.r === hex.r);

        if (isValid) {
            moveUnit(selectedUnit, hex);
        } else {
            // 点击了非法区域，取消选中
            selectedUnit = null;
            validMoves = [];
            draw();
        }
    }
}

function calculateValidMoves(unit) {
    validMoves = [];
    map.forEach(tile => {
        // 1. 距离检查
        const dist = getDistance(unit, tile);
        if (dist <= MOVE_RANGE && dist > 0) {
            // 2. 阻挡检查：目标格子不能有其他单位
            const isOccupied = units.some(u => u.q === tile.q && u.r === tile.r);
            if (!isOccupied) {
                validMoves.push(tile);
            }
        }
    });
}

function moveUnit(unit, targetHex) {
    // 更新坐标
    unit.q = targetHex.q;
    unit.r = targetHex.r;
    // 重置状态
    selectedUnit = null;
    validMoves = [];

    // 切换回合
    switchTurn();
    draw();
}
function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    statusText.textContent = `当前回合: 玩家 ${currentPlayer} (${currentPlayer === 1 ? '红方' : '蓝方'})`;
    statusText.className = `status player-${currentPlayer}`;
}
initGame();
