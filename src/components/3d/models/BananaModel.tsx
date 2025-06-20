import * as THREE from 'three';
import { ModelProps } from './types';

export const createBananaPlantation = ({ scene }: ModelProps) => {
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
    color: 0x3d2314 // Solo escuro e úmido para plantação de banana
  });
  
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMaterial
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Criar plantação de banana baseada na imagem de referência
  // Bananeiras com folhas grandes verdes e cachos de bananas
  
  // Reduzir a quantidade de plantas para otimização
  const plantCount = 20;
  const rows = 5;
  const cols = 4;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Posição em grade com pequena variação
      const x = -30 + col * 20 + (Math.random() - 0.5) * 5;
      const z = -30 + row * 15 + (Math.random() - 0.5) * 5;
      
      // Grupo para cada bananeira
      const bananaPlantGroup = new THREE.Group();
      bananaPlantGroup.position.set(x, 0, z);
      
      // Tronco (pseudocaule) como na imagem - cilíndrico e verde
      const trunkHeight = 3 + Math.random() * 1;
      const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.35, trunkHeight, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x81c784, // Verde claro como na imagem
        roughness: 0.9,
        metalness: 0.0
      });
      
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = trunkHeight / 2;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      bananaPlantGroup.add(trunk);
      
      // Adicionar textura ao tronco (camadas de folhas)
      for (let i = 0; i < 5; i++) {
        const layerGeometry = new THREE.CylinderGeometry(0.26, 0.36, trunkHeight * 0.2, 8);
        const layerMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x66bb6a, // Verde um pouco mais escuro
          roughness: 0.9,
          metalness: 0.0
        });
        
        const layer = new THREE.Mesh(layerGeometry, layerMaterial);
        layer.position.y = i * trunkHeight * 0.2;
        bananaPlantGroup.add(layer);
      }
      
      // Folhas grandes como na imagem
      const leafCount = 5 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < leafCount; i++) {
        // Geometria da folha - grande e alongada como na imagem
        const leafLength = 3 + Math.random() * 1;
        const leafWidth = 0.8 + Math.random() * 0.4;
        
        const leafGeometry = new THREE.PlaneGeometry(leafWidth, leafLength, 5, 10);
        
        // Adicionar curvatura natural às folhas
        const positions = leafGeometry.attributes.position;
        for (let j = 0; j < positions.count; j++) {
          const y = positions.getY(j);
          // Curvar a folha ao longo do comprimento
          if (y > 0) {
            positions.setZ(j, Math.sin(y / leafLength * Math.PI) * 0.5);
          }
        }
        
        positions.needsUpdate = true;
        
        // Cor verde vibrante como na imagem
        const leafMaterial = new THREE.MeshStandardMaterial({
          color: 0x2e7d32, // Verde escuro
          roughness: 0.9,
          metalness: 0.0,
          side: THREE.DoubleSide
        });
        
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        
        // Posicionar folhas no topo do tronco
        leaf.position.y = trunkHeight;
        
        // Distribuir folhas em círculo
        const angle = (i / leafCount) * Math.PI * 2;
        leaf.rotation.y = angle;
        
        // Inclinação para cima e para fora como na imagem
        leaf.rotation.x = -Math.PI / 3;
        
        leaf.castShadow = true;
        leaf.receiveShadow = true;
        bananaPlantGroup.add(leaf);
      }
      
      // Adicionar cacho de bananas como na imagem
      if (Math.random() > 0.3) {
        // Grupo para o cacho
        const bunchGroup = new THREE.Group();
        
        // Posicionar o cacho pendendo do topo
        bunchGroup.position.y = trunkHeight;
        
        // Talo do cacho
        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 6);
        const stemMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x8d6e63, // Marrom
          roughness: 0.9,
          metalness: 0.0
        });
        
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = -0.4;
        stem.rotation.x = Math.PI / 2;
        bunchGroup.add(stem);
        
        // Adicionar bananas em "mãos" como na imagem
        const handCount = 4 + Math.floor(Math.random() * 3);
        
        for (let j = 0; j < handCount; j++) {
          // Cada "mão" de bananas
          const handGroup = new THREE.Group();
          handGroup.position.y = -0.4 - j * 0.15;
          
          // Número de bananas por "mão"
          const bananasPerHand = 5 + Math.floor(Math.random() * 4);
          
          for (let k = 0; k < bananasPerHand; k++) {
            // Geometria da banana - curvada como na imagem
            const bananaGeometry = new THREE.CapsuleGeometry(0.04, 0.2, 6, 6);
            
            // Cor verde/amarela como na imagem
            let bananaColor;
            if (j < handCount / 3) {
              bananaColor = 0xffeb3b; // Amarelo (maduras)
            } else {
              bananaColor = 0xc5e1a5; // Verde claro (não maduras)
            }
            
            const bananaMaterial = new THREE.MeshStandardMaterial({ 
              color: bananaColor,
              roughness: 0.7,
              metalness: 0.1
            });
            
            const banana = new THREE.Mesh(bananaGeometry, bananaMaterial);
            
            // Posicionar em arco
            const angle = (k / bananasPerHand) * Math.PI;
            const radius = 0.15;
            
            banana.position.set(
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius - 0.1
            );
            
            // Rotacionar para apontar para fora
            banana.rotation.z = Math.PI / 2;
            banana.rotation.y = angle;
            
            // Curvar levemente para cima
            banana.rotation.x = Math.PI / 6;
            
            banana.castShadow = true;
            handGroup.add(banana);
          }
          
          bunchGroup.add(handGroup);
        }
        
        // Rotacionar o cacho inteiro para uma posição natural
        bunchGroup.rotation.x = Math.PI / 6;
        bunchGroup.rotation.y = Math.random() * Math.PI * 2;
        
        bananaPlantGroup.add(bunchGroup);
      }
      
      scene.add(bananaPlantGroup);
    }
  }
  
  // Adicionar algumas plantas mais jovens
  for (let i = 0; i < 10; i++) {
    const youngPlantGroup = new THREE.Group();
    
    // Posição aleatória
    const x = Math.random() * 80 - 40;
    const z = Math.random() * 80 - 40;
    
    youngPlantGroup.position.set(x, 0, z);
    
    // Tronco menor
    const youngTrunkHeight = 1 + Math.random() * 0.8;
    const youngTrunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, youngTrunkHeight, 8);
    const youngTrunkMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x81c784,
      roughness: 0.9,
      metalness: 0.0
    });
    
    const youngTrunk = new THREE.Mesh(youngTrunkGeometry, youngTrunkMaterial);
    youngTrunk.position.y = youngTrunkHeight / 2;
    youngTrunk.castShadow = true;
    youngTrunk.receiveShadow = true;
    youngPlantGroup.add(youngTrunk);
    
    // Poucas folhas
    const youngLeafCount = 2 + Math.floor(Math.random() * 2);
    
    for (let j = 0; j < youngLeafCount; j++) {
      const youngLeafGeometry = new THREE.PlaneGeometry(0.6, 1.5, 4, 8);
      
      // Adicionar curvatura
      const positions = youngLeafGeometry.attributes.position;
      for (let k = 0; k < positions.count; k++) {
        const y = positions.getY(k);
        if (y > 0) {
          positions.setZ(k, Math.sin(y / 1.5 * Math.PI) * 0.3);
        }
      }
      
      positions.needsUpdate = true;
      
      const youngLeafMaterial = new THREE.MeshStandardMaterial({
        color: 0x66bb6a, // Verde mais claro
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.DoubleSide
      });
      
      const youngLeaf = new THREE.Mesh(youngLeafGeometry, youngLeafMaterial);
      
      youngLeaf.position.y = youngTrunkHeight;
      
      const angle = (j / youngLeafCount) * Math.PI * 2;
      youngLeaf.rotation.y = angle;
      youngLeaf.rotation.x = -Math.PI / 4;
      
      youngLeaf.castShadow = true;
      youngLeaf.receiveShadow = true;
      youngPlantGroup.add(youngLeaf);
    }
    
    scene.add(youngPlantGroup);
  }
  
  // Adicionar carrinho de mão como na imagem
  const cartGroup = new THREE.Group();
  cartGroup.position.set(15, 0, 15);
  
  // Estrutura do carrinho
  const cartBaseGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8);
  const cartBaseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x795548,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const cartBase = new THREE.Mesh(cartBaseGeometry, cartBaseMaterial);
  cartBase.position.y = 0.4;
  cartBase.castShadow = true;
  cartBase.receiveShadow = true;
  cartGroup.add(cartBase);
  
  // Laterais do carrinho
  const cartSideGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.05);
  
  const cartSideFront = new THREE.Mesh(cartSideGeometry, cartBaseMaterial);
  cartSideFront.position.set(0, 0.6, 0.425);
  cartGroup.add(cartSideFront);
  
  const cartSideBack = new THREE.Mesh(cartSideGeometry, cartBaseMaterial);
  cartSideBack.position.set(0, 0.6, -0.425);
  cartGroup.add(cartSideBack);
  
  // Roda
  const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x424242,
    roughness: 0.7,
    metalness: 0.3
  });
  
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.position.set(0.6, 0.2, 0);
  wheel.rotation.x = Math.PI / 2;
  wheel.castShadow = true;
  cartGroup.add(wheel);
  
  // Alças
  const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 6);
  const handleMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x5d4037,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const handleLeft = new THREE.Mesh(handleGeometry, handleMaterial);
  handleLeft.position.set(-0.8, 0.6, 0.3);
  handleLeft.rotation.x = Math.PI / 2;
  handleLeft.rotation.z = -Math.PI / 6;
  cartGroup.add(handleLeft);
  
  const handleRight = new THREE.Mesh(handleGeometry, handleMaterial);
  handleRight.position.set(-0.8, 0.6, -0.3);
  handleRight.rotation.x = Math.PI / 2;
  handleRight.rotation.z = -Math.PI / 6;
  cartGroup.add(handleRight);
  
  // Adicionar algumas bananas no carrinho
  for (let i = 0; i < 12; i++) {
    const cartBananaGeometry = new THREE.CapsuleGeometry(0.04, 0.2, 6, 6);
    const cartBananaMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffeb3b,
      roughness: 0.7,
      metalness: 0.1
    });
    
    const cartBanana = new THREE.Mesh(cartBananaGeometry, cartBananaMaterial);
    
    cartBanana.position.set(
      (Math.random() - 0.5) * 1.2,
      0.5,
      (Math.random() - 0.5) * 0.6
    );
    
    cartBanana.rotation.x = Math.random() * Math.PI;
    cartBanana.rotation.y = Math.random() * Math.PI;
    cartBanana.rotation.z = Math.random() * Math.PI;
    
    cartBanana.castShadow = true;
    cartGroup.add(cartBanana);
  }
  
  scene.add(cartGroup);
};
