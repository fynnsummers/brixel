// Item-Drop-System

class ItemDrops {
    constructor() {
        this.items = [];
    }
    
    createDrop(blockX, blockY, blockType) {
        const worldX = blockX * CONFIG.BLOCK_SIZE + CONFIG.BLOCK_SIZE / 2;
        const worldY = blockY * CONFIG.BLOCK_SIZE + CONFIG.BLOCK_SIZE / 2;
        
        this.items.push({
            x: worldX,
            y: worldY,
            vx: (Math.random() - 0.5) * 2,
            vy: -3,
            type: blockType,
            rotationAngle: Math.random() * Math.PI * 2, // Winkel für 3D-Rotation
            rotationSpeed: (Math.random() - 0.5) * 0.04, // Langsame Rotation
            bobOffset: Math.random() * Math.PI * 2,
            age: 0
        });
    }
    
    update(world, player, inventory) {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            
            // Prüfe Distanz zum Player
            const dx = (player.x + player.width / 2) - item.x;
            const dy = (player.y + player.height / 2) - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Wenn in Pickup-Range, ziehe Item zum Player
            if (distance < CONFIG.PICKUP_RANGE) {
                // Magnet-Effekt
                const pullSpeed = 0.15;
                item.vx = dx * pullSpeed;
                item.vy = dy * pullSpeed;
                
                // Wenn sehr nah, sammle auf
                if (distance < 10) {
                    if (inventory.addItem(item.type)) {
                        this.items.splice(i, 1);
                        console.log(`Picked up ${item.type}`);
                    }
                    continue;
                }
            } else {
                // Normale Physik wenn außerhalb der Range
                item.vy += CONFIG.ITEM_GRAVITY;
                item.vx *= 0.95;
            }
            
            // Bewegung
            item.x += item.vx;
            item.y += item.vy;
            
            // 3D-Rotation (langsam um Y-Achse drehen)
            item.rotationAngle += item.rotationSpeed;
            
            item.age++;
            
            // Boden-Kollision (nur wenn nicht magnetisiert)
            if (distance >= CONFIG.PICKUP_RANGE) {
                const blockX = Math.floor(item.x / CONFIG.BLOCK_SIZE);
                const blockY = Math.floor((item.y + CONFIG.ITEM_SIZE / 2) / CONFIG.BLOCK_SIZE);
                
                if (world.getBlockAt(item.x, item.y + CONFIG.ITEM_SIZE / 2, false)) {
                    item.vy = 0;
                    item.vx *= 0.8;
                    item.y = blockY * CONFIG.BLOCK_SIZE - CONFIG.ITEM_SIZE / 2;
                }
            }
        }
    }
    
    render(ctx, camera, textures, darkness = 0) {
        for (const item of this.items) {
            const screenX = item.x - camera.x;
            const screenY = item.y - camera.y;
            
            // Bob-Animation (langsam hoch und runter)
            const bobAmount = Math.sin(item.age * 0.03 + item.bobOffset) * 3;
            
            // Berechne 3D-Perspektive (Y-Achsen-Rotation)
            // cos gibt Werte von -1 bis 1, wir mappen das auf 0.2 bis 1 (nie zu schmal)
            const scaleX = Math.abs(Math.cos(item.rotationAngle)) * 0.8 + 0.2;
            
            ctx.save();
            ctx.translate(screenX, screenY + bobAmount);
            
            // Seitliche 3D-Skalierung
            ctx.scale(scaleX, 1);
            
            // Wende Dunkelheit als Brightness-Filter an
            if (darkness > 0) {
                const brightness = Math.round((1 - darkness) * 100);
                ctx.filter = `brightness(${brightness}%)`;
            }
            
            const texture = textures[item.type];
            if (texture) {
                ctx.drawImage(
                    texture,
                    -CONFIG.ITEM_SIZE / 2,
                    -CONFIG.ITEM_SIZE / 2,
                    CONFIG.ITEM_SIZE,
                    CONFIG.ITEM_SIZE
                );
            }
            
            ctx.filter = 'none';
            ctx.restore();
        }
    }
    
    getItemCount() {
        return this.items.length;
    }
}
