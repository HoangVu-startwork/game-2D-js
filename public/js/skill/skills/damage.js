const damage = {
    id: "damage",

    name: "Tăng sát thương",

    description:
        "Mỗi tia gây thêm 1 sát thương",

    image:
        "/images/skills/4.png",

    maxStack: 9,

    getModifiers(stack) {
        return {
            damage: stack
        };
    }
};

export default damage;