import { CONFIG } from '/static/chess/config.js';
//静态方法，负责所有数学计算（坐标转换、距离计算）
export class HexMath {
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
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * max-min+1) + min;
    }
}
