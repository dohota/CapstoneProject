import { CONFIG } from '/static/chess/config.js';
import { HexMath } from '/static/chess/math.js';
//渲染器:负责 canvas 绘图
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
