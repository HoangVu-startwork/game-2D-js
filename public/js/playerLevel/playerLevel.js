import { EXP_REQUIRED } from "./levelConfig.js";

export const playerLevel = {
    level: 1,
    exp: 0,
    maxLevel: 200
};


// ======================================
// EXP cần để lên level hiện tại
// ======================================

export function getRequiredExp() {
    if (
        playerLevel.level >=
        playerLevel.maxLevel
    ) {
        return 0;
    }

    return EXP_REQUIRED[
        playerLevel.level - 1
    ];
}


// ======================================
// Lấy % thanh EXP
// ======================================

export function getExpPercent() {
    if (
        playerLevel.level >=
        playerLevel.maxLevel
    ) {
        return 100;
    }

    const requiredExp =
        getRequiredExp();

    if (!requiredExp) {
        return 0;
    }

    return (
        playerLevel.exp /
        requiredExp
    ) * 100;
}


// ======================================
// Cộng EXP
// ======================================

export function addExperience(amount) {

    if (amount <= 0) {
        return;
    }

    // Level 200 thì không tăng nữa
    if (
        playerLevel.level >=
        playerLevel.maxLevel
    ) {
        return;
    }

    playerLevel.exp += amount;


    // ==================================
    // Kiểm tra có lên nhiều level không
    // ==================================

    while (
        playerLevel.level <
        playerLevel.maxLevel
    ) {

        const requiredExp =
            getRequiredExp();

        if (!requiredExp) {
            console.error(
                `Chưa nhập EXP cho Level ${playerLevel.level}`
            );

            break;
        }


        if (
            playerLevel.exp <
            requiredExp
        ) {
            break;
        }


        // Trừ EXP của level hiện tại
        playerLevel.exp -=
            requiredExp;


        // Tăng level
        playerLevel.level++;


        console.log(
            `🎉 Hình vuông lên Level ${playerLevel.level}`
        );
    }


    // ==================================
    // Level 200
    // ==================================

    if (
        playerLevel.level >=
        playerLevel.maxLevel
    ) {
        playerLevel.level =
            playerLevel.maxLevel;

        playerLevel.exp = 0;
    }
}