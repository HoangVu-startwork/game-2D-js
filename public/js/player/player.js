import {
    getSkillModifiers
} from "../skill/skillManager.js";

export const player = {
    x: 0,
    y: 0,
    width: 40,
    height: 40
};

const mouse = {
    x: 0,
    y: 0
};

// export function initPlayer(canvas) {
//     player.x = canvas.width / 2;
//     player.y = canvas.height / 2;

//     mouse.x = player.x;
//     mouse.y = player.y;

//     canvas.addEventListener("mousemove", (event) => {
//         const rect = canvas.getBoundingClientRect();

//         mouse.x = event.clientX - rect.left;
//         mouse.y = event.clientY - rect.top;
//     });
// }

// export function updatePlayer(deltaTime) {
//     const smooth = 1 - Math.exp(-0.01 * deltaTime);

//     player.x += (mouse.x - player.x) * smooth;
//     player.y += (mouse.y - player.y) * smooth;
// }

// export function drawPlayer(ctx) {
//     ctx.fillStyle = "white";

//     ctx.fillRect(
//         player.x - player.width / 2,
//         player.y - player.height / 2,
//         player.width,
//         player.height
//     );
// }

export function initPlayer(
    canvas
) {

    player.x =
        canvas.width / 2;

    player.y =
        canvas.height / 2;


    mouse.x =
        player.x;

    mouse.y =
        player.y;


    canvas.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                canvas.getBoundingClientRect();


            mouse.x =
                event.clientX -
                rect.left;


            mouse.y =
                event.clientY -
                rect.top;
        }
    );
}


export function updatePlayer(
    deltaTime
) {

    const modifiers =
        getSkillModifiers();


    const smooth =
        1 -
        Math.exp(
            -0.01 *
            deltaTime *
            modifiers.playerSpeed
        );


    player.x +=
        (
            mouse.x -
            player.x
        ) *
        smooth;


    player.y +=
        (
            mouse.y -
            player.y
        ) *
        smooth;
}


export function drawPlayer(ctx) {

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