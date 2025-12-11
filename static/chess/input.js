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
        // 滚轮监听: passive: false 是必须的，为了能调用 preventDefault
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    }
    onMouseDown(e) {
        this.state.isDragging = true;
        this.state.hasMoved = false;
        this.state.startX = e.clientX;
        this.state.startY = e.clientY;
        this.canvas.style.cursor = 'grabbing';
    }
    // 注意：onMouseMove 里 camera.pan 的调用不需要改，因为我在 camera.pan 内部除以了 zoom
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
    onWheel(e) {//滚轮处理
        e.preventDefault(); // 阻止网页本身滚动
        this.camera.handleZoom(e.deltaY, e.clientX, e.clientY);
    }
}
