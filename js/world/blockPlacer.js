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
        }
        
        // Dirt-grass: Kann auf dirt-grass platziert werden (unterer wird zu dirt)
        if (blockType === 'dirt-grass' && existingBlock === 'dirt-grass') {
            // Prüfe ob eine Ebene darüber frei ist
            const blockAbove = world.getBlockAtCoords(targetX, targetY - 1);
            if (blockAbove) {
                return false; // Bereits ein Block darüber
            }
            
            // Prüfe Player-Kollision für Position eine Ebene höher
            const blockWorldX = targetX * CONFIG.BLOCK_SIZE;
            const checkBlockWorldY = (targetY - 1) * CONFIG.BLOCK_SIZE;
            
            if (blockWorldX < player.x + player.width &&
                blockWorldX + CONFIG.BLOCK_SIZE > player.x &&
                checkBlockWorldY < player.y + player.height &&
                checkBlockWorldY + CONFIG.BLOCK_SIZE > player.y) {
                return false; // Block würde mit Player kollidieren
            }
            
            return true; // Erlaubt - unterer wird zu dirt
        }
        
        // Für andere Blöcke (nicht grass und nicht dirt-grass auf dirt-grass):
        if (blockType !== 'grass' && !(blockType === 'dirt-grass' && existingBlock === 'dirt-grass')) {
            // Wenn auf Grass platziert wird, ist es erlaubt (Grass wird abgebaut)
            if (existingBlock === 'grass') {
                return true;
            }
            
            // Wenn bereits ein anderer Block dort ist, nicht platzieren
            if (existingBlock && existingBlock !== 'grass') {
                return false;
            }
        }
        
        // Prüfe Player-Kollision - verhindere Bauen in sich selbst
        const blockWorldX = targetX * CONFIG.BLOCK_SIZE;
        
        // Bei grass: Prüfe Kollision eine Ebene höher
        const checkY = (blockType === 'grass') ? targetY - 1 : targetY;
        const checkBlockWorldY = checkY * CONFIG.BLOCK_SIZE;
        
        // Prüfe ob Block mit Player überlappt
        if (blockWorldX < player.x + player.width &&
            blockWorldX + CONFIG.BLOCK_SIZE > player.x &&
            checkBlockWorldY < player.y + player.height &&
            checkBlockWorldY + CONFIG.BLOCK_SIZE > player.y) {
            return false; // Block würde mit Player kollidieren
        }
        
        return true;
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
        
        const targetX = mouse.blockX;
        const targetY = mouse.blockY;
        
        // Prüfe ob Platzierung erlaubt ist (mit Player-Kollision)
        if (!this.canPlaceBlock(slot.item, targetX, targetY, world, player)) {
            // Trigger Shake wenn Platzierung nicht möglich
            input.triggerShake();
            return null;
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
        
        // Entferne Item aus Inventar
        inventory.removeItem(selectedSlot);
        
        // Verhindere sofortiges erneutes Platzieren (setze Flag zurück)
        mouse.isRightDown = false;
        
        return { x: placedX, y: placedY, blockType: blockType };
    }
}
