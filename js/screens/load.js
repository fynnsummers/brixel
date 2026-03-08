// Start Screen mit animierter Welt als Hintergrund

const startScreen = document.getElementById('start-screen');
const loadingScreen = document.getElementById('loading-screen');
const bgCanvas = document.getElementById('bg-canvas');
const loadingCanvas = document.getElementById('loading-canvas');
const newGameBtn = document.getElementById('new-game-btn');
const bgMusic = document.getElementById('bg-music');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

// Canvas Setup
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;
loadingCanvas.width = window.innerWidth;
loadingCanvas.height = window.innerHeight;

const bgCtx = bgCanvas.getContext('2d');
const loadingCtx = loadingCanvas.getContext('2d');

// Welt für Hintergrund
const world = new World();
const textures = {};
let cameraX = 0; // Start Screen: nach rechts
let loadingCameraX = 0; // Loading: nach links

// Texturen laden
async function loadTextures() {
    const textureNames = ['stone', 'dirt', 'dirt-grass', 'grass', 'coalore'];
    
    const promises = textureNames.map(name => {
        return loadImage(name, `assets/textures/${name}.png`);
    });
    
    const results = await Promise.all(promises);
    results.forEach(({ name, img }) => {
        if (img) {
            textures[name] = img;
        }
    });
}

// Welt rendern
function renderWorld(ctx, cameraX) {
    // Himmel
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const zoom = 1;
    ctx.save();
    ctx.scale(zoom, zoom);
    
    const startChunk = Math.floor((cameraX - CONFIG.BLOCK_SIZE) / (CONFIG.CHUNK_WIDTH * CONFIG.BLOCK_SIZE));
    const endChunk = Math.ceil((cameraX + ctx.canvas.width / zoom + CONFIG.BLOCK_SIZE) / (CONFIG.CHUNK_WIDTH * CONFIG.BLOCK_SIZE));
    
    for (let chunkX = startChunk; chunkX <= endChunk; chunkX++) {
        const chunk = world.generateChunk(chunkX);
        
        for (let x = 0; x < CONFIG.CHUNK_WIDTH; x++) {
            for (let y = 0; y < CONFIG.WORLD_HEIGHT; y++) {
                const blockType = chunk[x][y];
                if (!blockType) continue;
                
                const worldX = (chunkX * CONFIG.CHUNK_WIDTH + x) * CONFIG.BLOCK_SIZE;
                const worldY = y * CONFIG.BLOCK_SIZE;
                const screenX = worldX - cameraX;
                const screenY = worldY;
                
                if (screenX > -CONFIG.BLOCK_SIZE && screenX < ctx.canvas.width / zoom &&
                    screenY > -CONFIG.BLOCK_SIZE && screenY < ctx.canvas.height / zoom) {
                    
                    const texture = textures[blockType];
                    if (texture) {
                        ctx.drawImage(texture, screenX, screenY, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
                    }
                }
            }
        }
    }
    
    ctx.restore();
}

// Animation Loop für Start Screen
function animateStartScreen() {
    if (!startScreen.classList.contains('hidden')) {
        cameraX += 0.5; // Langsam nach rechts
        renderWorld(bgCtx, cameraX);
        requestAnimationFrame(animateStartScreen);
    }
}

// Animation Loop für Loading Screen
function animateLoadingScreen() {
    if (!loadingScreen.classList.contains('hidden')) {
        loadingCameraX -= 0.5; // Langsam nach links
        renderWorld(loadingCtx, loadingCameraX);
        requestAnimationFrame(animateLoadingScreen);
    }
}

// Musik starten bei erstem Klick oder Tastendruck
let musicStarted = false;
function startMusic() {
    if (!musicStarted) {
        bgMusic.volume = 0.1; // 10% Lautstärke
        bgMusic.play().catch(e => {
            console.log('Audio play failed:', e);
            // Fallback: Versuche bei nächster Interaktion
            document.addEventListener('click', () => {
                bgMusic.volume = 0.1;
                bgMusic.play();
            }, { once: true });
        });
        musicStarted = true;
    }
}

// Versuche Musik sofort zu starten
startMusic();

// Falls Browser Autoplay blockiert, starte bei erster Interaktion
document.addEventListener('click', startMusic);
document.addEventListener('keydown', startMusic);

// New Game Button
newGameBtn.addEventListener('click', () => {
    startGame();
});

function startGame() {
    // Verstecke Start Screen
    startScreen.classList.add('hidden');
    
    // Zeige Loading Screen
    loadingScreen.classList.remove('hidden');
    loadingCameraX = cameraX; // Starte von aktueller Position
    animateLoadingScreen();
    
    // Zufällige Ladezeit zwischen 5-8 Sekunden
    const totalTime = 5000 + Math.random() * 3000;
    const updateInterval = 50;
    const totalSteps = totalTime / updateInterval;
    
    let progress = 0;
    let step = 0;
    
    const interval = setInterval(() => {
        step++;
        // Nicht-lineare Progression für realistischeres Laden
        const rawProgress = step / totalSteps;
        progress = Math.floor(rawProgress * 100);
        
        // Manchmal kleine Sprünge, manchmal langsamer
        if (Math.random() > 0.7) {
            progress += Math.floor(Math.random() * 5);
        }
        
        progress = Math.min(progress, 100);
        
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Fade out Musik
            const fadeOut = setInterval(() => {
                if (bgMusic.volume > 0.05) {
                    bgMusic.volume -= 0.05;
                } else {
                    bgMusic.pause();
                    clearInterval(fadeOut);
                }
            }, 100);
            
            // Navigiere zum Spiel
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
    }, updateInterval);
}

// Window Resize
window.addEventListener('resize', () => {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    loadingCanvas.width = window.innerWidth;
    loadingCanvas.height = window.innerHeight;
});

// Version anzeigen
document.getElementById('version-start').textContent = CONFIG.VERSION;
document.getElementById('version-loading').textContent = CONFIG.VERSION;

// Start
loadTextures().then(() => {
    animateStartScreen();
});
