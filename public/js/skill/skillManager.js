import fireRate from "./skills/fireRate.js";
import doubleShot from "./skills/doubleShot.js";
import damage from "./skills/damage.js";
import bulletSpeed from "./skills/bulletSpeed.js";
import playerSpeed from "./skills/playerSpeed.js";


// ======================================
// DANH SÁCH TẤT CẢ SKILL
// ======================================

export const ALL_SKILLS = [
    fireRate,
    doubleShot,
    damage,
    bulletSpeed,
    playerSpeed
];


// ======================================
// SKILL NGƯỜI CHƠI ĐANG SỞ HỮU
// ======================================

export const playerSkills = [];


// ======================================
// THÊM SKILL
// ======================================

export function addSkill(skillId) {

    const skill =
        ALL_SKILLS.find(
            (item) =>
                item.id === skillId
        );


    if (!skill) {

        console.error(
            "Không tìm thấy skill:",
            skillId
        );

        return;
    }


    // Kiểm tra skill đã có chưa
    const existingSkill =
        playerSkills.find(
            (item) =>
                item.id === skillId
        );


    // ==================================
    // ĐÃ CÓ → TĂNG STACK
    // ==================================

    if (existingSkill) {

        if (
            existingSkill.stack >=
            existingSkill.maxStack
        ) {

            console.log(
                `${skill.name} đã MAX STACK`
            );

            return;
        }


        existingSkill.stack++;

        console.log(
            `${skill.name} → Stack ${existingSkill.stack}`
        );

        return;
    }


    // ==================================
    // CHƯA CÓ → THÊM
    // ==================================

    playerSkills.push({

        ...skill,

        stack: 1
    });


    console.log(
        `Đã nhận skill: ${skill.name}`
    );
}


// ======================================
// RANDOM SKILL
// ======================================

export function getRandomSkills(
    count = 3
) {

    const availableSkills =
        ALL_SKILLS.filter(
            (skill) => {

                const owned =
                    playerSkills.find(
                        (item) =>
                            item.id === skill.id
                    );


                // Chưa sở hữu
                if (!owned) {
                    return true;
                }


                // Đã sở hữu nhưng chưa max
                return (
                    owned.stack <
                    skill.maxStack
                );
            }
        );


    // Fisher-Yates
    const shuffled = [
        ...availableSkills
    ];


    for (
        let i =
            shuffled.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }


    return shuffled.slice(
        0,
        Math.min(
            count,
            shuffled.length
        )
    );
}


// ======================================
// LẤY STACK
// ======================================

export function getSkillStack(
    skillId
) {

    const skill =
        playerSkills.find(
            (item) =>
                item.id === skillId
        );


    return skill
        ? skill.stack
        : 0;
}


// ======================================
// TÍNH TOÀN BỘ HIỆU ỨNG
// ======================================

export function getSkillModifiers() {

    const modifiers = {

        bulletCount: 1,

        damage: 1,

        bulletSpeed: 1,

        shootInterval: 500,

        playerSpeed: 1
    };


    for (
        const skill
        of playerSkills
    ) {

        const result =
            skill.getModifiers(
                skill.stack
            );


        // ==================================
        // SONG TIA
        // ==================================

        if (
            result.bulletCount
        ) {

            modifiers.bulletCount +=
                result.bulletCount;
        }


        // ==================================
        // DAMAGE
        // ==================================

        if (
            result.damage
        ) {

            modifiers.damage +=
                result.damage;
        }


        // ==================================
        // BULLET SPEED
        // ==================================

        if (
            result.bulletSpeed
        ) {

            modifiers.bulletSpeed *=
                result.bulletSpeed;
        }


        // ==================================
        // FIRE RATE
        // ==================================

        if (
            result.shootInterval
        ) {

            modifiers.shootInterval *=
                result.shootInterval;
        }


        // ==================================
        // PLAYER SPEED
        // ==================================

        if (
            result.playerSpeed
        ) {

            modifiers.playerSpeed *=
                result.playerSpeed;
        }
    }


    return modifiers;
}