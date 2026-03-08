// Tag-Nacht-Zyklus System

class DayNightCycle {
    constructor() {
        this.time = 0; // Zeit in Millisekunden (0 = Mitternacht)
        this.enabled = CONFIG.DAY_NIGHT_CYCLE.ENABLE;
    }
    
    update(deltaTime) {
        if (!this.enabled) return;
        
        this.time += deltaTime;
        
        // Wrap around nach einem vollen Zyklus
        if (this.time >= CONFIG.DAY_NIGHT_CYCLE.CYCLE_DURATION) {
            this.time = 0;
        }
    }
    
    // Gibt einen Wert zwischen 0 und 1 zurück (0 = Mitternacht, 0.5 = Mittag)
    getTimeOfDay() {
        return this.time / CONFIG.DAY_NIGHT_CYCLE.CYCLE_DURATION;
    }
    
    // Berechnet die Helligkeit (0 = dunkel, 1 = hell)
    getBrightness() {
        const timeOfDay = this.getTimeOfDay();
        
        // Sinuswelle für sanften Übergang
        // 0.0 = Mitternacht (dunkel)
        // 0.5 = Mittag (hell)
        const brightness = Math.sin(timeOfDay * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
        
        // Interpoliere zwischen NIGHT_DARKNESS und 1.0
        const minBrightness = CONFIG.DAY_NIGHT_CYCLE.NIGHT_DARKNESS;
        return minBrightness + (1 - minBrightness) * brightness;
    }
    
    // Gibt die Himmelfarben für den Gradient zurück
    getSkyColors() {
        const timeOfDay = this.getTimeOfDay();
        
        // Definiere Farben für verschiedene Tageszeiten
        const colors = {
            night: { top: '#0a0a1a', bottom: '#1a1a2e' },      // Dunkle Nacht
            sunrise: { top: '#ff6b35', bottom: '#ffd93d' },    // Sonnenaufgang
            day: { top: '#87ceeb', bottom: '#e0f6ff' },        // Tag
            sunset: { top: '#ff6b35', bottom: '#ffd93d' },     // Sonnenuntergang
        };
        
        // Berechne welche Phase wir haben
        let topColor, bottomColor;
        
        if (timeOfDay < 0.2) {
            // Nacht (0.0 - 0.2)
            topColor = colors.night.top;
            bottomColor = colors.night.bottom;
        } else if (timeOfDay < 0.3) {
            // Sonnenaufgang (0.2 - 0.3)
            const t = (timeOfDay - 0.2) / 0.1;
            topColor = this.lerpColor(colors.night.top, colors.sunrise.top, t);
            bottomColor = this.lerpColor(colors.night.bottom, colors.sunrise.bottom, t);
        } else if (timeOfDay < 0.4) {
            // Übergang zu Tag (0.3 - 0.4)
            const t = (timeOfDay - 0.3) / 0.1;
            topColor = this.lerpColor(colors.sunrise.top, colors.day.top, t);
            bottomColor = this.lerpColor(colors.sunrise.bottom, colors.day.bottom, t);
        } else if (timeOfDay < 0.6) {
            // Tag (0.4 - 0.6)
            topColor = colors.day.top;
            bottomColor = colors.day.bottom;
        } else if (timeOfDay < 0.7) {
            // Sonnenuntergang (0.6 - 0.7)
            const t = (timeOfDay - 0.6) / 0.1;
            topColor = this.lerpColor(colors.day.top, colors.sunset.top, t);
            bottomColor = this.lerpColor(colors.day.bottom, colors.sunset.bottom, t);
        } else if (timeOfDay < 0.8) {
            // Übergang zu Nacht (0.7 - 0.8)
            const t = (timeOfDay - 0.7) / 0.1;
            topColor = this.lerpColor(colors.sunset.top, colors.night.top, t);
            bottomColor = this.lerpColor(colors.sunset.bottom, colors.night.bottom, t);
        } else {
            // Nacht (0.8 - 1.0)
            topColor = colors.night.top;
            bottomColor = colors.night.bottom;
        }
        
        return { top: topColor, bottom: bottomColor };
    }
    
    // Interpoliert zwischen zwei Hex-Farben
    lerpColor(color1, color2, t) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}
