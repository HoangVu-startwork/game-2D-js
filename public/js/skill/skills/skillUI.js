import {
    getRandomSkills,
    addSkill
} from "./skillManager.js";


let skillOverlay = null;


// ======================================
// HIỆN 3 SKILL
// ======================================

export function showSkillSelection(
    onSelected
) {

    // Nếu đang có UI thì xóa
    if (skillOverlay) {

        skillOverlay.remove();

        skillOverlay = null;
    }


    // ==================================
    // OVERLAY
    // ==================================

    skillOverlay =
        document.createElement("div");

    skillOverlay.className =
        "skill-overlay";


    // ==================================
    // TITLE
    // ==================================

    const title =
        document.createElement("div");

    title.className =
        "skill-title";

    title.textContent =
        "LEVEL UP!";


    // ==================================
    // SUB TITLE
    // ==================================

    const subtitle =
        document.createElement("div");

    subtitle.className =
        "skill-subtitle";

    subtitle.textContent =
        "Chọn một chiêu thức";


    // ==================================
    // CONTAINER
    // ==================================

    const container =
        document.createElement("div");

    container.className =
        "skill-container";


    // ==================================
    // RANDOM 3 SKILL
    // ==================================

    const skills =
        getRandomSkills(3);


    skills.forEach(
        (skill) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "skill-card";


            button.innerHTML = `

                <img
                    src="${skill.image}"
                    alt="${skill.name}"
                    class="skill-image"
                >

                <div class="skill-name">
                    ${skill.name}
                </div>

                <div class="skill-description">
                    ${skill.description}
                </div>

                ${
                    getSkillStackText(
                        skill.id
                    )
                }
            `;


            button.addEventListener(
                "click",
                () => {

                    // Lưu skill
                    addSkill(
                        skill.id
                    );


                    // Đóng UI
                    skillOverlay.remove();

                    skillOverlay = null;


                    // Báo game tiếp tục
                    if (onSelected) {
                        onSelected();
                    }
                }
            );


            container.appendChild(
                button
            );
        }
    );


    skillOverlay.appendChild(
        title
    );

    skillOverlay.appendChild(
        subtitle
    );

    skillOverlay.appendChild(
        container
    );


    document.body.appendChild(
        skillOverlay
    );
}


// ======================================
// HIỂN THỊ STACK
// ======================================

function getSkillStackText(
    skillId
) {

    return "";
}