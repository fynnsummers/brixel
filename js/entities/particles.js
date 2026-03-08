// Partikel-System für Block-Breaking

class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    createBlockBreakParticles(blockX, blockY, blockType, textures) {
        const worldX = blockX * CONFIG.BLOCK_SIZE;
        const worldY = blockY * CONFIG.BLOCK_SIZE;
        
        // Erstelle 8-12 Partikel pro Block
        const particleCount = 8 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < particleCount; i++) {
            // Zufällige Position innerhalb des Blocks
            const offsetX = Math.random() * CONFIG.BLOCK_SIZE;
            const offsetY = Math.random() * CONFIG.BLOCK_SIZE;
            
            // Zufällige Geschwindigkeit
            const vx = (Math.random() - 0.5) * 4;
            const vy = (Math.random() - 0.5) * 4 - 2; // Leicht nach oben
            
            // Zufällige Größe (kleine Fragmente)
            const size = 4 + Math.random() * 4;
            
            this.particles.push({
                x: worldX + offsetX,
                y: worldY + offsetY,
                vx: vx,
                vy: vy,
                size: size,
                blockType: blockType,
                life: 1.0, // 0 = tot, 1 = voll lebendig
                decay: 0.02 + Math.random() * 0.02, // Wie schnell es verschwindet
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                // Speichere Textur-Ausschnitt
                texOffsetX: Math.floor(Math.random() * (CONFIG.BLOCK_SIZE - size)),
                texOffsetY: Math.floor(Math.random() * (CONFIG.BLOCK_SIZE - size))
            });
        }
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Physik
            p.vy += CONFIG.PARTICLE_GRAVITY;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            
            // Reibung
            p.vx *= 0.98;
            
            // Leben reduzieren
            p.life -= p.decay;
            
            // Entferne tote Partikel
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    render(ctx, camera, textures) {
        for (const p of this.particles) {
            const screenX = p.x - camera.x;
            const screenY = p.y - camera.y;
            
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.translate(screenX + p.size / 2, screenY + p.size / 2);
            ctx.rotate(p.rotation);
            
            // Zeichne Textur-Fragment
            const texture = textures[p.blockType];
            if (texture) {
                ctx.drawImage(
                    texture,
                    p.texOffsetX, p.texOffsetY, p.size, p.size, // Source
                    -p.size / 2, -p.size / 2, p.size, p.size    // Destination
                );
            }
            
            ctx.restore();
        }
    }
    
    getParticleCount() {
        return this.particles.length;
    }
}
