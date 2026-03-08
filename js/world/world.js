// Welt-Generierung und Chunk-Management

class World {
    constructor() {
        this.chunks = new Map();
        this.brokenBlocks = new Set(); // Speichert zerstörte Blöcke als "chunkX,localX,y"
        this.breakAnimations = []; // { blockX, blockY, startTime, duration }
    }
    
    getBlockKey(blockX, blockY) {
        const chunkX = Math.floor(blockX / CONFIG.CHUNK_WIDTH);
        const localX = blockX - chunkX * CONFIG.CHUNK_WIDTH;
        return `${chunkX},${localX},${blockY}`;
    }
    
    placeBlock(blockX, blockY, blockType) {
        const key = this.getBlockKey(blockX, blockY);
        
        // Entferne Block aus der "broken" Liste falls vorhanden
        this.brokenBlocks.delete(key);
        
        // Füge Block zum Chunk hinzu oder ersetze existierenden Block
        const chunkX = Math.floor(blockX / CONFIG.CHUNK_WIDTH);
        const chunk = this.generateChunk(chunkX);
        const localX = blockX - chunkX * CONFIG.CHUNK_WIDTH;
        
        if (localX >= 0 && localX < CONFIG.CHUNK_WIDTH && blockY >= 0 && blockY < CONFIG.WORLD_HEIGHT) {
            chunk[localX][blockY] = blockType;
        }
    }
    
    breakBlock(blockX, blockY, blockType) {
        const key = this.getBlockKey(blockX, blockY);
        
        // Prüfe ob Block bereits zerstört ist
        if (this.brokenBlocks.has(key)) return;
        
        this.brokenBlocks.add(key);
        
        // Break-Animation hinzufügen
        this.breakAnimations.push({
            blockX: blockX,
            blockY: blockY,
            blockType: blockType, // Speichere Block-Typ für Partikel
            startTime: Date.now(),
            duration: CONFIG.BREAK_ANIMATION_DURATION
        });
        
        // Wenn dirt-grass abgebaut wird, entferne auch grass darüber
        if (blockType === 'dirt-grass') {
            const grassAbove = this.getBlockAtCoords(blockX, blockY - 1);
            if (grassAbove === 'grass') {
                const grassKey = this.getBlockKey(blockX, blockY - 1);
                
                if (!this.brokenBlocks.has(grassKey)) {
                    this.brokenBlocks.add(grassKey);
                    
                    // Animation für Grass
                    this.breakAnimations.push({
                        blockX: blockX,
                        blockY: blockY - 1,
                        blockType: 'grass',
                        startTime: Date.now(),
                        duration: CONFIG.BREAK_ANIMATION_DURATION
                    });
                }
            }
        }
    }

    
    isBlockBroken(blockX, blockY) {
        const key = this.getBlockKey(blockX, blockY);
        return this.brokenBlocks.has(key);
    }
    
    getBlockAtCoords(blockX, blockY) {
        if (blockY < 0 || blockY >= CONFIG.WORLD_HEIGHT) return null;
        if (this.isBlockBroken(blockX, blockY)) return null;
        
        const chunkX = Math.floor(blockX / CONFIG.CHUNK_WIDTH);
        const chunk = this.generateChunk(chunkX);
        const localX = blockX - chunkX * CONFIG.CHUNK_WIDTH;
        
        if (localX < 0 || localX >= CONFIG.CHUNK_WIDTH) return null;
        
        return chunk[localX][blockY];
    }
    
    updateAnimations() {
        const now = Date.now();
        this.breakAnimations = this.breakAnimations.filter(anim => {
            return (now - anim.startTime) < anim.duration;
        });
    }
    
    getBreakAnimations() {
        return this.breakAnimations;
    }
    
    getAnimationProgress(blockX, blockY) {
        const anim = this.breakAnimations.find(a => a.blockX === blockX && a.blockY === blockY);
        if (!anim) return null;
        
        const elapsed = Date.now() - anim.startTime;
        return Math.min(elapsed / anim.duration, 1);
    }
    
    generateChunk(chunkX) {
        if (this.chunks.has(chunkX)) return this.chunks.get(chunkX);
        
        const chunk = [];
        const seed = chunkX * 1000;
        const heights = []; // Speichere Höhen für Glättung
        
        // Erste Pass: Berechne alle Höhen mit verbessertem Noise
        for (let x = 0; x < CONFIG.CHUNK_WIDTH; x++) {
            const worldX = chunkX * CONFIG.CHUNK_WIDTH + x;
            
            // Multi-Layer Noise für natürliches Terrain
            const baseNoise = Math.sin(worldX * CONFIG.TERRAIN.BASE_FREQUENCY + seed * 0.001) * CONFIG.TERRAIN.BASE_AMPLITUDE;
            const detailNoise = Math.sin(worldX * CONFIG.TERRAIN.DETAIL_FREQUENCY + seed * 0.01) * CONFIG.TERRAIN.DETAIL_AMPLITUDE;
            const mountainNoise = Math.sin(worldX * CONFIG.TERRAIN.MOUNTAIN_FREQUENCY + seed * 0.0001) * CONFIG.TERRAIN.MOUNTAIN_AMPLITUDE;
            
            // Zusätzliche Variation für natürlichere Hügel
            const variation1 = Math.sin(worldX * 0.03 + seed * 0.002) * 0.5;
            const variation2 = Math.cos(worldX * 0.06 + seed * 0.005) * 0.3;
            
            const totalNoise = baseNoise + detailNoise + mountainNoise + variation1 + variation2;
            const rawHeight = CONFIG.MIN_HEIGHT + (CONFIG.MAX_HEIGHT - CONFIG.MIN_HEIGHT) / 2 + totalNoise;
            heights.push(rawHeight);
        }
        
        // Zweite Pass: Mehrfache Glättung für sanfte Hügel
        let smoothedHeights = [...heights];
        for (let pass = 0; pass < CONFIG.TERRAIN.SMOOTHING_PASSES; pass++) {
            const tempHeights = [...smoothedHeights];
            for (let x = 1; x < CONFIG.CHUNK_WIDTH - 1; x++) {
                // Durchschnitt mit Nachbarn für sanfte Übergänge
                tempHeights[x] = (smoothedHeights[x - 1] + smoothedHeights[x] * 2 + smoothedHeights[x + 1]) / 4;
            }
            smoothedHeights = tempHeights;
        }
        
        // Dritte Pass: Begrenze Höhenänderung für kletterbare Steigungen
        const finalHeights = [Math.floor(smoothedHeights[0])];
        for (let x = 1; x < CONFIG.CHUNK_WIDTH; x++) {
            const targetHeight = Math.floor(smoothedHeights[x]);
            const heightDiff = targetHeight - finalHeights[x - 1];
            
            // Wenn zu steil, reduziere auf max Änderung
            if (Math.abs(heightDiff) > CONFIG.TERRAIN.MAX_HEIGHT_CHANGE) {
                if (heightDiff > 0) {
                    finalHeights.push(finalHeights[x - 1] + CONFIG.TERRAIN.MAX_HEIGHT_CHANGE);
                } else {
                    finalHeights.push(finalHeights[x - 1] - CONFIG.TERRAIN.MAX_HEIGHT_CHANGE);
                }
            } else {
                finalHeights.push(targetHeight);
            }
        }
        
        // Vierte Pass: Erstelle Chunks mit geglätteten Höhen und Ore-Adern
        const oreVeins = new Set(); // Speichere Ore-Positionen für Adern
        
        for (let x = 0; x < CONFIG.CHUNK_WIDTH; x++) {
            const surfaceHeight = finalHeights[x];
            
            const column = [];
            for (let y = 0; y < CONFIG.WORLD_HEIGHT; y++) {
                let blockType = null;
                
                if (y === surfaceHeight) {
                    blockType = 'grass';
                } else if (y === surfaceHeight + 1) {
                    blockType = 'dirt-grass';
                } else if (y > surfaceHeight + 1 && y <= surfaceHeight + 1 + CONFIG.STONE_DEPTH) {
                    blockType = 'dirt';
                } else if (y > surfaceHeight + 1 + CONFIG.STONE_DEPTH) {
                    blockType = 'stone';
                    
                    const blockX = chunkX * CONFIG.CHUNK_WIDTH + x;
                    const veinKey = `${blockX},${y}`;
                    
                    // Coal Ore - seltener (1.5% statt 5%), aber in Adern von 2-4 Blöcken
                    const coalSeed = blockX * 1000 + y * 100;
                    if (seededRandom(coalSeed) < 0.015 && !oreVeins.has(veinKey)) {
                        // Erstelle Coal-Ader
                        const veinSize = Math.floor(seededRandom(coalSeed + 1) * 3) + 2; // 2-4 Blöcke
                        blockType = 'coalore';
                        oreVeins.add(veinKey);
                        
                        // Füge benachbarte Blöcke zur Ader hinzu (max 3 Blöcke in eine Richtung)
                        let added = 1;
                        for (let i = 1; i < veinSize && added < 3; i++) {
                            const direction = seededRandom(coalSeed + i + 10) > 0.5 ? 1 : -1;
                            const neighborKey = `${blockX + direction * i},${y}`;
                            if (!oreVeins.has(neighborKey)) {
                                oreVeins.add(neighborKey);
                                added++;
                            }
                        }
                    }
                    
                    // Iron Ore - tiefer unten (ab Y > surfaceHeight + 30), sehr selten (0.8%)
                    if (y > surfaceHeight + 30) {
                        const ironSeed = blockX * 2000 + y * 200;
                        if (seededRandom(ironSeed) < 0.008 && !oreVeins.has(veinKey)) {
                            blockType = 'ironore';
                            oreVeins.add(veinKey);
                        }
                    }
                    
                    // Prüfe ob dieser Block Teil einer Ader ist
                    if (oreVeins.has(veinKey) && blockType === 'stone') {
                        // Finde heraus welches Ore hier sein sollte
                        for (let checkX = x - 3; checkX <= x + 3; checkX++) {
                            if (checkX < 0 || checkX >= CONFIG.CHUNK_WIDTH) continue;
                            const checkBlockX = chunkX * CONFIG.CHUNK_WIDTH + checkX;
                            const checkKey = `${checkBlockX},${y}`;
                            if (oreVeins.has(checkKey)) {
                                const checkSeed = checkBlockX * 1000 + y * 100;
                                if (seededRandom(checkSeed) < 0.015) {
                                    blockType = 'coalore';
                                    break;
                                }
                            }
                        }
                    }
                }
                
                column.push(blockType);
            }
            chunk.push(column);
        }
        
        this.chunks.set(chunkX, chunk);
        return chunk;
    }
    
    getBlockAt(worldX, worldY, includeGrass = false) {
        const blockX = Math.floor(worldX / CONFIG.BLOCK_SIZE);
        const blockY = Math.floor(worldY / CONFIG.BLOCK_SIZE);
        
        if (blockY < 0 || blockY >= CONFIG.WORLD_HEIGHT) return null;
        
        // Prüfe ob Block zerstört wurde
        if (this.isBlockBroken(blockX, blockY)) return null;
        
        const chunkX = Math.floor(blockX / CONFIG.CHUNK_WIDTH);
        const chunk = this.generateChunk(chunkX);
        const localX = blockX - chunkX * CONFIG.CHUNK_WIDTH;
        
        if (localX < 0 || localX >= CONFIG.CHUNK_WIDTH) return null;
        
        const blockType = chunk[localX][blockY];
        
        // Grass-Block hat keine Kollision (außer für Hover)
        if (blockType === 'grass' && !includeGrass) return null;
        
        return blockType;
    }
    
    cleanupChunks(startChunk, endChunk) {
        for (let [chunkX] of this.chunks) {
            if (chunkX < startChunk - 2 || chunkX > endChunk + 2) {
                this.chunks.delete(chunkX);
            }
        }
    }
}
