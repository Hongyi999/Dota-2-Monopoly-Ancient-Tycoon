/**
 * Main.js - Application entry point and initialization
 */

// Global variables
let sceneManager = null;
let boardRenderer = null;
let gameInstance = null;

// Application state
const AppState = {
    initialized: false,
    currentScreen: 'loading',
    language: 'en',
    soundEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8
};

/**
 * Initialize the application
 */
async function initApp() {
    console.log('🎮 Initializing Ancient Tycoon 3D...');

    try {
        // Initialize i18n
        await i18n.init();
        AppState.language = i18n.getCurrentLanguage();
        updateLanguageUI();

        console.log('✅ i18n initialized');

        // Load game data
        await loadGameData();
        console.log('✅ Game data loaded');

        // Initialize 3D scene (but don't show board yet)
        initializeScene();
        console.log('✅ 3D scene initialized');

        // Mark as initialized
        AppState.initialized = true;

        // Hide loading screen, show main menu
        setTimeout(() => {
            hideLoading();
            showScreen('main-menu');
        }, 1000);

        console.log('🎉 Application initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing application:', error);
        showError('Failed to initialize the game. Please refresh the page.');
    }
}

/**
 * Initialize Three.js scene
 */
function initializeScene() {
    // We'll initialize the scene manager but not create the board yet
    // Board will be created when game starts
    const container = document.getElementById('board-container-3d');

    if (!container) {
        console.warn('Board container not found, skipping 3D initialization');
        return;
    }

    // Scene will be created when entering game screen
}

/**
 * Load all game data
 */
async function loadGameData() {
    // Data is already loaded via constants.js
    // This function can be extended to load additional assets
    return Promise.resolve();
}

/**
 * Hide loading screen
 */
function hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            loadingScreen.classList.remove('active');
        }, 500);
    }
}

/**
 * Show main menu
 */
function showMainMenu() {
    showScreen('main-menu');
}

/**
 * Show hero selection
 */
function showHeroSelection() {
    showScreen('hero-selection');
    populateHeroGrid();
}

/**
 * Show game screen
 */
function showGameScreen() {
    showScreen('game-screen');

    // Initialize 3D board if not already done
    if (!sceneManager) {
        const container = document.getElementById('board-container-3d');
        sceneManager = new SceneManager(container);

        // Create board renderer
        boardRenderer = new BoardRenderer(sceneManager, {
            properties: PROPERTIES
        });

        console.log('✅ 3D board created');
    }
}

/**
 * Show a specific screen
 */
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.style.display = 'flex';
        setTimeout(() => {
            targetScreen.classList.add('active');
        }, 10);
    }

    AppState.currentScreen = screenId;
}

/**
 * Show instructions modal
 */
function showInstructions() {
    showModal('instructions-modal');
}

/**
 * Show settings modal
 */
function showSettings() {
    showModal('settings-modal');

    // Update settings UI
    document.getElementById('settings-language').value = AppState.language;
    document.getElementById('settings-music').value = AppState.musicVolume * 100;
    document.getElementById('settings-sfx').value = AppState.sfxVolume * 100;
}

/**
 * Show about modal
 */
function showAbout() {
    showModal('about-modal');
}

/**
 * Show modal
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

/**
 * Close modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

/**
 * Change language
 */
async function changeLanguage(language) {
    await i18n.setLanguage(language);
    AppState.language = language;
    updateLanguageUI();

    // Save to localStorage
    localStorage.setItem('ancient-tycoon-language', language);
}

/**
 * Update language UI (flag buttons)
 */
function updateLanguageUI() {
    const langEn = document.getElementById('lang-en');
    const langZh = document.getElementById('lang-zh');

    if (langEn && langZh) {
        langEn.classList.toggle('active', AppState.language === 'en');
        langZh.classList.toggle('active', AppState.language === 'zh-CN');
    }

    // Update settings dropdown
    const settingsLang = document.getElementById('settings-language');
    if (settingsLang) {
        settingsLang.value = AppState.language;
    }
}

/**
 * Toggle sound
 */
function toggleSound() {
    AppState.soundEnabled = !AppState.soundEnabled;
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
        soundIcon.textContent = AppState.soundEnabled ? 'ON' : 'OFF';
    }

    // TODO: Implement actual sound toggling
    console.log('Sound:', AppState.soundEnabled ? 'ON' : 'OFF');
}

/**
 * Camera controls
 */
function zoomIn() {
    if (sceneManager && sceneManager.camera) {
        const camera = sceneManager.camera;
        camera.zoom = Math.min(camera.zoom * 1.1, 3);
        camera.updateProjectionMatrix();
    }
}

function zoomOut() {
    if (sceneManager && sceneManager.camera) {
        const camera = sceneManager.camera;
        camera.zoom = Math.max(camera.zoom * 0.9, 0.5);
        camera.updateProjectionMatrix();
    }
}

function resetCamera() {
    if (sceneManager && sceneManager.camera) {
        const camera = sceneManager.camera;
        camera.zoom = 1;
        camera.updateProjectionMatrix();

        // Reset position
        camera.position.set(30, 30, 30);
        camera.lookAt(0, 0, 0);
    }
}

/**
 * Back to menu from any screen
 */
function backToMenu() {
    const confirmed = confirm(i18n.t('messages.backToMenu') || 'Return to main menu?');
    if (confirmed) {
        // Cleanup game if running
        if (gameInstance) {
            // TODO: Cleanup game instance
            gameInstance = null;
        }

        showMainMenu();
    }
}

/**
 * Show error message
 */
function showError(message) {
    alert(message);
    // TODO: Implement better error UI
}

/**
 * Populate hero grid
 */
function populateHeroGrid() {
    const heroGrid = document.getElementById('hero-grid');
    if (!heroGrid) return;

    heroGrid.innerHTML = '';

    HEROES.forEach((hero, index) => {
        const heroCard = createHeroCard(hero, index);
        heroGrid.appendChild(heroCard);
    });

    updatePlayerCount(2); // Default 2 players
}

/**
 * Create hero card element
 */
function createHeroCard(hero, index) {
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.dataset.heroId = hero.id;
    card.dataset.index = index;

    // Hero image placeholder (gradient background)
    const heroImage = document.createElement('div');
    heroImage.className = 'hero-image';
    heroImage.style.background = `linear-gradient(135deg, ${getHeroColor(index)}, ${getHeroColor(index)}88)`;
    card.appendChild(heroImage);

    // Hero name
    const heroName = document.createElement('div');
    heroName.className = 'hero-name';
    heroName.textContent = i18n.t(`heroes.${hero.id}.name`) || hero.name;
    card.appendChild(heroName);

    // Ability name
    const abilityName = document.createElement('div');
    abilityName.className = 'hero-ability';
    abilityName.textContent = i18n.t(`heroes.${hero.id}.ability`) || hero.ability_name;
    card.appendChild(abilityName);

    // Difficulty
    const difficulty = document.createElement('div');
    difficulty.className = `hero-difficulty difficulty-${hero.difficulty}`;
    difficulty.textContent = i18n.t(`heroSelection.difficulty.${hero.difficulty}`) || hero.difficulty;
    card.appendChild(difficulty);

    // Click handler
    card.addEventListener('click', () => toggleHeroSelection(card));

    return card;
}

/**
 * Get hero color by index
 */
function getHeroColor(index) {
    const colors = [
        '#FFD700', // Gold
        '#FF6B6B', // Red
        '#4ECDC4', // Cyan
        '#95E1D3', // Mint
        '#F38181', // Pink
        '#AA96DA', // Purple
        '#FCBAD3', // Light Pink
        '#FFFFD2', // Light Yellow
        '#A8D8EA', // Light Blue
        '#FFAAA5'  // Light Red
    ];
    return colors[index % colors.length];
}

/**
 * Toggle hero selection
 */
function toggleHeroSelection(card) {
    // TODO: Implement hero selection logic
    card.classList.toggle('selected');
    updateStartGameButton();
}

/**
 * Update player count
 */
function updatePlayerCount(count) {
    const display = document.getElementById('player-count-display');
    if (display) {
        display.textContent = count;
    }

    const status = document.getElementById('selection-status');
    if (status) {
        status.textContent = i18n.t('heroSelection.selectHeroes', { count }) ||
            `Select ${count} heroes to continue`;
    }

    updateStartGameButton();
}

/**
 * Update start game button state
 */
function updateStartGameButton() {
    const selectedHeroes = document.querySelectorAll('.hero-card.selected');
    const playerCount = parseInt(document.getElementById('player-count').value);
    const startButton = document.getElementById('start-game-btn');

    if (startButton) {
        startButton.disabled = selectedHeroes.length !== playerCount;
    }
}

/**
 * Start game
 */
function startGame() {
    const selectedHeroes = Array.from(document.querySelectorAll('.hero-card.selected'))
        .map(card => HEROES[card.dataset.index]);

    if (selectedHeroes.length < 2) {
        alert('Please select at least 2 heroes');
        return;
    }

    console.log('🎮 Starting game with heroes:', selectedHeroes);

    // Initialize game
    // TODO: Create game instance with selected heroes

    // Show game screen
    showGameScreen();
}

/**
 * Close modal when clicking outside
 */
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        setTimeout(() => {
            event.target.style.display = 'none';
        }, 300);
    }
};

/**
 * Handle window resize
 */
window.addEventListener('resize', () => {
    if (sceneManager) {
        sceneManager.onWindowResize();
    }
});

/**
 * Start the application when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
