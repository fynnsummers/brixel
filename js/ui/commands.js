// Chat-Command-System

class CommandHandler {
    constructor(game) {
        this.game = game;
        this.commands = {
            'give': this.cmdGive.bind(this),
            'help': this.cmdHelp.bind(this),
            'clear': this.cmdClear.bind(this),
            'list': this.cmdList.bind(this),
            'adm': this.cmdAdm.bind(this)
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
            'pickaxe-wood', 'pickaxe-stone', 'pickaxe-iron', 'pickaxe-diamond', 'pickaxe-emerald',
            // Axes
            'axe-wood', 'axe-stone', 'axe-iron', 'axe-diamond', 'axe-emerald',
            // Shovels
            'shovel-wood', 'shovel-stone', 'shovel-iron', 'shovel-diamond', 'shovel-emerald',
            // Swords
            'sword-wood', 'sword-stone', 'sword-iron', 'sword-diamond', 'sword-emerald'
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
}
