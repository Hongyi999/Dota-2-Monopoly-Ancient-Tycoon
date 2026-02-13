/**
 * BoardRenderer - Renders the 3D game board with Dota 2 aesthetic
 */

class BoardRenderer {
    constructor(sceneManager, gameData) {
        this.sceneManager = sceneManager;
        this.gameData = gameData;
        this.boardGroup = new THREE.Group();
        this.propertyMeshes = [];
        this.spacePositions = [];

        this.init();
    }

    /**
     * Initialize board rendering
     */
    init() {
        this.createBoard();
        this.sceneManager.add(this.boardGroup);
    }

    /**
     * Create the 3D game board
     */
    createBoard() {
        // Board layout: 40 spaces in a square (10 per side)
        const boardSize = 40; // Total spaces (matching Monopoly board)
        const spacesPerSide = 10; // 10 spaces per side
        const spaceSize = 3;
        const boardWidth = spacesPerSide * spaceSize;

        // Create center area (river/map decoration)
        this.createCenterArea(boardWidth);

        // Create spaces around the board
        this.createSpaces(spacesPerSide, spaceSize);

        // Add decorative elements
        this.addDecorations();
    }

    /**
     * 🌍 Create center area - CUTE PIXEL MAP STYLE
     */
    createCenterArea(boardWidth) {
        // 🎨 Cute pixel ground - Softer, brighter color
        const groundGeometry = new THREE.PlaneGeometry(boardWidth, boardWidth);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d3748, // Softer dark blue-gray
            roughness: 0.9,
            metalness: 0.05,
            flatShading: true
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.boardGroup.add(ground);

        // River (diagonal across the board)
        this.createRiver(boardWidth);

        // Add miniature Dota 2 map features
        this.createMapFeatures(boardWidth);
    }

    /**
     * Create river flowing through the center
     */
    createRiver(boardWidth) {
        const riverGroup = new THREE.Group();

        // Create curved river path
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-boardWidth / 2, -0.4, -boardWidth / 2),
            new THREE.Vector3(-boardWidth / 4, -0.4, 0),
            new THREE.Vector3(boardWidth / 4, -0.4, 0),
            new THREE.Vector3(boardWidth / 2, -0.4, boardWidth / 2)
        );

        const points = curve.getPoints(50);
        const riverGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            50,
            1.5,
            8,
            false
        );

        const riverMaterial = new THREE.MeshStandardMaterial({
            color: 0x60a5fa, // 🎨 Brighter, friendlier blue
            roughness: 0.3,
            metalness: 0.4,
            emissive: 0x60a5fa,
            emissiveIntensity: 0.3,
            flatShading: true // Pixel-style
        });

        const river = new THREE.Mesh(riverGeometry, riverMaterial);
        riverGroup.add(river);

        this.boardGroup.add(riverGroup);
    }

    /**
     * Create miniature Dota 2 map features
     */
    createMapFeatures(boardWidth) {
        const featuresGroup = new THREE.Group();

        // 🌟 Radiant Ancient (bottom-left) - Golden Green
        this.createAncient(-boardWidth / 3, 0, -boardWidth / 3, 0xB8E986, 'radiant');

        // 🔴 Dire Ancient (top-right) - Blood Red
        this.createAncient(boardWidth / 3, 0, boardWidth / 3, 0xC23030, 'dire');

        // Roshan Pit (center-right)
        this.createRoshanPit(boardWidth / 4, 0, 0);

        this.boardGroup.add(featuresGroup);
    }

    /**
     * 🏰 Create Ancient structure - CUTE PIXEL STYLE
     */
    createAncient(x, y, z, color, faction) {
        const ancientGroup = new THREE.Group();

        // 🎨 Cute pixel base (low-poly hexagon)
        const baseGeometry = new THREE.CylinderGeometry(1.2, 1.5, 0.6, 6);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: this.brightenColor(color, 1.2),
            roughness: 0.8,
            metalness: 0.2,
            flatShading: true
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.3;
        base.castShadow = true;
        ancientGroup.add(base);

        // 🏰 Cute pixel tower (low-poly pyramid)
        const towerGeometry = new THREE.ConeGeometry(1, 2.5, 4); // 4 sides = pyramid!
        const towerColor = faction === 'radiant' ? 0xFFD700 : 0x8B4789;
        const towerMaterial = new THREE.MeshStandardMaterial({
            color: this.brightenColor(towerColor, 1.1),
            roughness: 0.6,
            metalness: 0.3,
            emissive: color,
            emissiveIntensity: 0.5,
            flatShading: true
        });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.y = 1.8;
        tower.castShadow = true;
        ancientGroup.add(tower);

        // ⭐ Cute glowing star on top (low-poly sphere)
        const glowGeometry = new THREE.SphereGeometry(0.5, 8, 8); // Low-poly sphere
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 3.2;
        ancientGroup.add(glow);

        ancientGroup.position.set(x, y - 0.5, z);
        this.boardGroup.add(ancientGroup);
    }

    /**
     * 💀 Create Roshan Pit - CUTE PIXEL STYLE
     */
    createRoshanPit(x, y, z) {
        const pitGroup = new THREE.Group();

        // 🎨 Cute pixel pit (low-poly)
        const pitGeometry = new THREE.CylinderGeometry(1.5, 1, 0.8, 8); // 8 sides for pixel look
        const pitMaterial = new THREE.MeshStandardMaterial({
            color: 0x3f4652, // Softer gray
            roughness: 0.9,
            metalness: 0.05,
            flatShading: true
        });
        const pit = new THREE.Mesh(pitGeometry, pitMaterial);
        pit.position.y = -0.3;
        pit.receiveShadow = true;
        pitGroup.add(pit);

        // 🪨 Cute pixel rocks (simple boxes for pixel aesthetic)
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const rockRadius = 2;
            const rockX = Math.cos(angle) * rockRadius;
            const rockZ = Math.sin(angle) * rockRadius;

            // Simple box rocks for pixel style
            const rockSize = 0.3 + Math.random() * 0.2;
            const rockGeometry = new THREE.BoxGeometry(rockSize, rockSize, rockSize);
            const rockMaterial = new THREE.MeshStandardMaterial({
                color: 0x6b7280, // Lighter gray
                roughness: 0.95,
                metalness: 0.05,
                flatShading: true
            });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.position.set(rockX, rockSize / 2, rockZ);
            rock.rotation.y = Math.random() * Math.PI;
            rock.castShadow = true;
            pitGroup.add(rock);
        }

        pitGroup.position.set(x, y, z);
        this.boardGroup.add(pitGroup);
    }

    /**
     * Create property spaces around the board
     */
    createSpaces(spacesPerSide, spaceSize) {
        const totalSpaces = 40; // Monopoly standard: 40 spaces
        const halfBoard = (spacesPerSide * spaceSize) / 2;

        for (let i = 0; i < totalSpaces; i++) {
            const property = this.gameData.properties[i];
            if (!property) continue;

            const position = this.calculateSpacePosition(i, spacesPerSide, spaceSize, halfBoard);
            const space = this.createSpace(property, position, i);

            this.propertyMeshes.push(space);
            this.spacePositions.push(position);
            this.boardGroup.add(space);
        }
    }

    /**
     * Calculate position for a space on the board
     */
    calculateSpacePosition(index, spacesPerSide, spaceSize, halfBoard) {
        let x, z;

        if (index < spacesPerSide) {
            // Bottom edge (0-9)
            x = -halfBoard + (index * spaceSize) + spaceSize / 2;
            z = -halfBoard + spaceSize / 2;
        } else if (index < spacesPerSide * 2 - 1) {
            // Right edge (10-18)
            x = halfBoard - spaceSize / 2;
            z = -halfBoard + ((index - spacesPerSide + 1) * spaceSize) + spaceSize / 2;
        } else if (index < spacesPerSide * 3 - 2) {
            // Top edge (19-27)
            x = halfBoard - ((index - (spacesPerSide * 2 - 2)) * spaceSize) - spaceSize / 2;
            z = halfBoard - spaceSize / 2;
        } else {
            // Left edge (28-39)
            x = -halfBoard + spaceSize / 2;
            z = halfBoard - ((index - (spacesPerSide * 3 - 3)) * spaceSize) - spaceSize / 2;
        }

        return new THREE.Vector3(x, 0, z);
    }

    /**
     * Create a single property space
     */
    createSpace(property, position, index) {
        const spaceGroup = new THREE.Group();
        const spaceSize = 2.8;

        // Determine color based on property type
        const color = this.getPropertyColor(property);
        // Corner spaces: 0 (Fountain), 10 (Jail), 20 (Free Parking), 30 (Go to Jail)
        const isCorner = (index % 10 === 0);
        const size = isCorner ? 3.2 : spaceSize;

        // 🎨 CUTE PIXEL BASE - Brighter, low-poly style
        const baseGeometry = new THREE.BoxGeometry(size, 0.4, size);

        // Brighten colors for cute pixel style
        const brightColor = this.brightenColor(color, 1.3);

        const baseMaterial = new THREE.MeshStandardMaterial({
            color: brightColor,
            roughness: 0.8,
            metalness: 0.1,
            flatShading: true // Pixel-style low-poly shading
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.2;
        base.castShadow = true;
        base.receiveShadow = true;
        spaceGroup.add(base);

        // Add cute white pixel border on top
        const borderGeometry = new THREE.BoxGeometry(size + 0.1, 0.05, size + 0.1);
        const borderMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9,
            metalness: 0.1,
            flatShading: true
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.y = 0.42;
        spaceGroup.add(border);

        // Property name label (3D text would go here - simplified for now)
        this.createPropertyLabel(spaceGroup, property, size);

        // Special space indicators
        if (isCorner) {
            this.addCornerIndicator(spaceGroup, property, size);
        } else if (property.type === 'property') {
            this.addPropertyIndicator(spaceGroup, property);
        }

        spaceGroup.position.copy(position);
        spaceGroup.userData = { property, index };

        return spaceGroup;
    }

    /**
     * Get color for property type
     */
    getPropertyColor(property) {
        const colorMap = {
            'fountain': 0x4ECDC4,
            'jail': 0x95a5a6,
            'free': 0x2ecc71,
            'property': this.getFactionColor(property.faction),
            'item': 0xf39c12,
            'tax': 0xe74c3c,
            'event': 0x9b59b6
        };

        return colorMap[property.type] || 0xbdc3c7;
    }

    /**
     * Get color for property faction - Dota 2 Themed
     */
    getFactionColor(faction) {
        const colors = {
            'radiant': 0xB8E986,  // 🌟 Bright Radiant Green
            'dire': 0xC23030,      // 🔴 Blood Red Dire
            'neutral': 0x6B7280    // 🪨 Stone Gray Neutral
        };

        return colors[faction] || 0xbdc3c7;
    }

    /**
     * 🎨 Brighten color for cute pixel style
     */
    brightenColor(hexColor, factor) {
        const color = new THREE.Color(hexColor);
        color.r = Math.min(color.r * factor, 1);
        color.g = Math.min(color.g * factor, 1);
        color.b = Math.min(color.b * factor, 1);
        return color.getHex();
    }

    /**
     * Create property label
     */
    createPropertyLabel(spaceGroup, property, size) {
        // Color stripe for properties
        if (property.type === 'property' && property.faction) {
            const color = this.getFactionColor(property.faction);
            const stripeGeometry = new THREE.BoxGeometry(size * 0.8, 0.35, 0.3);
            const stripeMaterial = new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.5,
                metalness: 0.5,
                emissive: color,
                emissiveIntensity: 0.2
            });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.set(0, 0.5, 0);
            stripe.castShadow = true;
            spaceGroup.add(stripe);
        }
    }

    /**
     * Add corner space indicator - 💰 Gold Coin Style
     */
    addCornerIndicator(spaceGroup, property, size) {
        const indicatorGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 8); // Octagon for pixel style
        const indicatorMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700, // Pure gold
            roughness: 0.3,
            metalness: 0.7,
            emissive: 0xF59E0B,
            emissiveIntensity: 0.5 // Stronger glow
        });
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.position.y = 0.55;
        indicator.castShadow = true;
        spaceGroup.add(indicator);
    }

    /**
     * Add property indicator (placeholder for house/hotel)
     */
    addPropertyIndicator(spaceGroup, property) {
        // This will be used later for building indicators
    }

    /**
     * Add decorative elements
     */
    addDecorations() {
        // Add trees/foliage around the board
        this.addFoliage();
    }

    /**
     * Add foliage decoration
     */
    addFoliage() {
        const boardWidth = 27;

        for (let i = 0; i < 20; i++) {
            const x = (Math.random() - 0.5) * boardWidth * 0.6;
            const z = (Math.random() - 0.5) * boardWidth * 0.6;

            // Only place foliage away from center river
            if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;

            const treeGeometry = new THREE.ConeGeometry(0.3, 1, 6);
            const treeMaterial = new THREE.MeshStandardMaterial({
                color: x < 0 ? 0x27ae60 : 0x1e7d4a, // Radiant (bright) vs Dire (dark) green
                roughness: 0.8,
                metalness: 0.1
            });
            const tree = new THREE.Mesh(treeGeometry, treeMaterial);
            tree.position.set(x, 0, z);
            tree.castShadow = true;
            this.boardGroup.add(tree);
        }
    }

    /**
     * Get space position by index
     */
    getSpacePosition(index) {
        return this.spacePositions[index] || new THREE.Vector3(0, 0, 0);
    }

    /**
     * Highlight space
     */
    highlightSpace(index, color = 0xffff00) {
        if (this.propertyMeshes[index]) {
            const space = this.propertyMeshes[index];
            // Add highlight effect
            // TODO: Implement highlight animation
        }
    }

    /**
     * Get board group
     */
    getBoardGroup() {
        return this.boardGroup;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoardRenderer;
}
