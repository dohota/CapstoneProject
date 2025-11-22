import { CONFIG } from '/static/chess/config.js';
//输入系统: 处理鼠标交互，区分拖拽和点击
export class InputSystem {
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
