import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Thermal3DCanvasProps {
  temperature: number;
  fireDetected: boolean;
  darkMode: boolean;
}

export const Thermal3DCanvas: React.FC<Thermal3DCanvasProps> = ({ temperature, fireDetected, darkMode }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create 3D Industrial Terrain / Plant Sector Grid
    const gridSize = 16;
    const divisions = 16;
    const gridHelper = new THREE.GridHelper(gridSize, divisions, 0xD9381E, darkMode ? 0x2D2A26 : 0xE6E2DE);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Create 3D Heat Dispersion Particles (Embers & Thermal Plumes)
    const particleCount = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;     // x
      positions[i * 3 + 1] = Math.random() * 8 - 2;      // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;   // z
      scales[i] = Math.random() * 2 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle material in ember red / burnt orange
    const material = new THREE.PointsMaterial({
      color: fireDetected ? 0xD9381E : 0xC85A17,
      size: 0.35,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Central Sector 7 Thermal Core Mesh
    const coreGeometry = new THREE.CylinderGeometry(1.5, 2.5, 3, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: fireDetected ? 0xD9381E : 0x1C1917,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreMesh.position.set(2, 0, -2);
    scene.add(coreMesh);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate particle system & core
      particleSystem.rotation.y = elapsedTime * 0.15;
      coreMesh.rotation.y = elapsedTime * 0.3;

      // Animate particles upward (thermal plume)
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 1] += 0.03 + (fireDetected ? 0.04 : 0.01);
        if (arr[i * 3 + 1] > 8) {
          arr[i * 3 + 1] = -2;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
    };
  }, [fireDetected, darkMode]);

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-[2px] overflow-hidden">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/10 dark:bg-white/10 backdrop-blur-sm rounded-[2px] text-[10px] font-mono pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#D9381E] animate-ping"></span>
        <span>3D THERMAL PLUME MESH // SECTOR 7</span>
      </div>
    </div>
  );
};
