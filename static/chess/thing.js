import { UNIT } from '/static/chess/unit.js';
//import {HexMath} from "/static/chess/maths.js";
function clone(value) {
        return typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
}
function validateType(value, expected) {
        if (expected === "any") return true;
        if (expected === "array") return Array.isArray(value);
        if (expected === "object") return typeof value === "object" && !Array.isArray(value);
        return typeof value === expected;
    }
//示例：new GameObject(0, 0, 2, "villager", { name: "村民A", color: "#ff0000" })
//data 中的字段会覆盖 UNIT 定义的默认值    
export class GameObject { 
    constructor(q, r, owner, type, data = {}) {
        this.q = q;
        this.r = r;
        this.owner = owner; // 1 或 2：哪一队玩家
        const def = UNIT[type]; 
        if (!def) throw new Error(`Unknown unit type: ${type}`);
        this.type = type; 
        this._applyFields(def.fields, data);
        this._applyMethods(def.methods);
        this.hp = this.maxhp; //刚初始化的时候是满血，以后可能会扣血
    } 
    _applyFields(fieldDefs, data) {
         for (const [key, cfg] of Object.entries(fieldDefs)) { //读取 UNIT[type].fields
            const defaultValue = clone(cfg.default); //克隆默认值
            const provided = data[key] !== undefined ? data[key] : defaultValue; //合并用户传入的 data
            if (!validateType(provided, cfg.type)) { 
                throw new TypeError(
                    `Field '${key}' for '${this.type}' expects type '${cfg.type}', got '${typeof provided}'`
                ); //校验类型
            } 
            this[key] = provided; //挂到 this 上
        } 
    }
     _applyMethods(methods = {}) {
         for (const [name, fn] of Object.entries(methods)) {
            Object.defineProperty(this, name, { value: fn.bind(this), enumerable: false }); 
        } 
    }
    //_applyMethods = “类里写的固有方法”，只能属于自己
    //_applyMixins = “插件/模块”，可以被不同 unit 挂载复用
    moveTo(q, r) {// 移动
        this.q = q;
        this.r = r;
    }
}
