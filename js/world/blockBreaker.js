// Block-Breaking-System

class BlockBreaker {
    constructor() {
        this.breakingBlock = null; // { x, y, startTime, progress, blockType, breakTime }
        this.breakFrames = [];
    }
    
    loadBreakFrames() {
        const promises = [];
        for (let i = 1; i <= CONFIG.BREAK_FRAMES; i++) {
            promises.push(loadImage(`b${i}`, `assets/break/b${i}.png`));
        }
        return Promise.all(promises).then(results => {
            results.forEach(({ name, img }) => {
                this.breakFrames.push(img);
            });
        });
    }
    
    getBreakTime(blockType, heldItem) {
        const baseTime = CONFIG.BLOCK_BREAK_TIMES[blockType] || CONFIG.BREAK_TIME;
        
        // Prüfe ob ein Tool gehalten wird
        if (heldItem) {
            const item = ItemRegistry.getByName(heldItem);
            if (item && item.category === 'tools' && item.miningSpeed) {
                // Teile die Zeit durch die Mining-Speed
                return baseTime / item.miningSpeed;
            }
        }
        
        // Keine Tool oder kein Mining-Speed - normale Zeit
        return baseTime;
    }
    
    startBreaking(blockX, blockY, blockType, heldItem) {
        // Neuer Block oder gleicher Block
        if (!this.breakingBlock || 
            this.breakingBlock.x !== blockX || 
            this.breakingBlock.y !== blockY) {
            this.breakingBlock = {
                x: blockX,
                y: blockY,
                blockType: blockType,
                breakTime: this.getBreakTime(blockType, heldItem),
                startTime: Date.now(),
                progress: 0
            };
        }
    }
    
    stopBreaking() {
        this.breakingBlock = null;
    }
    
    update(mouse, world, heldItem) {
        if (!mouse.isDown) {
            this.stopBreaking();
            return null;
        }
        
        // Prüfe ob Block existiert
        const block = world.getBlockAt(mouse.worldX, mouse.worldY, true);
        if (!block) {
            this.stopBreaking();
            return null;
        }
        
        // Starte Breaking
        this.startBreaking(mouse.blockX, mouse.blockY, block, heldItem);
        
        // Berechne Progress
        const elapsed = Date.now() - this.breakingBlock.startTime;
        this.breakingBlock.progress = Math.min(elapsed / this.breakingBlock.breakTime, 1);
        
        // Block zerstört?
        if (this.breakingBlock.progress >= 1) {
            const result = { 
                x: this.breakingBlock.x, 
                y: this.breakingBlock.y,
                blockType: this.breakingBlock.blockType
            };
            this.stopBreaking();
            return result;
        }
        
        return null;
    }
    
    getCurrentFrame() {
        if (!this.breakingBlock) return null;
        
        const frameIndex = Math.floor(this.breakingBlock.progress * CONFIG.BREAK_FRAMES);
        return Math.min(frameIndex, CONFIG.BREAK_FRAMES - 1);
    }
    
    getBreakingBlock() {
        return this.breakingBlock;
    }
    
    getFrameTexture(frameIndex) {
        return this.breakFrames[frameIndex];
    }
}
