function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
}

function showHeroSelection() {
    initializeHeroSelection();
    showScreen('hero-selection');
}

function backToMenu() {
    if (gameState.gameStarted) {
        if (confirm('确定要退出当前游戏吗？')) {
            resetGame();
            showScreen('main-menu');
        }
    } else {
        showScreen('main-menu');
    }
}

function resetGame() {
    if (particleSystem) {
        particleSystem.stop();
        particleSystem = null;
    }
    gameState = {
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
    document.getElementById('event-log').innerHTML = '';
    document.getElementById('dice-result').innerHTML = '';
    const boardSpaces = document.getElementById('board-spaces');
    if (boardSpaces) boardSpaces.innerHTML = '';
    const playerTokens = document.getElementById('player-tokens');
    if (playerTokens) playerTokens.innerHTML = '';
    const pathSvg = document.getElementById('path-svg');
    if (pathSvg) pathSvg.innerHTML = '';
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function showInstructions() {
    showModal('instructions-modal');
}

function showAbout() {
    showModal('about-modal');
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        if (gameState.pendingAction) {
            gameState.pendingAction = null;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    console.log('远古大亨 - 网页版已加载！');
    showScreen('main-menu');
});

document.addEventListener('keydown', (e) => {
    if (gameState.gameStarted) {
        if (e.code === 'Space' && !gameState.diceRolled) {
            e.preventDefault();
            rollDice();
        }
        if (e.code === 'Enter' && gameState.diceRolled) {
            e.preventDefault();
            if (document.getElementById('purchase-modal').classList.contains('active')) return;
            if (document.getElementById('card-modal').classList.contains('active')) return;
            endTurn();
        }
    }

    if (e.code === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        if (gameState.pendingAction) {
            closePurchaseModal();
        }
    }
});
