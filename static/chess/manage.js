import { CONFIG } from '/static/chess/config.js';
import { HexMath } from '/static/chess/math.js';
import { Camera } from '/static/chess/camera.js';
import { InputSystem } from '/static/chess/input.js';
import { Renderer } from '/static/chess/render.js';
import { Warrior, Rider, Archer } from '/static/chess/unit.js';
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');//canvas画板
        this.ctx = this.canvas.getContext('2d');
        this.turnText = document.getElementById('turn-text');//显示是哪一方的回合

        this.map = new Map();
        this.units = [];
        this.currentPlayer = 1;
        this.selectedUnit = null;
        this.validMoves = [];

        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.renderer = new Renderer(this.canvas, this.ctx);
        this.input = new InputSystem(this.canvas, this.camera, (hex) => this.handleInput(hex));
        // 窗口调整事件
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.camera.resize(window.innerWidth, window.innerHeight);
            this.renderer.render(this, this.camera);// 强制重绘
        });
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;// 初始化Canvas
        this.initMap()
        this.initUnit()
    }
    initMap(){
        console.time("MapGen");
        for (let q = -CONFIG.MAP_RADIUS; q <= CONFIG.MAP_RADIUS; q++) {
            let r1 = Math.max(-CONFIG.MAP_RADIUS, -q - CONFIG.MAP_RADIUS);
            let r2 = Math.min(CONFIG.MAP_RADIUS, -q + CONFIG.MAP_RADIUS);
            for (let r = r1; r <= r2; r++) {
                const key = HexMath.getKey(q, r);
                this.map.set(key, { q, r });
            }
        }
        console.timeEnd("MapGen");//计算画地图花了多少时间，一般2-3ms
    }
    initUnit(){
        this.units.push(new Warrior(0, -7, 2));
        this.units.push(new Warrior(-1, -3, 2));
        this.units.push(new Warrior(-1, -4, 1));
        // let r = HexMath.getRandomInt(1, 25);
        // if (r <= 7){//严格相等,值 和 类型 都相等，无隐式类型转换
        //     //for (let q = 1; q <= 3; q++){
        //     this.units.push(new Warrior(r-15, r-10, 1));
        //     this.units.push(new Warrior(r-15, r-7, 2));
        //     //}
        // }else if(r >19){
        //     this.units.push(new Archer(r-5, r-9, 1));
        // }else{
        //     this.units.push(new Rider(r-13, r-11, 2));
        // }
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
    // 修改：读取单位moveRange
    calculateValidMoves(unit) {
        this.validMoves = [];
        this.map.forEach(tile => {
            const dist = HexMath.getDistance(unit, tile);
            // 关键修改：这里不再用全局 CONFIG.MOVE_RANGE，而是用 unit.moveRange
            if (dist <= unit.moveRange && dist > 0) {
                const isOccupied = this.units.some(u => u.q === tile.q && u.r === tile.r);
                if (!isOccupied) this.validMoves.push(tile);
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
    loop() {
        this.renderer.render(this, this.camera);
        requestAnimationFrame(() => this.loop());
    }
}
const game = new Game();
game.loop() // 游戏主循环
