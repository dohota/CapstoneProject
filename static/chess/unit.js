export const UNIT = {
    villager: {
        fields: {
            name: { type: "string", default: "村" },
            maxhp: { type: "number", default: 10 },
            move: { type: "number", default: 7 },
            color: { type: "string", default: "#e67e22"}
        },
        // methods: {
        //     sayHi() {
        //         console.log(`Hi, I'm ${this.name}, ${this.age} years old.`);
        //     }
        // }   
    },
    warrior: {
        fields: {
            name: { type: "string", default: "战" },
            maxhp: { type: "number", default: 80 },
            move: { type: "number", default: 4 },
            color: { type: "string", default: "#15c229ff"}
        },
    },
    tank: {
        fields: {
            name: { type: "string", default: "坦" },
            maxhp: { type: "number", default: 200 },
            move: { type: "number", default: 6 },
            color: { type: "string", default: "#6b4524ff"}
        },
    },
    rider: {
        fields: {
            name: { type: "string", default: "射" },
            maxhp: { type: "number", default: 30 },
            move: { type: "number", default: 8 },
            color: { type: "string", default: "#e40ecfff"}
        },
    },
    defender: {
        fields: {
            name: { type: "string", default: "护" },
            maxhp: { type: "number", default: 200 },
            move: { type: "number", default: 1 },
            color: { type: "string", default: "#4e464dd3"}
        },
    },
    king: {
        fields: {
            name: { type: "string", default: "王" },
            maxhp: { type: "number", default: 5 },
            move: { type: "number", default: 1 },
            color: { type: "string", default: "#a9a90bff"}
        },
    }
};
