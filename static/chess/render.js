import { CONFIG } from '/static/chess/config.js';
import { HexMath } from '/static/chess/maths.js';

export class Renderer {
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
        // if (zoom > 0.8) { // 如果太小了就不显示字了，省得糊成一团
        //     this.ctx.fillStyle = "black";
        //     this.ctx.font = `bold ${8 * zoom}px Arial`;
        //     this.h = 100;
        //     this.ctx.fillText(`${x} - ${y} - ${h}`, x, y);
        // }
    }
    drawUnit(x, y, unit,zoom) {
        // 根据 unit.color 决定身体颜色：由兵种决定
        // 根据 unit.owner 决定描边颜色,即阵营边框，目前就是(Red vs Blue)
        const teamColor = unit.owner === 1 ? CONFIG.COLORS.P1 : CONFIG.COLORS.P2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, CONFIG.HEX_SIZE * 0.6 * zoom, 0, Math.PI * 2);//单位大小随 Zoom 变化

        this.ctx.fillStyle = unit.color; // 兵种色
        this.ctx.fill();

        this.ctx.lineWidth = 4 * zoom;          // 边框加粗方便分辨敌我.边框也随比例缩放一点，不然太粗/太细
        this.ctx.strokeStyle = teamColor; // 阵营色
        this.ctx.stroke(); 
        if (zoom > 0.6) { // 如果太小了就不显示字了，省得糊成一团
            this.ctx.fillStyle = "white";
            this.ctx.font = `bold ${14 * zoom}px Arial`;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(unit.name[0], x, y);// 取名字的第一个字
        }
    }
    render(game, camera) {
        this.clear();
        //console.log(camera.zoom);
        // 视锥剔除边界
        // Culling 边界需要考虑缩放后的 HEX 大小
        // 实际上因为 worldToScreen 已经处理了 zoom，这里的 padding 用 constant 即可，
        // 但为了安全，稍微加大一点 padding
        const padding = CONFIG.HEX_SIZE * 2 * camera.zoom;
        const viewBounds = {
            left: -padding,
            top: -padding,
            right: this.canvas.width + padding,
            bottom: this.canvas.height + padding
        };
        
        // --- 缓存缩放后的格子大小，避免循环里重复计算 ---
        const hexRadius = (CONFIG.HEX_SIZE - 2) * camera.zoom;
        const selectRadius = (CONFIG.HEX_SIZE + 2) * camera.zoom;
        let renderedCount = 0;

        game.map.forEach(tile => {// 绘制地图
            const worldPos = HexMath.hexToWorld(tile.q, tile.r);
            const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);
            // Culling 剔除
            if (screenPos.x < viewBounds.left || screenPos.x > viewBounds.right ||
                screenPos.y < viewBounds.top || screenPos.y > viewBounds.bottom) return;
            renderedCount++;//渲染多少个格子
            let color = CONFIG.COLORS.TILE;
            // 检查是否为有效移动范围
            if (game.validMoves.some(m => m.q === tile.q && m.r === tile.r)) color = CONFIG.COLORS.MOVE_HINT;
            this.drawHexagon(screenPos.x, screenPos.y, hexRadius, color, CONFIG.COLORS.TILE_STROKE);
        });
        if (game.selectedUnit) {//绘制选中框
            const wPos = HexMath.hexToWorld(game.selectedUnit.q, game.selectedUnit.r);
            const sPos = camera.worldToScreen(wPos.x, wPos.y);
            // 检查是否在屏幕内
            if (sPos.x > viewBounds.left && sPos.x < viewBounds.right) {
                this.drawHexagon(sPos.x, sPos.y, selectRadius, CONFIG.COLORS.HIGHLIGHT, "gold", 2);
            }
        }
        game.units.forEach(unit => {//绘制单位
            const wPos = HexMath.hexToWorld(unit.q, unit.r);
            const sPos = camera.worldToScreen(wPos.x, wPos.y);
            // 简单的屏幕外剔除
            if (sPos.x < viewBounds.left || sPos.x > viewBounds.right ||
                sPos.y < viewBounds.top || sPos.y > viewBounds.bottom) return;
            this.drawUnit(sPos.x, sPos.y, unit, camera.zoom);
        });
        if(this.debugInfo) {// 更新 UI
            // 显示一下当前的 Zoom 倍率
            this.debugInfo.textContent =
             `Cam: ${Math.round(camera.x)},${Math.round(camera.y)} | Zoom: ${camera.zoom.toFixed(2)}`;
        }
    }
}
