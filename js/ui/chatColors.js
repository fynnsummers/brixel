// Chat-Farbsystem

const ChatColors = {
    // Farbcodes (Minecraft-Style mit §)
    codes: {
        '§0': '#000000', // Schwarz
        '§1': '#0000AA', // Dunkelblau
        '§2': '#00AA00', // Dunkelgrün
        '§3': '#00AAAA', // Dunkel Aqua
        '§4': '#AA0000', // Dunkelrot
        '§5': '#AA00AA', // Dunkel Lila
        '§6': '#FFAA00', // Gold
        '§7': '#AAAAAA', // Grau
        '§8': '#555555', // Dunkelgrau
        '§9': '#5555FF', // Blau
        '§a': '#55FF55', // Grün
        '§b': '#55FFFF', // Aqua
        '§c': '#FF5555', // Rot
        '§d': '#FF55FF', // Lila
        '§e': '#FFFF55', // Gelb
        '§f': '#FFFFFF', // Weiß
        
        // Aliase
        '§r': 'reset'    // Reset zu Standard
    },
    
    // Parse Text mit Farbcodes
    parseText(text) {
        const segments = [];
        let currentColor = '#FFFFFF';
        let currentText = '';
        
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '§' && i + 1 < text.length) {
                // Speichere aktuellen Text-Segment
                if (currentText.length > 0) {
                    segments.push({ text: currentText, color: currentColor });
                    currentText = '';
                }
                
                // Hole Farbcode
                const code = '§' + text[i + 1];
                if (this.codes[code]) {
                    if (this.codes[code] === 'reset') {
                        currentColor = '#FFFFFF';
                    } else {
                        currentColor = this.codes[code];
                    }
                }
                i++; // Überspringe Farbcode-Zeichen
            } else {
                currentText += text[i];
            }
        }
        
        // Füge letzten Segment hinzu
        if (currentText.length > 0) {
            segments.push({ text: currentText, color: currentColor });
        }
        
        return segments;
    },
    
    // Färbe Command-Input
    colorizeCommand(text) {
        if (!text.startsWith('/')) {
            return [{ text: text, color: '#FFFFFF' }];
        }
        
        const parts = text.slice(1).split(' ');
        const command = parts[0];
        const args = parts.slice(1);
        
        const segments = [];
        
        // "/" in Grau
        segments.push({ text: '/', color: '#AAAAAA' });
        
        // Command in Gelb
        segments.push({ text: command, color: '#FFFF55' });
        
        // Argumente färben
        if (command === 'give') {
            // /give <item> [count]
            if (args.length > 0) {
                segments.push({ text: ' ', color: '#FFFFFF' });
                segments.push({ text: args[0], color: '#55FF55' }); // Item in Grün
            }
            if (args.length > 1) {
                segments.push({ text: ' ', color: '#FFFFFF' });
                segments.push({ text: args[1], color: '#55FFFF' }); // Count in Aqua
            }
            if (args.length > 2) {
                // Weitere Argumente in Weiß
                segments.push({ text: ' ' + args.slice(2).join(' '), color: '#FFFFFF' });
            }
        } else if (command === 'list') {
            // /list [category]
            if (args.length > 0) {
                segments.push({ text: ' ', color: '#FFFFFF' });
                segments.push({ text: args.join(' '), color: '#55FFFF' }); // Category in Aqua
            }
        } else {
            // Andere Commands - Argumente in Weiß
            if (args.length > 0) {
                segments.push({ text: ' ' + args.join(' '), color: '#FFFFFF' });
            }
        }
        
        return segments;
    },
    
    // Entferne Farbcodes aus Text (für Längenberechnung)
    stripColors(text) {
        return text.replace(/§./g, '');
    }
};
