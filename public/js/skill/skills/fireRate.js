// Skill tăng tốc bắn
const fireRate = {
    id: "fireRate",

    name: "Tăng tốc bắn",

    description:
        "Giảm 15% thời gian giữa các lần bắn",

    image:
        "/images/skills/2.png",

    maxStack: 10,

    getModifiers(stack) {
        return {
            shootInterval:
                Math.pow(0.85, stack)
        };
    }
};

export default fireRate;