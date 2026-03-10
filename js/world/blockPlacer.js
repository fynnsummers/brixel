// Block-Platzierungs-System

class BlockPlacer {
    constructor() {
        // Keine Event-Listener mehr hier
    }
    
    canPlaceBlock(blockType, targetX, targetY, world, player) {
            const existingBlock = world.getBlockAtCoords(targetX, targetY);

            // GRASS: Kann NUR auf dirt-grass platziert werden
            if (blockType === 'grass') {
                // Muss dirt-grass sein
                if (existingBlock !== 'dirt-grass') {
                    return false;
                }
                // Prüfe ob bereits grass eine Ebene darüber ist
                const blockAbove = world.getBlockAtCoords(targetX, targetY - 1);
                if (blockAbove) {
                    return false; // Bereits ein Block darüber
                }
                return true;
            }

            // Dirt-grass: Kann auf dirt-grass platziert werden (unterer wird zu dirt)
            if (blockType === 'dirt-grass' && existingBlock === 'dirt-grass') {
                // Prüfe ob eine Ebene darüber frei ist
                const blockAbove = world.getBlockAtCoords(targetX, targetY - 1);
                if (blockAbove) {
                    return false; // Bereits ein Block darüber
                }
                return true; // Erlaubt - unterer wird zu dirt
            }

            // Für alle anderen Blöcke:
            // Nur platzieren wenn Position leer ist ODER nur Grass dort ist
            if (existingBlock === null || existingBlock === 'grass') {
                return true;
            }

            // Wenn bereits ein anderer Block dort ist, nicht platzieren
            return false;
        }

    
    tryPlaceBlock(mouse, world, inventory, hotbar, player, input) {
        if (!mouse.isRightDown) return null;
        if (!mouse.inRange) {
            // Trigger Shake wenn außerhalb der Range
            input.triggerShake();
            return null;
        }
        
        const selectedSlot = hotbar.getSelectedSlot();
        const slot = inventory.getSlot(selectedSlot);
        
        // Prüfe ob Item im Slot vorhanden
        if (!slot.item || slot.count <= 0) return null;
        
        // Prüfe ob es ein Tool ist - Tools können nicht platziert werden
        const item = ItemRegistry.getByName(slot.item);
        if (item && item.category === 'tools') {
            input.triggerShake();
            return null;
        }
        
        // Prüfe ob Item platzierbar ist (z.B. Materialien wie coal, iron, etc. sind nicht platzierbar)
        if (item && item.placeable === false) {
            input.triggerShake();
            return null;
        }
        
        const targetX = mouse.blockX;
        const targetY = mouse.blockY;
        
        // Prüfe ob Platzierung erlaubt ist (mit Player-Kollision)
        const canPlace = this.canPlaceBlock(slot.item, targetX, targetY, world, player);
        
        // Wenn Block mit Player kollidieren würde, versuche Player wegzustoßen
        if (!canPlace) {
            const blockWorldX = targetX * CONFIG.BLOCK_SIZE;
            const checkY = (slot.item === 'grass') ? targetY - 1 : targetY;
            const checkBlockWorldY = checkY * CONFIG.BLOCK_SIZE;
            
            // Prüfe ob es eine Player-Kollision ist
            const wouldCollideWithPlayer = (
                blockWorldX < player.x + player.width &&
                blockWorldX + CONFIG.BLOCK_SIZE > player.x &&
                checkBlockWorldY < player.y + player.height &&
                checkBlockWorldY + CONFIG.BLOCK_SIZE > player.y
            );
            
            if (wouldCollideWithPlayer) {
                // Stoße Player weg
                this.pushPlayerAway(player, blockWorldX, checkBlockWorldY);
                // Erlaube Platzierung nach Push
            } else {
                // Andere Gründe für nicht-Platzierung
                input.triggerShake();
                return null;
            }
        }
        
        // Wenn auf Grass platziert wird, entferne Grass (aber nicht bei grass-auf-dirt-grass)
        const existingBlock = world.getBlockAtCoords(targetX, targetY);
        if (existingBlock === 'grass' && slot.item !== 'grass') {
            world.breakBlock(targetX, targetY, 'grass');
            
            // Prüfe ob darunter dirt-grass ist und wandle es zu dirt um
            const blockBelow = world.getBlockAtCoords(targetX, targetY + 1);
            if (blockBelow === 'dirt-grass') {
                world.placeBlock(targetX, targetY + 1, 'dirt');
            }
        }
        
        let placedX = targetX;
        let placedY = targetY;
        const blockType = slot.item; // Speichere blockType vor dem Entfernen
        
        // Wenn dirt-grass auf dirt-grass platziert wird, wandle unteren Block zu dirt um
        if (blockType === 'dirt-grass' && existingBlock === 'dirt-grass') {
            world.placeBlock(targetX, targetY, 'dirt'); // Unterer wird zu dirt
            world.placeBlock(targetX, targetY - 1, 'dirt-grass'); // Neuer dirt-grass darüber
            placedY = targetY - 1;
        }
        // Bei grass auf dirt-grass: Platziere grass ÜBER dem dirt-grass (eine Ebene höher)
        else if (blockType === 'grass' && existingBlock === 'dirt-grass') {
            placedY = targetY - 1; // Eine Ebene höher
            world.placeBlock(placedX, placedY, blockType);
        } 
        // Normale Platzierung
        else {
            world.placeBlock(placedX, placedY, blockType);
        }
        
        // Wenn dirt-grass platziert wurde, prüfe ob Block darunter auch dirt-grass ist
        if (blockType === 'dirt-grass') {
            const blockBelow = world.getBlockAtCoords(placedX, placedY + 1);
            if (blockBelow === 'dirt-grass') {
                world.placeBlock(placedX, placedY + 1, 'dirt'); // Wandle unteren zu dirt
            }
        }
        
        // Prüfe ob Block mit Player kollidiert und drücke ihn weg
        this.pushPlayerOutOfBlock(player, placedX, placedY);
        
        // Entferne Item aus Inventar
        inventory.removeItem(selectedSlot);
        
        // Verhindere sofortiges erneutes Platzieren (setze Flag zurück)
        mouse.isRightDown = false;
        
        return { x: placedX, y: placedY, blockType: blockType };
    }
    
    pushPlayerAway(player, blockX, blockY) {
        // Berechne Zentrum des Blocks und des Players
        const blockCenterX = blockX + CONFIG.BLOCK_SIZE / 2;
        const blockCenterY = blockY + CONFIG.BLOCK_SIZE / 2;
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        
        // Berechne Richtung vom Block zum Player
        const dx = playerCenterX - blockCenterX;
        const dy = playerCenterY - blockCenterY;
        
        // Bestimme die stärkere Richtung (horizontal oder vertikal)
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal wegsto��en
            if (dx > 0) {
                // Nach rechts
                player.x = blockX + CONFIG.BLOCK_SIZE + 2;
            } else {
                // Nach links
                player.x = blockX - player.width - 2;
            }
            // Kleine horizontale Geschwindigkeit
            player.vx = (dx > 0 ? 3 : -3);
        } else {
            // Vertikal wegstoßen
            if (dy > 0) {
                // Nach unten
                player.y = blockY + CONFIG.BLOCK_SIZE + 2;
            } else {
                // Nach oben
                player.y = blockY - player.height - 2;
            }
            // Kleine vertikale Geschwindigkeit
            player.vy = (dy > 0 ? 3 : -3);
        }
    }
    
    pushPlayerOutOfBlock(player, blockX, blockY) {
        const blockWorldX = blockX * CONFIG.BLOCK_SIZE;
        const blockWorldY = blockY * CONFIG.BLOCK_SIZE;
        
        // Prüfe ob Block mit Player überlappt
        if (blockWorldX < player.x + player.width &&
            blockWorldX + CONFIG.BLOCK_SIZE > player.x &&
            blockWorldY < player.y + player.height &&
            blockWorldY + CONFIG.BLOCK_SIZE > player.y) {
            
            // Berechne Überlappung in alle Richtungen
            const overlapLeft = (player.x + player.width) - blockWorldX;
            const overlapRight = (blockWorldX + CONFIG.BLOCK_SIZE) - player.x;
            const overlapTop = (player.y + player.height) - blockWorldY;
            const overlapBottom = (blockWorldY + CONFIG.BLOCK_SIZE) - player.y;
            
            // Finde kleinste Überlappung (kürzester Weg raus)
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            
            // Drücke Player in Richtung der kleinsten Überlappung
            if (minOverlap === overlapLeft) {
                // Nach links drücken
                player.x = blockWorldX - player.width - 1;
                player.vx = -3; // Leichter Schub nach links
            } else if (minOverlap === overlapRight) {
                // Nach rechts drücken
                player.x = blockWorldX + CONFIG.BLOCK_SIZE + 1;
                player.vx = 3; // Leichter Schub nach rechts
            } else if (minOverlap === overlapTop) {
                // Nach oben drücken
                player.y = blockWorldY - player.height - 1;
                player.vy = -5; // Leichter Schub nach oben
            } else if (minOverlap === overlapBottom) {
                // Nach unten drücken
                player.y = blockWorldY + CONFIG.BLOCK_SIZE + 1;
                player.vy = 2; // Leichter Schub nach unten
            }
            
            console.log(`Player pushed out of block at ${blockX}, ${blockY}`);
        }
    }
}
