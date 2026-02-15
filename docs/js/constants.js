const GAME_CONSTANTS = {
    STARTING_GOLD: 2000,
    BASE_SALARY: 200,
    TOTAL_SPACES: 36,
    SPACES_PER_SIDE: 8,
    MAX_ITEMS_PER_PLAYER: 2,
    JAIL_POSITION: 9,
    JAIL_BAIL: 50,
    BUYBACK_COST: 500,
    BUYBACK_STARTING_GOLD: 1000,
    MAX_TURNS: 50,
    RENT_CAP_PERCENT: 40,
    HOTEL_MIN_TURN: 20,

    BUILDING_COSTS: {
        house: 100,
        hotel: 500
    },

    RENT_MULTIPLIERS: [1, 3, 5, 8, 15, 30],

    PLAYER_COLORS: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3', '#F38181'],
    PLAYER_COLOR_NAMES: ['红色', '青色', '黄色', '薄荷', '粉色']
};

const HERO_IMG_BASE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/';
const ITEM_IMG_BASE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/';

const HEROES = [
    {
        id: "alchemist", name: "炼金术士", nameEn: "Alchemist",
        img: HERO_IMG_BASE + "alchemist.png",
        type: "passive", ability_name: "贪婪",
        ability_description: "工资+30G；租金收入+5%",
        cooldown: 0, difficulty: "beginner", power: 4,
        bonus_salary: 30, bonus_rent_percent: 5
    },
    {
        id: "bounty_hunter", name: "赏金猎人", nameEn: "Bounty Hunter",
        img: HERO_IMG_BASE + "bounty_hunter.png",
        type: "passive", ability_name: "忍术",
        ability_description: "踩中他人地块少付20%租金（每圈最多3次）",
        cooldown: 0, difficulty: "advanced", power: 4,
        rent_discount_percent: 20, max_uses_per_lap: 3
    },
    {
        id: "furion", name: "先知", nameEn: "Nature's Prophet",
        img: HERO_IMG_BASE + "furion.png",
        type: "active", ability_name: "传送",
        ability_description: "传送到任意未被购买或自己拥有的地块（50G传送费）",
        cooldown: 7, difficulty: "intermediate", power: 4,
        teleport_cost: 50
    },
    {
        id: "techies", name: "工程师", nameEn: "Techies",
        img: HERO_IMG_BASE + "techies.png",
        type: "active", ability_name: "埋雷",
        ability_description: "指定地块放置地雷，踩中者晕眩1回合并扣100G",
        cooldown: 4, difficulty: "beginner", power: 3,
        mine_damage: 100, stun_duration: 1
    },
    {
        id: "faceless_void", name: "虚空假面", nameEn: "Faceless Void",
        img: HERO_IMG_BASE + "faceless_void.png",
        type: "active", ability_name: "时间漫游",
        ability_description: "掷骰子后可撤销并后退1-3格",
        cooldown: 5, difficulty: "intermediate", power: 4,
        max_backtrack: 3
    },
    {
        id: "crystal_maiden", name: "水晶室女", nameEn: "Crystal Maiden",
        img: HERO_IMG_BASE + "crystal_maiden.png",
        type: "passive", ability_name: "奥术光环",
        ability_description: "抽神符卡时可抽2张选1张",
        cooldown: 0, difficulty: "beginner", power: 3,
        card_draw_bonus: 1
    },
    {
        id: "rubick", name: "拉比克", nameEn: "Rubick",
        img: HERO_IMG_BASE + "rubick.png",
        type: "active", ability_name: "窃取",
        ability_description: "复制上一个行动玩家的主动技能",
        cooldown: 4, difficulty: "advanced", power: 4
    },
    {
        id: "axe", name: "斧王", nameEn: "Axe",
        img: HERO_IMG_BASE + "axe.png",
        type: "passive", ability_name: "反击螺旋",
        ability_description: "他人与你同格时，强制支付50G",
        cooldown: 0, difficulty: "beginner", power: 3,
        friction_fee: 50
    },
    {
        id: "invoker", name: "祈求者", nameEn: "Invoker",
        img: HERO_IMG_BASE + "invoker.png",
        type: "active", ability_name: "阳炎冲击",
        ability_description: "扣除目标当前金币10%（100~500G）",
        cooldown: 6, difficulty: "advanced", power: 4,
        damage_percent: 10, min_damage: 100, max_damage: 500
    },
    {
        id: "pudge", name: "帕吉", nameEn: "Pudge",
        img: HERO_IMG_BASE + "pudge.png",
        type: "active", ability_name: "肉钩",
        ability_description: "将前方3-4格内的玩家钩到自己格子",
        cooldown: 4, difficulty: "intermediate", power: 3,
        hook_range_min: 3, hook_range_max: 4
    }
];

const COLOR_SETS = {
    brown:      { name: "天辉野区",     color: "#8B6914", ids: [1, 2] },
    light_blue: { name: "天辉防御塔",   color: "#4FC3F7", ids: [4, 6, 7] },
    pink:       { name: "中路防御塔",   color: "#F06292", ids: [10, 12, 13] },
    orange:     { name: "远古野",       color: "#FF9800", ids: [15, 17] },
    red:        { name: "夜魇防御塔",   color: "#EF5350", ids: [19, 21, 22] },
    yellow:     { name: "夜魇兵营",     color: "#FFEE58", ids: [24, 25] },
    green:      { name: "天辉兵营",     color: "#66BB6A", ids: [28, 29] },
    deep_blue:  { name: "遗迹",         color: "#42A5F5", ids: [34, 35] }
};

const PROPERTIES = [
    { id: 0,  type: "corner",   subtype: "start",         name: "泉水",           description: "经过或停留领取200G工资，解除所有负面效果" },

    { id: 1,  type: "property",                            name: "小型野怪营地",   price: 60,  base_rent: 6,   color_set: "brown" },
    { id: 2,  type: "property",                            name: "中型野怪营地",   price: 60,  base_rent: 6,   color_set: "brown" },
    { id: 3,  type: "outpost",                             name: "哨站",           price: 200, rent_tiers: [20, 50, 120, 250] },
    { id: 4,  type: "property",                            name: "天辉一塔",       price: 100, base_rent: 10,  color_set: "light_blue" },
    { id: 5,  type: "chance",    subtype: "rune",          name: "赏金神符",       description: "抽取一张神符卡" },
    { id: 6,  type: "property",                            name: "天辉二塔",       price: 100, base_rent: 10,  color_set: "light_blue" },
    { id: 7,  type: "property",                            name: "天辉圣坛",       price: 120, base_rent: 12,  color_set: "light_blue" },
    { id: 8,  type: "tax",       subtype: "shopping",      name: "边路商店",       tax: 100, description: "支付购物税100G" },

    { id: 9,  type: "corner",   subtype: "jail",           name: "小黑屋",         description: "路过无事；被关需掷双数或付50G出狱" },

    { id: 10, type: "property",                            name: "中路一塔",       price: 140, base_rent: 14,  color_set: "pink" },
    { id: 11, type: "utility",                             name: "神秘商店",       price: 150, description: "租金=骰子×4；拥有两商店=骰子×10" },
    { id: 12, type: "property",                            name: "中路二塔",       price: 140, base_rent: 14,  color_set: "pink" },
    { id: 13, type: "property",                            name: "中路三塔",       price: 160, base_rent: 16,  color_set: "pink" },
    { id: 14, type: "outpost",                             name: "哨站",           price: 200, rent_tiers: [20, 50, 120, 250] },
    { id: 15, type: "property",                            name: "天辉远古野",     price: 180, base_rent: 18,  color_set: "orange" },
    { id: 16, type: "community", subtype: "neutral_item",  name: "中立物品",       description: "抽取一张中立物品卡" },
    { id: 17, type: "property",                            name: "夜魇远古野",     price: 200, base_rent: 20,  color_set: "orange" },

    { id: 18, type: "corner",   subtype: "free",           name: "肉山坑",         description: "安全区；掷双数可挑战肉山" },

    { id: 19, type: "property",                            name: "夜魇一塔",       price: 220, base_rent: 22,  color_set: "red" },
    { id: 20, type: "chance",    subtype: "rune",          name: "极速神符",       description: "抽取一张神符卡" },
    { id: 21, type: "property",                            name: "夜魇二塔",       price: 220, base_rent: 22,  color_set: "red" },
    { id: 22, type: "property",                            name: "夜魇三塔",       price: 240, base_rent: 24,  color_set: "red" },
    { id: 23, type: "outpost",                             name: "哨站",           price: 200, rent_tiers: [20, 50, 120, 250] },
    { id: 24, type: "property",                            name: "夜魇近战兵营",   price: 260, base_rent: 26,  color_set: "yellow" },
    { id: 25, type: "property",                            name: "夜魇远程兵营",   price: 260, base_rent: 26,  color_set: "yellow" },
    { id: 26, type: "utility",                             name: "野区商店",       price: 150, description: "与神秘商店配对；骰子×4或×10" },

    { id: 27, type: "corner",   subtype: "go_to_jail",     name: "被举报！",       description: "直接进入小黑屋，本回合不能领工资" },

    { id: 28, type: "property",                            name: "天辉近战兵营",   price: 300, base_rent: 30,  color_set: "green" },
    { id: 29, type: "property",                            name: "天辉远程兵营",   price: 300, base_rent: 30,  color_set: "green" },
    { id: 30, type: "community", subtype: "neutral_item",  name: "中立物品",       description: "抽取一张中立物品卡" },
    { id: 31, type: "property",                            name: "天辉四塔",       price: 320, base_rent: 32,  color_set: null },
    { id: 32, type: "outpost",                             name: "哨站",           price: 200, rent_tiers: [20, 50, 120, 250] },
    { id: 33, type: "tax",       subtype: "luxury",        name: "买活费用",       tax: 200, tax_percent: 10, description: "支付200G或总资产10%（取较高者）" },
    { id: 34, type: "property",                            name: "天辉遗迹",       price: 350, base_rent: 35,  color_set: "deep_blue" },
    { id: 35, type: "property",                            name: "夜魇遗迹",       price: 400, base_rent: 40,  color_set: "deep_blue" }
];

const ITEMS = [
    { id: "wraith_band",     name: "怨灵系带",     price: 200,  type: "economic",  description: "工资+50G，4圈回本",                   img: ITEM_IMG_BASE + "wraith_band.png",     consumable: false, bonus_salary: 50 },
    { id: "phase_boots",     name: "相位鞋",       price: 500,  type: "tactical",  description: "可选择只走其中一颗骰子的点数（5回合CD）", img: ITEM_IMG_BASE + "phase_boots.png",     consumable: false, cooldown: 5 },
    { id: "aghanims_shard",  name: "阿哈利姆魔晶", price: 800,  type: "tactical",  description: "技能CD-1回合",                         img: ITEM_IMG_BASE + "aghanims_shard.png",  consumable: false, cd_reduction: 1 },
    { id: "ultimate_scepter",name: "阿哈利姆神杖", price: 1500, type: "tactical",  description: "强制升级一块地产1级（无需同色系）",       img: ITEM_IMG_BASE + "ultimate_scepter.png",consumable: false },
    { id: "rapier",          name: "圣剑",         price: 3000, type: "offensive", description: "所有地产租金×1.5；破产时掉落",          img: ITEM_IMG_BASE + "rapier.png",          consumable: false, rent_multiplier: 1.5, drops_on_bankruptcy: true },
    { id: "black_king_bar",  name: "黑皇杖",       price: 300,  type: "defensive", description: "免疫1次入狱或地雷（一次性）",             img: ITEM_IMG_BASE + "black_king_bar.png",  consumable: true },
    { id: "tpscroll",        name: "回城卷轴",     price: 50,   type: "economic",  description: "下次行动传送到泉水（一次性）",            img: ITEM_IMG_BASE + "tpscroll.png",        consumable: true },
    { id: "bottle",          name: "魔瓶",         price: 100,  type: "tactical",  description: "储存1张神符卡，稍后使用",                img: ITEM_IMG_BASE + "bottle.png",          consumable: false, can_store_rune: true }
];

const RUNE_CARDS = [
    { id: "double_damage", name: "双倍伤害", rarity: "common",  probability: 20, effect: "下一次收取的租金×2",                       description: "配合红旅馆使用" },
    { id: "invisibility",  name: "隐身",     rarity: "epic",    probability: 5,  effect: "路过对手地产免租金，直到下次掷骰子",          description: "穿越危险区域" },
    { id: "illusion",      name: "幻象",     rarity: "common",  probability: 20, effect: "制造幻象放在任意格，踩中者晕眩1回合",         description: "类似炸弹人地雷" },
    { id: "arcane",        name: "奥术",     rarity: "epic",    probability: 5,  effect: "所有技能CD立即刷新",                        description: "技能流英雄神卡" },
    { id: "bounty",        name: "赏金",     rarity: "common",  probability: 20, effect: "立即获得150G",                             description: "经济补充" },
    { id: "haste",         name: "极速",     rarity: "rare",    probability: 15, effect: "下次掷骰子点数+3",                          description: "快速到达目标" },
    { id: "regeneration",  name: "恢复",     rarity: "common",  probability: 15, effect: "免疫下一次租金",                             description: "防御卡" }
];

const NEUTRAL_ITEM_CARDS = [
    { id: "connection_lost", name: "掉线了",       type: "negative", probability: 15, effect: "暂停1回合，无法收租",             description: "轻度惩罚" },
    { id: "gabens_blessing", name: "GabeN的微笑",  type: "positive", probability: 13, effect: "下一个建筑升级费用5折",            description: "随机奖励" },
    { id: "ganked",          name: "被Gank！",     type: "negative", probability: 10, effect: "支付30G给每位玩家",               description: "敌方团战" },
    { id: "nerfed",          name: "被削弱",       type: "negative", probability: 5,  effect: "所有地产本回合租金-30%",           description: "冰蛙又来了" },
    { id: "deny",            name: "反补",         type: "neutral",  probability: 15, effect: "一块地免疫负面效果但无法收租",       description: "战术卡" },
    { id: "roshan_up",       name: "Roshan刷新",   type: "neutral",  probability: 15, effect: "所有玩家向肉山坑移动1-2格",        description: "打乱节奏" },
    { id: "refresher",       name: "刷新球",       type: "positive", probability: 14, effect: "所有技能CD立即刷新",              description: "重置一切" },
    { id: "tome",            name: "智慧之书",     type: "positive", probability: 13, effect: "立即获得300G",                    description: "知识就是力量" }
];

function drawRuneCard() {
    const totalProb = RUNE_CARDS.reduce((sum, c) => sum + c.probability, 0);
    let roll = Math.random() * totalProb;
    for (const card of RUNE_CARDS) {
        roll -= card.probability;
        if (roll <= 0) return card;
    }
    return RUNE_CARDS[RUNE_CARDS.length - 1];
}

function drawNeutralCard() {
    const totalProb = NEUTRAL_ITEM_CARDS.reduce((sum, c) => sum + c.probability, 0);
    let roll = Math.random() * totalProb;
    for (const card of NEUTRAL_ITEM_CARDS) {
        roll -= card.probability;
        if (roll <= 0) return card;
    }
    return NEUTRAL_ITEM_CARDS[NEUTRAL_ITEM_CARDS.length - 1];
}

function calculateRent(property, buildingLevel, diceTotal, ownerOutpostCount, ownerHasBothShops, ownerHasRapier) {
    if (property.type === 'outpost') {
        const idx = Math.min(ownerOutpostCount - 1, property.rent_tiers.length - 1);
        return property.rent_tiers[Math.max(0, idx)];
    }
    if (property.type === 'utility') {
        const multiplier = ownerHasBothShops ? 10 : 4;
        return diceTotal * multiplier;
    }
    if (property.type !== 'property') return 0;

    const level = Math.min(buildingLevel, GAME_CONSTANTS.RENT_MULTIPLIERS.length - 1);
    let rent = property.base_rent * GAME_CONSTANTS.RENT_MULTIPLIERS[level];
    if (ownerHasRapier) rent = Math.floor(rent * 1.5);
    return rent;
}
