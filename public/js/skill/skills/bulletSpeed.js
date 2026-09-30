const bulletSpeed = {
    id: "bulletSpeed",

    name: "Tia tốc độ cao",

    description:
        "Tăng 25% tốc độ của tia",

    image:
        "/images/skills/5.png",

    maxStack: 10,

    getModifiers(stack) {
        return {
            bulletSpeed:
                1 + stack * 0.25
        };
    }
};

export default bulletSpeed;