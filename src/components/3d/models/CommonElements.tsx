import * as THREE from 'three';
import { FenceProps, TreeProps } from './types';
import { createGrassMaterial, createFoliageMaterial } from '../shaders/AnimatedShaders';

export const createFence = ({ scene }: FenceProps) => {
  if (!scene) return;

  const fencePoints = [
    new THREE.Vector3(-25, 0, -25),
    new THREE.Vector3(25, 0, -25),
    new THREE.Vector3(25, 0, 25),
    new THREE.Vector3(-25, 0, 25),
    new THREE.Vector3(-25, 0, -25)
  ];

  for (let i = 0; i < fencePoints.length - 1; i++) {
    const start = fencePoints[i];
    const end = fencePoints[i + 1];
    
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const postSpacing = 5;
    
    direction.normalize();
    
    for (let dist = 0; dist <= length; dist += postSpacing) {
      const postPosition = new THREE.Vector3().addVectors(
        start,
        direction.clone().multiplyScalar(dist)
      );
      
      const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
      const postMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8d6e63,
        roughness: 0.7,
        metalness: 0.1
      });
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.set(postPosition.x, 0.75, postPosition.z);
      post.castShadow = true;
      scene.add(post);
    }
  }
};

export const addTree = ({ x, z, scene }: TreeProps) => {
  if (!scene) return;

  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8b4513,
    roughness: 0.9,
    metalness: 0.0,
    bumpScale: 0.02
  });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, 2, z);
  trunk.castShadow = true;
  scene.add(trunk);

  // Foliage - improved with animated shader
  const foliageGeometry = new THREE.SphereGeometry(2, 16, 16);
  const foliageMaterial = createFoliageMaterial();
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.set(x, 5, z);
  foliage.castShadow = true;
  scene.add(foliage);
  
  // Add some detail with smaller foliage clusters
  for (let i = 0; i < 3; i++) {
    const smallFoliageGeometry = new THREE.SphereGeometry(1, 12, 12);
    const smallFoliageMaterial = createFoliageMaterial();
    const smallFoliage = new THREE.Mesh(smallFoliageGeometry, smallFoliageMaterial);
    smallFoliage.position.set(
      x + Math.random() * 1.5 - 0.75,
      4 + Math.random() * 2,
      z + Math.random() * 1.5 - 0.75
    );
    smallFoliage.castShadow = true;
    scene.add(smallFoliage);
  }
};

export const setupBasicScene = (scene: THREE.Scene) => {
  // Clear existing models
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  
  // Re-add lights with improved settings
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(10, 15, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  
  // Improve shadow quality
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -30;
  directionalLight.shadow.camera.right = 30;
  directionalLight.shadow.camera.top = 30;
  directionalLight.shadow.camera.bottom = -30;
  directionalLight.shadow.bias = -0.0001;
  directionalLight.shadow.normalBias = 0.02;
  
  scene.add(directionalLight);
  
  // Add a secondary light for better illumination
  const secondaryLight = new THREE.DirectionalLight(0xffffcc, 0.4);
  secondaryLight.position.set(-10, 12, -15);
  scene.add(secondaryLight);
  
  // Add rim light for better depth
  const rimLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
  rimLight.position.set(0, 5, -20);
  scene.add(rimLight);
  
  // Ground plane with improved animated grass material
  const groundGeometry = new THREE.PlaneGeometry(100, 100, 64, 64);
  const groundMaterial = createGrassMaterial();
  
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);
  
  return scene;
};
