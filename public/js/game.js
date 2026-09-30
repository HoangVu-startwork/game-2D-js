import {
    initPlayer,
    updatePlayer,
    drawPlayer
} from "./player/player.js";


import {
    updateEnemies,
    drawEnemies,
    getCurrentSpawnConfig,
    spawnEnemyBatch
} from "./enemy/enemyManager.js";


import {
    shoot,
    updateBullets,
    drawBullets
} from "./bullet/bullet.js";


import {
    getGameSpeed
} from "./speed/gameSpeed.js";


import {
    playerLevel,
    getRequiredExp,
    getExpPercent
} from "./playerLevel/playerLevel.js";


import {
    showSkillSelection
} from "./skill/skillUI.js";


import {
    getSkillModifiers
} from "./skill/skillManager.js";


// ======================================
// GAME STATE
// ======================================

// Game có đang pause để chọn skill không
let gamePaused = false;

// Có bao nhiêu lần level up đang chờ chọn skill
let pendingLevelUps = 0;


// ======================================
// CANVAS
// ======================================

const canvas =
    document.getElementById("game");


if (!canvas) {
    throw new Error(
        'Không tìm thấy canvas có id="game"'
    );
}


const ctx =
    canvas.getContext("2d");


if (!ctx) {
    throw new Error(
        "Không thể lấy Canvas 2D context"
    );
}


// ======================================
// RESIZE CANVAS
// ======================================

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


// ======================================
// PLAYER
// ======================================

initPlayer(canvas);


// ======================================
// TIMER
// ======================================

let spawnTimer = 0;

let shootTimer = 0;

let elapsedGameTime = 0;


// Config spawn trước đó
let lastSpawnConfig = null;


// Thời gian frame trước
let lastTime =
    performance.now();


// ======================================
// LEVEL UI
// ======================================

function updateLevelUI() {

    const levelElement =
        document.getElementById(
            "playerLevel"
        );


    const progressElement =
        document.getElementById(
            "expProgress"
        );


    const expTextElement =
        document.getElementById(
            "expText"
        );


    // Không có UI thì bỏ qua
    if (
        !levelElement ||
        !progressElement ||
        !expTextElement
    ) {
        return;
    }


    // ==================================
    // LEVEL
    // ==================================

    levelElement.textContent =
        playerLevel.level;


    // ==================================
    // MAX LEVEL
    // ==================================

    if (
        playerLevel.level >=
        playerLevel.maxLevel
    ) {

        progressElement.style.width =
            "100%";


        expTextElement.textContent =
            "MAX LEVEL";


        return;
    }


    // ==================================
    // EXP REQUIRED
    // ==================================

    const requiredExp =
        getRequiredExp();


    // ==================================
    // EXP PERCENT
    // ==================================

    const percent =
        getExpPercent();


    progressElement.style.width =
        `${percent}%`;


    // ==================================
    // TEXT
    // ==================================

    expTextElement.textContent =
        `${playerLevel.exp} / ${requiredExp}`;
}


// ======================================
// SKILL SELECTION
// ======================================

function openNextSkillSelection() {

    // ==================================
    // Không còn level up
    // ==================================

    if (
        pendingLevelUps <= 0
    ) {

        gamePaused = false;


        // Reset thời gian
        // để không bị nhảy deltaTime
        lastTime =
            performance.now();


        return;
    }


    // ==================================
    // Lấy 1 lần level up
    // ==================================

    pendingLevelUps--;


    // ==================================
    // Game đang pause
    // ==================================

    gamePaused = true;


    // ==================================
    // Hiện 3 skill
    // ==================================

    showSkillSelection(
        () => {

            // Người chơi đã chọn skill

            console.log(
                "Đã chọn skill"
            );


            // Kiểm tra còn level up nữa không
            openNextSkillSelection();
        }
    );
}


// ======================================
// GAME LOOP
// ======================================

function gameLoop(currentTime) {

    // ==================================
    // GAME PAUSE
    // ==================================

    if (gamePaused) {

        requestAnimationFrame(
            gameLoop
        );

        return;
    }


    // ==================================
    // DELTA TIME
    // ==================================

    let deltaTime =
        currentTime - lastTime;


    lastTime =
        currentTime;


    // ==================================
    // GIỚI HẠN DELTA TIME
    // ==================================

    // Nếu tab bị treo / browser ngủ
    // tránh game nhảy quá xa
    if (
        deltaTime > 100
    ) {

        deltaTime = 100;
    }


    // ==================================
    // GAME SPEED
    // ==================================

    const gameSpeed =
        getGameSpeed();


    const scaledDeltaTime =
        deltaTime *
        gameSpeed;


    // ==================================
    // THỜI GIAN GAME
    // ==================================

    elapsedGameTime +=
        scaledDeltaTime;


    const timeInSeconds =
        elapsedGameTime / 1000;


    // ==================================
    // SPAWN CONFIG
    // ==================================

    const spawnConfig =
        getCurrentSpawnConfig(
            timeInSeconds
        );


    // ==================================
    // KIỂM TRA ĐỔI GIAI ĐOẠN
    // ==================================

    if (
        spawnConfig !==
        lastSpawnConfig
    ) {

        spawnTimer = 0;


        lastSpawnConfig =
            spawnConfig;
    }


    // ==================================
    // SPAWN ENEMY
    // ==================================

    if (spawnConfig) {

        spawnTimer +=
            scaledDeltaTime;


        // Có thể có nhiều lần spawn
        // nếu máy bị drop frame
        while (
            spawnTimer >=
            spawnConfig.interval
        ) {

            spawnTimer -=
                spawnConfig.interval;


            spawnEnemyBatch(
                spawnConfig.count,
                spawnConfig.levelWeights
            );
        }
    }


    // ==================================
    // SKILL MODIFIERS
    // ==================================

    const skillModifiers =
        getSkillModifiers();


    // ==================================
    // AUTO SHOOT
    // ==================================

    shootTimer +=
        scaledDeltaTime;


    if (
        shootTimer >=
        skillModifiers.shootInterval
    ) {

        shootTimer -=
            skillModifiers.shootInterval;


        shoot();
    }


    // ==================================
    // UPDATE PLAYER
    // ==================================

    updatePlayer(
        scaledDeltaTime
    );


    // ==================================
    // UPDATE ENEMIES
    // ==================================

    updateEnemies(
        scaledDeltaTime
    );


    // ==================================
    // UPDATE BULLETS
    // ==================================

    const levelsGained =
        updateBullets(
            scaledDeltaTime
        );


    // ==================================
    // LEVEL UP
    // ==================================

    if (
        levelsGained > 0
    ) {

        pendingLevelUps +=
            levelsGained;


        console.log(
            "Level Up:",
            levelsGained
        );


        console.log(
            "Pending Level Ups:",
            pendingLevelUps
        );
    }


    // ==================================
    // LEVEL UI
    // ==================================

    updateLevelUI();


    // ==================================
    // CLEAR SCREEN
    // ==================================

    ctx.fillStyle =
        "#111";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ==================================
    // DRAW PLAYER
    // ==================================

    drawPlayer(ctx);


    // ==================================
    // DRAW ENEMIES
    // ==================================

    drawEnemies(ctx);


    // ==================================
    // DRAW BULLETS
    // ==================================

    drawBullets(ctx);


    // ==================================
    // KIỂM TRA LEVEL UP
    // ==================================

    if (
        pendingLevelUps > 0 &&
        !gamePaused
    ) {

        openNextSkillSelection();
    }


    // ==================================
    // FRAME TIẾP THEO
    // ==================================

    requestAnimationFrame(
        gameLoop
    );
}


// ======================================
// START GAME
// ======================================

updateLevelUI();


requestAnimationFrame(
    gameLoop
);