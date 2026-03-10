// Crafting-Rezepte

const RECIPES = [
    // Tree zu Wood (4 Stück)
    {
        id: 'tree_to_wood',
        pattern: [['tree']],
        result: { item: 'wood', count: 4 },
        shapeless: true
    },
    
    // Wood zu Wood-Stick (4 Stück)
    {
        id: 'wood_to_stick',
        pattern: [['wood'], ['wood']],
        result: { item: 'wood-stick', count: 4 },
        shaped: true
    },
    
    // === WOODEN TOOLS ===
    {
        id: 'wooden_pickaxe',
        pattern: [
            ['wood', 'wood', 'wood', 'wood-stick'],
            [null, null, 'wood-stick', 'wood'],
            [null, 'wood-stick', null, 'wood'],
            ['wood-stick', null, null, 'wood']
        ],
        result: { item: 'pickaxe-wood', count: 1 },
        shaped: true
    },
    {
        id: 'wooden_axe',
        pattern: [
            [null, null, 'wood', 'wood-stick'],
            [null, null, 'wood-stick', 'wood'],
            [null, 'wood-stick', null, 'wood'],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'axe-wood', count: 1 },
        shaped: true
    },
    {
        id: 'wooden_shovel',
        pattern: [
            [null, null, 'wood', 'wood'],
            [null, null, 'wood-stick', 'wood'],
            [null, 'wood-stick', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'shovel-wood', count: 1 },
        shaped: true
    },
    {
        id: 'wooden_sword',
        pattern: [
            [null, null, null, 'wood'],
            [null, null, 'wood', null],
            [null, 'wood', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'sword-wood', count: 1 },
        shaped: true
    },
    
    // === STONE TOOLS ===
    {
        id: 'stone_pickaxe',
        pattern: [
            ['stone', 'stone', 'stone', 'wood-stick'],
            [null, null, 'wood-stick', 'stone'],
            [null, 'wood-stick', null, 'stone'],
            ['wood-stick', null, null, 'stone']
        ],
        result: { item: 'pickaxe-stone', count: 1 },
        shaped: true
    },
    {
        id: 'stone_axe',
        pattern: [
            [null, null, 'stone', 'wood-stick'],
            [null, null, 'wood-stick', 'stone'],
            [null, 'wood-stick', null, 'stone'],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'axe-stone', count: 1 },
        shaped: true
    },
    {
        id: 'stone_shovel',
        pattern: [
            [null, null, 'stone', 'stone'],
            [null, null, 'wood-stick', 'stone'],
            [null, 'wood-stick', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'shovel-stone', count: 1 },
        shaped: true
    },
    {
        id: 'stone_sword',
        pattern: [
            [null, null, null, 'stone'],
            [null, null, 'stone', null],
            [null, 'stone', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'sword-stone', count: 1 },
        shaped: true
    },
    
    // === IRON TOOLS ===
    {
        id: 'iron_pickaxe',
        pattern: [
            ['iron', 'iron', 'iron', 'wood-stick'],
            [null, null, 'wood-stick', 'iron'],
            [null, 'wood-stick', null, 'iron'],
            ['wood-stick', null, null, 'iron']
        ],
        result: { item: 'pickaxe-iron', count: 1 },
        shaped: true
    },
    {
        id: 'iron_axe',
        pattern: [
            [null, null, 'iron', 'wood-stick'],
            [null, null, 'wood-stick', 'iron'],
            [null, 'wood-stick', null, 'iron'],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'axe-iron', count: 1 },
        shaped: true
    },
    {
        id: 'iron_shovel',
        pattern: [
            [null, null, 'iron', 'iron'],
            [null, null, 'wood-stick', 'iron'],
            [null, 'wood-stick', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'shovel-iron', count: 1 },
        shaped: true
    },
    {
        id: 'iron_sword',
        pattern: [
            [null, null, null, 'iron'],
            [null, null, 'iron', null],
            [null, 'iron', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'sword-iron', count: 1 },
        shaped: true
    },
    
    // === GOLD TOOLS ===
    {
        id: 'gold_pickaxe',
        pattern: [
            ['gold', 'gold', 'gold', 'wood-stick'],
            [null, null, 'wood-stick', 'gold'],
            [null, 'wood-stick', null, 'gold'],
            ['wood-stick', null, null, 'gold']
        ],
        result: { item: 'pickaxe-gold', count: 1 },
        shaped: true
    },
    {
        id: 'gold_axe',
        pattern: [
            [null, null, 'gold', 'wood-stick'],
            [null, null, 'wood-stick', 'gold'],
            [null, 'wood-stick', null, 'gold'],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'axe-gold', count: 1 },
        shaped: true
    },
    {
        id: 'gold_shovel',
        pattern: [
            [null, null, 'gold', 'gold'],
            [null, null, 'wood-stick', 'gold'],
            [null, 'wood-stick', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'shovel-gold', count: 1 },
        shaped: true
    },
    {
        id: 'gold_sword',
        pattern: [
            [null, null, null, 'gold'],
            [null, null, 'gold', null],
            [null, 'gold', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'sword-gold', count: 1 },
        shaped: true
    },
    
    // === DIAMOND TOOLS ===
    {
        id: 'diamond_pickaxe',
        pattern: [
            ['diamond', 'diamond', 'diamond', 'wood-stick'],
            [null, null, 'wood-stick', 'diamond'],
            [null, 'wood-stick', null, 'diamond'],
            ['wood-stick', null, null, 'diamond']
        ],
        result: { item: 'pickaxe-diamond', count: 1 },
        shaped: true
    },
    {
        id: 'diamond_axe',
        pattern: [
            [null, null, 'diamond', 'wood-stick'],
            [null, null, 'wood-stick', 'diamond'],
            [null, 'wood-stick', null, 'diamond'],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'axe-diamond', count: 1 },
        shaped: true
    },
    {
        id: 'diamond_shovel',
        pattern: [
            [null, null, 'diamond', 'diamond'],
            [null, null, 'wood-stick', 'diamond'],
            [null, 'wood-stick', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'shovel-diamond', count: 1 },
        shaped: true
    },
    {
        id: 'diamond_sword',
        pattern: [
            [null, null, null, 'diamond'],
            [null, null, 'diamond', null],
            [null, 'diamond', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'sword-diamond', count: 1 },
        shaped: true
    },
    
    // === EMERALD TOOLS ===
    {
        id: 'emerald_pickaxe',
        pattern: [
            ['emerald', 'emerald', 'emerald', 'wood-stick'],
            [null, null, 'wood-stick', 'emerald'],
            [null, 'wood-stick', null, 'emerald'],
            ['wood-stick', null, null, 'emerald']
        ],
        result: { item: 'pickaxe-emerald', count: 1 },
        shaped: true
    },
    {
        id: 'emerald_axe',
        pattern: [
            [null, null, 'emerald', 'wood-stick'],
            [null, null, 'wood-stick', 'emerald'],
            [null, 'wood-stick', null, 'emerald'],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'axe-emerald', count: 1 },
        shaped: true
    },
    {
        id: 'emerald_shovel',
        pattern: [
            [null, null, 'emerald', 'emerald'],
            [null, null, 'wood-stick', 'emerald'],
            [null, 'wood-stick', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'shovel-emerald', count: 1 },
        shaped: true
    },
    {
        id: 'emerald_sword',
        pattern: [
            [null, null, null, 'emerald'],
            [null, null, 'emerald', null],
            [null, 'emerald', null, null],
            ['wood-stick', null, null, null]
        ],
        result: { item: 'sword-emerald', count: 1 },
        shaped: true
    }
];
