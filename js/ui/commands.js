// Chat-Command-System

class CommandHandler {
    constructor(game) {
        this.game = game;
        this.commands = {
            'give': this.cmdGive.bind(this),
            'help': this.cmdHelp.bind(this),
            'clear': this.cmdClear.bind(this),
            'list': this.cmdList.bind(this),
            'adm': this.cmdAdm.bind(this),
            'adm2': this.cmdAdm2.bind(this),
            'fly': this.cmdFly.bind(this),
            'time': this.cmdTime.bind(this)
        };
    }
    
    // Verarbeite Command
    execute(message) {
        // Prüfe ob es ein Command ist
        if (!message.startsWith('/')) {
            return false;
        }
        
        // Parse Command
        const parts = message.slice(1).trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Führe Command aus
        if (this.commands[command]) {
            try {
                this.commands[command](args);
                return true;
            } catch (error) {
                this.game.chat.addMessage(`§cError: ${error.message}`);
                return true;
            }
        } else {
            this.game.chat.addMessage(`§cUnknown command: /${command}`);
            this.game.chat.addMessage('§7Type /help for a list of commands');
            return true;
        }
    }
    
    // Command: /give <item> [count]
    cmdGive(args) {
        if (args.length === 0) {
            this.game.chat.addMessage('§cUsage: /give <item> [count]');
            this.game.chat.addMessage('§7Example: /give stone 64');
            return;
        }
        
        const itemInput = args[0];
        const count = args[1] ? parseInt(args[1]) : 1;
        
        // Validiere Count
        if (isNaN(count) || count <= 0) {
            this.game.chat.addMessage('§cInvalid count! Must be a positive number.');
            return;
        }
        
        if (count > 999) {
            this.game.chat.addMessage('§cCount too high! Maximum is 999.');
            return;
        }
        
        // Finde Item (nach Name oder ID)
        let itemKey = null;
        
        if (!isNaN(itemInput)) {
            // Input ist eine Zahl (ID)
            const id = parseInt(itemInput);
            itemKey = ItemRegistry.getKeyById(id);
        } else {
            // Input ist ein Name
            if (ItemRegistry.exists(itemInput)) {
                itemKey = itemInput;
            }
        }
        
        if (!itemKey) {
            this.game.chat.addMessage(`§cItem not found: ${itemInput}`);
            this.game.chat.addMessage('§7Use /list to see all items');
            return;
        }
        
        // Füge Item zum Inventar hinzu
        const item = ItemRegistry.getByName(itemKey);
        const added = this.game.inventory.addItem(itemKey, count);
        
        if (added) {
            this.game.chat.addMessage(`§aGave ${count}x ${item.name} (${itemKey})`);
        } else {
            this.game.chat.addMessage('§cInventory is full!');
        }
    }
    
    // Command: /help
    cmdHelp(args) {
        this.game.chat.addMessage('§e=== Available Commands ===');
        this.game.chat.addMessage('§7/give <item> [count] - Give yourself items');
        this.game.chat.addMessage('§7/list [category] - List all items');
        this.game.chat.addMessage('§7/adm - Give all tools (admin)');
        this.game.chat.addMessage('§7/adm2 - Give all ores & materials x100 (admin)');
        this.game.chat.addMessage('§7/fly <on|off> - Toggle fly mode');
        this.game.chat.addMessage('§7/time <day|night> - Set time of day');
        this.game.chat.addMessage('§7/clear - Clear chat');
        this.game.chat.addMessage('§7/help - Show this help');
    }
    
    // Command: /clear
    cmdClear(args) {
        this.game.chat.messages = [];
        this.game.chat.addMessage('§aChat cleared!');
    }
    
    // Command: /list [category]
    cmdList(args) {
        const category = args[0] ? args[0].toLowerCase() : null;
        
        let items;
        if (category) {
            items = ItemRegistry.getByCategory(category);
            if (items.length === 0) {
                items = ItemRegistry.getBySubcategory(category);
            }
            
            if (items.length === 0) {
                this.game.chat.addMessage(`§cNo items found in category: ${category}`);
                return;
            }
            
            this.game.chat.addMessage(`§e=== Items (${category}) ===`);
        } else {
            items = ItemRegistry.listAll();
            this.game.chat.addMessage('§e=== All Items ===');
        }
        
        items.forEach(item => {
            this.game.chat.addMessage(`§7[${item.id}] ${item.key} - ${item.name}`);
        });
    }
    
    // Command: /adm - Give all tools sorted
    cmdAdm(args) {
        // Leere Inventar zuerst
        this.game.inventory.clear();
        
        // Alle Tools geordnet nach Material und Typ
        const toolOrder = [
            // Pickaxes
            'pickaxe-wood', 'pickaxe-stone', 'pickaxe-iron', 'pickaxe-gold', 'pickaxe-diamond', 'pickaxe-emerald',
            // Axes
            'axe-wood', 'axe-stone', 'axe-iron', 'axe-gold', 'axe-diamond', 'axe-emerald',
            // Shovels
            'shovel-wood', 'shovel-stone', 'shovel-iron', 'shovel-gold', 'shovel-diamond', 'shovel-emerald',
            // Swords
            'sword-wood', 'sword-stone', 'sword-iron', 'sword-gold', 'sword-diamond', 'sword-emerald'
        ];
        
        let addedCount = 0;
        toolOrder.forEach(toolKey => {
            if (ItemRegistry.exists(toolKey)) {
                const added = this.game.inventory.addItem(toolKey, 1);
                if (added) addedCount++;
            }
        });
        
        this.game.chat.addMessage(`§a[ADMIN] Gave ${addedCount} tools!`);
        this.game.chat.addMessage('§7All tools have been added to your inventory');
    }
    
    // Command: /adm2 - Give all ores and their drop materials x100
    cmdAdm2(args) {
        // Leere Inventar zuerst
        this.game.inventory.clear();
        
        // Alle Ore-Blöcke und deren Drop-Items
        const oreItems = [
            // Ore blocks
            'coalore', 'ironore', 'goldore', 'diamondore', 'emeraldore',
            // Drop materials
            'coal', 'iron', 'gold', 'diamond', 'emerald'
        ];
        
        let addedCount = 0;
        oreItems.forEach(itemKey => {
            if (ItemRegistry.exists(itemKey)) {
                const added = this.game.inventory.addItem(itemKey, 100);
                if (added) addedCount++;
            }
        });
        
        this.game.chat.addMessage(`§a[ADMIN] Gave ${addedCount} ore items x100!`);
        this.game.chat.addMessage('§7All ores and materials have been added');
    }
    
    // Command: /fly <on|off>
    cmdFly(args) {
        if (args.length === 0) {
            this.game.chat.addMessage('§cUsage: /fly <on|off>');
            return;
        }
        
        const mode = args[0].toLowerCase();
        
        if (mode === 'on') {
            this.game.player.flyMode = true;
            this.game.chat.addMessage('§aFly mode enabled!');
            this.game.chat.addMessage('§7Space to fly up, Shift to fly down');
        } else if (mode === 'off') {
            this.game.player.flyMode = false;
            this.game.chat.addMessage('§cFly mode disabled!');
        } else {
            this.game.chat.addMessage('§cUsage: /fly <on|off>');
        }
    }
    
    // Command: /time <day|night>
    cmdTime(args) {
        if (args.length === 0) {
            this.game.chat.addMessage('§cUsage: /time <day|night>');
            return;
        }
        
        const timeMode = args[0].toLowerCase();
        
        if (timeMode === 'day') {
            // Setze Zeit auf Mittag (0.5 = 50% des Zyklus)
            this.game.renderer.dayTime = 0.5;
            this.game.chat.addMessage('§aTime set to day!');
        } else if (timeMode === 'night') {
            // Setze Zeit auf Mitternacht (0.0 = 0% des Zyklus)
            this.game.renderer.dayTime = 0.0;
            this.game.chat.addMessage('§aTime set to night!');
        } else {
            this.game.chat.addMessage('§cUsage: /time <day|night>');
        }
    }
}
