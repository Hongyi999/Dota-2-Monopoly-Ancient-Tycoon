/**
 * SceneManager - Manages Three.js scene, camera, renderer, and lighting
 */

class SceneManager {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.lights = [];
        this.animationId = null;
        this.clock = new THREE.Clock();

        this.init();
    }

    /**
     * Initialize Three.js scene
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e); // Dark blue background

        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);

        // Setup camera
        this.setupCamera();

        // Setup renderer
        this.setupRenderer();

        // Setup lights
        this.setupLights();

        // Setup camera controls (optional - for debugging)
        this.setupControls();

        // Add grid helper (for development)
        // this.addGridHelper();

        // Start animation loop
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Setup orthographic camera for isometric view
     */
    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const frustumSize = 40;

        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );

        // Position camera for isometric view
        this.camera.position.set(30, 30, 30);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Setup WebGL renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        this.container.appendChild(this.renderer.domElement);
    }

    /**
     * Setup scene lighting
     */
    setupLights() {
        // Ambient light for base visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);

        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(20, 30, 10);
        directionalLight.castShadow = true;

        // Shadow properties
        directionalLight.shadow.camera.left = -40;
        directionalLight.shadow.camera.right = 40;
        directionalLight.shadow.camera.top = 40;
        directionalLight.shadow.camera.bottom = -40;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.bias = -0.0001;

        this.scene.add(directionalLight);
        this.lights.push(directionalLight);

        // Hemisphere light for ambient color variation
        const hemisphereLight = new THREE.HemisphereLight(
            0x87CEEB, // Sky color (light blue)
            0x3d2817, // Ground color (brown)
            0.3
        );
        this.scene.add(hemisphereLight);
        this.lights.push(hemisphereLight);

        // Point lights at special locations (Fountain, Roshan Pit)
        this.addPointLight(0, 1, 0, 0x4CAF50, 1.0); // Fountain (green)
        this.addPointLight(0, 1, 18, 0xF44336, 0.8); // Roshan Pit (red)
    }

    /**
     * Add point light at position
     */
    addPointLight(x, y, z, color, intensity) {
        const light = new THREE.PointLight(color, intensity, 15);
        light.position.set(x, y, z);
        light.castShadow = false; // Point lights expensive for shadows
        this.scene.add(light);
        this.lights.push(light);
        return light;
    }

    /**
     * Setup camera controls (for development/debugging)
     */
    setupControls() {
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxPolarAngle = Math.PI / 2.5; // Limit rotation
            this.controls.minDistance = 20;
            this.controls.maxDistance = 60;
        }
    }

    /**
     * Add grid helper for development
     */
    addGridHelper() {
        const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
        this.scene.add(gridHelper);
    }

    /**
     * Animation loop
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // Update controls if available
        if (this.controls) {
            this.controls.update();
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);

        // Dispatch update event for other systems
        window.dispatchEvent(new CustomEvent('sceneUpdate', { detail: { delta } }));
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const frustumSize = 40;

        this.camera.left = frustumSize * aspect / -2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    /**
     * Add object to scene
     */
    add(object) {
        this.scene.add(object);
    }

    /**
     * Remove object from scene
     */
    remove(object) {
        this.scene.remove(object);
    }

    /**
     * Get scene
     */
    getScene() {
        return this.scene;
    }

    /**
     * Get camera
     */
    getCamera() {
        return this.camera;
    }

    /**
     * Get renderer
     */
    getRenderer() {
        return this.renderer;
    }

    /**
     * Dispose of resources
     */
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.renderer) {
            this.renderer.dispose();
        }

        if (this.controls) {
            this.controls.dispose();
        }

        // Clear scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SceneManager;
}
