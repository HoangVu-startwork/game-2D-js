// Skill song tia

const doubleShot = {
    id: "doubleShot",

    name: "Song tia",

    description:
        "Mỗi lần bắn thêm 1 tia",

    image:
        "/images/skills/3.png",

    maxStack: 9,

    getModifiers(stack) {
        return {
            bulletCount: stack
        };
    }
};

export default doubleShot;