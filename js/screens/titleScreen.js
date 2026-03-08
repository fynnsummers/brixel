// Title Screen System

class TitleScreen {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.active = true;
        this.bgImage = null;
        this.bgRotation = 0;
        this.bgMusic = null;
        this.state = 'menu'; // 'menu', 'generating', 'ready'
        this.generationProgress = 0;
        this.buttons = [];
        
        this.setupButtons();
        this.loadAssets();
    }
    
    setupButtons() {
        this.buttons.push({
            text: 'New Game',
            x: this.canvas.width / 2 - 100,
            y: this.canvas.height / 2 + 50,
            width: 200,
            height: 50,
            hovered: false,
            onClick: () => this.startGame()
        });
    }
    
    async loadAssets() {
        // Lade Hintergrundbild
        this.bgImage = new Image();
        this.bgImage.src = 'assets/homebg.png';
        
        // Lade und spiele Hintergrundmusik
        this.bgMusic = new Audio('assets/homemc.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.2; // Leise
        
        // Warte auf User-Interaktion bevor Musik abgespielt wird
        document.addEventListener('click', () => {
            if (this.active && this.bgMusic.paused) {
                this.bgMusic.play().catch(e => console.log('Audio play failed:', e));
            }
        }, { once: true });
    }
    
    startGame() {
        this.state = 'generating';
        this.generationProgress = 0;
        
        // Simuliere Weltgenerierung
        const interval = setInterval(() => {
            this.generationProgress += 0.02;
            
            if (this.generationProgress >= 1) {
                clearInterval(interval);
                this.state = 'ready';
                
                // Fade out Musik
                const fadeOut = setInterval(() => {
                    if (this.bgMusic.volume > 0.05) {
                        this.bgMusic.volume -= 0.05;
                    } else {
                        this.bgMusic.pause();
                        clearInterval(fadeOut);
                    }
                }, 100);
                
                // Starte Spiel nach kurzer Verzögerung
                setTimeout(() => {
                    this.active = false;
                    if (this.onGameStart) {
                        this.onGameStart();
                    }
                }, 500);
            }
        }, 50);
    }
    
    update() {
        if (!this.active) return;
        
        // Langsame Rotation des Hintergrunds
        this.bgRotation += 0.0005;
        if (this.bgRotation > Math.PI * 2) {
            this.bgRotation = 0;
        }
    }
    
    handleMouseMove(x, y) {
        if (this.state !== 'menu') return;
        
        this.buttons.forEach(button => {
            button.hovered = (
                x >= button.x &&
                x <= button.x + button.width &&
                y >= button.y &&
                y <= button.y + button.height
            );
        });
    }
    
    handleClick(x, y) {
        if (this.state !== 'menu') return;
        
        this.buttons.forEach(button => {
            if (button.hovered) {
                button.onClick();
            }
        });
    }
    
    render() {
        if (!this.active) return;
        
        // Hintergrund mit Rotation (Fischauge-Effekt)
        if (this.bgImage && this.bgImage.complete) {
            this.ctx.save();
            
            // Zentriere und rotiere
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.rotate(this.bgRotation);
            
            // Skaliere Bild um Canvas zu füllen (mit Rand)
            const scale = Math.max(
                this.canvas.width / this.bgImage.width,
                this.canvas.height / this.bgImage.height
            ) * 1.2; // 1.2x für Rand beim Drehen
            
            const width = this.bgImage.width * scale;
            const height = this.bgImage.height * scale;
            
            this.ctx.drawImage(this.bgImage, -width / 2, -height / 2, width, height);
            this.ctx.restore();
        } else {
            // Fallback Hintergrund
            this.ctx.fillStyle = '#1a1a2e';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Dunkler Overlay für bessere Lesbarkeit
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.state === 'menu') {
            this.renderMenu();
        } else if (this.state === 'generating') {
            this.renderGenerating();
        }
    }
    
    renderMenu() {
        // Spielname
        this.ctx.save();
        this.ctx.font = '48px "Press Start 2P", monospace';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 4;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const titleY = this.canvas.height / 2 - 100;
        this.ctx.strokeText('BLOCK WORLD', this.canvas.width / 2, titleY);
        this.ctx.fillText('BLOCK WORLD', this.canvas.width / 2, titleY);
        this.ctx.restore();
        
        // Buttons
        this.buttons.forEach(button => {
            this.ctx.save();
            
            // Button Hintergrund
            if (button.hovered) {
                this.ctx.fillStyle = '#4a4a4a';
                this.ctx.strokeStyle = '#FFFFFF';
            } else {
                this.ctx.fillStyle = '#2a2a2a';
                this.ctx.strokeStyle = '#888888';
            }
            
            this.ctx.lineWidth = 3;
            this.ctx.fillRect(button.x, button.y, button.width, button.height);
            this.ctx.strokeRect(button.x, button.y, button.width, button.height);
            
            // Button Text
            this.ctx.font = '20px "Press Start 2P", monospace';
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
            
            this.ctx.restore();
        });
    }
    
    renderGenerating() {
        // Weltgenerierungs-Animation (pixelig)
        this.ctx.save();
        
        // Titel
        this.ctx.font = '32px "Press Start 2P", monospace';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Generating World...', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        // Pixeliger Fortschrittsbalken
        const barWidth = 400;
        const barHeight = 40;
        const barX = this.canvas.width / 2 - barWidth / 2;
        const barY = this.canvas.height / 2;
        
        // Hintergrund
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Fortschritt (pixelig)
        const progressWidth = barWidth * this.generationProgress;
        const pixelSize = 8;
        
        for (let x = 0; x < progressWidth; x += pixelSize) {
            for (let y = 0; y < barHeight; y += pixelSize) {
                // Zufällige Grüntöne für pixeligen Effekt
                const brightness = 100 + Math.random() * 155;
                this.ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
                this.ctx.fillRect(barX + x, barY + y, pixelSize - 1, pixelSize - 1);
            }
        }
        
        // Rand
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Prozent
        this.ctx.font = '16px "Press Start 2P", monospace';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(
            Math.floor(this.generationProgress * 100) + '%',
            this.canvas.width / 2,
            barY + barHeight + 30
        );
        
        this.ctx.restore();
    }
}
