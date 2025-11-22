// 这里体现了 OOP 的精髓：继承 (Inheritance) 和 多态 (Polymorphism)。
//
// BaseUnit: 基础类，包含所有棋子都有的属性（坐标、血量、所属玩家）。
//
// Warrior: 继承自基础类，移动力普通，血厚。
//
// Rider: 移动力很高，但血少。
//
// Archer: 移动力低
import { CONFIG } from './config.js';
/**
 * 基础单位类
 * 所有棋子的父类
 */
export class BaseUnit {
    constructor(q, r, owner) {
        this.q = q;
        this.r = r;
        this.owner = owner; // 1 或 2
        // 默认属性
        this.name = "Unknown";
        this.maxHp = 100;
        this.hp = 100;
        this.moveRange = 3;
        this.color = "#ffffff";
    }
    // 移动方法
    moveTo(q, r) {
        this.q = q;
        this.r = r;
    }
    // 受伤方法 (为未来战斗系统做准备)
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }
    isAlive() {
        return this.hp > 0;
    }
}
/**
 * 兵种：战士 (步兵)
 * 特点：平衡
 */
export class Warrior extends BaseUnit {
    constructor(q, r, owner) {
        super(q, r, owner); // 调用父类构造函数
        this.name = "战士";
        this.hp = 120;      // 血厚
        this.moveRange = 3; // 标准移动
        this.color = CONFIG.COLORS.UNIT_WARRIOR;
    }
}
/**
 * 兵种：骑兵
 * 特点：跑得快 (moveRange = 5)
 */
export class Rider extends BaseUnit {
    constructor(q, r, owner) {
        super(q, r, owner);
        this.name = "骑兵";
        this.hp = 80;       // 血略少
        this.moveRange = 5; // !! 跑得远
        this.color = CONFIG.COLORS.UNIT_RIDER;
    }
}
/**
 * 兵种：弓箭手
 * 特点：跑得慢
 */
export class Archer extends BaseUnit {
    constructor(q, r, owner) {
        super(q, r, owner);
        this.name = "弓手";
        this.hp = 60;       // 脆皮
        this.moveRange = 2; // 腿短
        this.color = CONFIG.COLORS.UNIT_ARCHER;
    }
}
//如果加一个Tank，只需要在 unit.js 里写 class Tank extends BaseUnit，设置 hp = 500, moveRange = 1，
// 然后在 game.js 里 new Tank(...) 即可，其他代码一行都不用改！
