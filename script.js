/**
 * Gabriel Molter Style Three.js Setup
 * ===================================
 * Complete tutorial structure with guaranteed visibility
 */

console.log('%c╔════════════════════════════════════════╗', 'color: cyan; font-weight: bold');
console.log('%c║     THREE.JS SCENE INITIALIZATION      ║', 'color: cyan; font-weight: bold');
console.log('%c╚════════════════════════════════════════╝', 'color: cyan; font-weight: bold');

// ============================================================
// GLOBAL STATE & CONFIGURATION
// ============================================================

const CONFIG = {
    viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight
    },
    camera: {
        fov: 45,
        near: 0.1,
        far: 10000,
        position: { x: 0, y: 0, z: 5 }
    },
    lights: {
        ambient: { color: 0xffffff, intensity: 1 },
        directional: { color: 0xffffff, intensity: 2, pos: { x: 5, y: 5, z: 5 } },
        point: { color: 0x00ffff, intensity: 2, pos: { x: 0, y: 0, z: 3 } }
    }
};

let scrollAmount = 0;
let isDebugMode = true;

// ============================================================
// SCENE SETUP
// ============================================================

console.log('%c[SCENE] Creating Three.js scene...', 'color: #FFD700; font-weight: bold');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = null;

updateDebug('status-init', '✅ Scene created');
console.log('✓ Scene created with black background');

// ============================================================
// CAMERA SETUP
// ============================================================

console.log('%c[CAMERA] Setting up perspective camera...', 'color: #FFD700; font-weight: bold');

const camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    CONFIG.viewport.aspect,
    CONFIG.camera.near,
    CONFIG.camera.far
);

camera.position.set(
    CONFIG.camera.position.x,
    CONFIG.camera.position.y,
    CONFIG.camera.position.z
);
camera.lookAt(0, 0, 0);

updateDebug('status-camera', `✅ Camera: (${camera.position.x}, ${camera.position.y}, ${camera.position.z})`);
console.log('✓ Camera positioned at:', camera.position);
console.log('✓ Camera looking at: (0, 0, 0)');

// ============================================================
// RENDERER SETUP
// ============================================================

console.log('%c[RENDERER] Creating WebGL renderer...', 'color: #FFD700; font-weight: bold');

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    precision: 'highp',
    powerPreference: 'high-performance'
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// Append to container
const container = document.getElementById('container3D');
if (container) {
    container.appendChild(renderer.domElement);
    console.log('✓ Renderer appended to #container3D');
} else {
    document.body.insertBefore(renderer.domElement, document.body.firstChild);
    console.warn('⚠️ #container3D not found, appended to body directly');
}

updateDebug('status-renderer', `✅ Renderer: ${renderer.domElement.width}x${renderer.domElement.height}`);
console.log('✓ Renderer size:', renderer.domElement.width, 'x', renderer.domElement.height);

// ============================================================
// LIGHTING SETUP
// ============================================================

console.log('%c[LIGHTS] Setting up lights...', 'color: #FFD700; font-weight: bold');

// Ambient Light - Base illumination
const ambientLight = new THREE.AmbientLight(
    CONFIG.lights.ambient.color,
    CONFIG.lights.ambient.intensity
);
scene.add(ambientLight);
console.log('✓ Ambient Light added (intensity: 1)');

// Directional Light - Key light
const directionalLight = new THREE.DirectionalLight(
    CONFIG.lights.directional.color,
    CONFIG.lights.directional.intensity
);
directionalLight.position.set(
    CONFIG.lights.directional.pos.x,
    CONFIG.lights.directional.pos.y,
    CONFIG.lights.directional.pos.z
);
scene.add(directionalLight);
console.log('✓ Directional Light added (intensity: 2)');

// Point Light - Accent light (cyan)
const pointLight = new THREE.PointLight(
    CONFIG.lights.point.color,
    CONFIG.lights.point.intensity
);
pointLight.position.set(
    CONFIG.lights.point.pos.x,
    CONFIG.lights.point.pos.y,
    CONFIG.lights.point.pos.z
);
scene.add(pointLight);
console.log('✓ Point Light added (cyan, intensity: 2)');

updateDebug('status-lights', '✅ Lights: Ambient, Directional, Point');

// ============================================================
// TEST OBJECT (HOTPINK CUBE) - ALWAYS VISIBLE FALLBACK
// ============================================================

console.log('%c[OBJECTS] Creating test cube...', 'color: #FFD700; font-weight: bold');

const testGeo = new THREE.BoxGeometry(1, 1, 1);
const testMat = new THREE.MeshStandardMaterial({
    color: 0xff1493,  // HOT PINK
    metalness: 0.3,
    roughness: 0.4,
    emissive: 0xff1493,
    emissiveIntensity: 0.3
});
const testCube = new THREE.Mesh(testGeo, testMat);
testCube.position.z = 0;
testCube.scale.set(1, 1, 1);
testCube.name = 'test-cube';
scene.add(testCube);

console.log('✓ Test cube created (HOT PINK, always visible)');

// ============================================================
// CODE SYMBOLS (3D BRACKETS & PUNCTUATION)
// ============================================================

console.log('%c[OBJECTS] Creating 3D code symbols (brackets & punctuation)...', 'color: #FFD700; font-weight: bold');

// Helper: thin box for strokes
function makeBar(w = 0.08, h = 0.6, d = 0.08, color = 0x00ff00) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.2 });
    return new THREE.Mesh(geo, mat);
}

// Helper: small dot (for punctuation)
function makeDot(radius = 0.06, color = 0xffffff) {
    const geo = new THREE.SphereGeometry(radius, 12, 12);
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6 });
    return new THREE.Mesh(geo, mat);
}

// Build a square bracket [ or ] as a Group
function createSquareBracket(side = 'left', color = 0x00ff00) {
    const g = new THREE.Group();
    const vertical = makeBar(0.08, 1.2, 0.08, color);
    vertical.position.set(side === 'left' ? -0.12 : 0.12, 0, 0);
    const top = makeBar(0.5, 0.08, 0.08, color);
    top.position.set(side === 'left' ? 0.12 : -0.12, 0.56, 0);
    const bottom = makeBar(0.5, 0.08, 0.08, color);
    bottom.position.set(side === 'left' ? 0.12 : -0.12, -0.56, 0);
    g.add(vertical, top, bottom);
    return g;
}

// Build an angle bracket < or >
function createAngleBracket(direction = 'left', color = 0x00ff00) {
    const g = new THREE.Group();
    const arm1 = makeBar(0.08, 0.9, 0.08, color);
    const arm2 = makeBar(0.08, 0.9, 0.08, color);
    arm1.rotation.z = direction === 'left' ? 0.6 : -0.6;
    arm2.rotation.z = direction === 'left' ? -0.6 : 0.6;
    g.add(arm1, arm2);
    return g;
}

// Build a parenthesis approximation (arc made of small bars)
function createParen(side = 'left', color = 0x00ff00) {
    const g = new THREE.Group();
    const segments = 6;
    for (let i = 0; i < segments; i++) {
        const seg = makeBar(0.06, 0.18, 0.06, color);
        const angle = (i / (segments - 1)) * Math.PI * 0.6 - Math.PI * 0.3;
        const radius = 0.6;
        seg.position.x = (side === 'left' ? -1 : 1) * Math.cos(angle) * radius * 0.5;
        seg.position.y = Math.sin(angle) * radius * 0.6;
        seg.rotation.z = angle + (side === 'left' ? Math.PI / 2 : -Math.PI / 2);
        g.add(seg);
    }
    return g;
}

// Curly brace approximation built from small bars
function createCurlyBrace(side = 'left', color = 0x00ff00) {
    const g = new THREE.Group();
    const positions = [0.6, 0.2, -0.2, -0.6];
    positions.forEach((py, i) => {
        const seg = makeBar(0.08, 0.3, 0.08, color);
        seg.position.set((side === 'left' ? -0.25 : 0.25), py, 0);
        seg.rotation.z = (i % 2 === 0) ? 0.4 : -0.4;
        g.add(seg);
    });
    return g;
}

// Small punctuation (comma, semicolon, period)
function createPunctuation(type = 'period', color = 0xffffff) {
    const g = new THREE.Group();
    if (type === 'period') {
        const dot = makeDot(0.06, color);
        g.add(dot);
    } else if (type === 'comma') {
        const dot = makeDot(0.06, color);
        const tail = makeBar(0.06, 0.12, 0.06, color);
        tail.position.set(0.06, -0.08, 0);
        tail.rotation.z = -0.6;
        g.add(dot, tail);
    } else if (type === 'semicolon') {
        const dot = makeDot(0.06, color);
        const tail = makeBar(0.06, 0.12, 0.06, color);
        tail.position.set(0.06, -0.02, 0);
        tail.rotation.z = -0.6;
        tail.position.y = -0.18;
        g.add(dot, tail);
    } else if (type === 'colon') {
        const top = makeDot(0.05, color);
        const bottom = makeDot(0.05, color);
        top.position.y = 0.08;
        bottom.position.y = -0.08;
        g.add(top, bottom);
    }
    return g;
}

// Group that holds all code-related symbols
const codeSymbolsGroup = new THREE.Group();
codeSymbolsGroup.name = 'codeSymbols';

// Add a variety of bracket types and punctuation
const sqLeft = createSquareBracket('left', 0x00ff00);
sqLeft.position.set(-1.8, 0.0, -0.4);
sqLeft.scale.set(1.2, 1.2, 1.2);
codeSymbolsGroup.add(sqLeft);

const sqRight = createSquareBracket('right', 0x00ff00);
sqRight.position.set(1.8, 0.0, -0.4);
sqRight.scale.set(1.2, 1.2, 1.2);
codeSymbolsGroup.add(sqRight);

const angLeft = createAngleBracket('left', 0x00ff00);
angLeft.position.set(-0.9, 0.6, -0.2);
angLeft.scale.set(1.0, 1.0, 1.0);
codeSymbolsGroup.add(angLeft);

const angRight = createAngleBracket('right', 0x00ff00);
angRight.position.set(0.9, 0.6, -0.2);
codeSymbolsGroup.add(angRight);

const curlLeft = createCurlyBrace('left', 0x00ff00);
curlLeft.position.set(-0.9, -0.6, -0.2);
codeSymbolsGroup.add(curlLeft);

const curlRight = createCurlyBrace('right', 0x00ff00);
curlRight.position.set(0.9, -0.6, -0.2);
codeSymbolsGroup.add(curlRight);

const parenLeft = createParen('left', 0x00ff00);
parenLeft.position.set(-0.35, 0.0, -0.1);
codeSymbolsGroup.add(parenLeft);

const parenRight = createParen('right', 0x00ff00);
parenRight.position.set(0.35, 0.0, -0.1);
codeSymbolsGroup.add(parenRight);

// Punctuation cluster
const punctGroup = new THREE.Group();
punctGroup.position.set(0, -0.9, 0);
punctGroup.add(createPunctuation('period', 0xffffff));
const comma = createPunctuation('comma', 0xffd700);
comma.position.x = 0.2;
punctGroup.add(comma);
const semicolon = createPunctuation('semicolon', 0xff69b4);
semicolon.position.x = -0.2;
punctGroup.add(semicolon);
codeSymbolsGroup.add(punctGroup);

scene.add(codeSymbolsGroup);

console.log('✓ Code symbols created (square/angle/curly/paren/punctuation)');

// ============================================================
// TECH BRACKETS (NEON GREEN)
// ============================================================

console.log('%c[OBJECTS] Creating tech brackets...', 'color: #FFD700; font-weight: bold');

const bracketsGroup = new THREE.Group();
bracketsGroup.name = 'brackets';

// Left bracket "<"
const leftBracketGeo = new THREE.PlaneGeometry(0.5, 1.5);
const bracketMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,  // Neon green
    transparent: false,
    side: THREE.DoubleSide
});
const leftBracket = new THREE.Mesh(leftBracketGeo, bracketMat);
leftBracket.position.set(-2, 0, -1);
bracketsGroup.add(leftBracket);

// Right bracket ">"
const rightBracket = new THREE.Mesh(leftBracketGeo, bracketMat);
rightBracket.position.set(2, 0, -1);
bracketsGroup.add(rightBracket);

// Add wireframe cube in center
const bracketCubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const bracketWireMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    transparent: false
});
const bracketCube = new THREE.Mesh(bracketCubeGeo, bracketWireMat);
bracketCube.position.z = 0;
bracketsGroup.add(bracketCube);

scene.add(bracketsGroup);

console.log('✓ Tech brackets created (neon green)');

// ============================================================
// SCENE INSPECTION
// ============================================================

console.group('%c📊 SCENE OBJECTS', 'color: #FFD700; font-weight: bold');
console.log('Total children in scene:', scene.children.length);
scene.children.forEach((child, index) => {
    console.log(`  [${index}] ${child.name || child.type} - Visible: ${child.visible}`);
});
console.groupEnd();

updateDebug('status-objects', `✅ Objects: ${scene.children.length} total`);

// ============================================================
// SCROLL HANDLING
// ============================================================

console.log('%c[SCROLL] Setting up scroll listener...', 'color: #FFD700; font-weight: bold');

let lastScrollY = 0;
const scrollSensitivity = 0.005;

window.addEventListener('scroll', (event) => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    scrollAmount += scrollDelta * scrollSensitivity;
    
    // Update scroll indicator
    const scrollPercentage = (currentScrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const scrollIndicator = document.getElementById('scroll-value');
    if (scrollIndicator) {
        scrollIndicator.textContent = Math.round(scrollPercentage) + '%';
    }
    
    lastScrollY = currentScrollY;
});

console.log('✓ Scroll listener attached');

// ============================================================
// WINDOW RESIZE HANDLING
// ============================================================

console.log('%c[RESPONSIVE] Setting up resize listener...', 'color: #FFD700; font-weight: bold');

window.addEventListener('resize', () => {
    CONFIG.viewport.width = window.innerWidth;
    CONFIG.viewport.height = window.innerHeight;
    CONFIG.viewport.aspect = window.innerWidth / window.innerHeight;
    
    camera.aspect = CONFIG.viewport.aspect;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    console.log('✓ Window resized to:', window.innerWidth, 'x', window.innerHeight);
});

console.log('✓ Resize listener attached');

// ============================================================
// ANIMATION LOOP
// ============================================================

console.log('%c[ANIMATION] Starting animation loop...', 'color: #FFD700; font-weight: bold');

let frameCount = 0;
let lastFPS = 0;
let lastTime = performance.now();

function animate() {
    requestAnimationFrame(animate);
    
    try {
        // Rotate test cube
        if (testCube) {
            testCube.rotation.x += 0.01;
            testCube.rotation.y += 0.01;
        }
        
        // Rotate code symbols (based on scroll)
        if (codeSymbolsGroup) {
            // gentle X wobble driven by scroll for subtle movement
            codeSymbolsGroup.rotation.x += 0.001 * Math.sin(scrollAmount);
            // Y rotation increased by scroll amount
            codeSymbolsGroup.rotation.y += 0.003 + scrollAmount * 0.5;
        }
        
        // Rotate brackets
        if (bracketsGroup) {
            bracketsGroup.rotation.y += 0.004;
        }
        
        // Render scene
        renderer.render(scene, camera);
        
        // FPS Counter
        frameCount++;
        const currentTime = performance.now();
        if (currentTime >= lastTime + 1000) {
            lastFPS = frameCount;
            frameCount = 0;
            lastTime = currentTime;
        }
        
    } catch (error) {
        console.error('❌ Animation loop error:', error);
    }
}

animate();

updateDebug('status-animation', `✅ Animation: Running (${lastFPS} FPS)`);
console.log('✓ Animation loop started');

// ============================================================
// DEBUG UTILITIES
// ============================================================

function updateDebug(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = text;
    }
}

// Update FPS display
setInterval(() => {
    updateDebug('status-animation', `✅ Animation: Running (${lastFPS} FPS)`);
}, 1000);

// ============================================================
// GLOBAL TESTING FUNCTIONS
// ============================================================

window.showTestCube = () => {
    testCube.visible = true;
    if (typeof codeSymbolsGroup !== 'undefined') codeSymbolsGroup.visible = false;
    bracketsGroup.visible = false;
    console.log('%c🔴 Showing TEST CUBE (HOT PINK)', 'color: #ff1493; font-weight: bold');
};

// Replaced showOrb with showCodeSymbols
window.showCodeSymbols = () => {
    testCube.visible = false;
    if (typeof codeSymbolsGroup !== 'undefined') codeSymbolsGroup.visible = true;
    bracketsGroup.visible = false;
    console.log('%c� Showing CODE SYMBOLS (BRACKETS & PUNCTUATION)', 'color: #00aaff; font-weight: bold');
};

window.showBrackets = () => {
    testCube.visible = false;
    if (typeof codeSymbolsGroup !== 'undefined') codeSymbolsGroup.visible = false;
    bracketsGroup.visible = true;
    console.log('%c🟢 Showing BRACKETS (GREEN)', 'color: #00ff00; font-weight: bold');
};

window.showAll = () => {
    testCube.visible = true;
    if (typeof codeSymbolsGroup !== 'undefined') codeSymbolsGroup.visible = true;
    bracketsGroup.visible = true;
    console.log('%c⭐ Showing ALL OBJECTS', 'color: #ffff00; font-weight: bold');
};

window.logScene = () => {
    console.group('%c📊 SCENE STATISTICS', 'color: #FFD700; font-weight: bold; font-size: 14px');
    console.log('Renderer size:', `${renderer.domElement.width}x${renderer.domElement.height}`);
    console.log('Window size:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('Camera position:', camera.position);
    console.log('Camera looking at:', new THREE.Vector3(0, 0, 0));
    console.log('Scene children:', scene.children.length);
    console.log('Objects:');
    console.log('  - Test Cube:', testCube.visible);
    console.log('  - Code Symbols:', (typeof codeSymbolsGroup !== 'undefined') ? codeSymbolsGroup.visible : false);
    console.log('  - Brackets:', bracketsGroup.visible);
    console.log('Scroll amount:', scrollAmount);
    console.groupEnd();
};

// ============================================================
// FINAL INITIALIZATION LOG
// ============================================================

console.log('%c╔════════════════════════════════════════╗', 'color: cyan; font-weight: bold');
console.log('%c║    ✅ SCENE FULLY INITIALIZED!        ║', 'color: #00ff00; font-weight: bold');
console.log('%c╚════════════════════════════════════════╝', 'color: cyan; font-weight: bold');

console.log('%cAvailable commands:', 'color: #FFD700; font-weight: bold');
console.log('  window.showTestCube()     - Show hot pink cube');
console.log('  window.showCodeSymbols()  - Show 3D brackets & punctuation');
console.log('  window.showBrackets()     - Show green planar brackets');
console.log('  window.showAll()          - Show all objects');
console.log('  window.logScene()         - Display scene stats');

updateDebug('status-init', '✅ All systems ready!');

// Final console output
console.log('%cScene Information:', 'color: #00ff00; font-weight: bold');
console.log('Renderer:', renderer.domElement);
console.log('Camera:', camera.position);
console.log('Objects in scene:', scene.children);
console.log('%cScroll down to animate the code symbols!', 'color: #00ffff; font-size: 14px; font-weight: bold');
