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
        this.highestAirY = y; // Höchster Punkt in der Luft (kleinste Y-Koordinate)
        this.facingRight = true; // Blickrichtung
        this.scale = 1; // Für Flip-Animation
        this.targetScale = 1;
        this.firstSpawn = true; // Flag für ersten Spawn
    }
    
    update(keys, world) {
        // Tracke ob wir auf dem Boden waren
        this.wasOnGround = this.onGround;
        
        // Bewegung mit Beschleunigung
        this.targetVx = 0;
        
        // Prüfe ob Sprint aktiv ist (Shift gedrückt)
        const isSprinting = keys['shift'];
        const currentSpeed = isSprinting ? CONFIG.SPRINT_SPEED : CONFIG.MOVE_SPEED;
        
        if (keys['a']) {
            this.targetVx = -currentSpeed;
            this.facingRight = false;
        }
        if (keys['d']) {
            this.targetVx = currentSpeed;
            this.facingRight = true;
        }
        
        // Smooth Scale für Flip
        this.targetScale = this.facingRight ? 1 : -1;
        this.scale += (this.targetScale - this.scale) * 0.3;
        
        // Smooth Bewegung
        this.vx += (this.targetVx - this.vx) * CONFIG.MOVE_ACCELERATION;
        
        // Reibung
        if (this.onGround && this.targetVx === 0) {
            this.vx *= CONFIG.FRICTION;
        }
        
        // Prüfe ob Player noch auf dem Boden steht (vor Gravitation)
        if (this.onGround) {
            const stillOnGround = this.checkGroundBelow(world);
            if (!stillOnGround) {
                this.onGround = false;
            }
        }
        
        // Wenn wir gerade den Boden verlassen haben, setze highestAirY einmalig
        if (!this.onGround && this.wasOnGround) {
            this.highestAirY = this.y;
            console.log(`Left ground at Y: ${this.y.toFixed(1)}`);
        }
        
        // Wenn in der Luft, tracke höchsten Punkt (kleinste Y = höchster Punkt)
        if (!this.onGround) {
            if (this.y < this.highestAirY) {
                this.highestAirY = this.y;
            }
        }
        
        // Gravitation
        this.vy += CONFIG.GRAVITY;
        
        // Horizontale Bewegung
        this.x += this.vx;
        if (this.checkCollision(world)) {
            this.x -= this.vx;
            this.vx = 0;
        }
        
        // Vertikale Bewegung
        this.y += this.vy;
        this.onGround = false;
        
        if (this.checkCollision(world)) {
            if (this.vy > 0) {
                this.onGround = true;
            }
            this.y -= this.vy;
            this.vy = 0;
        }
    }
    
    getFallDamage() {
        // Nur wenn wir gerade gelandet sind (vorher in der Luft, jetzt auf dem Boden)
        if (this.onGround && !this.wasOnGround) {
            // Beim ersten Spawn keinen Fallschaden
            if (this.firstSpawn) {
                console.log('First spawn landing - no fall damage');
                this.firstSpawn = false;
                this.highestAirY = this.y;
                return 0;
            }
            
            // Berechne Fallhöhe in Blöcken basierend auf Y-Koordinaten
            const startBlockY = Math.floor(this.highestAirY / CONFIG.BLOCK_SIZE);
            const endBlockY = Math.floor(this.y / CONFIG.BLOCK_SIZE);
            const fallBlocks = endBlockY - startBlockY;
            
            console.log(`Landed! From block Y:${startBlockY} to Y:${endBlockY} = ${fallBlocks} blocks fallen`);
            
            // Reset für nächsten Fall
            this.highestAirY = this.y;
            
            // Berechne Schaden: Ab 5 Blöcken, 1 Herz pro 3 Blöcke
            if (fallBlocks >= CONFIG.FALL_DAMAGE_THRESHOLD) {
                const damage = Math.floor(fallBlocks / CONFIG.FALL_DAMAGE_PER_BLOCK);
                console.log(`Fall damage: ${damage} hearts (${fallBlocks} blocks / ${CONFIG.FALL_DAMAGE_PER_BLOCK})`);
                return damage;
            }
        }
        
        // Reset highestAirY wenn auf dem Boden
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
}
