const playerSpeed = {
    id: "playerSpeed",

    name: "Tăng tốc hình vuông",

    description:
        "Tăng 20% tốc độ di chuyển",

    image:
        "/images/skills/6.png",

    maxStack: 10,

    getModifiers(stack) {
        return {
            playerSpeed:
                1 + stack * 0.2
        };
    }
};

export default playerSpeed;