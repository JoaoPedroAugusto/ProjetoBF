import * as THREE from 'three';
import { ModelProps } from './types';

export const createCattleFarm = ({ scene }: ModelProps) => {
  if (!scene) return;

  // Criar textura de solo para pastagem
  const groundTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/terrain/grasslight-big.jpg');
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(25, 25);
  groundTexture.anisotropy = 16;
  
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    roughness: 0.8,
    metalness: 0.1,
    color: 0x4c7031 // Verde pastagem
  });
  
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMaterial
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Adicionar variações no terreno (pequenas elevações)
  for (let i = 0; i < 20; i++) { // Reduzido para otimização
    const hillGeometry = new THREE.SphereGeometry(5 + Math.random() * 10, 12, 12); // Geometria simplificada
    const hillMaterial = new THREE.MeshStandardMaterial({
      map: groundTexture,
      roughness: 0.9,
      metalness: 0.0,
      color: 0x4c7031
    });
    
    const hill = new THREE.Mesh(hillGeometry, hillMaterial);
    hill.position.set(
      Math.random() * 100 - 50,
      -4.5 + Math.random() * 1.5,
      Math.random() * 100 - 50
    );
    hill.scale.y = 0.2;
    hill.receiveShadow = true;
    scene.add(hill);
  }

  // Adicionar áreas de solo exposto
  for (let i = 0; i < 15; i++) { // Reduzido para otimização
    const patchGeometry = new THREE.CircleGeometry(1 + Math.random() * 2, 12);
    const patchMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 1.0,
      metalness: 0.0
    });
    
    const patch = new THREE.Mesh(patchGeometry, patchMaterial);
    patch.position.set(
      Math.random() * 80 - 40,
      0.01, // Ligeiramente acima do solo
      Math.random() * 80 - 40
    );
    patch.rotation.x = -Math.PI / 2;
    patch.receiveShadow = true;
    scene.add(patch);
  }

  // Criar grupo de gado baseado na imagem de referência
  // Gado de diferentes cores pastando em campo verde com árvores ao fundo
  const cattleCount = 8; // Número reduzido para otimização
  
  // Criar grupo principal de gado
  const herd = new THREE.Group();
  
  // Posições em linha como na imagem de referência
  for (let i = 0; i < cattleCount; i++) {
    // Posição em linha com pequeno deslocamento
    const x = i * 3 - (cattleCount * 3) / 2 + Math.random() * 1 - 0.5;
    const z = Math.random() * 4 - 2;
    
    // Grupo para o animal completo
    const cow = new THREE.Group();
    cow.position.set(x, 0, z);
    
    // Cores variadas como na imagem (marrom, branco, malhado)
    const colorIndex = i % 4;
    let cowColor;
    
    if (colorIndex === 0) {
      // Marrom
      cowColor = new THREE.Color(0x8B4513);
    } else if (colorIndex === 1) {
      // Branco
      cowColor = new THREE.Color(0xF5F5DC);
    } else if (colorIndex === 2) {
      // Marrom avermelhado
      cowColor = new THREE.Color(0xA0522D);
    } else {
      // Malhado (base branca)
      cowColor = new THREE.Color(0xF5F5DC);
    }
    
    // Corpo principal com geometria simplificada
    const bodyGeometry = new THREE.CapsuleGeometry(0.8, 1.8, 12, 12);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: cowColor,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.5;
    body.rotation.z = Math.PI / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    cow.add(body);
    
    // Adicionar manchas para vacas malhadas
    if (colorIndex === 3) {
      for (let j = 0; j < 5; j++) {
        const spotGeometry = new THREE.CircleGeometry(0.3 + Math.random() * 0.3, 8);
        const spotMaterial = new THREE.MeshStandardMaterial({
          color: 0x8B4513,
          roughness: 0.9,
          metalness: 0.1,
          side: THREE.DoubleSide
        });
        
        const spot = new THREE.Mesh(spotGeometry, spotMaterial);
        
        // Posição aleatória no corpo
        const angle = Math.random() * Math.PI * 2;
        spot.position.set(
          Math.cos(angle) * 0.7,
          1.5 + Math.random() * 0.5 - 0.25,
          Math.sin(angle) * 0.7
        );
        
        // Rotação para acompanhar a curvatura do corpo
        spot.lookAt(cow.position);
        spot.rotation.y += Math.PI / 2;
        
        cow.add(spot);
      }
    }
    
    // Pescoço simplificado
    const neckGeometry = new THREE.CapsuleGeometry(0.4, 0.8, 10, 10);
    const neck = new THREE.Mesh(neckGeometry, bodyMaterial);
    neck.position.set(1.2, 1.7, 0);
    neck.rotation.z = Math.PI / 4;
    neck.castShadow = true;
    neck.receiveShadow = true;
    cow.add(neck);

    // Cabeça simplificada
    const headGeometry = new THREE.CapsuleGeometry(0.4, 0.8, 10, 10);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(1.8, 2.0, 0);
    head.rotation.z = Math.PI / 2;
    head.castShadow = true;
    head.receiveShadow = true;
    cow.add(head);
    
    // Focinho
    const muzzleGeometry = new THREE.CapsuleGeometry(0.25, 0.4, 8, 8);
    const muzzleMaterial = new THREE.MeshStandardMaterial({
      color: cowColor.clone().multiplyScalar(0.8),
      roughness: 1.0,
      metalness: 0.0
    });
    
    const muzzle = new THREE.Mesh(muzzleGeometry, muzzleMaterial);
    muzzle.position.set(2.3, 2.0, 0);
    muzzle.rotation.z = Math.PI / 2;
    muzzle.castShadow = true;
    cow.add(muzzle);
    
    // Olhos simplificados
    for (let side = -1; side <= 1; side += 2) {
      if (side === 0) continue; // Pular o meio
      
      const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000
      });
      
      const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      eye.position.set(2.0, 2.2, side * 0.2);
      cow.add(eye);
    }
    
    // Orelhas simplificadas
    for (let side = -1; side <= 1; side += 2) {
      if (side === 0) continue; // Pular o meio
      
      const earGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
      const ear = new THREE.Mesh(earGeometry, bodyMaterial);
      ear.position.set(1.7, 2.4, side * 0.3);
      ear.rotation.x = side * Math.PI / 6;
      ear.rotation.z = -Math.PI / 3;
      ear.castShadow = true;
      cow.add(ear);
    }
    
    // Chifres (para alguns animais)
    if (Math.random() > 0.3) {
      for (let side = -1; side <= 1; side += 2) {
        if (side === 0) continue; // Pular o meio
        
        const hornGeometry = new THREE.ConeGeometry(0.08, 0.4, 8);
        const hornMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xd7ccc8,
          roughness: 0.7,
          metalness: 0.3
        });
        
        const horn = new THREE.Mesh(hornGeometry, hornMaterial);
        horn.position.set(1.7, 2.3, side * 0.2);
        horn.rotation.x = side * Math.PI / 8;
        horn.rotation.z = -Math.PI / 6;
        horn.castShadow = true;
        cow.add(horn);
      }
    }

    // Pernas simplificadas
    const legMaterial = new THREE.MeshStandardMaterial({ 
      color: cowColor,
      roughness: 0.9,
      metalness: 0.0
    });
    
    // Posições das pernas
    const legPositions = [
      { x: 0.7, z: 0.4 },  // Frente direita
      { x: 0.7, z: -0.4 }, // Frente esquerda
      { x: -0.7, z: 0.4 }, // Traseira direita
      { x: -0.7, z: -0.4 } // Traseira esquerda
    ];
    
    legPositions.forEach((pos) => {
      const legGeometry = new THREE.CapsuleGeometry(0.15, 1.2, 8, 8);
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos.x, 0.6, pos.z);
      leg.castShadow = true;
      leg.receiveShadow = true;
      cow.add(leg);
      
      // Casco
      const hoofGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.25);
      const hoofMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.9,
        metalness: 0.1
      });
      
      const hoof = new THREE.Mesh(hoofGeometry, hoofMaterial);
      hoof.position.set(pos.x, 0.05, pos.z);
      hoof.castShadow = true;
      hoof.receiveShadow = true;
      cow.add(hoof);
    });
    
    // Cauda simplificada
    const tailGeometry = new THREE.CylinderGeometry(0.08, 0.02, 1.2, 8);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(-1.0, 1.5, 0);
    tail.rotation.z = Math.PI / 4;
    tail.castShadow = true;
    cow.add(tail);
    
    // Tufo da cauda
    const tuftGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const tuftMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 1.0,
      metalness: 0.0
    });
    
    const tuft = new THREE.Mesh(tuftGeometry, tuftMaterial);
    tuft.position.set(-1.5, 1.0, 0);
    tuft.castShadow = true;
    cow.add(tuft);
    
    // Rotação aleatória para variedade
    cow.rotation.y = Math.random() * Math.PI / 4 - Math.PI / 8;
    
    herd.add(cow);
  }
  
  // Posicionar o rebanho em uma área específica do pasto
  herd.position.set(0, 0, 0);
  scene.add(herd);

  // Adicionar cerca ao redor do pasto (simplificada)
  const fenceHeight = 1.2;
  const fencePostMaterial = new THREE.MeshStandardMaterial({
    color: 0x4d3319,
    roughness: 1.0,
    metalness: 0.0
  });
  
  const fenceRailMaterial = new THREE.MeshStandardMaterial({
    color: 0x6d4c41,
    roughness: 0.9,
    metalness: 0.0
  });
  
  // Criar cerca em formato de quadrado com menos postes
  const fenceSize = 80;
  const postSpacing = 16; // Espaçamento maior para menos postes
  
  for (let i = -fenceSize/2; i <= fenceSize/2; i += postSpacing) {
    // Postes nas bordas x
    for (const z of [-fenceSize/2, fenceSize/2]) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, fenceHeight, 8),
        fencePostMaterial
      );
      post.position.set(i, fenceHeight/2, z);
      post.castShadow = true;
      post.receiveShadow = true;
      scene.add(post);
    }
    
    // Postes nas bordas z
    for (const x of [-fenceSize/2, fenceSize/2]) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, fenceHeight, 8),
        fencePostMaterial
      );
      post.position.set(x, fenceHeight/2, i);
      post.castShadow = true;
      post.receiveShadow = true;
      scene.add(post);
    }
  }
  
  // Adicionar trilhos horizontais
  for (let i = -fenceSize/2; i < fenceSize/2; i += postSpacing) {
    // Trilhos nas bordas x
    for (const z of [-fenceSize/2, fenceSize/2]) {
      for (let railHeight = 0.4; railHeight < fenceHeight; railHeight += 0.4) {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(postSpacing, 0.1, 0.05),
          fenceRailMaterial
        );
        rail.position.set(i + postSpacing/2, railHeight, z);
        rail.castShadow = true;
        rail.receiveShadow = true;
        scene.add(rail);
      }
    }
    
    // Trilhos nas bordas z
    for (const x of [-fenceSize/2, fenceSize/2]) {
      for (let railHeight = 0.4; railHeight < fenceHeight; railHeight += 0.4) {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.1, postSpacing),
          fenceRailMaterial
        );
        rail.position.set(x, railHeight, i + postSpacing/2);
        rail.castShadow = true;
        rail.receiveShadow = true;
        scene.add(rail);
      }
    }
  }
  
  // Adicionar árvores ao fundo como na imagem
  const treeCount = 20;
  
  for (let i = 0; i < treeCount; i++) {
    const treeGroup = new THREE.Group();
    
    // Posicionar árvores ao fundo como na imagem
    const angle = (i / treeCount) * Math.PI - Math.PI / 2;
    const radius = 40 + Math.random() * 10;
    
    treeGroup.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius - 20
    );
    
    // Tronco
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 5 + Math.random() * 3, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2.5;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);
    
    // Copa da árvore
    const foliageGeometry = new THREE.SphereGeometry(2 + Math.random() * 1, 8, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: 0x2E8B57,
      roughness: 0.9,
      metalness: 0.0
    });
    
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 5 + Math.random() * 2;
    foliage.scale.y = 1.2;
    foliage.castShadow = true;
    foliage.receiveShadow = true;
    treeGroup.add(foliage);
    
    scene.add(treeGroup);
  }
  
  // Adicionar colinas ao fundo como na imagem
  for (let i = 0; i < 3; i++) {
    const hillLargeGeometry = new THREE.SphereGeometry(20 + Math.random() * 10, 16, 16);
    const hillLargeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4c7031,
      roughness: 0.9,
      metalness: 0.0
    });
    
    const hillLarge = new THREE.Mesh(hillLargeGeometry, hillLargeMaterial);
    
    // Posicionar colinas ao fundo
    const angle = (i / 3) * Math.PI - Math.PI / 2;
    const radius = 70;
    
    hillLarge.position.set(
      Math.cos(angle) * radius,
      -15,
      Math.sin(angle) * radius - 20
    );
    
    hillLarge.scale.y = 0.5;
    hillLarge.receiveShadow = true;
    scene.add(hillLarge);
  }
};
