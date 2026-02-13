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
        // Board layout: 36 spaces in a square (9x9 grid, outer ring only)
        const boardSize = 36; // Total spaces
        const spacesPerSide = 9; // 9 spaces per side
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
     * Create center area with Dota 2 map aesthetic
     */
    createCenterArea(boardWidth) {
        // Base ground
        const groundGeometry = new THREE.PlaneGeometry(boardWidth, boardWidth);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d3436,
            roughness: 0.8,
            metalness: 0.2
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
            color: 0x3498db,
            roughness: 0.3,
            metalness: 0.5,
            emissive: 0x1a5490,
            emissiveIntensity: 0.2
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

        // Radiant Ancient (bottom-left)
        this.createAncient(-boardWidth / 3, 0, -boardWidth / 3, 0x4CAF50, 'radiant');

        // Dire Ancient (top-right)
        this.createAncient(boardWidth / 3, 0, boardWidth / 3, 0xF44336, 'dire');

        // Roshan Pit (center-right)
        this.createRoshanPit(boardWidth / 4, 0, 0);

        this.boardGroup.add(featuresGroup);
    }

    /**
     * Create Ancient structure
     */
    createAncient(x, y, z, color, faction) {
        const ancientGroup = new THREE.Group();

        // Base
        const baseGeometry = new THREE.CylinderGeometry(1, 1.5, 0.5, 6);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.25;
        base.castShadow = true;
        ancientGroup.add(base);

        // Tower
        const towerGeometry = new THREE.ConeGeometry(0.8, 2, 6);
        const towerMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.6,
            metalness: 0.4,
            emissive: color,
            emissiveIntensity: 0.3
        });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.y = 1.5;
        tower.castShadow = true;
        ancientGroup.add(tower);

        // Glow
        const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 2.5;
        ancientGroup.add(glow);

        ancientGroup.position.set(x, y - 0.5, z);
        this.boardGroup.add(ancientGroup);
    }

    /**
     * Create Roshan Pit
     */
    createRoshanPit(x, y, z) {
        const pitGroup = new THREE.Group();

        // Pit depression
        const pitGeometry = new THREE.CylinderGeometry(1.5, 1, 0.8, 16);
        const pitMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            roughness: 0.9,
            metalness: 0.1
        });
        const pit = new THREE.Mesh(pitGeometry, pitMaterial);
        pit.position.y = -0.3;
        pit.receiveShadow = true;
        pitGroup.add(pit);

        // Surrounding rocks
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const rockRadius = 2;
            const rockX = Math.cos(angle) * rockRadius;
            const rockZ = Math.sin(angle) * rockRadius;

            const rockGeometry = new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.2, 0);
            const rockMaterial = new THREE.MeshStandardMaterial({
                color: 0x5a6268,
                roughness: 0.95,
                metalness: 0.05
            });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.position.set(rockX, 0, rockZ);
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
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
        const totalSpaces = 36;
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
            // Bottom edge (0-8)
            x = -halfBoard + (index * spaceSize) + spaceSize / 2;
            z = -halfBoard + spaceSize / 2;
        } else if (index < spacesPerSide * 2 - 1) {
            // Right edge (9-16)
            x = halfBoard - spaceSize / 2;
            z = -halfBoard + ((index - spacesPerSide + 1) * spaceSize) + spaceSize / 2;
        } else if (index < spacesPerSide * 3 - 2) {
            // Top edge (17-25)
            x = halfBoard - ((index - (spacesPerSide * 2 - 2)) * spaceSize) - spaceSize / 2;
            z = halfBoard - spaceSize / 2;
        } else {
            // Left edge (26-35)
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
        const isCorner = property.type === 'corner';
        const size = isCorner ? 3.2 : spaceSize;

        // Base platform
        const baseGeometry = new THREE.BoxGeometry(size, 0.3, size);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.15;
        base.castShadow = true;
        base.receiveShadow = true;
        spaceGroup.add(base);

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
            'corner': 0xecf0f1,
            'property': this.getColorSetColor(property.color_set),
            'transportation': 0x95a5a6,
            'utility': 0xf39c12,
            'tax': 0xe74c3c,
            'chance': 0x3498db,
            'community_chest': 0x9b59b6
        };

        return colorMap[property.type] || 0xbdc3c7;
    }

    /**
     * Get color for property color set
     */
    getColorSetColor(colorSet) {
        const colors = {
            'brown': 0x8B4513,
            'light_blue': 0x87CEEB,
            'pink': 0xFF69B4,
            'orange': 0xFF8C00,
            'red': 0xFF0000,
            'yellow': 0xFFD700,
            'green': 0x00FF00,
            'deep_blue': 0x00008B,
            'independent': 0x9370DB
        };

        return colors[colorSet] || 0xbdc3c7;
    }

    /**
     * Create property label
     */
    createPropertyLabel(spaceGroup, property, size) {
        // Color stripe for properties
        if (property.type === 'property') {
            const stripeGeometry = new THREE.BoxGeometry(size * 0.8, 0.35, 0.3);
            const stripeMaterial = new THREE.MeshStandardMaterial({
                color: this.getColorSetColor(property.color_set),
                roughness: 0.5,
                metalness: 0.5,
                emissive: this.getColorSetColor(property.color_set),
                emissiveIntensity: 0.2
            });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.set(0, 0.5, 0);
            stripe.castShadow = true;
            spaceGroup.add(stripe);
        }
    }

    /**
     * Add corner space indicator
     */
    addCornerIndicator(spaceGroup, property, size) {
        const indicatorGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
        const indicatorMaterial = new THREE.MeshStandardMaterial({
            color: 0xf1c40f,
            roughness: 0.4,
            metalness: 0.6,
            emissive: 0xf39c12,
            emissiveIntensity: 0.3
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
