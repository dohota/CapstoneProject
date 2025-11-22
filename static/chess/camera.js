import { CONFIG } from '/static/chess/config.js';
import { HexMath } from '/static/chess/maths.js';
export class Camera {
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
