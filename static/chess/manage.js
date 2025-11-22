const CONFIG = {
    HEX_SIZE: 40,
    MAP_RADIUS: 50,
    MOVE_RANGE: 3,
    DRAG_THRESHOLD: 5,
    COLORS: {
        P1: "#e74c3c",
        P2: "#3498db",
        HIGHLIGHT: "rgba(241, 196, 15, 0.4)",
        MOVE_HINT: "#16a085",
        BG: "#222",
        TILE: "#34495e",
        TILE_STROKE: "#2c3e50"
    }
};
/* 静态方法，无需实例化.
负责所有数学计算（坐标转换、距离计算）*/
class HexMath {
    static getKey(q, r) {
        return `${q},${r}`;
    }
    static hexToWorld(q, r) {
        const x = CONFIG.HEX_SIZE * (3/2 * q);
        const y = CONFIG.HEX_SIZE * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
        return { x, y };
    }
    static hexRound(q, r) {
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
    static getDistance(h1, h2) {
        return (Math.abs(h1.q - h2.q) + Math.abs(h1.q + h1.r - h2.q - h2.r) + Math.abs(h1.r - h2.r)) / 2;
    }
}
class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
    }
    resize(w, h) {
        this.width = w;
        this.height = h;
    }
    // 世界坐标 -> 屏幕坐标
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x + this.width / 2,
            y: worldY - this.y + this.height / 2
        };
    }
    // 屏幕坐标 -> Hex网格坐标
    screenToHex(screenX, screenY) {
        const worldX = screenX - this.width / 2 + this.x;
        const worldY = screenY - this.height / 2 + this.y;

        const q = (2/3 * worldX) / CONFIG.HEX_SIZE;
        const r = (-1/3 * worldX + Math.sqrt(3)/3 * worldY) / CONFIG.HEX_SIZE;
        return HexMath.hexRound(q, r);
    }
    // 移动摄像机
    pan(dx, dy) {
        this.x -= dx;
        this.y -= dy;
    }
}
//输入系统: 处理鼠标交互，区分拖拽和点击
class InputSystem {
    constructor(canvas, camera, onClickCallback) {
        this.canvas = canvas;
        this.camera = camera;
        this.onClick = onClickCallback;
        this.state = {
            isDragging: false,
            hasMoved: false,
            startX: 0,
            startY: 0
        };
        this.bindEvents();
    }
    bindEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => this.onMouseLeave());
    }
    onMouseDown(e) {
        this.state.isDragging = true;
        this.state.hasMoved = false;
        this.state.startX = e.clientX;
        this.state.startY = e.clientY;
        this.canvas.style.cursor = 'grabbing';
    }
    onMouseMove(e) {
        if (!this.state.isDragging) return;
        const dx = e.clientX - this.state.startX;
        const dy = e.clientY - this.state.startY;
        // 检测是否达到拖拽阈值
        if (Math.abs(dx) > CONFIG.DRAG_THRESHOLD || Math.abs(dy) > CONFIG.DRAG_THRESHOLD) {
            this.state.hasMoved = true;
        }
        // 移动摄像机
        this.camera.pan(dx, dy);
        // 更新起始点，避免累积误差
        this.state.startX = e.clientX;
        this.state.startY = e.clientY;
    }
    onMouseUp(e) {
        this.state.isDragging = false;
        this.canvas.style.cursor = 'default';
        if (!this.state.hasMoved) {
            // 触发点击回调
            const hex = this.camera.screenToHex(e.clientX, e.clientY);
            this.onClick(hex);
        }
    }
    onMouseLeave() {
        this.state.isDragging = false;
    }
}
//渲染器:负责 canvas 绘图
class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.debugInfo = document.getElementById('debug-info');
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawHexagon(x, y, size, color, strokeColor, lineWidth = 1) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle_deg = 60 * i;
            const angle_rad = Math.PI / 180 * angle_deg;
            this.ctx.lineTo(x + size * Math.cos(angle_rad), y + size * Math.sin(angle_rad));
        }
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
    }
    drawUnit(x, y, owner) {
        const color = owner === 1 ? CONFIG.COLORS.P1 : CONFIG.COLORS.P2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, CONFIG.HEX_SIZE * 0.6, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#fff";
        this.ctx.stroke();
        // 血条
        this.ctx.fillStyle = "#222";
        this.ctx.fillRect(x - 15, y + 10, 30, 6);
        this.ctx.fillStyle = "#2ecc71";
        this.ctx.fillRect(x - 14, y + 11, 28, 4);
    }
    render(game, camera) {
        this.clear();
        // 视锥剔除边界
        const padding = CONFIG.HEX_SIZE * 2;
        const viewBounds = {
            left: -padding,
            top: -padding,
            right: this.canvas.width + padding,
            bottom: this.canvas.height + padding
        };
        let renderedCount = 0;
        // 绘制地图
        game.map.forEach(tile => {
            const worldPos = HexMath.hexToWorld(tile.q, tile.r);
            const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);
            // Culling 剔除
            if (screenPos.x < viewBounds.left || screenPos.x > viewBounds.right ||
                screenPos.y < viewBounds.top || screenPos.y > viewBounds.bottom) {
                return;
            }
            renderedCount++;
            let color = CONFIG.COLORS.TILE;
            // 检查是否为有效移动范围
            const isMoveTarget = game.validMoves.some(m => m.q === tile.q && m.r === tile.r);
            if (isMoveTarget) color = CONFIG.COLORS.MOVE_HINT;
            this.drawHexagon(screenPos.x, screenPos.y, CONFIG.HEX_SIZE - 2, color, CONFIG.COLORS.TILE_STROKE);
        });
        // 绘制选中框
        if (game.selectedUnit) {
            const wPos = HexMath.hexToWorld(game.selectedUnit.q, game.selectedUnit.r);
            const sPos = camera.worldToScreen(wPos.x, wPos.y);
            // 简单检查是否在屏幕内
            if (sPos.x > viewBounds.left && sPos.x < viewBounds.right) {
                this.drawHexagon(sPos.x, sPos.y, CONFIG.HEX_SIZE + 2, CONFIG.COLORS.HIGHLIGHT, "gold", 2);
            }
        }
        // 绘制单位
        game.units.forEach(unit => {
            const wPos = HexMath.hexToWorld(unit.q, unit.r);
            const sPos = camera.worldToScreen(wPos.x, wPos.y);
            if (sPos.x < viewBounds.left || sPos.x > viewBounds.right ||
                sPos.y < viewBounds.top || sPos.y > viewBounds.bottom) return;
            this.drawUnit(sPos.x, sPos.y, unit.owner);
        });
        // 更新 UI
        this.debugInfo.textContent = `Camera: ${Math.round(camera.x)}, ${Math.round(camera.y)} | Tiles: ${renderedCount}`;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.turnText = document.getElementById('turn-text');
        // 游戏数据
        this.map = new Map();
        this.units = [];
        this.currentPlayer = 1;
        this.selectedUnit = null;
        this.validMoves = [];
        // 核心模块
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.renderer = new Renderer(this.canvas, this.ctx);
        this.input = new InputSystem(this.canvas, this.camera, (hex) => this.handleInput(hex));
        // 窗口调整事件
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.camera.resize(window.innerWidth, window.innerHeight);
            this.draw(); // 强制重绘
        });
        // 初始化
        this.initCanvas();
        this.generateMap();
        this.spawnUnits();
        // 启动循环
        this.loop();
    }
    initCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    generateMap() {
        console.time("MapGen");
        for (let q = -CONFIG.MAP_RADIUS; q <= CONFIG.MAP_RADIUS; q++) {
            let r1 = Math.max(-CONFIG.MAP_RADIUS, -q - CONFIG.MAP_RADIUS);
            let r2 = Math.min(CONFIG.MAP_RADIUS, -q + CONFIG.MAP_RADIUS);
            for (let r = r1; r <= r2; r++) {
                const key = HexMath.getKey(q, r);
                this.map.set(key, { q, r });
            }
        }
        console.timeEnd("MapGen");
    }
    spawnUnits() {
        // 模拟单位数据结构
        const createUnit = (id, owner, q, r) => ({ id, owner, q, r, hp: 100 });
        this.units.push(createUnit(1, 1, -2, 0));
        this.units.push(createUnit(2, 2, 2, 0));
        this.units.push(createUnit(3, 1, -10, 5));
        this.units.push(createUnit(4, 2, 10, -5));
    }
    // 核心交互逻辑
    handleInput(hex) {
        // 检查地图边界
        if (!this.map.has(HexMath.getKey(hex.q, hex.r))) return;
        const clickedUnit = this.units.find(u => u.q === hex.q && u.r === hex.r);
        if (clickedUnit && clickedUnit.owner === this.currentPlayer) {
            // 选中自己人
            this.selectUnit(clickedUnit);
        } else if (this.selectedUnit && !clickedUnit) {
            // 点击空地，尝试移动
            this.tryMove(hex);
        }
    }
    selectUnit(unit) {
        this.selectedUnit = unit;
        this.calculateValidMoves(unit);
    }
    calculateValidMoves(unit) {
        this.validMoves = [];
        this.map.forEach(tile => {
            const dist = HexMath.getDistance(unit, tile);
            if (dist <= CONFIG.MOVE_RANGE && dist > 0) {
                const isOccupied = this.units.some(u => u.q === tile.q && u.r === tile.r);
                if (!isOccupied) {
                    this.validMoves.push(tile);
                }
            }
        });
    }
    tryMove(targetHex) {
        const isValid = this.validMoves.some(m => m.q === targetHex.q && m.r === targetHex.r);
        if (isValid) {
            // 执行移动
            this.selectedUnit.q = targetHex.q;
            this.selectedUnit.r = targetHex.r;
            // 清理状态
            this.selectedUnit = null;
            this.validMoves = [];
            // 切换回合
            this.switchTurn();
        } else {
            // 点击非法区域，取消选中
            this.selectedUnit = null;
            this.validMoves = [];
        }
    }
    switchTurn() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.turnText.textContent = this.currentPlayer === 1 ? "红方回合" : "蓝方回合";
        this.turnText.style.color = this.currentPlayer === 1 ? CONFIG.COLORS.P1 : CONFIG.COLORS.P2;
    }
    // 游戏主循环
    loop() {
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
    draw() {
        this.renderer.render(this, this.camera);
    }
}
// 启动游戏
const game = new Game();
