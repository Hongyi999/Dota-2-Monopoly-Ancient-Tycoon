// Game Constants

const GAME_CONSTANTS = {
    STARTING_GOLD: 1500,
    BASE_SALARY: 200,
    TOTAL_SPACES: 40,
    MAX_ITEMS_PER_PLAYER: 2,
    JAIL_POSITION: 10,
    JAIL_BAIL: 50,
    BUYBACK_COST: 500,
    BUYBACK_STARTING_GOLD: 800,

    PLAYER_COLORS: [
        '#FF6B6B', // Red
        '#4ECDC4', // Cyan
        '#FFD93D', // Yellow
        '#95E1D3', // Mint
        '#F38181'  // Pink
    ]
};

const HEROES = [
    {
        id: "alchemist",
        name: "Alchemist",
        ability_name: "Greevil's Greed",
        ability_description: "Earn bonus gold from salary and property purchases",
        difficulty: "beginner",
        cooldown: 0,
        bonus_salary: 50,
        bonus_rent_percent: 10
    },
    {
        id: "axe",
        name: "Axe",
        ability_name: "Berserker's Call",
        ability_description: "Force nearby players to pay you rent even if not on your property",
        difficulty: "intermediate",
        cooldown: 5
    },
    {
        id: "bounty_hunter",
        name: "Bounty Hunter",
        ability_name: "Jinada",
        ability_description: "Get 20% discount on rent payments (3 times per lap)",
        difficulty: "beginner",
        cooldown: 0,
        rent_discount_percent: 20,
        max_uses_per_lap: 3
    },
    {
        id: "dragon_knight",
        name: "Dragon Knight",
        ability_name: "Dragon Blood",
        ability_description: "Immune to negative events and traps",
        difficulty: "beginner",
        cooldown: 0
    },
    {
        id: "juggernaut",
        name: "Juggernaut",
        ability_name: "Omnislash",
        ability_description: "Roll dice twice and choose which result to use",
        difficulty: "intermediate",
        cooldown: 8
    },
    {
        id: "lina",
        name: "Lina",
        ability_name: "Laguna Blade",
        ability_description: "Force a player to sell a random property at half price",
        difficulty: "advanced",
        cooldown: 10
    },
    {
        id: "phantom_assassin",
        name: "Phantom Assassin",
        ability_name: "Coup de Grace",
        ability_description: "15% chance to collect double rent",
        difficulty: "intermediate",
        cooldown: 0,
        crit_chance: 15
    },
    {
        id: "pudge",
        name: "Pudge",
        ability_name: "Meat Hook",
        ability_description: "Pull another player to your position",
        difficulty: "intermediate",
        cooldown: 6
    },
    {
        id: "sniper",
        name: "Sniper",
        ability_name: "Assassinate",
        ability_description: "Collect rent from players within 3 spaces",
        difficulty: "advanced",
        cooldown: 7
    },
    {
        id: "zeus",
        name: "Zeus",
        ability_name: "Thundergod's Wrath",
        ability_description: "All players pay you 50 gold",
        difficulty: "advanced",
        cooldown: 12
    }
];

const PROPERTIES = [
    // Starting Position
    { id: 0, type: "fountain", name: "Fountain", description: "Collect 200G when passing" },

    // Radiant Side
    { id: 1, type: "property", name: "Radiant Safe Lane", faction: "radiant", price: 60, rent: [2, 10, 30, 90, 160, 250], tier: 1 },
    { id: 2, type: "event", name: "Rune Spawn", description: "Draw a rune card" },
    { id: 3, type: "property", name: "Radiant Mid Lane", faction: "radiant", price: 60, rent: [4, 20, 60, 180, 320, 450], tier: 1 },
    { id: 4, type: "tax", name: "Courier Cost", description: "Pay 200G" },
    { id: 5, type: "property", name: "Radiant Jungle", faction: "radiant", price: 200, rent: [25, 50, 100, 200], tier: 2 },
    { id: 6, type: "property", name: "Radiant Off Lane", faction: "radiant", price: 100, rent: [6, 30, 90, 270, 400, 550], tier: 1 },
    { id: 7, type: "event", name: "Bounty Rune", description: "Gain 100G" },
    { id: 8, type: "property", name: "Radiant Secret Shop", faction: "radiant", price: 100, rent: [6, 30, 90, 270, 400, 550], tier: 1 },
    { id: 9, type: "property", name: "Radiant Ancient Camp", faction: "radiant", price: 120, rent: [8, 40, 100, 300, 450, 600], tier: 1 },

    // Jail
    { id: 10, type: "jail", name: "Low Priority Queue", description: "Just visiting or stuck for 3 turns" },

    // Neutral Areas
    { id: 11, type: "property", name: "River Outpost", faction: "neutral", price: 140, rent: [10, 50, 150, 450, 625, 750], tier: 2 },
    { id: 12, type: "item", name: "Item Shop", description: "Buy items" },
    { id: 13, type: "property", name: "Roshan Pit", faction: "neutral", price: 140, rent: [10, 50, 150, 450, 625, 750], tier: 2 },
    { id: 14, type: "property", name: "Dire Jungle", faction: "dire", price: 160, rent: [12, 60, 180, 500, 700, 900], tier: 2 },
    { id: 15, type: "property", name: "Ancient Neutral Camp", faction: "neutral", price: 200, rent: [25, 50, 100, 200], tier: 3 },
    { id: 16, type: "property", name: "Secret Shop", faction: "neutral", price: 180, rent: [14, 70, 200, 550, 750, 950], tier: 2 },
    { id: 17, type: "event", name: "Power Rune", description: "Draw a power rune card" },
    { id: 18, type: "property", name: "Side Shop", faction: "neutral", price: 180, rent: [14, 70, 200, 550, 750, 950], tier: 2 },
    { id: 19, type: "property", name: "Lotus Pool", faction: "neutral", price: 200, rent: [16, 80, 220, 600, 800, 1000], tier: 2 },

    // Free Parking equivalent
    { id: 20, type: "free", name: "Neutral Outpost", description: "Rest here, nothing happens" },

    // Dire Side
    { id: 21, type: "property", name: "Dire Safe Lane", faction: "dire", price: 220, rent: [18, 90, 250, 700, 875, 1050], tier: 3 },
    { id: 22, type: "event", name: "Scan", description: "Special event" },
    { id: 23, type: "property", name: "Dire Mid Lane", faction: "dire", price: 220, rent: [18, 90, 250, 700, 875, 1050], tier: 3 },
    { id: 24, type: "property", name: "Dire Off Lane", faction: "dire", price: 240, rent: [20, 100, 300, 750, 925, 1100], tier: 3 },
    { id: 25, type: "property", name: "Triangle Camp", faction: "dire", price: 200, rent: [25, 50, 100, 200], tier: 3 },
    { id: 26, type: "property", name: "Dire Ancient Camp", faction: "dire", price: 260, rent: [22, 110, 330, 800, 975, 1150], tier: 3 },
    { id: 27, type: "property", name: "Dire Secret Shop", faction: "dire", price: 260, rent: [22, 110, 330, 800, 975, 1150], tier: 3 },
    { id: 28, type: "item", name: "Dire Item Shop", description: "Buy items" },
    { id: 29, type: "property", name: "Dire Outpost", faction: "dire", price: 280, rent: [24, 120, 360, 850, 1025, 1200], tier: 3 },

    // Go to Jail
    { id: 30, type: "gojail", name: "Report for Griefing", description: "Go to Low Priority Queue" },

    // High tier properties
    { id: 31, type: "property", name: "Radiant Base", faction: "radiant", price: 300, rent: [26, 130, 390, 900, 1100, 1275], tier: 4 },
    { id: 32, type: "property", name: "Radiant Shrine", faction: "radiant", price: 300, rent: [26, 130, 390, 900, 1100, 1275], tier: 4 },
    { id: 33, type: "event", name: "Aegis Drop", description: "Special reward" },
    { id: 34, type: "property", name: "Dire Base", faction: "dire", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], tier: 4 },
    { id: 35, type: "property", name: "Aghanim's Sanctum", faction: "neutral", price: 200, rent: [25, 50, 100, 200], tier: 4 },
    { id: 36, type: "event", name: "Glyph of Fortification", description: "Protection event" },
    { id: 37, type: "property", name: "Dire Shrine", faction: "dire", price: 350, rent: [35, 175, 500, 1100, 1300, 1500], tier: 4 },
    { id: 38, type: "tax", name: "Divine Rapier Tax", description: "Pay 100G" },
    { id: 39, type: "property", name: "Ancient (Throne)", faction: "neutral", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], tier: 5 }
];

const ITEMS = [
    { id: "wraith_band", name: "Wraith Band", price: 50, description: "+50 salary bonus" },
    { id: "aghanims_shard", name: "Aghanim's Shard", price: 100, description: "Reduce ability cooldown by 1" },
    { id: "divine_rapier", name: "Divine Rapier", price: 300, description: "+50% rent collection, but drop on bankruptcy" },
    { id: "aegis", name: "Aegis of Immortal", price: 200, description: "One-time bankruptcy protection" },
    { id: "bottle", name: "Bottle", price: 75, description: "Store one rune card for later use" },
    { id: "blink_dagger", name: "Blink Dagger", price: 150, description: "Teleport to any space once" }
];
