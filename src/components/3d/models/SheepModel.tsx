import * as THREE from 'three';
import { ModelProps } from './types';

export const createSheepFarm = ({ scene }: ModelProps) => {
  if (!scene) return;

  // Criar textura de solo para a área de pastagem
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

  // Criar cerca ao redor do pasto
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
  const postSpacing = 12; // Espaçamento maior para menos postes
  
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

  // Criar grupo de ovelhas baseado na imagem de referência
  // Ovelhas agrupadas pastando em campo verde
  const sheepCount = 12; // Número de ovelhas no grupo
  
  // Criar grupo principal de ovelhas
  const flock = new THREE.Group();
  flock.position.set(0, 0, 0);
  
  // Posições em formato de grupo compacto como na imagem
  for (let i = 0; i < sheepCount; i++) {
    // Posição em grupo compacto, todas na mesma direção
    const row = Math.floor(i / 4);
    const col = i % 4;
    const x = col * 1.5 - 2.25;
    const z = row * 1.5 - 2;
    
    // Pequena variação aleatória na posição para naturalidade
    const xOffset = Math.random() * 0.5 - 0.25;
    const zOffset = Math.random() * 0.5 - 0.25;
    
    // Grupo para cada ovelha
    const sheepGroup = new THREE.Group();
    sheepGroup.position.set(x + xOffset, 0, z + zOffset);
    
    // Todas as ovelhas na imagem são brancas
    const woolColor = new THREE.Color().setHSL(0.1, 0.05, 0.95);
    
    // Corpo principal com geometria otimizada
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.0, 10, 10);
    const woolMaterial = new THREE.MeshStandardMaterial({ 
      color: woolColor,
      roughness: 1.0,
      metalness: 0.0
    });
    
    const body = new THREE.Mesh(bodyGeometry, woolMaterial);
    body.position.y = 0.7;
    body.rotation.x = Math.PI / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    sheepGroup.add(body);

    // Cabeça com geometria simplificada
    const headGeometry = new THREE.SphereGeometry(0.3, 12, 12);
    
    // Cor da cabeça (mais escura que a lã)
    const headColor = new THREE.Color(woolColor).multiplyScalar(0.7);
    
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: headColor,
      roughness: 0.8,
      metalness: 0.1
    });
    
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0.8, 0.8, 0);
    head.castShadow = true;
    head.receiveShadow = true;
    sheepGroup.add(head);
    
    // Focinho
    const muzzleGeometry = new THREE.CapsuleGeometry(0.12, 0.25, 8, 8);
    const muzzleMaterial = new THREE.MeshStandardMaterial({
      color: headColor.clone().multiplyScalar(0.8),
      roughness: 0.9,
      metalness: 0.0
    });
    
    const muzzle = new THREE.Mesh(muzzleGeometry, muzzleMaterial);
    muzzle.position.set(1.05, 0.75, 0);
    muzzle.rotation.z = Math.PI / 2;
    muzzle.castShadow = true;
    sheepGroup.add(muzzle);
    
    // Olhos
    for (let side = -1; side <= 1; side += 2) {
      if (side === 0) continue; // Pular o meio
      
      const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
      const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000
      });
      
      const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      eye.position.set(0.95, 0.9, side * 0.12);
      sheepGroup.add(eye);
    }
    
    // Orelhas simplificadas
    for (let side = -1; side <= 1; side += 2) {
      if (side === 0) continue; // Pular o meio
      
      const earGeometry = new THREE.CapsuleGeometry(0.06, 0.15, 6, 6);
      const earMaterial = new THREE.MeshStandardMaterial({ 
        color: headColor,
        roughness: 0.8,
        metalness: 0.1
      });
      
      const ear = new THREE.Mesh(earGeometry, earMaterial);
      ear.position.set(0.8, 1.0, side * 0.2);
      ear.rotation.z = Math.PI / 4;
      ear.rotation.x = side * Math.PI / 8;
      ear.castShadow = true;
      sheepGroup.add(ear);
    }

    // Pernas com geometria simplificada
    const legMaterial = new THREE.MeshStandardMaterial({ 
      color: headColor,
      roughness: 0.9,
      metalness: 0.0
    });
    
    // Posições das pernas
    const legPositions = [
      { x: 0.4, z: 0.3 },  // Frente direita
      { x: 0.4, z: -0.3 }, // Frente esquerda
      { x: -0.4, z: 0.3 }, // Traseira direita
      { x: -0.4, z: -0.3 } // Traseira esquerda
    ];
    
    legPositions.forEach((pos) => {
      const legGeometry = new THREE.CapsuleGeometry(0.08, 0.7, 6, 6);
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos.x, 0.35, pos.z);
      leg.castShadow = true;
      leg.receiveShadow = true;
      sheepGroup.add(leg);
    });
    
    // Adicionar lã volumosa com menos detalhes para otimização
    const woolPuffCount = 8;
    
    for (let j = 0; j < woolPuffCount; j++) {
      const woolPuffGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.1, 6, 6);
      const woolPuff = new THREE.Mesh(woolPuffGeometry, woolMaterial);
      
      // Distribuir os tufos de lã ao redor do corpo
      const angle = (j / woolPuffCount) * Math.PI * 2;
      const radius = 0.5;
      const height = 0.7 + Math.random() * 0.2;
      
      woolPuff.position.set(
        Math.cos(angle) * radius * 0.8,
        height,
        Math.sin(angle) * radius * 0.8
      );
      
      woolPuff.castShadow = true;
      woolPuff.receiveShadow = true;
      sheepGroup.add(woolPuff);
    }
    
    // Todas as ovelhas com cabeça baixa pastando como na imagem
    sheepGroup.children.forEach(child => {
      if (child.position.x > 0.5) { // Componentes da cabeça
        child.position.y -= 0.4;
      }
    });
    
    // Todas as ovelhas na mesma direção como na imagem
    sheepGroup.rotation.y = Math.PI * 0.75;
    
    flock.add(sheepGroup);
  }
  
  // Posicionar o grupo de ovelhas em uma área específica do pasto
  flock.position.set(10, 0, 5);
  scene.add(flock);

  // Adicionar abrigo simplificado
  const shelterGroup = new THREE.Group();
  shelterGroup.position.set(-20, 0, -15);
  
  // Estrutura principal
  const shelterGeometry = new THREE.BoxGeometry(8, 4, 6);
  const shelterMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8b4513,
    roughness: 0.8,
    metalness: 0.1
  });
  const shelter = new THREE.Mesh(shelterGeometry, shelterMaterial);
  shelter.position.y = 2;
  shelter.castShadow = true;
  shelter.receiveShadow = true;
  shelterGroup.add(shelter);

  // Telhado simplificado
  const roofGeometry = new THREE.ConeGeometry(6, 2.5, 4);
  const roofMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x654321,
    roughness: 0.9,
    metalness: 0.1
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 5.25;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  shelterGroup.add(roof);
  
  scene.add(shelterGroup);
  
  // Adicionar árvores na borda da pastagem como na imagem
  const treeCount = 15;
  
  for (let i = 0; i < treeCount; i++) {
    const treeGroup = new THREE.Group();
    
    // Posicionar árvores na borda da pastagem
    const angle = (i / treeCount) * Math.PI * 2;
    const radius = 40 + Math.random() * 10;
    
    treeGroup.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
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
  for (let i = 0; i < 5; i++) {
    const hillLargeGeometry = new THREE.SphereGeometry(20 + Math.random() * 10, 16, 16);
    const hillLargeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4c7031,
      roughness: 0.9,
      metalness: 0.0
    });
    
    const hillLarge = new THREE.Mesh(hillLargeGeometry, hillLargeMaterial);
    
    // Posicionar colinas ao fundo
    const angle = (i / 5) * Math.PI + Math.PI / 2;
    const radius = 70;
    
    hillLarge.position.set(
      Math.cos(angle) * radius,
      -15,
      Math.sin(angle) * radius
    );
    
    hillLarge.scale.y = 0.5;
    hillLarge.receiveShadow = true;
    scene.add(hillLarge);
  }
};
