import * as THREE from 'three';
import { ModelProps } from './types';

export const createFishFarm = ({ scene }: ModelProps) => {
  if (!scene) return;

  // Criar textura de solo para a área
  const groundTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/terrain/grasslight-big.jpg');
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(25, 25);
  groundTexture.anisotropy = 16;
  
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    roughness: 0.8,
    metalness: 0.1,
    color: 0x8B8558 // Marrom claro para área de piscicultura
  });
  
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMaterial
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Criar sistema de piscicultura baseado na imagem de referência
  // Sistema hidropônico vertical com tanque azul circular na base
  
  // Tanque principal azul circular
  const tankGeometry = new THREE.CylinderGeometry(8, 8, 2, 32);
  const tankMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1e88e5, // Azul como na imagem
    roughness: 0.7,
    metalness: 0.3
  });
  const tank = new THREE.Mesh(tankGeometry, tankMaterial);
  tank.position.set(0, 1, 0);
  tank.castShadow = true;
  tank.receiveShadow = true;
  scene.add(tank);
  
  // Água dentro do tanque
  const waterGeometry = new THREE.CylinderGeometry(7.8, 7.8, 1.8, 32);
  const waterMaterial = new THREE.MeshPhysicalMaterial({ 
    color: 0x64b5f6,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.8,
    transmission: 0.5
  });
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.position.set(0, 1, 0);
  scene.add(water);
  
  // Estrutura de suporte vertical (madeira)
  const supportGeometry = new THREE.BoxGeometry(16, 8, 0.5);
  const supportMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8d6e63, // Madeira
    roughness: 0.9,
    metalness: 0.1
  });
  const support = new THREE.Mesh(supportGeometry, supportMaterial);
  support.position.set(0, 5, -2);
  support.castShadow = true;
  support.receiveShadow = true;
  scene.add(support);
  
  // Adicionar tubos horizontais de PVC (brancos)
  const tubeCount = 4; // 4 níveis como na imagem
  
  for (let i = 0; i < tubeCount; i++) {
    const tubeGeometry = new THREE.CylinderGeometry(0.8, 0.8, 14, 16);
    const tubeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, // Branco como na imagem
      roughness: 0.8,
      metalness: 0.2
    });
    
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tube.rotation.z = Math.PI / 2; // Rotacionar para horizontal
    tube.position.set(0, 2 + i * 2, -2); // Posicionar em níveis
    tube.castShadow = true;
    tube.receiveShadow = true;
    scene.add(tube);
    
    // Adicionar plantas em cada tubo (alface/verduras)
    const plantsPerTube = 7; // 7 plantas por tubo como na imagem
    
    for (let j = 0; j < plantsPerTube; j++) {
      const plantGroup = new THREE.Group();
      
      // Posição ao longo do tubo
      const xPos = -6 + j * 2;
      plantGroup.position.set(xPos, 2 + i * 2 + 0.8, -2);
      
      // Criar folhas de alface
      const leafCount = 8 + Math.floor(Math.random() * 5);
      
      for (let k = 0; k < leafCount; k++) {
        const leafGeometry = new THREE.PlaneGeometry(0.6 + Math.random() * 0.4, 0.3 + Math.random() * 0.2);
        const leafMaterial = new THREE.MeshStandardMaterial({
          color: 0x7cb342, // Verde claro como na imagem
          roughness: 0.9,
          metalness: 0.0,
          side: THREE.DoubleSide
        });
        
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        
        // Distribuir folhas em círculo
        const angle = (k / leafCount) * Math.PI * 2;
        const radius = 0.3 + Math.random() * 0.2;
        
        leaf.position.set(
          Math.cos(angle) * radius * 0.5,
          Math.random() * 0.2,
          Math.sin(angle) * radius
        );
        
        // Rotacionar folhas para parecerem naturais
        leaf.rotation.x = Math.random() * Math.PI / 2;
        leaf.rotation.y = Math.random() * Math.PI * 2;
        leaf.rotation.z = Math.random() * Math.PI / 4;
        
        plantGroup.add(leaf);
      }
      
      scene.add(plantGroup);
    }
    
    // Adicionar aberturas nos tubos para as plantas
    for (let j = 0; j < plantsPerTube; j++) {
      const holeGeometry = new THREE.CircleGeometry(0.4, 16);
      const holeMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        side: THREE.DoubleSide
      });
      
      const hole = new THREE.Mesh(holeGeometry, holeMaterial);
      
      // Posição ao longo do tubo
      const xPos = -6 + j * 2;
      
      // Posicionar na parte superior do tubo
      hole.position.set(xPos, 2 + i * 2, -1.2);
      hole.rotation.x = Math.PI / 2;
      
      scene.add(hole);
    }
  }
  
  // Adicionar tubos de conexão vertical
  for (let i = 0; i < tubeCount - 1; i++) {
    const connectorGeometry = new THREE.CylinderGeometry(0.4, 0.4, 2, 12);
    const connectorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.2
    });
    
    // Conector na extremidade direita
    const connectorRight = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connectorRight.position.set(6.5, 3 + i * 2, -2);
    scene.add(connectorRight);
    
    // Conector na extremidade esquerda
    const connectorLeft = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connectorLeft.position.set(-6.5, 3 + i * 2, -2);
    scene.add(connectorLeft);
  }
  
  // Adicionar tubos de conexão com o tanque
  const mainPipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 12);
  const mainPipeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.2
  });
  
  // Tubo principal de alimentação
  const mainPipe = new THREE.Mesh(mainPipeGeometry, mainPipeMaterial);
  mainPipe.position.set(-7, 4, -2);
  scene.add(mainPipe);
  
  // Tubo de retorno ao tanque
  const returnPipeGeometry = new THREE.CylinderGeometry(0.6, 0.6, 8, 12);
  const returnPipe = new THREE.Mesh(returnPipeGeometry, mainPipeMaterial);
  returnPipe.position.set(7, 5, -2);
  scene.add(returnPipe);
  
  // Curva do tubo de retorno para o tanque
  const curvePipeGeometry = new THREE.TorusGeometry(2, 0.6, 12, 12, Math.PI / 2);
  const curvePipe = new THREE.Mesh(curvePipeGeometry, mainPipeMaterial);
  curvePipe.position.set(5, 1, -2);
  curvePipe.rotation.z = Math.PI / 2;
  scene.add(curvePipe);
  
  // Bomba de água
  const pumpGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
  const pumpMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x424242,
    roughness: 0.7,
    metalness: 0.5
  });
  const pump = new THREE.Mesh(pumpGeometry, pumpMaterial);
  pump.position.set(-5, 0.5, 3);
  scene.add(pump);
  
  // Tubo da bomba para o sistema
  const pumpPipeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 5, 8);
  const pumpPipe = new THREE.Mesh(pumpPipeGeometry, mainPipeMaterial);
  pumpPipe.position.set(-6, 3, 1);
  pumpPipe.rotation.z = Math.PI / 4;
  scene.add(pumpPipe);
  
  // Adicionar algumas plantas aquáticas no tanque
  for (let i = 0; i < 5; i++) {
    const aquaticPlantGroup = new THREE.Group();
    
    // Posição aleatória no tanque
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 6;
    
    aquaticPlantGroup.position.set(
      Math.cos(angle) * radius,
      0.2,
      Math.sin(angle) * radius
    );
    
    // Caule da planta
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x33691e,
      roughness: 0.9,
      metalness: 0.0
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.75;
    aquaticPlantGroup.add(stem);
    
    // Folhas da planta
    const aquaticLeafCount = 5;
    for (let j = 0; j < aquaticLeafCount; j++) {
      const leafGeometry = new THREE.PlaneGeometry(0.5, 0.2);
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x558b2f,
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.DoubleSide
      });
      
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      const leafAngle = (j / aquaticLeafCount) * Math.PI * 2;
      const leafHeight = 0.5 + j * 0.2;
      
      leaf.position.set(
        Math.cos(leafAngle) * 0.2,
        leafHeight,
        Math.sin(leafAngle) * 0.2
      );
      
      leaf.rotation.x = Math.PI / 4;
      leaf.rotation.y = leafAngle;
      
      aquaticPlantGroup.add(leaf);
    }
    
    scene.add(aquaticPlantGroup);
  }
  
  // Adicionar pequenos peixes no tanque
  for (let i = 0; i < 10; i++) {
    const fishGroup = new THREE.Group();
    
    // Posição aleatória no tanque
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 6;
    
    fishGroup.position.set(
      Math.cos(angle) * radius,
      0.5 + Math.random() * 0.5,
      Math.sin(angle) * radius
    );
    
    // Corpo do peixe simplificado
    const fishGeometry = new THREE.CapsuleGeometry(0.15, 0.4, 8, 8);
    const fishMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x90caf9,
      roughness: 0.7,
      metalness: 0.3
    });
    
    const fish = new THREE.Mesh(fishGeometry, fishMaterial);
    fish.rotation.y = Math.random() * Math.PI * 2;
    fishGroup.add(fish);
    
    // Cauda do peixe
    const tailGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
    const tailMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x64b5f6,
      roughness: 0.8,
      metalness: 0.2
    });
    
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(-0.35, 0, 0);
    tail.rotation.y = Math.PI;
    fishGroup.add(tail);
    
    scene.add(fishGroup);
  }
  
  // Adicionar alguns elementos decorativos ao redor
  
  // Balde de nutrientes
  const bucketGeometry = new THREE.CylinderGeometry(1, 0.8, 1.5, 16);
  const bucketMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf57f17,
    roughness: 0.8,
    metalness: 0.2
  });
  const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
  bucket.position.set(-8, 0.75, 5);
  scene.add(bucket);
  
  // Ferramentas de jardinagem
  const toolHandleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
  const toolHandleMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8d6e63,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const toolHead1Geometry = new THREE.BoxGeometry(0.5, 0.1, 0.8);
  const toolHeadMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x9e9e9e,
    roughness: 0.7,
    metalness: 0.5
  });
  
  // Pá
  const shovelGroup = new THREE.Group();
  shovelGroup.position.set(8, 1.5, 5);
  shovelGroup.rotation.z = Math.PI / 4;
  
  const shovelHandle = new THREE.Mesh(toolHandleGeometry, toolHandleMaterial);
  shovelGroup.add(shovelHandle);
  
  const shovelHead = new THREE.Mesh(toolHead1Geometry, toolHeadMaterial);
  shovelHead.position.set(0, -1.5, 0);
  shovelHead.rotation.x = Math.PI / 2;
  shovelGroup.add(shovelHead);
  
  scene.add(shovelGroup);
  
  // Adicionar algumas plantas em vasos ao redor
  for (let i = 0; i < 3; i++) {
    const potGroup = new THREE.Group();
    potGroup.position.set(-10 + i * 10, 0, -8);
    
    // Vaso
    const potGeometry = new THREE.CylinderGeometry(0.8, 0.6, 1.2, 12);
    const potMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe57373,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = 0.6;
    potGroup.add(pot);
    
    // Terra no vaso
    const soilGeometry = new THREE.CylinderGeometry(0.75, 0.75, 0.2, 12);
    const soilMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x5d4037,
      roughness: 1.0,
      metalness: 0.0
    });
    
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = 1.1;
    potGroup.add(soil);
    
    // Planta no vaso
    const potPlantGroup = new THREE.Group();
    potPlantGroup.position.y = 1.2;
    
    // Caule
    const potStemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 8);
    const potStemMaterial = new THREE.MeshStandardMaterial({
      color: 0x33691e,
      roughness: 0.9,
      metalness: 0.0
    });
    
    const potStem = new THREE.Mesh(potStemGeometry, potStemMaterial);
    potStem.position.y = 0.5;
    potPlantGroup.add(potStem);
    
    // Folhas
    for (let j = 0; j < 5; j++) {
      const potLeafGeometry = new THREE.PlaneGeometry(0.4, 0.2);
      const potLeafMaterial = new THREE.MeshStandardMaterial({
        color: 0x66bb6a,
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.DoubleSide
      });
      
      const potLeaf = new THREE.Mesh(potLeafGeometry, potLeafMaterial);
      
      const leafAngle = (j / 5) * Math.PI * 2;
      const leafHeight = 0.3 + j * 0.15;
      
      potLeaf.position.set(
        Math.cos(leafAngle) * 0.2,
        leafHeight,
        Math.sin(leafAngle) * 0.2
      );
      
      potLeaf.rotation.x = Math.PI / 4;
      potLeaf.rotation.y = leafAngle;
      
      potPlantGroup.add(potLeaf);
    }
    
    potGroup.add(potPlantGroup);
    scene.add(potGroup);
  }
};
