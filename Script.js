// --- Variables de configuración ---
const canvas = document.getElementById("gameCanvas"); // Asegúrate de tener este ID en tu HTML
const ctx = canvas.getContext("2d");

// Ajustar tamaño del canvas al de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sceneOffset = 0; // Esto controla el movimiento del fondo
const backgroundSpeedMultiplier = 0.2;
const treeCrownWidth = 20;
const treeCrownHeight = 30;
const treeTrunkHeight = 15;

// --- Tus funciones de la imagen (Corregidas) ---

function getHilly(windowX, baseHeight, amplitude, stretch) {
    const sineBaseY = window.innerHeight - baseHeight;
    return (
        Math.sin((sceneOffset * backgroundSpeedMultiplier + windowX) * stretch) *
        amplitude +
        sineBaseY
    );
}

function getTreeY(x, baseHeight, amplitude) {
    const sineBaseY = window.innerHeight - baseHeight;
    // Corregido: Math.sin en lugar de Math.sinus
    return Math.sin(x) * amplitude + sineBaseY;
}

function drawCrown(color) {
    ctx.beginPath();
    ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
    ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
    ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
    ctx.fillStyle = color;
    ctx.fill();
}

// --- Funciones de dibujo adicionales para el estilo visual ---

function drawScene() {
    // 1. Limpiar y pintar el cielo (color crema de la imagen)
    ctx.fillStyle = "#f0f0d8"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Dibujar las colinas verdes
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width; x++) {
        // Generamos la curva usando tu lógica
        const y = getHilly(x, 120, 30, 0.01);
        ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fillStyle = "#91cb3e"; // Verde de la imagen
    ctx.fill();

    // 3. Dibujar árboles (opcional, en puntos específicos de la colina)
    ctx.save();
    ctx.translate(100, getHilly(100, 120, 30, 0.01)); // Ejemplo de posición
    drawCrown("#4a7c2a");
    ctx.restore();

    // 4. Dibujar plataformas (estilo Stick Hero)
    drawPlatform(50, 60);  // Plataforma inicial
    drawPlatform(250, 40); // Siguiente plataforma
}

function drawPlatform(x, width) {
    const platformHeight = 250;
    const y = canvas.height - platformHeight;

    // Cuerpo negro
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, width, platformHeight);

    // Punto rojo de bonus
    const bonusSize = 8;
    ctx.fillStyle = "red";
    ctx.fillRect(x + (width / 2) - (bonusSize / 2), y, bonusSize, bonusSize);
}

// --- Bucle de animación ---
function animate() {
    // sceneOffset += 1; // Descomenta esto para que las colinas se muevan
    drawScene();
    requestAnimationFrame(animate);
}

animate();
