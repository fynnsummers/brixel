// Start Screen mit animierter Welt als Hintergrund

const startScreen = document.getElementById('start-screen');
const loadingScreen = document.getElementById('loading-screen');
const helpOverlay = document.getElementById('help-overlay');
const itemsOverlay = document.getElementById('items-overlay');
const bgCanvas = document.getElementById('bg-canvas');
const loadingCanvas = document.getElementById('loading-canvas');
const newGameBtn = document.getElementById('new-game-btn');
const helpBtn = document.getElementById('help-btn');
const itemsBtn = document.getElementById('items-btn');
const closeHelpBtn = document.getElementById('close-help-btn');
const closeItemsBtn = document.getElementById('close-items-btn');
const recipeSearch = document.getElementById('recipe-search');
const recipeList = document.getElementById('recipe-list');
const itemSearch = document.getElementById('item-search');
const itemList = document.getElementById('item-list');
const bgMusic = document.getElementById('bg-music');

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

// Tag-Nacht-Zyklus für Load Screen
let dayTime = 0.5; // Start am Tag
let lastTime = Date.now();

// Day-Night Cycle Update
function updateDayNightCycle() {
    const now = Date.now();
    const deltaTime = now - lastTime;
    lastTime = now;
    
    dayTime += deltaTime / CONFIG.LOAD_SCREEN.CYCLE_DURATION;
    if (dayTime >= 1) {
        dayTime -= 1;
    }
}

// Himmel-Farben berechnen
function getSkyColors() {
    const time = dayTime;
    
    const colors = {
        night: { top: '#1a1a3a', bottom: '#2a2a4e' },
        sunrise: { top: '#ff6b35', bottom: '#ffd93d' },
        day: { top: '#87CEEB', bottom: '#b8e6ff' },
        sunset: { top: '#ff6b35', bottom: '#ff8c42' },
    };
    
    let topColor, bottomColor;
    
    if (time < 0.2) {
        const t = time / 0.2;
        topColor = lerpColor(colors.night.top, colors.sunrise.top, t);
        bottomColor = lerpColor(colors.night.bottom, colors.sunrise.bottom, t);
    } else if (time < 0.3) {
        const t = (time - 0.2) / 0.1;
        topColor = lerpColor(colors.sunrise.top, colors.day.top, t);
        bottomColor = lerpColor(colors.sunrise.bottom, colors.day.bottom, t);
    } else if (time < 0.7) {
        topColor = colors.day.top;
        bottomColor = colors.day.bottom;
    } else if (time < 0.8) {
        const t = (time - 0.7) / 0.1;
        topColor = lerpColor(colors.day.top, colors.sunset.top, t);
        bottomColor = lerpColor(colors.day.bottom, colors.sunset.bottom, t);
    } else {
        const t = (time - 0.8) / 0.2;
        topColor = lerpColor(colors.sunset.top, colors.night.top, t);
        bottomColor = lerpColor(colors.sunset.bottom, colors.night.bottom, t);
    }
    
    return { top: topColor, bottom: bottomColor };
}

// Farb-Interpolation
function lerpColor(color1, color2, t) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Dunkelheit berechnen
function getDarkness() {
    const time = dayTime;
    const NIGHT_DARKNESS = CONFIG.LOAD_SCREEN.NIGHT_DARKNESS;
    
    if (time < 0.2) {
        const t = time / 0.2;
        return (1 - t) * (1 - NIGHT_DARKNESS);
    } else if (time < 0.3) {
        return 0;
    } else if (time < 0.7) {
        return 0;
    } else if (time < 0.8) {
        const t = (time - 0.7) / 0.1;
        return t * (1 - NIGHT_DARKNESS) * 0.5;
    } else {
        const t = (time - 0.8) / 0.2;
        return 0.5 * (1 - NIGHT_DARKNESS) + t * 0.5 * (1 - NIGHT_DARKNESS);
    }
}

// Pixeliger Gradient
function drawPixelatedGradient(ctx, colors) {
    const pixelSize = 32;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const colorSteps = 8;
    
    for (let y = 0; y < height; y += pixelSize) {
        const t = y / height;
        const quantizedT = Math.floor(t * colorSteps) / colorSteps;
        const color = lerpColor(colors.top, colors.bottom, quantizedT);
        
        ctx.fillStyle = color;
        ctx.fillRect(0, y, width, pixelSize);
    }
}

// Texturen laden
async function loadTextures() {
    const textureNames = [
        'stone', 'dirt', 'dirt-grass', 'grass', 'coalore', 'ironore', 'goldore', 
        'diamondore', 'emeraldore', 'bedrock', 'diorite', 'granite',
        'tree', 'tree-leaves', 'tree-head', 'dirt-grass-tree', 'wood', 'wood-stick',
        'coal', 'iron', 'gold', 'diamond', 'emerald'
    ];
    
    const promises = textureNames.map(name => {
        return loadImage(name, `assets/textures/${name}.png`);
    });
    
    // Tool textures
    const toolTypes = ['pickaxe', 'axe', 'shovel', 'sword'];
    const materials = ['wood', 'stone', 'iron', 'gold', 'diamond', 'emerald'];
    
    materials.forEach(material => {
        toolTypes.forEach(tool => {
            const name = `${tool}-${material}`;
            promises.push(loadImage(name, `assets/tools/${name}.png`));
        });
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
    // Update Day-Night Cycle
    updateDayNightCycle();
    
    // Himmel mit Gradient
    const skyColors = getSkyColors();
    drawPixelatedGradient(ctx, skyColors);
    
    const darkness = getDarkness();
    
    const zoom = CONFIG.LOAD_SCREEN.ZOOM;
    const cameraOffsetY = CONFIG.BLOCK_SIZE * CONFIG.LOAD_SCREEN.CAMERA_OFFSET_Y;
    
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(0, cameraOffsetY);
    
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
    
    // Dunkelheit als Overlay über den gesamten Canvas (hinter dem Logo)
    if (darkness > 0) {
        ctx.save();
        ctx.globalAlpha = darkness;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
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

// Help Button
helpBtn.addEventListener('click', () => {
    helpOverlay.classList.remove('hidden');
    renderRecipes();
});

// Close Help Button
closeHelpBtn.addEventListener('click', () => {
    helpOverlay.classList.add('hidden');
});

// Recipe Search
recipeSearch.addEventListener('input', (e) => {
    renderRecipes(e.target.value.toLowerCase());
});

// Item Index Button
itemsBtn.addEventListener('click', () => {
    itemsOverlay.classList.remove('hidden');
    renderItems();
});

// Close Item Index Button
closeItemsBtn.addEventListener('click', () => {
    itemsOverlay.classList.add('hidden');
});

// Item Search
itemSearch.addEventListener('input', (e) => {
    renderItems(e.target.value.toLowerCase());
});

// Render Items
function renderItems(searchTerm = '') {
    itemList.innerHTML = '';
    
    const allItems = ItemRegistry.listAll();
    
    // Filter items first
    const filteredItems = allItems.filter(item => {
        if (!searchTerm) return true;
        return item.name.toLowerCase().includes(searchTerm) || 
               item.key.toLowerCase().includes(searchTerm);
    });
    
    // Sort by category, then by subcategory, then by name
    filteredItems.sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        if (a.subcategory !== b.subcategory) {
            return a.subcategory.localeCompare(b.subcategory);
        }
        return a.name.localeCompare(b.name);
    });
    
    // Count items per category
    const categoryCounts = {};
    filteredItems.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
    
    let currentCategory = null;
    
    filteredItems.forEach(item => {
        // Add category header if category changed
        if (item.category !== currentCategory) {
            currentCategory = item.category;
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'item-category-header';
            
            const categoryName = item.category.charAt(0).toUpperCase() + item.category.slice(1);
            const count = categoryCounts[item.category];
            
            categoryHeader.textContent = `${categoryName} (${count})`;
            itemList.appendChild(categoryHeader);
        }
        
        // Create item card
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        // Item image
        const itemImage = document.createElement('div');
        itemImage.className = 'item-image';
        
        const texture = textures[item.key];
        if (texture) {
            const img = document.createElement('img');
            img.src = texture.src;
            itemImage.appendChild(img);
        }
        
        itemCard.appendChild(itemImage);
        
        // Item name
        const itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = item.name;
        itemCard.appendChild(itemName);
        
        // Item key (ID name)
        const itemKey = document.createElement('div');
        itemKey.className = 'item-id';
        itemKey.textContent = item.key;
        itemCard.appendChild(itemKey);
        
        itemList.appendChild(itemCard);
    });
    
    // No results message
    if (itemList.children.length === 0) {
        const noResults = document.createElement('div');
        noResults.style.color = '#fff';
        noResults.style.textAlign = 'center';
        noResults.style.fontSize = '16px';
        noResults.style.gridColumn = '1 / -1';
        noResults.textContent = 'No items found';
        itemList.appendChild(noResults);
    }
}

// Render Recipes
function renderRecipes(searchTerm = '') {
    recipeList.innerHTML = '';
    
    RECIPES.forEach(recipe => {
        const resultItem = ItemRegistry.getByName(recipe.result.item);
        if (!resultItem) return;
        
        // Filter by search term
        if (searchTerm && !resultItem.name.toLowerCase().includes(searchTerm) && 
            !recipe.result.item.toLowerCase().includes(searchTerm)) {
            return;
        }
        
        // Create recipe item
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        
        // Crafting row (grid + arrow + result visual)
        const craftingRow = document.createElement('div');
        craftingRow.className = 'recipe-crafting-row';
        
        // Create grid
        const grid = document.createElement('div');
        grid.className = 'recipe-grid';
        
        // Fill grid (4x4)
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const slot = document.createElement('div');
                slot.className = 'recipe-slot';
                
                // Check if pattern has this position
                if (recipe.pattern && recipe.pattern[row] && recipe.pattern[row][col]) {
                    const itemKey = recipe.pattern[row][col];
                    const texture = textures[itemKey];
                    
                    if (texture) {
                        const img = document.createElement('img');
                        img.src = texture.src;
                        slot.appendChild(img);
                    }
                }
                
                grid.appendChild(slot);
            }
        }
        
        craftingRow.appendChild(grid);
        
        // Arrow
        const arrow = document.createElement('div');
        arrow.className = 'recipe-arrow';
        arrow.textContent = '→';
        craftingRow.appendChild(arrow);
        
        // Result visual (image + name)
        const resultVisual = document.createElement('div');
        resultVisual.className = 'recipe-result-visual';
        
        const resultSlot = document.createElement('div');
        resultSlot.className = 'recipe-result-slot';
        
        const resultTexture = textures[recipe.result.item];
        if (resultTexture) {
            const img = document.createElement('img');
            img.src = resultTexture.src;
            resultSlot.appendChild(img);
        }
        
        // Count badge
        if (recipe.result.count > 1) {
            const count = document.createElement('div');
            count.className = 'recipe-count';
            count.textContent = recipe.result.count;
            resultSlot.appendChild(count);
        }
        
        resultVisual.appendChild(resultSlot);
        
        // Name
        const name = document.createElement('div');
        name.className = 'recipe-name';
        name.textContent = resultItem.name;
        resultVisual.appendChild(name);
        
        craftingRow.appendChild(resultVisual);
        recipeItem.appendChild(craftingRow);
        
        // Description (below everything)
        const description = document.createElement('div');
        description.className = 'recipe-description';
        
        // Generate description like tooltips
        let descLines = [];
        if (resultItem.category === 'tools') {
            if (resultItem.damage) {
                descLines.push(`Damage: ${resultItem.damage}`);
            }
            if (resultItem.miningSpeed) {
                descLines.push(`Speed: ${resultItem.miningSpeed}x`);
            }
        } else if (resultItem.description) {
            descLines.push(resultItem.description);
        }
        
        description.textContent = descLines.length > 0 ? descLines.join(' | ') : resultItem.name;
        recipeItem.appendChild(description);
        
        recipeList.appendChild(recipeItem);
    });
    
    // No results message
    if (recipeList.children.length === 0) {
        const noResults = document.createElement('div');
        noResults.style.color = '#fff';
        noResults.style.textAlign = 'center';
        noResults.style.fontSize = '16px';
        noResults.textContent = 'No recipes found';
        recipeList.appendChild(noResults);
    }
}

function startGame() {
    // Verstecke Start Screen
    startScreen.classList.add('hidden');
    
    // Zeige Loading Screen
    loadingScreen.classList.remove('hidden');
    loadingCameraX = cameraX; // Starte von aktueller Position
    animateLoadingScreen();
    
    // Verwende die konfigurierte Ladezeit
    const loadTime = CONFIG.LOAD_SCREEN.LOADING_TIME;
    const startTime = Date.now();
    
    // Warte bis die Ladezeit abgelaufen ist
    const checkComplete = setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed >= loadTime) {
            clearInterval(checkComplete);
            
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
                window.location.href = 'world.html';
            }, 500);
        }
    }, 100);
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
