// Hotbar-System

class Hotbar {
    constructor() {
        this.selectedSlot = 0; // 0-5 für h1-h6
        this.targetSlot = 0;
        this.smoothSlot = 0; // Für smooth Animation
        this.slotCount = 6;
    }
    
    selectSlot(slot) {
        this.targetSlot = Math.max(0, Math.min(this.slotCount - 1, slot));
        this.selectedSlot = this.targetSlot;
    }
    
    scrollUp() {
        this.targetSlot = (this.selectedSlot - 1 + this.slotCount) % this.slotCount;
        this.selectedSlot = this.targetSlot;
    }
    
    scrollDown() {
        this.targetSlot = (this.selectedSlot + 1) % this.slotCount;
        this.selectedSlot = this.targetSlot;
    }
    
    update() {
        // Smooth interpolation zum Ziel-Slot
        this.smoothSlot += (this.targetSlot - this.smoothSlot) * 0.25;
        
        // Snap wenn sehr nah
        if (Math.abs(this.targetSlot - this.smoothSlot) < 0.01) {
            this.smoothSlot = this.targetSlot;
        }
    }
    
    getSelectedSlot() {
        return this.selectedSlot;
    }
    
    getSmoothSlot() {
        return this.smoothSlot;
    }
    
    getHotbarTextureName() {
        return `h${this.selectedSlot + 1}`;
    }
}
