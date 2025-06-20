import * as THREE from 'three';
import { ModelProps } from './types'; // Assuming types.ts exists with ModelProps { scene: THREE.Scene | null }
import { Cloud, Sky } from '@react-three/drei'; // Import Sky
import React, { useRef, useEffect } from 'react';

// Helper function to create InstancedMesh
const createInstancedPart = (geometry: THREE.BufferGeometry, material: THREE.Material, count: number) => {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.castShadow = true;
  // mesh.receiveShadow = true; // Optional, depending on visual needs
  return mesh;
};

// Helper function to create a simple tractor
const createTractor = () => {
  const tractorGroup = new THREE.Group();
  // ... (tractor creation code remains the same)
  // Body
  const bodyGeometry = new THREE.BoxGeometry(4, 2, 2.5);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.6, metalness: 0.4 }); // Red color
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 1;
  body.castShadow = true;
  tractorGroup.add(body);
  // Cabin
  const cabinGeometry = new THREE.BoxGeometry(1.8, 1.5, 2);
  const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0xaaddff, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.7 }); // Light blue, semi-transparent
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.set(-0.8, 2.25, 0);
  cabin.castShadow = true;
  tractorGroup.add(cabin);
  // Wheels
  const wheelRadius = 0.8;
  const wheelThickness = 0.5;
  const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.1 }); // Dark grey/black
  const wheelPositions = [
    { x: 1.5, y: 0.8, z: 1.5 }, { x: 1.5, y: 0.8, z: -1.5 },
    { x: -1.5, y: 0.8, z: 1.5 }, { x: -1.5, y: 0.8, z: -1.5 },
  ];
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(pos.x, pos.y, pos.z);
    wheel.castShadow = true;
    tractorGroup.add(wheel);
  });
  return tractorGroup;
};

// Helper function to create a cotton bale
const createCottonBale = () => {
  const baleRadius = 1;
  const baleHeight = 1.5;
  const baleGeometry = new THREE.CylinderGeometry(baleRadius, baleRadius, baleHeight, 16);
  const baleMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0e0, roughness: 0.9, metalness: 0.0 }); // Off-white
  const bale = new THREE.Mesh(baleGeometry, baleMaterial);
  bale.rotation.z = Math.PI / 2; // Lay it on its side
  bale.castShadow = true;
  return bale;
};

// Helper function to create a simple person model
const createPerson = (color = 0x0077cc) => {
  const personGroup = new THREE.Group();
  // ... (person creation code remains the same)
  const torsoHeight = 0.8;
  const headRadius = 0.25;
  // Torso
  const torsoGeometry = new THREE.CylinderGeometry(0.3, 0.25, torsoHeight, 8);
  const torsoMaterial = new THREE.MeshStandardMaterial({ color: color, roughness: 0.8, metalness: 0.1 });
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
  torso.position.y = torsoHeight / 2;
  torso.castShadow = true;
  personGroup.add(torso);
  // Head
  const headGeometry = new THREE.SphereGeometry(headRadius, 12, 12);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.7, metalness: 0.1 });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = torsoHeight + headRadius * 0.9;
  head.castShadow = true;
  personGroup.add(head);
  return personGroup;
};

// Helper function to create simple bushes
const createBush = () => {
    const bushGroup = new THREE.Group();
    const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.9 }); // Forest green

    // Create a few spheres clumped together
    for (let i = 0; i < 5; i++) {
        const radius = Math.random() * 0.4 + 0.3;
        const sphereGeo = new THREE.SphereGeometry(radius, 8, 8);
        const sphere = new THREE.Mesh(sphereGeo, bushMaterial);
        sphere.position.set(
            (Math.random() - 0.5) * 0.6,
            radius * 0.6, // Position slightly above ground
            (Math.random() - 0.5) * 0.6
        );
        sphere.castShadow = true;
        bushGroup.add(sphere);
    }
    return bushGroup;
}

export const createCottonField = ({ scene }: ModelProps) => {
  if (!scene) return;

  const fieldSize = 40;
  const plantSpacing = 4;
  const plantsPerRow = Math.floor(fieldSize / plantSpacing) + 1;
  const totalPlants = plantsPerRow * plantsPerRow;

  // --- Environment Setup (Ideally done outside this function in SceneSetup) ---

  // Improved Lighting
  scene.children = scene.children.filter(child => !(child instanceof THREE.Light)); // Remove existing lights if any
  const ambientLight = new THREE.AmbientLight(0xabcdef, 0.3); // Soft blueish ambient light
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.6); // Sky yellow, ground blueish, intensity
  scene.add(hemisphereLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // White directional light
  directionalLight.position.set(15, 25, 20);
  directionalLight.castShadow = true;
  // Configure shadow properties for better quality
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -fieldSize;
  directionalLight.shadow.camera.right = fieldSize;
  directionalLight.shadow.camera.top = fieldSize;
  directionalLight.shadow.camera.bottom = -fieldSize;
  scene.add(directionalLight);
  // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
  // scene.add( helper ); // Optional: Visualize shadow camera

  // Improved Ground (Ideally done outside this function)
  scene.children = scene.children.filter(child => !(child.name === 'ground_plane')); // Remove existing ground if any
  const groundSize = 120;
  const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
  // More realistic soil color, slightly rough
  const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8b5a2b, // Darker brown soil color
      roughness: 0.95, 
      metalness: 0.1 
  }); 
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true; // Allow ground to receive shadows
  ground.name = 'ground_plane'; // Name for potential removal
  scene.add(ground);

  // Sky/Background (Set background color, Sky component is better in React)
  scene.background = new THREE.Color(0x87ceeb); // Sky blue background
  // For a better sky, use <Sky/> from drei in your React component:
  // <Canvas>
  //   <Sky distance={450000} sunPosition={[15, 25, 20]} inclination={0} azimuth={0.25} />
  //   <SceneSetup /> 
  //   {/* ... rest of your scene */}
  // </Canvas>

  // --- Define Geometries and Materials Once ---
  // ... (Plant, Irrigation geometries/materials remain the same)
  const baseGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.9, metalness: 0.0 });
  const branchGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 6);
  const bollGeometry = new THREE.SphereGeometry(0.3, 10, 10);
  const bollMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, metalness: 0.0 });
  const fiberGeometry = new THREE.SphereGeometry(0.15, 6, 6);
  const fiberMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 1.0, metalness: 0.0, transparent: true, opacity: 0.8 });
  const leafGeometry = new THREE.PlaneGeometry(0.4, 0.4);
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide });
  const pipeRadius = 0.1;
  const pipeLength = fieldSize + plantSpacing;
  const pipeGeometry = new THREE.CylinderGeometry(pipeRadius, pipeRadius, pipeLength, 12);
  const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4, metalness: 0.6 });
  const sprinklerHeight = 0.5;
  const sprinklerGeometry = new THREE.ConeGeometry(0.15, sprinklerHeight, 8);
  const sprinklerMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6, metalness: 0.4 });

  // --- Create Instanced Meshes for Cotton Plants ---
  const branchesPerPlant = 3;
  const bollsPerPlant = 3;
  const fibersPerBoll = 2;
  const leavesPerPlant = 4;

  const baseInstances = createInstancedPart(baseGeometry, baseMaterial, totalPlants);
  const branchInstances = createInstancedPart(branchGeometry, baseMaterial, totalPlants * branchesPerPlant);
  const bollInstances = createInstancedPart(bollGeometry, bollMaterial, totalPlants * bollsPerPlant);
  const fiberInstances = createInstancedPart(fiberGeometry, fiberMaterial, totalPlants * bollsPerPlant * fibersPerBoll);
  const leafInstances = createInstancedPart(leafGeometry, leafMaterial, totalPlants * leavesPerPlant);

  // --- Position Plant Instances --- 
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);
  let plantIndex = 0;
  let branchIndex = 0;
  let bollIndex = 0;
  let fiberIndex = 0;
  let leafIndex = 0;

  for (let x = -fieldSize / 2; x <= fieldSize / 2; x += plantSpacing) {
    for (let z = -fieldSize / 2; z <= fieldSize / 2; z += plantSpacing) {
      // Base position
      position.set(x, 0.75, z);
      matrix.compose(position, quaternion, scale);
      baseInstances.setMatrixAt(plantIndex, matrix);

      // Branches, Bolls, Fibers, Leaves positioning (remains the same)
      for (let i = 0; i < branchesPerPlant; i++) {
        const angle = (i / branchesPerPlant) * Math.PI * 2;
        const branchPos = new THREE.Vector3(x + Math.cos(angle) * 0.3, 1.2, z + Math.sin(angle) * 0.3);
        const branchQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, Math.PI / 4 + (Math.random() * Math.PI / 4)));
        matrix.compose(branchPos, branchQuat, scale);
        branchInstances.setMatrixAt(branchIndex++, matrix);
      }
      for (let i = 0; i < bollsPerPlant; i++) {
        const angle = (i / bollsPerPlant) * Math.PI * 2;
        const radius = 0.3 + Math.random() * 0.2;
        const bollPos = new THREE.Vector3(x + Math.cos(angle) * radius, 1.5 + Math.random() * 0.5, z + Math.sin(angle) * radius);
        matrix.compose(bollPos, quaternion, scale);
        bollInstances.setMatrixAt(bollIndex++, matrix);
        for (let j = 0; j < fibersPerBoll; j++) {
          const fiberPos = bollPos.clone();
          fiberPos.y += 0.1;
          fiberPos.x += Math.random() * 0.2 - 0.1;
          fiberPos.z += Math.random() * 0.2 - 0.1;
          const fiberScale = new THREE.Vector3(0.7, 0.7, 0.7);
          matrix.compose(fiberPos, quaternion, fiberScale);
          fiberInstances.setMatrixAt(fiberIndex++, matrix);
        }
      }
      for (let i = 0; i < leavesPerPlant; i++) {
        const leafPos = new THREE.Vector3(x + Math.random() * 0.6 - 0.3, 0.8 + Math.random() * 1.0, z + Math.random() * 0.6 - 0.3);
        const leafQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));
        matrix.compose(leafPos, leafQuat, scale);
        leafInstances.setMatrixAt(leafIndex++, matrix);
      }

      plantIndex++;
    }
  }

  // Add Plant Instanced Meshes to the scene
  scene.add(baseInstances);
  scene.add(branchInstances);
  scene.add(bollInstances);
  scene.add(fiberInstances);
  scene.add(leafInstances);

  // --- Add Irrigation System --- 
  const irrigationGroup = new THREE.Group();
  const sprinklerSpacing = plantSpacing * 2;
  for (let x = -fieldSize / 2; x <= fieldSize / 2; x += plantSpacing) {
    const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe.position.set(x, pipeRadius, 0);
    pipe.rotation.x = Math.PI / 2;
    pipe.castShadow = true;
    irrigationGroup.add(pipe);
    for (let z = -fieldSize / 2; z <= fieldSize / 2; z += sprinklerSpacing) {
        const sprinkler = new THREE.Mesh(sprinklerGeometry, sprinklerMaterial);
        sprinkler.position.set(x, pipeRadius * 2 + sprinklerHeight / 2, z);
        sprinkler.castShadow = true;
        irrigationGroup.add(sprinkler);
    }
  }
  scene.add(irrigationGroup);

  // --- Add Tractor --- 
  const tractor = createTractor();
  const tractorPosX = fieldSize / 2 + 5;
  const tractorPosZ = -fieldSize / 2 - 5;
  tractor.position.set(tractorPosX, 0, tractorPosZ);
  tractor.rotation.y = -Math.PI / 4;
  scene.add(tractor);

  // --- Add Cotton Bales --- 
  const baleGroup = new THREE.Group();
  const numBales = 15;
  const facilityPosX = fieldSize / 2 + 10;
  const facilityPosZ = fieldSize / 2 + 10;
  for (let i = 0; i < numBales; i++) {
    const bale = createCottonBale();
    let posX, posZ;
    if (i < numBales * 0.5) { // Near facility
      posX = facilityPosX - 5 + (Math.random() - 0.5) * 8;
      posZ = facilityPosZ - 5 + (Math.random() - 0.5) * 8;
    } else if (i < numBales * 0.8) { // Near tractor
      posX = tractorPosX + (Math.random() - 0.5) * 6;
      posZ = tractorPosZ + (Math.random() - 0.5) * 6;
    } else { // Scattered elsewhere
      posX = (Math.random() - 0.5) * fieldSize * 0.8;
      posZ = fieldSize / 2 + Math.random() * 5 + 2;
    }
    bale.position.set(posX, 1, posZ);
    bale.rotation.y = Math.random() * Math.PI;
    baleGroup.add(bale);
  }
  scene.add(baleGroup);



  // --- Add Extra Vegetation (Bushes) --- 
  const bushGroup = new THREE.Group();
  const numBushes = 25;
  const fieldEdge = fieldSize / 2 + plantSpacing;
  for (let i = 0; i < numBushes; i++) {
      const bush = createBush();
      let posX, posZ;
      const side = Math.floor(Math.random() * 4); // 0: +X, 1: -X, 2: +Z, 3: -Z
      const offset = (Math.random() - 0.5) * fieldSize * 1.1; // Position along the edge
      const spread = Math.random() * 5 + 1; // How far from the edge

      if (side === 0) { posX = fieldEdge + spread; posZ = offset; }
      else if (side === 1) { posX = -fieldEdge - spread; posZ = offset; }
      else if (side === 2) { posX = offset; posZ = fieldEdge + spread; }
      else { posX = offset; posZ = -fieldEdge - spread; }

      bush.position.set(posX, 0, posZ);
      bush.rotation.y = Math.random() * Math.PI * 2;
      bush.scale.set(1.5, 1.5, 1.5); // Make bushes a bit larger
      bushGroup.add(bush);
  }
  scene.add(bushGroup);

  // --- Clouds Component (React part - Needs to be rendered in React) ---
  const CloudsComponent: React.FC = () => {
    const cloudData = useRef<{ position: [number, number, number]; scale: [number, number, number] }[]>([]);
    useEffect(() => {
      if (cloudData.current.length === 0) {
        cloudData.current = Array.from({ length: 12 }).map(() => ({ // More clouds
          position: [ Math.random() * 100 - 50, 15 + Math.random() * 10, Math.random() * 100 - 50 ], // Wider area, higher
          scale: [Math.random() * 4 + 3, Math.random() * 2 + 1.5, Math.random() * 4 + 3]
        }));
      }
    }, []);

    return (
      <group>
        {cloudData.current.map((cloud, i) => (
          <Cloud 
            key={i} 
            position={new THREE.Vector3(...cloud.position)}
            scale={new THREE.Vector3(...cloud.scale)}
            opacity={0.7} // Slightly more opaque
            speed={0.04} 
            segments={30} // More segments for smoother clouds
            color="#ffffff" 
          />
        ))}
      </group>
    );
  };
  // Note: Render <CloudsComponent /> within your main React component's JSX.

  // --- Processing Facility ---
  const facilityGeometry = new THREE.BoxGeometry(12, 6, 8);
  const facilityMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.7, metalness: 0.2 });
  const facility = new THREE.Mesh(facilityGeometry, facilityMaterial);
  facility.position.set(facilityPosX, 3, facilityPosZ);
  facility.castShadow = true;
  scene.add(facility);

  const roofGeometry = new THREE.BoxGeometry(14, 1, 10);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x607d8b, roughness: 0.8, metalness: 0.3 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(facilityPosX, 6.5, facilityPosZ);
  roof.castShadow = true;
  scene.add(roof);
};



export default createCottonField;

