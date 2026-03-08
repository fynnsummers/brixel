// Gesundheits-System

class HealthSystem {
    constructor(player) {
        this.player = player;
        this.maxHealth = 4; // 4 Herzen (l4 bis l0)
        this.currentHealth = 4; // Start mit 4 Herzen
        this.isDead = false;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.respawnDelay = 0;
    }
    
    takeDamage(amount) {
        if (this.invulnerable || this.isDead) return;
        
        console.log(`Taking ${amount} damage. Current health: ${this.currentHealth}`);
        
        this.currentHealth = Math.max(0, this.currentHealth - amount);
        
        if (this.currentHealth <= 0) {
            this.die();
        } else {
            // Kurze Unverwundbarkeit nach Schaden
            this.invulnerable = true;
            this.invulnerableTime = 1000; // 1 Sekunde
        }
    }
    
    die() {
        this.isDead = true;
        this.currentHealth = 0;
        this.respawnDelay = 2000; // 2 Sekunden bis Respawn
    }
    
    respawn(spawnX, spawnY) {
        this.currentHealth = this.maxHealth;
        this.isDead = false;
        this.invulnerable = true;
        this.invulnerableTime = 2000; // 2 Sekunden Unverwundbarkeit nach Respawn
        
        this.player.x = spawnX;
        this.player.y = spawnY;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.highestAirY = spawnY;
        this.player.wasOnGround = false;
    }
    
    update(deltaTime) {
        // Update Unverwundbarkeit
        if (this.invulnerable) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
                this.invulnerableTime = 0;
            }
        }
        
        // Update Respawn Timer
        if (this.isDead) {
            this.respawnDelay -= deltaTime;
        }
    }
    
    shouldRespawn() {
        return this.isDead && this.respawnDelay <= 0;
    }
    
    getHealthTextureName() {
        return `l${this.currentHealth}`;
    }
    
    getCurrentHealth() {
        return this.currentHealth;
    }
    
    isAlive() {
        return !this.isDead;
    }
}
