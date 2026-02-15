let gameState = {
    players: [],
    currentPlayerIndex: 0,
    turnNumber: 1,
    selectedHeroes: [],
    playerCount: 2,
    gameStarted: false,
    diceRolled: false,
    propertyBuildings: {},
    propertyOwners: {},
    pendingAction: null,
    lastDice: [0, 0],
    doublesCount: 0
};

class Player {
    constructor(id, name, hero, color) {
        this.id = id;
        this.name = name;
        this.hero = hero;
        this.color = color;
        this.gold = GAME_CONSTANTS.STARTING_GOLD;
        this.position = 0;
        this.properties = [];
        this.items = [];
        this.isInJail = false;
        this.jailTurnsRemaining = 0;
        this.isBankrupt = false;
        this.hasUsedBuyback = false;
        this.abilityCooldown = 0;
        this.jinadaUsesThisLap = 0;
        this.storedRune = null;
        this.immuneToRent = false;
        this.doubleRentNext = false;
        this.haste_bonus = 0;
        this.stunned = false;
    }

    moveToPosition(newPosition) {
        const oldPosition = this.position;
        this.position = newPosition % GAME_CONSTANTS.TOTAL_SPACES;
        if (newPosition >= GAME_CONSTANTS.TOTAL_SPACES && oldPosition !== 0) {
            this.collectSalary();
            this.jinadaUsesThisLap = 0;
        }
    }

    collectSalary() {
        let salary = GAME_CONSTANTS.BASE_SALARY;
        if (this.hero.bonus_salary) salary += this.hero.bonus_salary;
        const wb = this.items.find(i => i === 'wraith_band');
        if (wb) salary += 50;
        this.gold += salary;
        addEventLog(`${this.name} 领取了 ${salary}G 工资！`);
        return salary;
    }

    addGold(amount) { this.gold += amount; }

    deductGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    getTotalAssets() {
        let total = this.gold;
        this.properties.forEach(pid => {
            const prop = PROPERTIES[pid];
            if (prop && prop.price) total += prop.price;
            const level = gameState.propertyBuildings[pid] || 0;
            if (level <= 4) total += level * GAME_CONSTANTS.BUILDING_COSTS.house;
            else total += 4 * GAME_CONSTANTS.BUILDING_COSTS.house + GAME_CONSTANTS.BUILDING_COSTS.hotel;
        });
        this.items.forEach(itemId => {
            const item = ITEMS.find(i => i.id === itemId);
            if (item) total += Math.floor(item.price / 2);
        });
        return total;
    }

    getHealthLevel() {
        if (this.gold > 1500) return 'safe';
        if (this.gold > 500) return 'warning';
        if (this.gold > 200) return 'danger';
        return 'critical';
    }

    reduceCooldown() {
        if (this.abilityCooldown > 0) {
            this.abilityCooldown--;
            if (this.items.includes('aghanims_shard')) {
                this.abilityCooldown = Math.max(0, this.abilityCooldown - 1);
            }
        }
    }
}

function initializeHeroSelection() {
    const heroGrid = document.getElementById('hero-grid');
    heroGrid.innerHTML = '';

    HEROES.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.dataset.heroId = hero.id;

        const powerStars = '★'.repeat(hero.power) + '☆'.repeat(5 - hero.power);
        const diffLabel = { beginner: '新手', intermediate: '进阶', advanced: '高手' }[hero.difficulty] || '';

        card.innerHTML = `
            <div class="hero-portrait">
                <img src="${hero.img}" alt="${hero.name}" onerror="this.style.display='none'; this.parentNode.innerHTML='<span class=\\'hero-fallback\\'>${hero.name.charAt(0)}</span>';">
            </div>
            <div class="hero-card-body">
                <div class="hero-name">${hero.name}</div>
                <div class="hero-name-en">${hero.nameEn}</div>
                <div class="hero-ability-name">${hero.ability_name}</div>
                <div class="hero-ability">${hero.ability_description}</div>
                <div class="hero-meta">
                    <span class="hero-stars">${powerStars}</span>
                    <span class="hero-diff">${diffLabel}</span>
                </div>
                ${hero.cooldown > 0 ? `<div class="hero-cd">CD: ${hero.cooldown}回合</div>` : '<div class="hero-cd passive">被动</div>'}
            </div>
        `;

        card.onclick = () => toggleHeroSelection(hero.id);
        heroGrid.appendChild(card);
    });
}

function toggleHeroSelection(heroId) {
    const maxSelections = gameState.playerCount;
    const index = gameState.selectedHeroes.indexOf(heroId);

    if (index > -1) {
        gameState.selectedHeroes.splice(index, 1);
    } else {
        if (gameState.selectedHeroes.length >= maxSelections) {
            gameState.selectedHeroes.shift();
        }
        gameState.selectedHeroes.push(heroId);
    }
    updateHeroSelection();
}

function updateHeroSelection() {
    document.querySelectorAll('.hero-card').forEach(card => {
        const heroId = card.dataset.heroId;
        const index = gameState.selectedHeroes.indexOf(heroId);

        if (index > -1) {
            card.classList.add('selected');
            let badge = card.querySelector('.player-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'player-badge';
                card.appendChild(badge);
            }
            badge.textContent = `玩家${index + 1}`;
            badge.style.backgroundColor = GAME_CONSTANTS.PLAYER_COLORS[index];
        } else {
            card.classList.remove('selected');
            const badge = card.querySelector('.player-badge');
            if (badge) badge.remove();
        }
    });

    const needed = gameState.playerCount - gameState.selectedHeroes.length;
    document.getElementById('heroes-needed').textContent = needed;
    document.getElementById('start-game-btn').disabled = gameState.selectedHeroes.length < gameState.playerCount;
}

function updatePlayerCount(count) {
    gameState.playerCount = parseInt(count);
    document.getElementById('player-count-display').textContent = count;
    while (gameState.selectedHeroes.length > gameState.playerCount) {
        gameState.selectedHeroes.pop();
    }
    updateHeroSelection();
}

function startGame() {
    gameState.players = [];
    gameState.propertyBuildings = {};
    gameState.propertyOwners = {};

    gameState.selectedHeroes.forEach((heroId, index) => {
        const hero = HEROES.find(h => h.id === heroId);
        const player = new Player(index, `玩家${index + 1}`, hero, GAME_CONSTANTS.PLAYER_COLORS[index]);
        gameState.players.push(player);
    });

    gameState.currentPlayerIndex = 0;
    gameState.turnNumber = 1;
    gameState.gameStarted = true;
    gameState.diceRolled = false;
    gameState.doublesCount = 0;

    showScreen('game-screen');
    initializeBoard();
    updateGameUI();
    addEventLog(`游戏开始！每位玩家获得 ${GAME_CONSTANTS.STARTING_GOLD}G 起始资金。`);
    addEventLog(`轮到 ${gameState.players[0].name} 的回合。`);
}

function initializeBoard() {
    generatePathSVG();
    renderBoardSpaces();
    renderPlayerTokens();
    initParticles();
    updateBoardSpaces();
}

function refreshBoard() {
    updateBoardSpaces();
    repositionAllTokens();
    const turnEl = document.getElementById('center-turn');
    if (turnEl && gameState.gameStarted) {
        turnEl.textContent = `第 ${gameState.turnNumber} 回合`;
    }
}

function rollDice() {
    if (gameState.diceRolled) return;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.stunned) {
        currentPlayer.stunned = false;
        addEventLog(`${currentPlayer.name} 处于晕眩状态，跳过本回合！`);
        gameState.diceRolled = true;
        document.getElementById('roll-dice-btn').disabled = true;
        document.getElementById('end-turn-btn').disabled = false;
        return;
    }

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    let total = die1 + die2;

    if (currentPlayer.haste_bonus > 0) {
        total += currentPlayer.haste_bonus;
        addEventLog(`极速神符加成 +${currentPlayer.haste_bonus}！`);
        currentPlayer.haste_bonus = 0;
    }

    gameState.lastDice = [die1, die2];
    const isDoubles = die1 === die2;
    gameState.diceRolled = true;
    document.getElementById('roll-dice-btn').disabled = true;

    animateDiceRoll(die1, die2, () => {
        document.getElementById('dice-result').innerHTML = `
            <span class="dice-face">${die1}</span>
            <span class="dice-plus">+</span>
            <span class="dice-face">${die2}</span>
            <span class="dice-equals">=</span>
            <span class="dice-total">${total}</span>
            ${isDoubles ? '<span class="dice-doubles">双数!</span>' : ''}
        `;

        const oldPos = currentPlayer.position;
        const newPos = (oldPos + total) % GAME_CONSTANTS.TOTAL_SPACES;

        if (oldPos + total >= GAME_CONSTANTS.TOTAL_SPACES && oldPos !== 0) {
            currentPlayer.collectSalary();
            currentPlayer.jinadaUsesThisLap = 0;
        }

        animatePlayerMove(gameState.currentPlayerIndex, oldPos, newPos, () => {
            currentPlayer.position = newPos;
            addEventLog(`${currentPlayer.name} 掷出了 ${die1}+${die2}=${total}，移动到 ${PROPERTIES[currentPlayer.position].name}`);
            handleLanding(currentPlayer);
            updateGameUI();
            refreshBoard();
            document.getElementById('end-turn-btn').disabled = false;
        });
    });
}

function handleLanding(player) {
    const space = PROPERTIES[player.position];
    if (!space) return;

    switch (space.type) {
        case 'property':
            handlePropertyLanding(player, space);
            break;
        case 'outpost':
        case 'utility':
            handleBuyableLanding(player, space);
            break;
        case 'chance':
            handleRuneCard(player);
            break;
        case 'community':
            handleNeutralCard(player);
            break;
        case 'tax':
            handleTax(player, space);
            break;
        case 'corner':
            handleCorner(player, space);
            break;
    }
    updateGameUI();
}

function handlePropertyLanding(player, space) {
    const ownerId = gameState.propertyOwners[space.id];

    if (ownerId === undefined) {
        showPurchaseModal(player, space);
    } else if (ownerId !== player.id) {
        if (player.immuneToRent) {
            addEventLog(`${player.name} 免疫了本次租金！`);
            player.immuneToRent = false;
            return;
        }
        const owner = gameState.players[ownerId];
        const level = gameState.propertyBuildings[space.id] || 0;
        let rent = calculateRent(space, level, 0, 0, false, owner.items.includes('rapier'));

        if (owner.hero.bonus_rent_percent) {
            rent = Math.floor(rent * (1 + owner.hero.bonus_rent_percent / 100));
        }
        if (owner.doubleRentNext) {
            rent *= 2;
            owner.doubleRentNext = false;
            addEventLog(`双倍伤害生效！租金翻倍！`);
        }

        const cap = Math.floor(player.getTotalAssets() * GAME_CONSTANTS.RENT_CAP_PERCENT / 100);
        if (rent > cap && cap > 0) {
            rent = Math.min(rent, cap);
            addEventLog(`租金保护：上限为资产的${GAME_CONSTANTS.RENT_CAP_PERCENT}%`);
        }

        if (player.hero.id === 'bounty_hunter' && player.jinadaUsesThisLap < (player.hero.max_uses_per_lap || 3)) {
            const discount = Math.floor(rent * (player.hero.rent_discount_percent || 20) / 100);
            rent -= discount;
            player.jinadaUsesThisLap++;
            addEventLog(`忍术生效！少付 ${discount}G（${player.jinadaUsesThisLap}/${player.hero.max_uses_per_lap}）`);
        }

        if (player.deductGold(rent)) {
            owner.addGold(rent);
            addEventLog(`${player.name} 向 ${owner.name} 支付了 ${rent}G 租金`);
        } else {
            addEventLog(`${player.name} 无法支付 ${rent}G 租金！面临破产！`);
        }
    } else {
        addEventLog(`${player.name} 到达了自己的地产 ${space.name}`);
    }
}

function handleBuyableLanding(player, space) {
    const ownerId = gameState.propertyOwners[space.id];
    if (ownerId === undefined) {
        showPurchaseModal(player, space);
    } else if (ownerId !== player.id) {
        if (player.immuneToRent) {
            addEventLog(`${player.name} 免疫了本次租金！`);
            player.immuneToRent = false;
            return;
        }
        const owner = gameState.players[ownerId];
        let rent = 0;
        if (space.type === 'outpost') {
            const count = owner.properties.filter(pid => PROPERTIES[pid] && PROPERTIES[pid].type === 'outpost').length;
            rent = calculateRent(space, 0, 0, count, false, false);
        } else {
            const diceTotal = gameState.lastDice[0] + gameState.lastDice[1];
            const hasBoth = owner.properties.some(pid => PROPERTIES[pid] && PROPERTIES[pid].type === 'utility' && pid !== space.id);
            rent = calculateRent(space, 0, diceTotal, 0, hasBoth, false);
        }
        if (player.deductGold(rent)) {
            owner.addGold(rent);
            addEventLog(`${player.name} 向 ${owner.name} 支付了 ${rent}G`);
        } else {
            addEventLog(`${player.name} 无法支付！`);
        }
    }
}

function handleRuneCard(player) {
    const card = drawRuneCard();
    addEventLog(`${player.name} 抽到了神符卡：${card.name} — ${card.effect}`);
    showCardModal(card, 'rune');
    applyRuneCard(player, card);
}

function handleNeutralCard(player) {
    const card = drawNeutralCard();
    addEventLog(`${player.name} 抽到了中立物品卡：${card.name} — ${card.effect}`);
    showCardModal(card, 'neutral');
    applyNeutralCard(player, card);
}

function applyRuneCard(player, card) {
    switch (card.id) {
        case 'bounty':
            player.addGold(150);
            addEventLog(`${player.name} 获得了 150G！`);
            break;
        case 'double_damage':
            player.doubleRentNext = true;
            addEventLog(`${player.name} 下次收租翻倍！`);
            break;
        case 'haste':
            player.haste_bonus = 3;
            addEventLog(`${player.name} 下次掷骰子+3！`);
            break;
        case 'regeneration':
            player.immuneToRent = true;
            addEventLog(`${player.name} 免疫下一次租金！`);
            break;
        case 'arcane':
            player.abilityCooldown = 0;
            addEventLog(`${player.name} 所有技能CD刷新！`);
            break;
        case 'invisibility':
            player.immuneToRent = true;
            addEventLog(`${player.name} 进入隐身状态，免疫租金！`);
            break;
        case 'illusion':
            addEventLog(`${player.name} 制造了一个幻象（效果待实现）`);
            break;
    }
}

function applyNeutralCard(player, card) {
    switch (card.id) {
        case 'tome':
            player.addGold(300);
            addEventLog(`${player.name} 获得了 300G！`);
            break;
        case 'refresher':
            player.abilityCooldown = 0;
            addEventLog(`${player.name} 技能CD全部刷新！`);
            break;
        case 'gabens_blessing':
            addEventLog(`${player.name} 下次建筑升级半价！（效果待实现）`);
            break;
        case 'ganked':
            const amount = 30;
            gameState.players.forEach(p => {
                if (p.id !== player.id && !p.isBankrupt) {
                    player.deductGold(amount);
                    p.addGold(amount);
                }
            });
            addEventLog(`${player.name} 被Gank！向每位玩家支付了 ${amount}G`);
            break;
        case 'connection_lost':
            player.stunned = true;
            addEventLog(`${player.name} 掉线了！下回合跳过行动`);
            break;
        case 'nerfed':
            addEventLog(`${player.name} 被削弱！本回合所有地产租金-30%（效果待实现）`);
            break;
        case 'deny':
            addEventLog(`${player.name} 反补了一块地产（效果待实现）`);
            break;
        case 'roshan_up':
            addEventLog(`Roshan刷新了！所有玩家向肉山坑移动（效果待实现）`);
            break;
    }
}

function handleTax(player, space) {
    let tax = space.tax || 200;
    if (space.tax_percent) {
        const percentTax = Math.floor(player.getTotalAssets() * space.tax_percent / 100);
        tax = Math.max(tax, percentTax);
    }
    player.deductGold(tax);
    addEventLog(`${player.name} 支付了 ${tax}G 税费`);
}

function handleCorner(player, space) {
    if (space.subtype === 'start') {
        addEventLog(`${player.name} 到达泉水，恢复一切！`);
        player.immuneToRent = false;
        player.stunned = false;
    } else if (space.subtype === 'jail') {
        if (!player.isInJail) {
            addEventLog(`${player.name} 路过小黑屋，什么都没发生`);
        }
    } else if (space.subtype === 'free') {
        addEventLog(`${player.name} 到达肉山坑，安全休息`);
        if (gameState.lastDice[0] === gameState.lastDice[1]) {
            addEventLog(`${player.name} 掷出双数！可以挑战肉山！（功能待开发）`);
        }
    } else if (space.subtype === 'go_to_jail') {
        addEventLog(`${player.name} 被举报了！进入小黑屋！`);
        player.position = GAME_CONSTANTS.JAIL_POSITION;
        player.isInJail = true;
        player.jailTurnsRemaining = 3;
    }
}

function showPurchaseModal(player, space) {
    const modal = document.getElementById('purchase-modal');
    const content = document.getElementById('purchase-modal-content');

    let rentInfo = '';
    if (space.type === 'property') {
        const cs = COLOR_SETS[space.color_set];
        rentInfo = `
            <div class="modal-rent-table">
                <div class="rent-row"><span>空地</span><span>${space.base_rent}G</span></div>
                <div class="rent-row"><span>🟢×1</span><span>${space.base_rent * 3}G</span></div>
                <div class="rent-row"><span>🟢×2</span><span>${space.base_rent * 5}G</span></div>
                <div class="rent-row"><span>🟢×3</span><span>${space.base_rent * 8}G</span></div>
                <div class="rent-row"><span>🟢×4</span><span>${space.base_rent * 15}G</span></div>
                <div class="rent-row highlight"><span>🔴旅馆</span><span>${space.base_rent * 30}G</span></div>
            </div>
            ${cs ? `<div class="modal-color-set">同色系：${cs.name}（${cs.ids.length}块）</div>` : ''}
        `;
    } else if (space.type === 'outpost') {
        rentInfo = `
            <div class="modal-rent-table">
                <div class="rent-row"><span>1个哨站</span><span>20G</span></div>
                <div class="rent-row"><span>2个哨站</span><span>50G</span></div>
                <div class="rent-row"><span>3个哨站</span><span>120G</span></div>
                <div class="rent-row"><span>4个哨站</span><span>250G</span></div>
            </div>
        `;
    } else if (space.type === 'utility') {
        rentInfo = `<p class="modal-desc">${space.description}</p>`;
    }

    content.innerHTML = `
        <h3>${space.name}</h3>
        <div class="modal-price">价格：${space.price}G</div>
        <div class="modal-balance">你的金币：${player.gold}G</div>
        ${rentInfo}
        <div class="modal-actions">
            <button class="btn btn-primary" onclick="confirmPurchase()" ${player.gold < space.price ? 'disabled' : ''}>
                购买
            </button>
            <button class="btn btn-ghost" onclick="closePurchaseModal()">
                跳过
            </button>
        </div>
    `;

    gameState.pendingAction = { type: 'purchase', playerId: player.id, spaceId: space.id };
    modal.classList.add('active');
}

function confirmPurchase() {
    const action = gameState.pendingAction;
    if (!action || action.type !== 'purchase') return;

    const player = gameState.players[action.playerId];
    const space = PROPERTIES[action.spaceId];

    if (player.deductGold(space.price)) {
        player.properties.push(action.spaceId);
        gameState.propertyOwners[action.spaceId] = player.id;
        gameState.propertyBuildings[action.spaceId] = 0;
        addEventLog(`${player.name} 以 ${space.price}G 购买了 ${space.name}！`);
    } else {
        addEventLog(`${player.name} 金币不足！`);
    }

    closePurchaseModal();
    updateGameUI();
    refreshBoard();
}

function closePurchaseModal() {
    document.getElementById('purchase-modal').classList.remove('active');
    gameState.pendingAction = null;
}

function showCardModal(card, type) {
    const modal = document.getElementById('card-modal');
    const content = document.getElementById('card-modal-content');

    const typeLabel = type === 'rune' ? '神符卡' : '中立物品卡';
    const rarityClass = card.rarity || card.type || '';
    let rarityLabel = '';
    if (card.rarity) {
        rarityLabel = { common: '常见', rare: '稀有', epic: '史诗' }[card.rarity] || '';
    } else if (card.type) {
        rarityLabel = { positive: '正面', negative: '负面', neutral: '中性' }[card.type] || '';
    }

    content.innerHTML = `
        <div class="card-type-label">${typeLabel}</div>
        <h3 class="card-name">${card.name}</h3>
        <div class="card-rarity ${rarityClass}">${rarityLabel}</div>
        <p class="card-effect">${card.effect}</p>
        <p class="card-desc">${card.description}</p>
        <button class="btn btn-primary" onclick="closeCardModal()">确认</button>
    `;

    modal.classList.add('active');
}

function closeCardModal() {
    document.getElementById('card-modal').classList.remove('active');
}

function canPlayerBuild(player) {
    for (const propId of player.properties) {
        const prop = PROPERTIES[propId];
        if (!prop || prop.type !== 'property') continue;
        const cs = prop.color_set;
        if (!cs || cs === 'independent') continue;
        const colorSet = COLOR_SETS[cs];
        if (!colorSet) continue;

        const ownsAll = colorSet.ids.every(id => gameState.propertyOwners[id] === player.id);
        if (!ownsAll) continue;

        const currentLevel = gameState.propertyBuildings[propId] || 0;
        if (currentLevel >= 5) continue;
        if (currentLevel === 4 && gameState.turnNumber < GAME_CONSTANTS.HOTEL_MIN_TURN) continue;

        const cost = currentLevel < 4 ? GAME_CONSTANTS.BUILDING_COSTS.house : GAME_CONSTANTS.BUILDING_COSTS.hotel;
        if (player.gold >= cost) return true;
    }
    return false;
}

function canBuildOnProperty(player, propId) {
    const prop = PROPERTIES[propId];
    if (!prop || prop.type !== 'property') return { can: false, reason: '不是地产' };
    if (gameState.propertyOwners[propId] !== player.id) return { can: false, reason: '不是你的地产' };

    const cs = prop.color_set;
    if (!cs || cs === 'independent') return { can: false, reason: '独立地块不能建造' };
    const colorSet = COLOR_SETS[cs];
    if (!colorSet) return { can: false, reason: '无色系' };

    const ownsAll = colorSet.ids.every(id => gameState.propertyOwners[id] === player.id);
    if (!ownsAll) return { can: false, reason: '需拥有同色系全部地产' };

    const currentLevel = gameState.propertyBuildings[propId] || 0;
    if (currentLevel >= 5) return { can: false, reason: '已满级' };

    const minLevel = Math.min(...colorSet.ids.map(id => gameState.propertyBuildings[id] || 0));
    if (currentLevel > minLevel) return { can: false, reason: '需均匀建造（先升级其他地块）' };

    if (currentLevel === 4) {
        if (gameState.turnNumber < GAME_CONSTANTS.HOTEL_MIN_TURN) {
            return { can: false, reason: `前${GAME_CONSTANTS.HOTEL_MIN_TURN}回合不可建红旅馆` };
        }
        const allAt4 = colorSet.ids.every(id => (gameState.propertyBuildings[id] || 0) >= 4);
        if (!allAt4) return { can: false, reason: '同色系地块需全部4栋绿房子' };
        if (player.gold < GAME_CONSTANTS.BUILDING_COSTS.hotel) return { can: false, reason: `需要${GAME_CONSTANTS.BUILDING_COSTS.hotel}G` };
        return { can: true, cost: GAME_CONSTANTS.BUILDING_COSTS.hotel, isHotel: true };
    }

    if (player.gold < GAME_CONSTANTS.BUILDING_COSTS.house) return { can: false, reason: `需要${GAME_CONSTANTS.BUILDING_COSTS.house}G` };
    return { can: true, cost: GAME_CONSTANTS.BUILDING_COSTS.house, isHotel: false };
}

function openBuildMenu() {
    const player = gameState.players[gameState.currentPlayerIndex];
    const modal = document.getElementById('build-modal');
    const content = document.getElementById('build-modal-content');

    let html = '<div class="build-list">';
    let hasBuildable = false;

    for (const propId of player.properties) {
        const prop = PROPERTIES[propId];
        if (!prop || prop.type !== 'property') continue;

        const result = canBuildOnProperty(player, propId);
        const level = gameState.propertyBuildings[propId] || 0;
        const levelIcons = level <= 4 ? '🟢'.repeat(level) + '⬜'.repeat(4 - level) : '🔴';
        const cs = prop.color_set && COLOR_SETS[prop.color_set] ? COLOR_SETS[prop.color_set] : null;

        html += `<div class="build-item ${result.can ? 'buildable' : 'locked'}">
            <div class="build-item-header">
                ${cs ? `<span class="build-color-dot" style="background:${cs.color}"></span>` : ''}
                <span class="build-name">${prop.name}</span>
                <span class="build-level">${levelIcons}</span>
            </div>
            <div class="build-item-info">
                <span>基础租: ${prop.base_rent}G → 当前: ${prop.base_rent * GAME_CONSTANTS.RENT_MULTIPLIERS[level]}G</span>
            </div>`;

        if (result.can) {
            hasBuildable = true;
            const nextRent = prop.base_rent * GAME_CONSTANTS.RENT_MULTIPLIERS[level + 1];
            html += `<div class="build-action">
                <span class="build-cost">${result.cost}G → ${nextRent}G</span>
                <button class="btn btn-primary btn-small" onclick="buildOn(${propId})">${result.isHotel ? '建红旅馆' : '建绿房子'}</button>
            </div>`;
        } else {
            html += `<div class="build-locked-reason">${result.reason}</div>`;
        }
        html += '</div>';
    }
    html += '</div>';

    if (!hasBuildable) {
        html = '<p class="build-no-options">暂无可建造的地产。需要拥有同色系全部地产，并有足够金币。</p>' + html;
    }

    content.innerHTML = html;
    modal.classList.add('active');
}

function buildOn(propId) {
    const player = gameState.players[gameState.currentPlayerIndex];
    const result = canBuildOnProperty(player, propId);
    if (!result.can) return;

    const prop = PROPERTIES[propId];
    player.deductGold(result.cost);
    gameState.propertyBuildings[propId] = (gameState.propertyBuildings[propId] || 0) + 1;

    const newLevel = gameState.propertyBuildings[propId];
    const buildType = newLevel === 5 ? '红旅馆' : `绿房子×${newLevel}`;
    addEventLog(`${player.name} 在 ${prop.name} 建造了${buildType}（花费${result.cost}G）`);

    openBuildMenu();
    updateGameUI();
    refreshBoard();
}

function closeBuildModal() {
    document.getElementById('build-modal').classList.remove('active');
}

function endTurn() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayer.reduceCooldown();

    do {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    } while (gameState.players[gameState.currentPlayerIndex].isBankrupt && gameState.players.some(p => !p.isBankrupt));

    if (gameState.currentPlayerIndex === 0) {
        gameState.turnNumber++;
    }

    gameState.diceRolled = false;
    gameState.doublesCount = 0;

    updateGameUI();
    document.getElementById('roll-dice-btn').disabled = false;
    document.getElementById('end-turn-btn').disabled = true;
    document.getElementById('dice-result').innerHTML = '';

    const newPlayer = gameState.players[gameState.currentPlayerIndex];
    addEventLog(`--- 第${gameState.turnNumber}回合 ${newPlayer.name} 的回合 ---`);
    refreshBoard();

    highlightCurrentPlayerSpace(newPlayer);
}

function highlightCurrentPlayerSpace(player) {
    document.querySelectorAll('.board-space').forEach(s => s.classList.remove('current-player-here'));
    const space = document.querySelector(`.board-space[data-space-id="${player.position}"]`);
    if (space) {
        space.classList.add('current-player-here');
        setTimeout(() => space.classList.remove('current-player-here'), 1500);
    }
}

function updateGameUI() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    document.getElementById('turn-number').textContent = gameState.turnNumber;
    document.getElementById('current-player-name').textContent = currentPlayer.name;
    document.getElementById('current-player-name').style.color = currentPlayer.color;

    const buildBtn = document.getElementById('build-btn');
    if (buildBtn) {
        buildBtn.style.display = canPlayerBuild(currentPlayer) ? 'block' : 'none';
    }

    const playerInfo = document.getElementById('player-info');
    playerInfo.innerHTML = '';

    gameState.players.forEach((p, i) => {
        const isActive = i === gameState.currentPlayerIndex;
        const healthLevel = p.getHealthLevel();

        const card = document.createElement('div');
        card.className = `player-card ${isActive ? 'active' : ''} ${p.isBankrupt ? 'bankrupt' : ''}`;
        card.style.borderLeftColor = p.color;

        const healthPercent = Math.min(100, Math.max(5, (p.gold / 3000) * 100));

        card.innerHTML = `
            <div class="player-card-header">
                <img src="${p.hero.img}" class="player-hero-icon" alt="${p.hero.name}" onerror="this.style.display='none'">
                <div class="player-card-info">
                    <div class="player-card-name" style="color: ${p.color}">${p.name}</div>
                    <div class="player-card-hero">${p.hero.name}</div>
                </div>
                <div class="player-card-gold">${p.gold}G</div>
            </div>
            <div class="health-bar-container">
                <div class="health-bar health-${healthLevel}" style="width: ${healthPercent}%"></div>
            </div>
            <div class="player-card-details">
                <span>📍 ${PROPERTIES[p.position] ? PROPERTIES[p.position].name : '未知'}</span>
                <span>🏠 ${p.properties.length}</span>
                ${p.abilityCooldown > 0 ? `<span class="cd-text">CD:${p.abilityCooldown}</span>` : '<span class="ready-text">⚡就绪</span>'}
            </div>
        `;

        playerInfo.appendChild(card);
    });
}

function addEventLog(message) {
    const eventLog = document.getElementById('event-log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    eventLog.insertBefore(entry, eventLog.firstChild);

    while (eventLog.children.length > 30) {
        eventLog.removeChild(eventLog.lastChild);
    }
}
