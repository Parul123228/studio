"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OrbProps {
  isMobile: boolean;
}

const Orb: React.FC<OrbProps> = ({ isMobile }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let animationFrameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;
    
    let renderer: THREE.WebGLRenderer;
    try {
        // Optimization: Disable antialiasing on mobile for better performance
        renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    } catch (error) {
        console.error("Failed to create WebGLRenderer:", error);
        return;
    }
    
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    // Optimization: Cap pixel ratio to 2 to prevent performance issues on high-DPI screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);
    
    // Optimization: Reduced segments from 32 to 16 for better performance
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00fff7,
      wireframe: true,
      emissive: 0x00fff7,
      emissiveIntensity: 1,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const particlesGeometry = new THREE.BufferGeometry();
    // Optimization: Reduced particle count from 150 to 100
    const particlesCnt = 100;
    const posArray = new Float32Array(particlesCnt * 3);
    for(let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x9D00FF,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const pointLight1 = new THREE.PointLight(0x00fff7, 100, 100);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00cc, 100, 100);
    pointLight2.position.set(-2, -2, -2);
    scene.add(pointLight2);
    
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      sphere.rotation.y = 0.5 * elapsedTime;
      sphere.rotation.x = 0.3 * elapsedTime;
      particlesMesh.rotation.y = -0.1 * elapsedTime;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        
        if (renderer.domElement.parentNode === currentMount) {
            currentMount.removeChild(renderer.domElement);
        }

        scene.traverse(object => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        
        renderer.dispose();
    };
  }, [isMobile]);

  return <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full opacity-30" />;
};

export default Orb;
