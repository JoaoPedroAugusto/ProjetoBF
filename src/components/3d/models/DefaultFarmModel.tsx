import * as THREE from 'three';
import { ModelProps } from './types';
import { addTree } from './CommonElements';

export const createDefaultFarm = ({ scene }: ModelProps) => {
  if (!scene) return;

  // Add basic farm elements with improved details
  // Create fence using the common fence function
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
        roughness: 0.8,
        metalness: 0.1
      });
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.set(postPosition.x, 0.75, postPosition.z);
      post.castShadow = true;
      scene.add(post);
    }
  }

  // Add barn with improved details
  const barnGeometry = new THREE.BoxGeometry(8, 6, 10);
  const barnMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8b4513,
    roughness: 0.8,
    metalness: 0.1
  });
  const barn = new THREE.Mesh(barnGeometry, barnMaterial);
  barn.position.set(-10, 3, 0);
  barn.castShadow = true;
  scene.add(barn);

  // Add roof with improved geometry
  const roofGeometry = new THREE.ConeGeometry(7, 3, 4);
  const roofMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x654321,
    roughness: 0.9,
    metalness: 0.1
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(-10, 7, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  scene.add(roof);
  
  // Add barn door
  const doorGeometry = new THREE.BoxGeometry(3, 4, 0.2);
  const doorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x5d4037,
    roughness: 0.9,
    metalness: 0.1
  });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(-10, 2, 5.1);
  door.castShadow = true;
  scene.add(door);
  
  // Add windows
  for (let i = 0; i < 2; i++) {
    const windowGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.1);
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xb3e5fc,
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.7
    });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(-12 + i * 4, 4, 5.1);
    window.castShadow = false;
    scene.add(window);
  }

  // Add trees with improved visuals
  for (let i = 0; i < 7; i++) {
    const x = Math.random() * 40 - 20;
    const z = Math.random() * 40 - 20;
    addTree({ x, z, scene });
  }
  
  // Add farmhouse
  const houseGeometry = new THREE.BoxGeometry(10, 5, 8);
  const houseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf5f5f5,
    roughness: 0.8,
    metalness: 0.1
  });
  const house = new THREE.Mesh(houseGeometry, houseMaterial);
  house.position.set(10, 2.5, -10);
  house.castShadow = true;
  scene.add(house);
  
  // Add house roof
  const houseRoofGeometry = new THREE.ConeGeometry(7, 4, 4);
  const houseRoofMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x795548,
    roughness: 0.9,
    metalness: 0.1
  });
  const houseRoof = new THREE.Mesh(houseRoofGeometry, houseRoofMaterial);
  houseRoof.position.set(10, 6, -10);
  houseRoof.rotation.y = Math.PI / 4;
  houseRoof.castShadow = true;
  scene.add(houseRoof);
  
  // Add house door
  const houseDoorGeometry = new THREE.BoxGeometry(1.5, 3, 0.1);
  const houseDoorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x5d4037,
    roughness: 0.9,
    metalness: 0.1
  });
  const houseDoor = new THREE.Mesh(houseDoorGeometry, houseDoorMaterial);
  houseDoor.position.set(10, 1.5, -6.01);
  houseDoor.castShadow = true;
  scene.add(houseDoor);
  
  // Add house windows
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const windowGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.1);
      const windowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xb3e5fc,
        roughness: 0.3,
        metalness: 0.5,
        transparent: true,
        opacity: 0.7
      });
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(
        7 + i * 6,
        2.5,
        -6.01 - j * 8
      );
      window.castShadow = false;
      scene.add(window);
    }
  }
  
  // Add garden
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 5; j++) {
      const plantGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const plantMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2e7d32,
        roughness: 1.0,
        metalness: 0.0
      });
      const plant = new THREE.Mesh(plantGeometry, plantMaterial);
      plant.position.set(
        15 + j * 1,
        0.3,
        -5 - i * 1
      );
      plant.castShadow = true;
      scene.add(plant);
      
      // Add flowers to some plants
      if (Math.random() > 0.5) {
        const flowerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const flowerMaterial = new THREE.MeshStandardMaterial({ 
          color: [0xff5252, 0xffeb3b, 0xe040fb, 0xffffff][Math.floor(Math.random() * 4)],
          roughness: 0.7,
          metalness: 0.1
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(
          15 + j * 1,
          0.5,
          -5 - i * 1
        );
        flower.castShadow = true;
        scene.add(flower);
      }
    }
  }
  
  // Add tractor
  const tractorBodyGeometry = new THREE.BoxGeometry(3, 1.5, 1.5);
  const tractorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf44336,
    roughness: 0.7,
    metalness: 0.3
  });
  const tractorBody = new THREE.Mesh(tractorBodyGeometry, tractorMaterial);
  tractorBody.position.set(5, 1.25, 10);
  tractorBody.castShadow = true;
  scene.add(tractorBody);
  
  // Add tractor cab
  const cabGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const cabMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd32f2f,
    roughness: 0.7,
    metalness: 0.3
  });
  const cab = new THREE.Mesh(cabGeometry, cabMaterial);
  cab.position.set(4, 2.25, 10);
  cab.castShadow = true;
  scene.add(cab);
  
  // Add tractor wheels
  for (let i = 0; i < 2; i++) {
    // Large back wheels
    const backWheelGeometry = new THREE.CylinderGeometry(0.75, 0.75, 0.5, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x212121,
      roughness: 0.9,
      metalness: 0.2
    });
    const backWheel = new THREE.Mesh(backWheelGeometry, wheelMaterial);
    backWheel.position.set(
      5.5,
      0.75,
      10 - 1 + i * 2
    );
    backWheel.rotation.z = Math.PI / 2;
    backWheel.castShadow = true;
    scene.add(backWheel);
    
    // Small front wheels
    const frontWheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const frontWheel = new THREE.Mesh(frontWheelGeometry, wheelMaterial);
    frontWheel.position.set(
      3.5,
      0.4,
      10 - 0.75 + i * 1.5
    );
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.castShadow = true;
    scene.add(frontWheel);
  }
};
