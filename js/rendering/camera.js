// Kamera-System

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.zoom = CONFIG.CAMERA_ZOOM; // Aktueller Zoom
        this.targetZoom = CONFIG.CAMERA_ZOOM; // Ziel-Zoom
        this.zoomLevel = 0; // -2, -1, 0, 1, 2 (0 = Standard)
    }
    
    zoomIn() {
        if (this.zoomLevel < 2) {
            this.zoomLevel++;
            this.updateTargetZoom();
        }
    }
    
    zoomOut() {
        if (this.zoomLevel > -2) {
            this.zoomLevel--;
            this.updateTargetZoom();
        }
    }
    
    updateTargetZoom() {
        // Berechne Zoom basierend auf Level
        // Level -2: 1.5x, -1: 2.0x, 0: 2.5x (Standard), 1: 3.0x, 2: 3.5x
        const baseZoom = CONFIG.CAMERA_ZOOM; // 2.5
        this.targetZoom = baseZoom + (this.zoomLevel * 0.5);
    }
    
    update(player, canvasWidth, canvasHeight) {
        // Smooth Zoom
        this.zoom += (this.targetZoom - this.zoom) * 0.1;
        
        // Kamera Target mit Drift
        this.targetX = player.x - (canvasWidth / this.zoom) / 2 + player.width / 2;
        this.targetY = player.y - (canvasHeight / this.zoom) / 2 + player.height / 2;
        
        // Kamera folgt mit Delay (Drift-Effekt)
        this.x += (this.targetX - this.x) * CONFIG.CAMERA_SMOOTH;
        this.y += (this.targetY - this.y) * CONFIG.CAMERA_DRIFT_DELAY;
    }
}
