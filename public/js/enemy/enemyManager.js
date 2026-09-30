import { player } from "../player/player.js";

import { level1 } from "./level1.js";
import { level2 } from "./level2.js";
import { level3 } from "./level3.js";
import { level4 } from "./level4.js";
import { level5 } from "./level5.js";
import { level6 } from "./level6.js";
import { level7 } from "./level7.js";
import { level8 } from "./level8.js";
import { level9 } from "./level9.js";
import { level10 } from "./level10.js";

import { SPAWN_CONFIG } from "./spawnConfig.js";


// ======================================
// DANH SÁCH ENEMY
// ======================================

export const enemies = [];


// ======================================
// DANH SÁCH LEVEL
// ======================================

const levels = [
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7,
    level8,
    level9,
    level10
];


// ======================================
// TẠO ENEMY
// ======================================

export function createEnemy(level = null) {

    let data;

    // Nếu truyền level
    if (level !== null) {

        data = levels[level - 1];

    } else {

        // random level
        data =
            levels[
                Math.floor(
                    Math.random() * levels.length
                )
            ];
    }


    if (!data) {
        console.error(
            "Không tìm thấy level:",
            level
        );

        return;
    }


    const radius = data.radius;

    const side =
        Math.floor(
            Math.random() * 4
        );


    let x;
    let y;


    // Trên
    if (side === 0) {

        x =
            Math.random() *
            window.innerWidth;

        y = -radius;
    }


    // Phải
    else if (side === 1) {

        x =
            window.innerWidth +
            radius;

        y =
            Math.random() *
            window.innerHeight;
    }


    // Dưới
    else if (side === 2) {

        x =
            Math.random() *
            window.innerWidth;

        y =
            window.innerHeight +
            radius;
    }


    // Trái
    else {

        x = -radius;

        y =
            Math.random() *
            window.innerHeight;
    }


    enemies.push({

        x,
        y,

        radius: data.radius,

        level: data.level,

        color: data.color,

        hp: data.hp,

        maxHp: data.hp,

        speed: data.speed
    });
}


// ======================================
// RANDOM LEVEL THEO %
// ======================================

export function getRandomLevel(
    levelWeights
) {

    const entries =
        Object.entries(
            levelWeights
        );


    const totalWeight =
        entries.reduce(
            (total, [, weight]) => {
                return total + Number(weight);
            },
            0
        );


    if (totalWeight <= 0) {

        console.error(
            "levelWeights không hợp lệ"
        );

        return 1;
    }


    let random =
        Math.random() *
        totalWeight;


    for (
        const [level, weight]
        of entries
    ) {

        random -= Number(weight);


        if (random <= 0) {

            return Number(level);
        }
    }


    return Number(
        entries[
            entries.length - 1
        ][0]
    );
}


// ======================================
// TẠO NHIỀU ENEMY
// ======================================

export function spawnEnemyBatch(
    count,
    levelWeights
) {

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const level =
            getRandomLevel(
                levelWeights
            );


        createEnemy(level);
    }
}


// ======================================
// LẤY CONFIG HIỆN TẠI
// ======================================

export function getCurrentSpawnConfig(
    timeInSeconds
) {

    return SPAWN_CONFIG.find(
        (config) => {

            return (
                timeInSeconds >= config.start &&
                timeInSeconds < config.end
            );
        }
    );
}


// ======================================
// UPDATE ENEMY
// ======================================

export function updateEnemies(
    deltaTime
) {

    for (
        const enemy of enemies
    ) {

        const dx =
            player.x - enemy.x;

        const dy =
            player.y - enemy.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance === 0) {
            continue;
        }


        const moveX =
            dx / distance;

        const moveY =
            dy / distance;


        enemy.x +=
            moveX *
            enemy.speed *
            (deltaTime / 1000);


        enemy.y +=
            moveY *
            enemy.speed *
            (deltaTime / 1000);
    }
}


// ======================================
// DAMAGE ENEMY
// ======================================

export function damageEnemy(
    enemy
) {

    enemy.hp--;


    if (enemy.hp <= 0) {

        const index =
            enemies.indexOf(enemy);


        if (index !== -1) {

            enemies.splice(
                index,
                1
            );
        }


        return true;
    }


    return false;
}


// ======================================
// DRAW ENEMY
// ======================================

export function drawEnemies(ctx) {

    for (
        const enemy of enemies
    ) {

        // --------------------------
        // HÌNH TRÒN
        // --------------------------

        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            enemy.color;

        ctx.fill();


        // --------------------------
        // LEVEL
        // --------------------------

        ctx.fillStyle =
            enemy.level === 9
                ? "black"
                : "white";

        ctx.font =
            "bold 14px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            enemy.level,
            enemy.x,
            enemy.y
        );


        // --------------------------
        // THANH HP
        // --------------------------

        const hpWidth = 45;
        const hpHeight = 5;

        const hpPercent =
            enemy.hp /
            enemy.maxHp;


        ctx.fillStyle =
            "#333";

        ctx.fillRect(
            enemy.x -
                hpWidth / 2,

            enemy.y -
                enemy.radius -
                10,

            hpWidth,
            hpHeight
        );


        ctx.fillStyle =
            "lime";

        ctx.fillRect(
            enemy.x -
                hpWidth / 2,

            enemy.y -
                enemy.radius -
                10,

            hpWidth *
                hpPercent,

            hpHeight
        );
    }
}