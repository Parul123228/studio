"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Orb = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current || rendererRef.current) return;

    const currentMount = mountRef.current;
    
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orb
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00fff7,
      wireframe: true,
      emissive: 0x00fff7,
      emissiveIntensity: 1,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 500;
    const posArray = new Float32Array(particlesCnt * 3);
    for(let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x9D00FF,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const pointLight1 = new THREE.PointLight(0x00fff7, 100, 100);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00cc, 100, 100);
    pointLight2.position.set(-2, -2, -2);
    scene.add(pointLight2);
    
    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      sphere.rotation.y = .5 * elapsedTime;
      sphere.rotation.x = .3 * elapsedTime;
      particlesMesh.rotation.y = -.1 * elapsedTime;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (currentMount && rendererRef.current) {
            currentMount.removeChild(rendererRef.current.domElement);
        }
        renderer.dispose();
        rendererRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full opacity-30" />;
};

export default Orb;
