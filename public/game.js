
const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");

const scoreElement =
    document.getElementById("score");


// ==================================================
// SETTINGS
// ==================================================

const bulletCountInput =
    document.getElementById("bulletCount");

const enemyCountInput =
    document.getElementById("enemyCount");

const enemySpeedInput =
    document.getElementById("enemySpeed");

const bulletSpeedInput =
    document.getElementById("bulletSpeed");

const spawnTimeInput =
    document.getElementById("spawnTime");

const shootTimeInput =
    document.getElementById("shootTime");

const startGameButton =
    document.getElementById("startGame");


// ==================================================
// GAME SETTINGS DEFAULT
// ==================================================

let settings = {

    // Số tia bắn cùng lúc
    bulletCount: 3,

    // Số hình tròn sinh ra mỗi đợt
    enemyCount: 5,

    // Tốc độ hình tròn
    enemySpeed: 0.5,

    // Tốc độ tia
    bulletSpeed: 3,

    // Thời gian sinh enemy
    spawnTime: 2000,

    // Thời gian bắn
    shootTime: 1000

};


// ==================================================
// TIMER
// ==================================================

let spawnTimer = null;

let shootTimer = null;


// ==================================================
// CANVAS
// ==================================================

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}

resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);


// ==================================================
// PLAYER
// ==================================================

const player = {

    x: canvas.width / 2,

    y: canvas.height / 2,

    width: 40,

    height: 40

};


// ==================================================
// MOUSE
// ==================================================

const mouse = {

    x: player.x,

    y: player.y

};


canvas.addEventListener(
    "mousemove",
    (event) => {

        mouse.x = event.clientX;

        mouse.y = event.clientY;

    }
);


// ==================================================
// BULLETS
// ==================================================

const bullets = [];


// ==================================================
// ENEMIES
// ==================================================

const enemies = [];


// ==================================================
// SCORE
// ==================================================

let score = 0;


// ==================================================
// PLAYER MOVE
// ==================================================

function updatePlayer() {

    player.x +=
        (mouse.x - player.x) *
        0.08;


    player.y +=
        (mouse.y - player.y) *
        0.08;

}


// ==================================================
// SPAWN ONE ENEMY
// ==================================================

function createEnemy() {

    const radius = 20;

    const side =
        Math.floor(
            Math.random() * 4
        );


    let x;

    let y;


    // TOP

    if (side === 0) {

        x =
            Math.random() *
            canvas.width;

        y = -radius;

    }


    // RIGHT

    else if (side === 1) {

        x =
            canvas.width +
            radius;

        y =
            Math.random() *
            canvas.height;

    }


    // BOTTOM

    else if (side === 2) {

        x =
            Math.random() *
            canvas.width;

        y =
            canvas.height +
            radius;

    }


    // LEFT

    else {

        x = -radius;

        y =
            Math.random() *
            canvas.height;

    }


    enemies.push({

        x,

        y,

        radius,

        speed:
            settings.enemySpeed

    });

}


// ==================================================
// SPAWN MULTIPLE ENEMIES
// ==================================================

function spawnEnemies() {

    for (
        let i = 0;

        i < settings.enemyCount;

        i++
    ) {

        createEnemy();

    }

}


// ==================================================
// UPDATE ENEMIES
// ==================================================

function updateEnemies() {

    enemies.forEach(
        (enemy) => {

            const dx =
                player.x -
                enemy.x;


            const dy =
                player.y -
                enemy.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distance > 0) {

                enemy.x +=
                    (dx / distance) *
                    enemy.speed;


                enemy.y +=
                    (dy / distance) *
                    enemy.speed;

            }

        }
    );

}


// ==================================================
// FIND NEAREST ENEMY
// ==================================================

function findNearestEnemy() {

    if (enemies.length === 0) {

        return null;

    }


    let nearest =
        enemies[0];


    let nearestDistance =
        Infinity;


    enemies.forEach(
        (enemy) => {

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
    );


    return nearest;

}


// ==================================================
// SHOOT MULTIPLE BULLETS
// ==================================================

function shoot() {

    const target =
        findNearestEnemy();


    if (!target) {

        return;

    }


    const dx =
        target.x -
        player.x;


    const dy =
        target.y -
        player.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    // ==============================================
    // TẠO NHIỀU TIA
    // ==============================================

    for (
        let i = 0;

        i < settings.bulletCount;

        i++
    ) {

        // Góc lệch giữa các tia

        const spread =
            (i -
                (settings.bulletCount - 1) / 2
            ) *
            0.15;


        const angle =
            Math.atan2(dy, dx) +
            spread;


        bullets.push({

            x: player.x,

            y: player.y,

            dx:
                Math.cos(angle),

            dy:
                Math.sin(angle),

            speed:
                settings.bulletSpeed,

            width: 8,

            height: 25

        });

    }

}


// ==================================================
// UPDATE BULLETS
// ==================================================

function updateBullets() {

    for (
        let bulletIndex =
            bullets.length - 1;

        bulletIndex >= 0;

        bulletIndex--
    ) {

        const bullet =
            bullets[bulletIndex];


        bullet.x +=
            bullet.dx *
            bullet.speed;


        bullet.y +=
            bullet.dy *
            bullet.speed;


        // ==========================================
        // BULLET OUT OF SCREEN
        // ==========================================

        if (

            bullet.x < -50 ||

            bullet.x >
                canvas.width + 50 ||

            bullet.y < -50 ||

            bullet.y >
                canvas.height + 50

        ) {

            bullets.splice(
                bulletIndex,
                1
            );

            continue;

        }


        // ==========================================
        // COLLISION
        // ==========================================

        for (
            let enemyIndex =
                enemies.length - 1;

            enemyIndex >= 0;

            enemyIndex--
        ) {

            const enemy =
                enemies[enemyIndex];


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

                // Xóa enemy

                enemies.splice(
                    enemyIndex,
                    1
                );


                // Xóa bullet

                bullets.splice(
                    bulletIndex,
                    1
                );


                // Tăng điểm

                score++;


                scoreElement.innerText =
                    `Score: ${score}`;


                break;

            }

        }

    }

}


// ==================================================
// DRAW PLAYER
// ==================================================

function drawPlayer() {

    ctx.fillStyle =
        "white";


    ctx.fillRect(

        player.x -
            player.width / 2,

        player.y -
            player.height / 2,

        player.width,

        player.height

    );

}


// ==================================================
// DRAW ENEMIES
// ==================================================

function drawEnemies() {

    enemies.forEach(
        (enemy) => {

            ctx.beginPath();


            ctx.arc(

                enemy.x,

                enemy.y,

                enemy.radius,

                0,

                Math.PI * 2

            );


            ctx.fillStyle =
                "red";


            ctx.fill();

        }
    );

}


// ==================================================
// DRAW BULLETS
// ==================================================

function drawBullets() {

    bullets.forEach(
        (bullet) => {

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

                -bullet.width / 2,

                bullet.height,

                bullet.width

            );


            ctx.restore();

        }
    );

}


// ==================================================
// PLAYER COLLISION
// ==================================================

function checkPlayerCollision() {

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
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <
            enemy.radius +
            player.width / 2
        ) {

            gameOver();

            return;

        }

    }

}


// ==================================================
// GAME OVER
// ==================================================

function gameOver() {

    alert(
        `Game Over!\nScore: ${score}`
    );


    location.reload();

}


// ==================================================
// BACKGROUND
// ==================================================

function drawBackground() {

    ctx.fillStyle =
        "#111";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

}


// ==================================================
// GAME LOOP
// ==================================================

function gameLoop() {

    drawBackground();


    updatePlayer();

    updateEnemies();

    updateBullets();


    checkPlayerCollision();


    drawPlayer();

    drawEnemies();

    drawBullets();


    requestAnimationFrame(
        gameLoop
    );

}


// ==================================================
// START / APPLY SETTINGS
// ==================================================

function startGame() {

    // ==============================================
    // ĐỌC DỮ LIỆU TỪ INPUT
    // ==============================================

    settings.bulletCount =
        Math.max(
            1,
            Number(
                bulletCountInput.value
            )
        );


    settings.enemyCount =
        Math.max(
            1,
            Number(
                enemyCountInput.value
            )
        );


    settings.enemySpeed =
        Math.max(
            0.1,
            Number(
                enemySpeedInput.value
            )
        );


    settings.bulletSpeed =
        Math.max(
            0.1,
            Number(
                bulletSpeedInput.value
            )
        );


    settings.spawnTime =
        Math.max(
            100,
            Number(
                spawnTimeInput.value
            )
        );


    settings.shootTime =
        Math.max(
            100,
            Number(
                shootTimeInput.value
            )
        );


    // ==============================================
    // XÓA TIMER CŨ
    // ==============================================

    clearInterval(spawnTimer);

    clearInterval(shootTimer);


    // ==============================================
    // TẠO TIMER SINH ENEMY
    // ==============================================

    spawnTimer =
        setInterval(
            () => {

                spawnEnemies();

            },

            settings.spawnTime

        );


    // ==============================================
    // TẠO TIMER BẮN
    // ==============================================

    shootTimer =
        setInterval(
            () => {

                shoot();

            },

            settings.shootTime

        );

}


// ==================================================
// BUTTON
// ==================================================

startGameButton.addEventListener(
    "click",
    startGame
);


// ==================================================
// START
// ==================================================

startGame();

gameLoop();

