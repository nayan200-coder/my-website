/**
 * Three.js Background System
 * Floating 3D brackets { and } with scroll-reactive animation
 * Module-based, runs on local server
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";
import { FontLoader } from "https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/geometries/TextGeometry.js";

// Safety check
if (!document.getElementById('three-bg')) {
  console.error('three-bg container not found');
}

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true,
  precision: 'highp'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // Transparent background

const container = document.getElementById('three-bg');
if (container) {
  container.appendChild(renderer.domElement);
}

console.log('Three.js Background System initialized');

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Font loading and bracket creation
const fontLoader = new FontLoader();
let leftBracket = null;
let rightBracket = null;

// Load font from CDN (Roboto Mono)
fontLoader.load(
  'https://threejs.org/examples/fonts/roboto_mono_bold.typeface.json',
  function(font) {
    console.log('Font loaded successfully');

    // Create left bracket { geometry
    const leftBracketGeo = new TextGeometry('{', {
      font: font,
      size: 2,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 3
    });

    leftBracketGeo.computeBoundingBox();
    const centerOffsetX = -0.5 * (leftBracketGeo.boundingBox.max.x - leftBracketGeo.boundingBox.min.x);
    const centerOffsetY = -0.5 * (leftBracketGeo.boundingBox.max.y - leftBracketGeo.boundingBox.min.y);
    leftBracketGeo.translate(centerOffsetX, centerOffsetY, 0);

    // Material with emissive glow
    const bracketMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x0099ff,
      emissiveIntensity: 0.4,
      metalness: 0.4,
      roughness: 0.6
    });

    leftBracket = new THREE.Mesh(leftBracketGeo, bracketMaterial);
    leftBracket.position.set(-3.5, 0, -2);
    leftBracket.scale.set(1.2, 1.2, 1.2);
    leftBracket.rotation.z = 0.1; // Slight tilt
    scene.add(leftBracket);

    // Create right bracket } geometry
    const rightBracketGeo = new TextGeometry('}', {
      font: font,
      size: 2,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 3
    });

    rightBracketGeo.computeBoundingBox();
    const centerOffsetX2 = -0.5 * (rightBracketGeo.boundingBox.max.x - rightBracketGeo.boundingBox.min.x);
    const centerOffsetY2 = -0.5 * (rightBracketGeo.boundingBox.max.y - rightBracketGeo.boundingBox.min.y);
    rightBracketGeo.translate(centerOffsetX2, centerOffsetY2, 0);

    const rightMaterial = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff0099,
      emissiveIntensity: 0.4,
      metalness: 0.4,
      roughness: 0.6
    });

    rightBracket = new THREE.Mesh(rightBracketGeo, rightMaterial);
    rightBracket.position.set(3.5, 0, -2);
    rightBracket.scale.set(1.2, 1.2, 1.2);
    rightBracket.rotation.z = -0.1; // Opposite tilt
    scene.add(rightBracket);

    console.log('Brackets created and added to scene');
  },
  function(progress) {
    console.log('Font loading...', (progress.loaded / progress.total * 100) + '%');
  },
  function(error) {
    console.warn('Font load failed, using fallback boxes', error);
    createFallbackBrackets();
  }
);

// Fallback bracket creation if font fails
function createFallbackBrackets() {
  const geo = new THREE.BoxGeometry(1, 2.5, 0.3);
  
  const leftMat = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x0099ff,
    emissiveIntensity: 0.4
  });
  
  leftBracket = new THREE.Mesh(geo, leftMat);
  leftBracket.position.set(-3.5, 0, -2);
  leftBracket.scale.set(1.2, 1.2, 1.2);
  scene.add(leftBracket);

  const rightMat = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff0099,
    emissiveIntensity: 0.4
  });

  rightBracket = new THREE.Mesh(geo, rightMat);
  rightBracket.position.set(3.5, 0, -2);
  rightBracket.scale.set(1.2, 1.2, 1.2);
  scene.add(rightBracket);

  console.log('Fallback brackets created');
}

// Animation state
let scrollDelta = 0;
let lastScroll = window.scrollY;
const baseRotationSpeed = 0.005;
let leftBracketBaseY = 0;
let rightBracketBaseY = 0;

// Scroll listener
window.addEventListener('scroll', () => {
  const newScroll = window.scrollY;
  const delta = (newScroll - lastScroll) * 0.0005;
  scrollDelta += delta;
  lastScroll = newScroll;
}, { passive: true });

// Resize handler
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// Animation loop
let frameCount = 0;
function animate() {
  requestAnimationFrame(animate);

  frameCount++;

  // Ease out scroll delta
  scrollDelta *= 0.9;

  // Update brackets if loaded
  if (leftBracket && rightBracket) {
    // Rotation: idle + scroll
    const totalRotation = baseRotationSpeed + scrollDelta;
    
    leftBracket.rotation.y += totalRotation;
    rightBracket.rotation.y -= totalRotation; // Opposite direction
    
    // X-axis gentle wobble
    leftBracket.rotation.x = Math.sin(frameCount * 0.003) * 0.1;
    rightBracket.rotation.x = Math.sin(frameCount * 0.003) * 0.1;
    
    // Floating up and down (Y position)
    const floatAmount = Math.sin(frameCount * 0.005) * 0.8;
    leftBracket.position.y = leftBracketBaseY + floatAmount;
    rightBracket.position.y = rightBracketBaseY + floatAmount;
    
    // Store base Y on first frame
    if (frameCount === 1) {
      leftBracketBaseY = leftBracket.position.y;
      rightBracketBaseY = rightBracket.position.y;
    }
  }

  renderer.render(scene, camera);
}

animate();

console.log('Three.js Background animation started');
