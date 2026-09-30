import { player } from "../player/player.js";

import {
    enemies,
    damageEnemy
} from "../enemy/enemyManager.js";

import {
    addExperience
} from "../playerLevel/playerLevel.js";

import {
    getSkillModifiers
} from "../skill/skillManager.js";

export const bullets = [];

const BULLET_SPEED = 500;


// ======================================
// TÌM ENEMY GẦN NHẤT
// ======================================

function getNearestEnemy() {

    if (
        enemies.length === 0
    ) {
        return null;
    }


    let nearest =
        enemies[0];

    let nearestDistance =
        Infinity;


    for (
        const enemy of enemies
    ) {

        const dx =
            enemy.x -
            player.x;

        const dy =
            enemy.y -
            player.y;


        const distance =
            dx * dx +
            dy * dy;


        if (
            distance <
            nearestDistance
        ) {

            nearestDistance =
                distance;

            nearest =
                enemy;
        }
    }


    return nearest;
}


// ======================================
// SHOOT
// ======================================

export function shoot() {

    const target =
        getNearestEnemy();


    if (!target) {
        return;
    }


    const modifiers =
        getSkillModifiers();


    const dx =
        target.x -
        player.x;

    const dy =
        target.y -
        player.y;


    const baseAngle =
        Math.atan2(
            dy,
            dx
        );


    const bulletCount =
        modifiers.bulletCount;


    const spread =
        0.15;


    for (
        let i = 0;

        i < bulletCount;

        i++
    ) {

        const offset =
            (
                i -
                (bulletCount - 1) / 2
            ) *
            spread;


        const angle =
            baseAngle +
            offset;


        bullets.push({

            x:
                player.x,

            y:
                player.y,

            dx:
                Math.cos(angle),

            dy:
                Math.sin(angle),

            speed:
                500 *
                modifiers.bulletSpeed,

            width:
                30,

            height:
                8
        });
    }
}


// ======================================
// UPDATE
// ======================================

export function updateBullets(
    deltaTime
) {

    let levelsGained = 0;


    for (
        let i =
            bullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            bullets[i];


        bullet.x +=
            bullet.dx *
            bullet.speed *
            (deltaTime / 1000);


        bullet.y +=
            bullet.dy *
            bullet.speed *
            (deltaTime / 1000);


        let hit =
            false;


        for (
            let j =
                enemies.length - 1;

            j >= 0;

            j--
        ) {

            const enemy =
                enemies[j];


            const dx =
                bullet.x -
                enemy.x;

            const dy =
                bullet.y -
                enemy.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                enemy.radius
            ) {

                const modifiers =
                    getSkillModifiers();


                const killed =
                    damageEnemy(
                        enemy,
                        modifiers.damage
                    );


                if (killed) {

                    levelsGained +=
                        addExperience(
                            enemy.level
                        );
                }


                bullets.splice(
                    i,
                    1
                );


                hit = true;

                break;
            }
        }


        if (hit) {
            continue;
        }


        if (
            bullet.x < -100 ||
            bullet.x >
                window.innerWidth + 100 ||
            bullet.y < -100 ||
            bullet.y >
                window.innerHeight + 100
        ) {

            bullets.splice(
                i,
                1
            );
        }
    }


    return levelsGained;
}


// ======================================
// DRAW
// ======================================

export function drawBullets(ctx) {

    for (
        const bullet of bullets
    ) {

        ctx.save();


        const angle =
            Math.atan2(
                bullet.dy,
                bullet.dx
            );


        ctx.translate(
            bullet.x,
            bullet.y
        );


        ctx.rotate(angle);


        ctx.fillStyle =
            "yellow";


        ctx.fillRect(
            0,
            -bullet.height / 2,
            bullet.width,
            bullet.height
        );


        ctx.restore();
    }
}

// export function shoot() {
//     if (enemies.length === 0) {
//         return;
//     }

//     // ==============================
//     // Tìm hình tròn gần nhất
//     // ==============================

//     let nearestEnemy = null;

//     let nearestDistance = Infinity;

//     for (const enemy of enemies) {

//         const dx =
//             enemy.x - player.x;

//         const dy =
//             enemy.y - player.y;

//         const distance =
//             dx * dx + dy * dy;

//         if (distance < nearestDistance) {

//             nearestDistance = distance;

//             nearestEnemy = enemy;
//         }
//     }

//     if (!nearestEnemy) {
//         return;
//     }

//     // ==============================
//     // Tính hướng bắn
//     // ==============================

//     const dx =
//         nearestEnemy.x - player.x;

//     const dy =
//         nearestEnemy.y - player.y;

//     const distance =
//         Math.sqrt(dx * dx + dy * dy);

//     if (distance === 0) {
//         return;
//     }

//     bullets.push({
//         x: player.x,
//         y: player.y,

//         dx: dx / distance,
//         dy: dy / distance,

//         speed: BULLET_SPEED,

//         width: 30,
//         height: 8
//     });
// }

// export function updateBullets(deltaTime) {

//     for (
//         let i = bullets.length - 1;
//         i >= 0;
//         i--
//     ) {
//         const bullet = bullets[i];

//         bullet.x +=
//             bullet.dx *
//             bullet.speed *
//             (deltaTime / 1000);

//         bullet.y +=
//             bullet.dy *
//             bullet.speed *
//             (deltaTime / 1000);

//         // ==========================
//         // Kiểm tra va chạm
//         // ==========================

//         let hit = false;

//         for (
//             let j = enemies.length - 1;
//             j >= 0;
//             j--
//         ) {
//             const enemy = enemies[j];

//             const dx =
//                 bullet.x - enemy.x;

//             const dy =
//                 bullet.y - enemy.y;

//             const distance =
//                 Math.sqrt(dx * dx + dy * dy);


//             if (distance < enemy.radius) {

//                 const killed =
//                     damageEnemy(enemy);
            
//                 if (killed) {
            
//                     // Quái level bao nhiêu
//                     // thì cộng bấy nhiêu EXP
//                     addExperience(
//                         enemy.level
//                     );
//                 }
            
//                 bullets.splice(i, 1);
            
//                 hit = true;
            
//                 break;
//             }
//         }

//         if (hit) {
//             continue;
//         }

//         // ==========================
//         // Xóa tia khi bay ra ngoài
//         // ==========================

//         if (
//             bullet.x < -100 ||
//             bullet.x > window.innerWidth + 100 ||
//             bullet.y < -100 ||
//             bullet.y > window.innerHeight + 100
//         ) {
//             bullets.splice(i, 1);
//         }
//     }
// }

// export function drawBullets(ctx) {
//     for (const bullet of bullets) {

//         ctx.save();

//         const angle =
//             Math.atan2(
//                 bullet.dy,
//                 bullet.dx
//             );

//         ctx.translate(
//             bullet.x,
//             bullet.y
//         );

//         ctx.rotate(angle);

//         ctx.fillStyle = "yellow";

//         ctx.fillRect(
//             0,
//             -bullet.height / 2,
//             bullet.width,
//             bullet.height
//         );

//         ctx.restore();
//     }
// }



// // ======================================
// // TÌM ENEMY GẦN NHẤT
// // ======================================

// function getNearestEnemy() {

//     if (
//         enemies.length === 0
//     ) {
//         return null;
//     }


//     let nearest =
//         enemies[0];

//     let nearestDistance =
//         Infinity;


//     for (
//         const enemy of enemies
//     ) {

//         const dx =
//             enemy.x -
//             player.x;

//         const dy =
//             enemy.y -
//             player.y;


//         const distance =
//             dx * dx +
//             dy * dy;


//         if (
//             distance <
//             nearestDistance
//         ) {

//             nearestDistance =
//                 distance;

//             nearest =
//                 enemy;
//         }
//     }


//     return nearest;
// }
