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
        this.minZoom = 0.1; // 最远看多远 (缩小)
        this.maxZoom = 3.0; // 最近看多近 (放大)
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
    // handleZoom(delta, mouseX, mouseY) {
    //     console.log(`[Zoom] 滚轮输入 delta: ${delta}, 当前 Zoom: ${this.zoom}`);
    //     // 1. 计算缩放因子 (Scale Factor)
    //     // 滚轮向下(delta > 0) -> 变小 (0.9); 滚轮向上(delta < 0) -> 变大 (1.1)
    //     // Math.sign(delta) 只有 1, -1 或 0。
    //     // 如果是普通鼠标，delta 通常是 100/-100；如果是触摸板，可能是 1/-1。
    //     // 这里做一个归一化处理，防止某些鼠标滚得太快。
    //     const direction = Math.sign(delta); // 1 (缩小) 或 -1 (放大)
    //     if (direction === 0) return;

    //     const factor = 0.1; // 每次滚动的缩放比例 (10%)
    //     // 如果是缩小 (direction > 0)，我们乘以 (1 - factor) = 0.9
    //     // 如果是放大 (direction < 0)，我们乘以 (1 + factor) = 1.1
    //     // 注意 deltaY > 0 是滚轮向下（通常意图是缩小）
        
    //     let scaleChange = 1;
    //     if (delta > 0) {
    //         scaleChange = 1 - factor; // 0.9
    //     } else {
    //         scaleChange = 1 + factor; // 1.1
    //     }

    //     const newZoom = this.zoom * scaleChange;

    //     // 2. 限制缩放范围
    //     const clampedZoom = Math.min(Math.max(newZoom, this.minZoom), this.maxZoom);
        
    //     console.log(`[Zoom] 计算后 newZoom: ${newZoom}`);

    //     // 3. 计算以鼠标为中心的缩放
    //     // 核心原理：鼠标在世界坐标中的位置，在缩放前后应该保持不变
        
    //     // 缩放前：鼠标在世界的位置
    //     const worldMouseX = (mouseX - this.width / 2) / this.zoom + this.x;
    //     const worldMouseY = (mouseY - this.height / 2) / this.zoom + this.y;

    //     // 应用新缩放
    //     this.zoom = clampedZoom;

    //     // 缩放后：反推摄像机应该在哪里，才能让鼠标对准刚才那个世界坐标
    //     this.x = worldMouseX - (mouseX - this.width / 2) / this.zoom;
    //     this.y = worldMouseY - (mouseY - this.height / 2) / this.zoom;
    // }
    // --- 调试版 handleZoom ---
    handleZoom(delta, mouseX, mouseY) {
        // 1. 打印原始输入
        console.log(`[Zoom] 滚轮输入 delta: ${delta}, 当前 Zoom: ${this.zoom}`);

        // 2. 确定方向
        // delta > 0 是向下滚（缩小），delta < 0 是向上滚（放大）
        const direction = delta > 0 ? -1 : 1; 
        
        // 3. 计算倍率
        const factor = 0.1; 
        let scaleChange = 1 + (direction * factor); // 1.1 或 0.9

        // 4. 计算预期的新 Zoom
        let newZoom = this.zoom * scaleChange;
        
        // 5. 限制范围
        newZoom = Math.max(this.minZoom, Math.min(newZoom, this.maxZoom));
        
        console.log(`[Zoom] 计算后 newZoom: ${newZoom}`);

        if (newZoom === this.zoom) {
            console.warn("[Zoom] 缩放被卡住了！可能是达到了最大/最小限制。");
            return;
        }

        // 6. 执行缩放位移计算
        const worldMouseX = (mouseX - this.width / 2) / this.zoom + this.x;
        const worldMouseY = (mouseY - this.height / 2) / this.zoom + this.y;

        this.zoom = newZoom;

        this.x = worldMouseX - (mouseX - this.width / 2) / this.zoom;
        this.y = worldMouseY - (mouseY - this.height / 2) / this.zoom;
    }
}
