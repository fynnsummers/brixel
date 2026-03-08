// Player-Logik

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 64;
        this.vx = 0;
        this.vy = 0;
        this.targetVx = 0;
        this.onGround = false;
        this.wasOnGround = false;
        this.airTime = 0;
        this.highestAirY = y;
        this.facingRight = true;
        this.scale = 1;
        this.targetScale = 1;
        this.firstSpawn = true;
        this.flyMode = false;
        
        // Animations-System
        this.animationTime = 0;
        this.currentFrame = 0;
        this.isMoving = false;
    }
    
    update(keys, world) {
        this.wasOnGround = this.onGround;
        
        this.targetVx = 0;
        
        const isSprinting = !this.flyMode && keys['shift'];
        const currentSpeed = isSprinting ? CONFIG.SPRINT_SPEED : CONFIG.MOVE_SPEED;
        
        if (keys['a']) {
            this.targetVx = -currentSpeed;
            this.facingRight = false;
        }
        if (keys['d']) {
            this.targetVx = currentSpeed;
            this.facingRight = true;
        }
        
        this.targetScale = this.facingRight ? 1 : -1;
        this.scale += (this.targetScale - this.scale) * 0.3;
        
        this.vx += (this.targetVx - this.vx) * CONFIG.MOVE_ACCELERATION;
        
        if (this.onGround && this.targetVx === 0) {
            this.vx *= CONFIG.FRICTION;
        }
        
        if (this.flyMode) {
            this.vy = 0;
            
            if (keys[' ']) {
                this.vy = -5;
            }
            
            if (keys['shift']) {
                this.vy = 5;
            }
            
            this.x += this.vx;
            if (this.checkCollision(world)) {
                this.x -= this.vx;
                this.vx = 0;
            }
            
            this.y += this.vy;
            if (this.checkCollision(world)) {
                this.y -= this.vy;
                this.vy = 0;
            }
            
            this.onGround = false;
            this.highestAirY = this.y;
            
            return;
        } else {
            if (this.onGround) {
                const stillOnGround = this.checkGroundBelow(world);
                if (!stillOnGround) {
                    this.onGround = false;
                }
            }
            
            if (!this.onGround && this.wasOnGround) {
                this.highestAirY = this.y;
                console.log(`Left ground at Y: ${this.y.toFixed(1)}`);
            }
            
            if (!this.onGround) {
                if (this.y < this.highestAirY) {
                    this.highestAirY = this.y;
                }
            }
            
            this.vy += CONFIG.GRAVITY;
        }
        
        this.x += this.vx;
        if (this.checkCollision(world)) {
            this.x -= this.vx;
            this.vx = 0;
        }
        
        this.y += this.vy;
        
        if (!this.flyMode) {
            this.onGround = false;
            
            if (this.checkCollision(world)) {
                if (this.vy > 0) {
                    this.onGround = true;
                }
                this.y -= this.vy;
                this.vy = 0;
            }
        }
    }
    
    getFallDamage() {
        if (this.onGround && !this.wasOnGround) {
            if (this.firstSpawn) {
                console.log('First spawn landing - no fall damage');
                this.firstSpawn = false;
                this.highestAirY = this.y;
                return 0;
            }
            
            const startBlockY = Math.floor(this.highestAirY / CONFIG.BLOCK_SIZE);
            const endBlockY = Math.floor(this.y / CONFIG.BLOCK_SIZE);
            const fallBlocks = endBlockY - startBlockY;
            
            console.log(`Landed! From block Y:${startBlockY} to Y:${endBlockY} = ${fallBlocks} blocks fallen`);
            
            this.highestAirY = this.y;
            
            if (fallBlocks >= CONFIG.FALL_DAMAGE_THRESHOLD) {
                const damage = Math.floor(fallBlocks / CONFIG.FALL_DAMAGE_PER_BLOCK);
                console.log(`Fall damage: ${damage} hearts (${fallBlocks} blocks / ${CONFIG.FALL_DAMAGE_PER_BLOCK})`);
                return damage;
            }
        }
        
        if (this.onGround) {
            this.highestAirY = this.y;
        }
        
        return 0;
    }
    
    checkGroundBelow(world) {
        const checkPoints = [
            [this.x + 2, this.y + this.height + 1],
            [this.x + this.width - 2, this.y + this.height + 1],
            [this.x + this.width / 2, this.y + this.height + 1]
        ];
        
        for (let [cx, cy] of checkPoints) {
            if (world.getBlockAt(cx, cy, false)) return true;
        }
        return false;
    }
    
    checkCollision(world) {
        const corners = [
            [this.x + 1, this.y + 1],
            [this.x + this.width - 1, this.y + 1],
            [this.x + 1, this.y + this.height - 1],
            [this.x + this.width - 1, this.y + this.height - 1],
            [this.x + this.width / 2, this.y + this.height - 1]
        ];
        
        for (let [cx, cy] of corners) {
            if (world.getBlockAt(cx, cy, false)) return true;
        }
        return false;
    }
    
    jump() {
        if (this.onGround) {
            this.vy = CONFIG.JUMP_FORCE;
            this.onGround = false;
        }
    }
    
    getAnimationFrame() {
        const isMoving = Math.abs(this.vx) > 0.1;
        const isJumping = !this.onGround; // Prüfe ob in der Luft
        
        if (isMoving) {
            // Prüfe ob Sprint aktiv ist (höhere Geschwindigkeit)
            const isSprinting = Math.abs(this.vx) > CONFIG.MOVE_SPEED;
            
            // Lauf-Animation: p-go1, p-go2
            // Normal: 0,2 Sekunden (200ms) pro Frame
            // Sprint: 0,1 Sekunden (100ms) pro Frame (doppelt so schnell)
            // Springen: 0,1 Sekunden (100ms) pro Frame (doppelt so schnell)
            let frameTime = 200;
            if (isSprinting || isJumping) {
                frameTime = 100;
            }
            
            const frameIndex = Math.floor(this.animationTime / frameTime) % 2;
            return `p-go${frameIndex + 1}`;
        } else {
            // Stand-Animation: p-stand1, p-stand2 (0,5 Sekunden = 500ms pro Frame)
            const frameTime = 500;
            const frameIndex = Math.floor(this.animationTime / frameTime) % 2; // Nur 2 Frames
            return `p-stand${frameIndex + 1}`;
        }
    }
    
    updateAnimation(deltaTime) {
        this.animationTime += deltaTime;
    }
}
