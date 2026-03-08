// Chat-System

class Chat {
    constructor() {
        this.messages = [];
        this.inputText = '';
        this.cursorPosition = 0; // Cursor-Position im Input
        this.isOpen = false;
        this.justOpened = false; // Flag für gerade geöffnet
        this.openedTime = 0; // Zeitpunkt des Öffnens
        this.inputDelay = 1000; // 1 Sekunde Verzögerung
        this.cursorBlink = 0;
        this.scrollOffset = 0; // Scroll-Position (0 = ganz unten)
        
        // Fade-Out System
        this.fadeAlpha = 0; // 0 = unsichtbar, 1 = sichtbar
        this.fadeTimer = 0; // Zeit seit letzter Nachricht
        this.fadeDelay = 3000; // 3 Sekunden bis Fade beginnt
        this.fadeDuration = 2000; // 2 Sekunden Fade-Out
    }
    
    addMessage(text) {
        this.messages.push({
            text: text,
            timestamp: Date.now()
        });
        
        // Auto-scroll nach unten bei neuer Nachricht
        this.scrollOffset = 0;
        
        // Reset Fade-Timer bei neuer Nachricht
        this.fadeTimer = 0;
        this.fadeAlpha = 1;
    }
    
    open() {
        this.isOpen = true;
        this.inputText = '';
        this.cursorPosition = 0;
        this.justOpened = true; // Setze Flag
        this.openedTime = Date.now(); // Speichere Öffnungszeit
        this.fadeAlpha = 1; // Voll sichtbar
        this.fadeTimer = 0;
    }
    
    canAcceptInput() {
        // Prüfe ob genug Zeit seit Öffnung vergangen ist
        return Date.now() - this.openedTime >= this.inputDelay;
    }
    
    close() {
        this.isOpen = false;
        this.inputText = '';
        this.cursorPosition = 0;
        this.justOpened = false;
        
        // Starte Fade-Out
        this.fadeTimer = 0;
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    scroll(delta) {
        const config = CONFIG.CHAT.LOGGER;
        const maxVisibleLines = Math.floor(config.HEIGHT / config.LINE_HEIGHT);
        const maxScroll = Math.max(0, this.messages.length - maxVisibleLines);
        
        this.scrollOffset = Math.max(0, Math.min(maxScroll, this.scrollOffset + delta));
    }
    
    handleInput(key) {
        if (!this.isOpen) return;
        
        if (key === 'Enter') {
            if (this.inputText.trim().length > 0) {
                this.sendMessage(this.inputText);
                this.inputText = '';
                this.cursorPosition = 0;
            }
        } else if (key === 'Backspace') {
            if (this.cursorPosition > 0) {
                this.inputText = this.inputText.slice(0, this.cursorPosition - 1) + this.inputText.slice(this.cursorPosition);
                this.cursorPosition--;
            }
        } else if (key === 'Delete') {
            if (this.cursorPosition < this.inputText.length) {
                this.inputText = this.inputText.slice(0, this.cursorPosition) + this.inputText.slice(this.cursorPosition + 1);
            }
        } else if (key === 'ArrowLeft') {
            if (this.cursorPosition > 0) {
                this.cursorPosition--;
            }
        } else if (key === 'ArrowRight') {
            if (this.cursorPosition < this.inputText.length) {
                this.cursorPosition++;
            }
        } else if (key === 'Home') {
            this.cursorPosition = 0;
        } else if (key === 'End') {
            this.cursorPosition = this.inputText.length;
        } else if (key === 'Escape') {
            this.close();
        } else if (key.length === 1) {
            // Nur einzelne Zeichen hinzufügen
            if (this.inputText.length < 50) {
                this.inputText = this.inputText.slice(0, this.cursorPosition) + key + this.inputText.slice(this.cursorPosition);
                this.cursorPosition++;
            }
        }
    }
    
    sendMessage(text) {
        this.addMessage(text);
        console.log('Chat message:', text);
    }
    
    update(deltaTime) {
        this.cursorBlink += deltaTime;
        if (this.cursorBlink > 1000) {
            this.cursorBlink = 0;
        }
        
        // Fade-Out Update (nur wenn Chat geschlossen)
        if (!this.isOpen && this.messages.length > 0) {
            this.fadeTimer += deltaTime;
            
            if (this.fadeTimer > this.fadeDelay) {
                // Fade-Out berechnen
                const fadeProgress = (this.fadeTimer - this.fadeDelay) / this.fadeDuration;
                this.fadeAlpha = Math.max(0, 1 - fadeProgress);
            }
        }
    }
    
    getVisibleMessages() {
        const config = CONFIG.CHAT.LOGGER;
        const maxVisibleLines = Math.floor(config.HEIGHT / config.LINE_HEIGHT);
        const startIndex = Math.max(0, this.messages.length - maxVisibleLines - this.scrollOffset);
        const endIndex = this.messages.length - this.scrollOffset;
        
        return this.messages.slice(startIndex, endIndex);
    }
}
