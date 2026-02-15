const BOARD_PATH = (() => {
    const W = 900, H = 700;
    const mx = W / 2, my = H / 2;
    const pts = [];

    const rx = 390, ry = 290;

    for (let i = 0; i < 36; i++) {
        const t = (i / 36) * Math.PI * 2 - Math.PI / 2;
        let x = mx + rx * Math.cos(t);
        let y = my + ry * Math.sin(t);

        const wobbleX = Math.sin(t * 3.7 + 1.2) * 30 + Math.cos(t * 2.3 + 0.5) * 20;
        const wobbleY = Math.cos(t * 4.1 + 0.8) * 25 + Math.sin(t * 1.9 + 2.1) * 15;

        x += wobbleX;
        y += wobbleY;

        x = Math.max(42, Math.min(W - 42, x));
        y = Math.max(42, Math.min(H - 42, y));

        pts.push({ x: Math.round(x), y: Math.round(y) });
    }
    return pts;
})();

const SPACE_ICONS = {
    'corner_start': '⛲',
    'corner_jail': '🔒',
    'corner_free': '🐉',
    'corner_go_to_jail': '⚠️',
    'property': '🏠',
    'outpost': '🗼',
    'utility': '⚡',
    'chance': '✨',
    'community': '📦',
    'tax': '💰'
};

function getSpaceIcon(property) {
    if (property.type === 'corner') {
        return SPACE_ICONS['corner_' + property.subtype] || '⭐';
    }
    return SPACE_ICONS[property.type] || '⬜';
}

function generatePathSVG() {
    const svg = document.getElementById('path-svg');
    if (!svg) return;

    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 900 700');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    let pathD = `M ${BOARD_PATH[0].x} ${BOARD_PATH[0].y}`;
    for (let i = 1; i <= 36; i++) {
        const curr = BOARD_PATH[i % 36];
        const prev = BOARD_PATH[(i - 1) % 36];
        const cpx = (prev.x + curr.x) / 2 + (Math.random() - 0.5) * 10;
        const cpy = (prev.y + curr.y) / 2 + (Math.random() - 0.5) * 10;
        pathD += ` Q ${cpx} ${cpy} ${curr.x} ${curr.y}`;
    }

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    glowFilter.setAttribute('id', 'pathGlow');
    glowFilter.innerHTML = `
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    `;
    defs.appendChild(glowFilter);
    svg.appendChild(defs);

    const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glowPath.setAttribute('d', pathD);
    glowPath.setAttribute('fill', 'none');
    glowPath.setAttribute('stroke', 'rgba(34, 197, 94, 0.15)');
    glowPath.setAttribute('stroke-width', '28');
    glowPath.setAttribute('filter', 'url(#pathGlow)');
    svg.appendChild(glowPath);

    const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mainPath.setAttribute('d', pathD);
    mainPath.setAttribute('fill', 'none');
    mainPath.setAttribute('stroke', 'rgba(34, 197, 94, 0.25)');
    mainPath.setAttribute('stroke-width', '14');
    mainPath.setAttribute('stroke-linecap', 'round');
    mainPath.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(mainPath);

    const dashPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    dashPath.setAttribute('d', pathD);
    dashPath.setAttribute('fill', 'none');
    dashPath.setAttribute('stroke', 'rgba(34, 197, 94, 0.08)');
    dashPath.setAttribute('stroke-width', '40');
    dashPath.setAttribute('stroke-linecap', 'round');
    svg.appendChild(dashPath);
}

function renderBoardSpaces() {
    const container = document.getElementById('board-spaces');
    if (!container) return;
    container.innerHTML = '';

    BOARD_PATH.forEach((pos, idx) => {
        const property = PROPERTIES[idx];
        if (!property) return;

        const space = document.createElement('div');
        space.className = 'board-space';
        space.dataset.spaceId = idx;

        const sizePercX = (pos.x / 900) * 100;
        const sizePercY = (pos.y / 700) * 100;
        space.style.left = sizePercX + '%';
        space.style.top = sizePercY + '%';

        let typeClass = property.type;
        if (property.type === 'corner') typeClass = 'corner-' + property.subtype;
        space.classList.add('space-' + typeClass);

        if (property.color_set && COLOR_SETS[property.color_set]) {
            space.style.setProperty('--set-color', COLOR_SETS[property.color_set].color);
            space.classList.add('has-color-set');
        }

        const icon = getSpaceIcon(property);
        const shortName = property.name.length > 4 ? property.name.substring(0, 4) : property.name;

        space.innerHTML = `
            <div class="space-icon">${icon}</div>
            <div class="space-name">${shortName}</div>
            ${property.price ? `<div class="space-price">${property.price}G</div>` : ''}
            <div class="space-buildings" id="buildings-${idx}"></div>
            <div class="space-owner-ring" id="owner-ring-${idx}"></div>
        `;

        space.addEventListener('click', () => onSpaceClick(idx));
        space.addEventListener('mouseenter', () => showSpaceTooltip(idx, space));
        space.addEventListener('mouseleave', hideSpaceTooltip);

        container.appendChild(space);
    });
}

function updateBoardSpaces() {
    BOARD_PATH.forEach((pos, idx) => {
        const property = PROPERTIES[idx];
        if (!property) return;

        const space = document.querySelector(`.board-space[data-space-id="${idx}"]`);
        if (!space) return;

        const ownerRing = document.getElementById(`owner-ring-${idx}`);
        const ownerId = gameState.propertyOwners[idx];
        if (ownerId !== undefined && ownerRing) {
            const ownerPlayer = gameState.players[ownerId];
            if (ownerPlayer) {
                ownerRing.style.borderColor = ownerPlayer.color;
                ownerRing.classList.add('owned');
                space.classList.add('space-owned');
            }
        } else if (ownerRing) {
            ownerRing.style.borderColor = 'transparent';
            ownerRing.classList.remove('owned');
            space.classList.remove('space-owned');
        }

        const buildingsEl = document.getElementById(`buildings-${idx}`);
        if (buildingsEl) {
            const level = gameState.propertyBuildings[idx] || 0;
            buildingsEl.innerHTML = '';
            if (level > 0 && level <= 4) {
                for (let b = 0; b < level; b++) {
                    const house = document.createElement('div');
                    house.className = 'building-dot house';
                    buildingsEl.appendChild(house);
                }
            } else if (level === 5) {
                const hotel = document.createElement('div');
                hotel.className = 'building-dot hotel';
                hotel.textContent = 'H';
                buildingsEl.appendChild(hotel);
            }
        }
    });
}

function renderPlayerTokens() {
    const container = document.getElementById('player-tokens');
    if (!container) return;
    container.innerHTML = '';

    if (!gameState.players) return;

    gameState.players.forEach((player, index) => {
        if (player.isBankrupt) return;

        const token = document.createElement('div');
        token.className = 'player-token';
        token.id = `player-token-${index}`;
        token.style.setProperty('--player-color', player.color);

        const heroImg = new Image();
        heroImg.crossOrigin = 'anonymous';
        heroImg.src = player.hero.img;
        heroImg.className = 'token-hero-img';
        heroImg.onerror = function() {
            this.style.display = 'none';
            this.parentNode.querySelector('.token-fallback').style.display = 'flex';
        };

        token.innerHTML = `
            <div class="token-inner">
                <div class="token-fallback" style="display:none">${index + 1}</div>
            </div>
            <div class="token-label">P${index + 1}</div>
        `;
        token.querySelector('.token-inner').prepend(heroImg);

        container.appendChild(token);
        positionPlayerToken(player, index, false);
    });
}

function positionPlayerToken(player, index, animate) {
    const token = document.getElementById(`player-token-${index}`);
    if (!token) return;

    const pos = BOARD_PATH[player.position];
    if (!pos) return;

    const playersAtPos = gameState.players.filter(p => !p.isBankrupt && p.position === player.position);
    const myIdx = playersAtPos.findIndex(p => p.id === player.id);
    const total = playersAtPos.length;

    const offsetAngle = (myIdx / total) * Math.PI * 2;
    const offsetR = total > 1 ? 18 : 0;
    const ox = Math.cos(offsetAngle) * offsetR;
    const oy = Math.sin(offsetAngle) * offsetR;

    const px = (pos.x / 900) * 100;
    const py = (pos.y / 700) * 100;

    if (animate) {
        token.style.transition = 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), top 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
        token.style.transition = 'none';
    }

    token.style.left = `calc(${px}% + ${ox}px)`;
    token.style.top = `calc(${py}% + ${oy}px)`;
}

function animatePlayerMove(playerIndex, fromPos, toPos, callback) {
    const player = gameState.players[playerIndex];
    const token = document.getElementById(`player-token-${playerIndex}`);
    if (!token) { if (callback) callback(); return; }

    const totalSpaces = GAME_CONSTANTS.TOTAL_SPACES;
    const steps = [];
    let pos = fromPos;
    while (pos !== toPos) {
        pos = (pos + 1) % totalSpaces;
        steps.push(pos);
    }

    let stepIdx = 0;
    function doStep() {
        if (stepIdx >= steps.length) {
            repositionAllTokens();
            if (callback) callback();
            return;
        }
        player.position = steps[stepIdx];
        const p = BOARD_PATH[steps[stepIdx]];
        const px = (p.x / 900) * 100;
        const py = (p.y / 700) * 100;
        token.style.transition = 'left 0.12s ease, top 0.12s ease';
        token.style.left = px + '%';
        token.style.top = py + '%';

        token.classList.add('token-bounce');
        setTimeout(() => token.classList.remove('token-bounce'), 120);

        stepIdx++;
        setTimeout(doStep, 140);
    }
    doStep();
}

function repositionAllTokens() {
    gameState.players.forEach((p, i) => {
        if (!p.isBankrupt) positionPlayerToken(p, i, false);
    });
}

let tooltipEl = null;
function showSpaceTooltip(idx, spaceEl) {
    const property = PROPERTIES[idx];
    if (!property) return;

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'space-tooltip';
        document.body.appendChild(tooltipEl);
    }

    let info = `<strong>${property.name}</strong>`;
    if (property.price) info += `<br>价格: ${property.price}G`;
    const level = gameState.propertyBuildings[idx] || 0;
    if (property.base_rent) {
        const rent = property.base_rent * GAME_CONSTANTS.RENT_MULTIPLIERS[level];
        info += `<br>当前租金: ${rent}G`;
    }
    const ownerId = gameState.propertyOwners[idx];
    if (ownerId !== undefined) {
        info += `<br>拥有者: ${gameState.players[ownerId].name}`;
    }

    tooltipEl.innerHTML = info;
    tooltipEl.style.display = 'block';

    const rect = spaceEl.getBoundingClientRect();
    tooltipEl.style.left = (rect.left + rect.width / 2) + 'px';
    tooltipEl.style.top = (rect.top - 10) + 'px';
}

function hideSpaceTooltip() {
    if (tooltipEl) tooltipEl.style.display = 'none';
}

function onSpaceClick(idx) {
}

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
    }

    resize() {
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
        }
    }

    start() {
        this.running = true;
        this.resize();
        for (let i = 0; i < 40; i++) {
            this.particles.push(this.createFirefly());
        }
        for (let i = 0; i < 8; i++) {
            this.particles.push(this.createFogPuff());
        }
        this.animate();
    }

    stop() {
        this.running = false;
    }

    createFirefly() {
        return {
            type: 'firefly',
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            alpha: Math.random(),
            alphaDir: Math.random() > 0.5 ? 0.01 : -0.01,
            hue: 80 + Math.random() * 60,
        };
    }

    createFogPuff() {
        return {
            type: 'fog',
            x: Math.random() * this.canvas.width,
            y: this.canvas.height * 0.5 + Math.random() * this.canvas.height * 0.5,
            vx: Math.random() * 0.3 + 0.1,
            size: Math.random() * 80 + 40,
            alpha: Math.random() * 0.06 + 0.02,
        };
    }

    animate() {
        if (!this.running) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            if (p.type === 'firefly') {
                p.x += p.vx + Math.sin(Date.now() * 0.001 + p.y * 0.01) * 0.3;
                p.y += p.vy + Math.cos(Date.now() * 0.0008 + p.x * 0.01) * 0.3;
                p.alpha += p.alphaDir;
                if (p.alpha > 1 || p.alpha < 0) p.alphaDir *= -1;
                p.alpha = Math.max(0, Math.min(1, p.alpha));

                if (p.x < -10) p.x = this.canvas.width + 10;
                if (p.x > this.canvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = this.canvas.height + 10;
                if (p.y > this.canvas.height + 10) p.y = -10;

                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.alpha * 0.8})`);
                gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 50%, ${p.alpha * 0.3})`);
                gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'fog') {
                p.x += p.vx;
                if (p.x > this.canvas.width + p.size) {
                    p.x = -p.size;
                    p.y = this.canvas.height * 0.5 + Math.random() * this.canvas.height * 0.5;
                }
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                gradient.addColorStop(0, `rgba(100, 150, 100, ${p.alpha})`);
                gradient.addColorStop(1, `rgba(100, 150, 100, 0)`);
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

let particleSystem = null;

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    particleSystem = new ParticleSystem(canvas);
    particleSystem.start();

    window.addEventListener('resize', () => {
        if (particleSystem) particleSystem.resize();
    });
}

function animateDiceRoll(die1, die2, callback) {
    const d1 = document.getElementById('dice1');
    const d2 = document.getElementById('dice2');
    const container = document.getElementById('dice-container');
    if (!d1 || !d2 || !container) {
        if (callback) callback();
        return;
    }

    container.style.display = 'flex';
    d1.classList.add('dice-rolling');
    d2.classList.add('dice-rolling');

    const diceChars = ['⚀','⚁','⚂','⚃','⚄','⚅'];
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        const r1 = Math.floor(Math.random() * 6) + 1;
        const r2 = Math.floor(Math.random() * 6) + 1;
        setDiceFace(d1, r1);
        setDiceFace(d2, r2);
        rollCount++;
        if (rollCount > 12) {
            clearInterval(rollInterval);
            setDiceFace(d1, die1);
            setDiceFace(d2, die2);
            d1.classList.remove('dice-rolling');
            d2.classList.remove('dice-rolling');
            d1.classList.add('dice-settled');
            d2.classList.add('dice-settled');
            setTimeout(() => {
                d1.classList.remove('dice-settled');
                d2.classList.remove('dice-settled');
                if (callback) callback();
            }, 400);
        }
    }, 80);
}

function setDiceFace(diceEl, value) {
    const faces = diceEl.querySelectorAll('.dice-face-3d');
    const values = [value, 7 - value, 
                    value <= 3 ? value + 2 : value - 2,
                    value <= 3 ? value + 1 : value - 1,
                    value <= 4 ? value + 1 : value - 3,
                    value >= 3 ? value - 1 : value + 3];
    faces.forEach((f, i) => {
        const dots = getDiceDots(values[i] || 1);
        f.innerHTML = dots;
    });
}

function getDiceDots(value) {
    const v = Math.max(1, Math.min(6, value));
    const patterns = {
        1: '<div class="dot c"></div>',
        2: '<div class="dot tr"></div><div class="dot bl"></div>',
        3: '<div class="dot tr"></div><div class="dot c"></div><div class="dot bl"></div>',
        4: '<div class="dot tl"></div><div class="dot tr"></div><div class="dot bl"></div><div class="dot br"></div>',
        5: '<div class="dot tl"></div><div class="dot tr"></div><div class="dot c"></div><div class="dot bl"></div><div class="dot br"></div>',
        6: '<div class="dot tl"></div><div class="dot tr"></div><div class="dot ml"></div><div class="dot mr"></div><div class="dot bl"></div><div class="dot br"></div>'
    };
    return `<div class="dice-dots">${patterns[v]}</div>`;
}
