// Extensión útil
Array.prototype.last = function () {
    return this[this.length - 1];
};

// Variables del juego
let phase = "waiting";
let lastTimestamp;

let heroX;
let heroY = 0;
let sceneOffset = 0;

let platforms = [];
let sticks = [];

let score = 0;

// Configuración
const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const introductionElement = document.getElementById("introduction");
const perfectElement = document.getElementById("perfect");
const restartButton = document.getElementById("restart");
const scoreElement = document.getElementById("score");

const platformHeight = 100;
const heroDistanceFromEdge = 10;

const stretchingSpeed = 4;
const turningSpeed = 4;
const walkingSpeed = 4;
const transitioningSpeed = 2;
const fallingSpeed = 2;

const heroWidth = 20;
const heroHeight = 30;

// RESET
function resetGame() {
    phase = "waiting";
    lastTimestamp = undefined;
    sceneOffset = 0;
    score = 0;

    introductionElement.style.opacity = 1;
    restartButton.style.display = "none";
    scoreElement.innerText = score;

    platforms = [{ x: 50, w: 50 }];
    generatePlatform();
    generatePlatform();

    sticks = [{
        x: platforms[0].x + platforms[0].w,
        length: 0,
        rotation: 0
    }];

    heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge;
    heroY = 0;

    draw();
}

// GENERAR PLATAFORMAS
function generatePlatform() {
    const last = platforms[platforms.length - 1];
    const gap = 50 + Math.random() * 100;
    const width = 30 + Math.random() * 70;

    platforms.push({
        x: last.x + last.w + gap,
        w: width
    });
}

// EVENTOS
window.addEventListener("mousedown", () => {
    if (phase === "waiting") {
        phase = "stretching";
        introductionElement.style.opacity = 0;
        window.requestAnimationFrame(animate);
    }
});

window.addEventListener("mouseup", () => {
    if (phase === "stretching") {
        phase = "turning";
    }
});

restartButton.addEventListener("click", resetGame);

// LOOP PRINCIPAL
function animate(timestamp) {
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
        window.requestAnimationFrame(animate);
        return;
    }

    const delta = timestamp - lastTimestamp;

    switch (phase) {
        case "waiting":
            return;

        case "stretching":
            sticks.last().length += delta / stretchingSpeed;
            break;

        case "turning":
            sticks.last().rotation += delta / turningSpeed;

            if (sticks.last().rotation >= 90) {
                sticks.last().rotation = 90;
                phase = "walking";
            }
            break;

        case "walking":
            heroX += delta / walkingSpeed;

            const stick = sticks.last();
            const targetX = stick.x + stick.length;

            if (heroX > targetX) {
                phase = "falling";
            }
            break;

        case "falling":
            heroY += delta / fallingSpeed;

            if (heroY > canvas.height) {
                restartButton.style.display = "block";
                return;
            }
            break;
    }

    draw();
    lastTimestamp = timestamp;
    window.requestAnimationFrame(animate);
}

// DIBUJAR
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlatforms();
    drawStick();
    drawHero();
}

// PLATAFORMAS
function drawPlatforms() {
    ctx.fillStyle = "black";

    platforms.forEach(p => {
        ctx.fillRect(
            p.x,
            canvas.height - platformHeight,
            p.w,
            platformHeight
        );
    });
}

// PALO
function drawStick() {
    const stick = sticks.last();

    ctx.save();
    ctx.translate(stick.x, canvas.height - platformHeight);
    ctx.rotate((Math.PI / 180) * stick.rotation);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -stick.length);
    ctx.stroke();

    ctx.restore();
}

// PERSONAJE
function drawHero() {
    ctx.fillStyle = "black";
    ctx.fillRect(
        heroX - heroWidth / 2,
        canvas.height - platformHeight - heroHeight - heroY,
        heroWidth,
        heroHeight
    );
}

// INICIO
resetGame();
