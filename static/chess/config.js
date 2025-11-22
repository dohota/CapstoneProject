export const CONFIG = {
    HEX_SIZE: 40,
    MAP_RADIUS: 50,
    DRAG_THRESHOLD: 5,
    COLORS: {
        // 阵营颜色 (用于描边区分敌我)
        P1: "#e74c3c",  // 红方
        P2: "#3498db",  // 蓝方
        // 地图颜色
        BG: "#222",
        TILE: "#34495e",
        TILE_STROKE: "#2c3e50",
        HIGHLIGHT: "rgba(241, 196, 15, 0.4)",
        MOVE_HINT: "#16a085",
        // 兵种颜色 (用于填充，区分类型)
        UNIT_WARRIOR: "#95a5a6", // 战士-灰色
        UNIT_RIDER:   "#e67e22", // 骑兵-橙色
        UNIT_ARCHER:  "#9b59b6"  // 弓兵-紫色
    }
};
