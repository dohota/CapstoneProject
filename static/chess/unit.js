import { CONFIG } from './config.js';

export class BaseUnit {
    constructor(q, r, owner) {
        this.q = q;
        this.r = r;
        this.owner = owner; // 1 或 2：哪一队玩家
        // 默认属性
        this.name = "Unknown";
        this.maxHp = 100;
        this.hp = this.maxHp; //刚初始化的时候是满血，以后可能会扣血
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
 // 战士移动力普通，血厚
export class Warrior extends BaseUnit {
    constructor(q, r, owner) {
        super(q, r, owner); // 调用父类构造函数
        this.name = "战士";
        this.hp = 120;
        this.moveRange = 3;
        this.color = CONFIG.COLORS.UNIT_WARRIOR;
    }
}
//骑兵移动力很高，血少
export class Rider extends BaseUnit {
    constructor(q, r, owner) {
        super(q, r, owner);
        this.name = "骑兵";
        this.hp = 80;
        this.moveRange = 5;
        this.color = CONFIG.COLORS.UNIT_RIDER;
    }
}

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
