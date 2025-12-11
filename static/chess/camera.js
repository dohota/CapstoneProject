import { CONFIG } from '/static/chess/config.js';
import { HexMath } from '/static/chess/maths.js';
export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        //缩放属性
        this.zoom = 1.0; 
        this.minZoom = 0.3; // 最远看多远 (缩小)
        this.maxZoom = 2.0; // 最近看多近 (放大)
    }
    resize(w, h) {
        this.width = w;
        this.height = h;
    }
    // 世界坐标 -> 屏幕坐标
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.x)* this.zoom + this.width / 2,
            y: (worldY - this.y)* this.zoom + this.height / 2
        };
    }
    // 屏幕坐标 -> Hex网格坐标 (加入 zoom 除法)
    screenToHex(screenX, screenY) {
        // 逆运算：先减去中心，除以缩放，再加上摄像机位置
        const worldX = (screenX - this.width / 2) / this.zoom + this.x;
        const worldY = (screenY - this.height / 2) / this.zoom + this.y;
        const q = (2/3 * worldX) / CONFIG.HEX_SIZE;
        const r = (-1/3 * worldX + Math.sqrt(3)/3 * worldY) / CONFIG.HEX_SIZE;
        return HexMath.hexRound(q, r);
    }
    pan(dx, dy) {// 移动摄像机
        // 拖拽时，移动速度应该随缩放变化
        // 如果放得很大，拖拽应该变慢，否则会一下飞很远
        this.x -= dx / this.zoom;
        this.y -= dy / this.zoom;
    }
    // --- 新增：处理缩放 ---
    handleZoom(delta, mouseX, mouseY) {
        const zoomSensitivity = 0.001; // 缩放灵敏度
        const newZoom = this.zoom - delta * zoomSensitivity;

        // 限制缩放范围
        const clampedZoom = Math.min(Math.max(newZoom, this.minZoom), this.maxZoom);

        if (clampedZoom === this.zoom) return; // 没变化则退出
        // --- 关键算法：向鼠标位置缩放 ---
        // 1. 计算鼠标当前指向的世界坐标 (缩放前)
        const worldMouseX = (mouseX - this.width / 2) / this.zoom + this.x;
        const worldMouseY = (mouseY - this.height / 2) / this.zoom + this.y;
        // 2. 应用新的缩放
        this.zoom = clampedZoom;
        // 3. 计算新的摄像机位置，使得鼠标指向的世界坐标保持不变
        // newCam = WorldMouse - (ScreenMouse - ScreenCenter) / NewZoom
        this.x = worldMouseX - (mouseX - this.width / 2) / this.zoom;
        this.y = worldMouseY - (mouseY - this.height / 2) / this.zoom;
    }
}
