import * as THREE from 'three';
import { ModelProps } from './types';

export const createCocoaPlantation = ({ scene }: ModelProps) => {
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
    color: 0x3d2314 // Solo escuro e úmido para plantação de cacau
  });
  
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMaterial
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Criar plantação de cacau baseada na imagem de referência
  // Árvores com frutos amarelos/alaranjados pendurados no tronco
  
  // Adicionar folhas caídas no solo para naturalidade
  for (let i = 0; i < 100; i++) {
    const leafGeometry = new THREE.PlaneGeometry(0.5 + Math.random() * 0.5, 0.3 + Math.random() * 0.3);
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x33691e,
      roughness: 1.0,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
    
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.position.set(
      Math.random() * 80 - 40,
      0.05,
      Math.random() * 80 - 40
    );
    
    leaf.rotation.x = -Math.PI / 2;
    leaf.rotation.z = Math.random() * Math.PI * 2;
    
    scene.add(leaf);
  }

  // Criar árvores de cacau como na imagem
  const treeCount = 16; // Reduzido para otimização
  const rows = 4;
  const cols = 4;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Posição em grade com pequena variação
      const x = -30 + col * 20 + (Math.random() - 0.5) * 5;
      const z = -30 + row * 20 + (Math.random() - 0.5) * 5;
      
      // Grupo para cada árvore de cacau
      const cocoaTreeGroup = new THREE.Group();
      cocoaTreeGroup.position.set(x, 0, z);
      
      // Altura da árvore
      const treeHeight = 4 + Math.random() * 1;
      
      // Tronco principal como na imagem
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, treeHeight, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4a312c,
        roughness: 0.9,
        metalness: 0.0
      });
      
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = treeHeight / 2;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      cocoaTreeGroup.add(trunk);
      
      // Galhos principais
      const branchCount = 5 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < branchCount; i++) {
        const branchHeight = treeHeight * 0.3 + Math.random() * (treeHeight * 0.6);
        const branchAngle = (i / branchCount) * Math.PI * 2;
        const branchTilt = Math.PI / 4 + Math.random() * (Math.PI / 6);
        
        const branchLength = 1.2 + Math.random() * 0.8;
        
        const branchGeometry = new THREE.CylinderGeometry(0.08, 0.12, branchLength, 6);
        const branch = new THREE.Mesh(branchGeometry, trunkMaterial);
        
        // Posicionar o galho
        branch.position.y = branchHeight;
        
        // Rotacionar o galho para fora do tronco
        branch.rotation.z = branchTilt;
        branch.rotation.y = branchAngle;
        
        // Ajustar a posição após a rotação
        branch.position.x += Math.cos(branchAngle) * 0.2;
        branch.position.z += Math.sin(branchAngle) * 0.2;
        
        branch.castShadow = true;
        cocoaTreeGroup.add(branch);
      }

      // Copa da árvore (folhas)
      const canopyCount = 3 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < canopyCount; i++) {
        const canopySize = 1.2 + Math.random() * 0.6;
        const canopyGeometry = new THREE.SphereGeometry(canopySize, 8, 8);
        
        // Cor verde escura como na imagem
        const canopyMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x1b5e20,
          roughness: 1.0,
          metalness: 0.0
        });
        
        const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
        
        // Posicionar a copa
        canopy.position.set(
          (Math.random() - 0.5) * 2,
          treeHeight * 0.6 + Math.random() * (treeHeight * 0.3),
          (Math.random() - 0.5) * 2
        );
        
        canopy.castShadow = true;
        canopy.receiveShadow = true;
        cocoaTreeGroup.add(canopy);
      }

      // Frutos de cacau (cabossas) como na imagem - amarelos/alaranjados
      const podCount = 6 + Math.floor(Math.random() * 4);
      
      for (let i = 0; i < podCount; i++) {
        // Grupo para cada fruto
        const podGroup = new THREE.Group();
        
        // Posição do fruto no tronco como na imagem
        const angle = Math.random() * Math.PI * 2;
        const height = Math.random() * treeHeight * 0.8;
        
        podGroup.position.set(
          Math.cos(angle) * 0.25,
          height,
          Math.sin(angle) * 0.25
        );
        
        // Geometria do fruto
        const podLength = 0.25 + Math.random() * 0.15;
        const podWidth = 0.12 + Math.random() * 0.08;
        
        const podGeometry = new THREE.CapsuleGeometry(podWidth, podLength, 8, 8);
        
        // Cor amarela/alaranjada como na imagem
        const podMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffa000, // Amarelo/laranja
          roughness: 0.7,
          metalness: 0.2
        });
        
        const pod = new THREE.Mesh(podGeometry, podMaterial);
        
        // Rotação para ficar perpendicular ao tronco
        pod.rotation.z = Math.PI / 2;
        pod.rotation.y = angle;
        
        pod.castShadow = true;
        podGroup.add(pod);
        
        // Adicionar sulcos ao fruto
        for (let j = 0; j < 5; j++) {
          const grooveGeometry = new THREE.BoxGeometry(0.01, podLength * 0.8, 0.01);
          const grooveMaterial = new THREE.MeshStandardMaterial({
            color: 0xe65100, // Laranja mais escuro
            roughness: 0.9,
            metalness: 0.0
          });
          
          const groove = new THREE.Mesh(grooveGeometry, grooveMaterial);
          
          const grooveAngle = (j / 5) * Math.PI * 2;
          groove.position.set(
            0,
            0,
            Math.sin(grooveAngle) * podWidth * 0.8
          );
          
          groove.rotation.x = grooveAngle;
          podGroup.add(groove);
        }
        
        // Adicionar pequeno caule conectando o fruto ao tronco
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 4);
        const stemMaterial = new THREE.MeshStandardMaterial({
          color: 0x795548,
          roughness: 0.9,
          metalness: 0.0
        });
        
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(-podLength/2 - 0.05, 0, 0);
        stem.rotation.z = Math.PI / 2;
        
        podGroup.add(stem);
        cocoaTreeGroup.add(podGroup);
      }
      
      scene.add(cocoaTreeGroup);
    }
  }
  
  // Adicionar área de secagem de cacau
  const dryingAreaGroup = new THREE.Group();
  dryingAreaGroup.position.set(20, 0, 20);
  
  // Plataforma de secagem
  const platformGeometry = new THREE.BoxGeometry(10, 0.2, 8);
  const platformMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd7ccc8,
    roughness: 0.9,
    metalness: 0.1
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = 0.1;
  platform.receiveShadow = true;
  dryingAreaGroup.add(platform);
  
  // Adicionar grãos de cacau secando
  for (let i = 0; i < 100; i++) {
    const beanGeometry = new THREE.SphereGeometry(0.1, 6, 6);
    const beanMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8d6e63,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const bean = new THREE.Mesh(beanGeometry, beanMaterial);
    bean.position.set(
      Math.random() * 8 - 4,
      0.25,
      Math.random() * 6 - 3
    );
    
    bean.scale.y = 0.5;
    bean.castShadow = true;
    bean.receiveShadow = true;
    dryingAreaGroup.add(bean);
  }
  
  scene.add(dryingAreaGroup);
  
  // Adicionar algumas ferramentas de colheita
  const toolsGroup = new THREE.Group();
  toolsGroup.position.set(-15, 0, 15);
  
  // Cesto de colheita
  const basketGeometry = new THREE.CylinderGeometry(1, 0.7, 1, 12);
  const basketMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xd7ccc8,
    roughness: 0.9,
    metalness: 0.1
  });
  const basket = new THREE.Mesh(basketGeometry, basketMaterial);
  basket.position.y = 0.5;
  basket.castShadow = true;
  basket.receiveShadow = true;
  toolsGroup.add(basket);
  
  // Adicionar alguns frutos no cesto
  for (let i = 0; i < 8; i++) {
    const harvestedPodGeometry = new THREE.CapsuleGeometry(0.2, 0.4, 8, 8);
    const harvestedPodMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffa000,
      roughness: 0.7,
      metalness: 0.2
    });
    
    const harvestedPod = new THREE.Mesh(harvestedPodGeometry, harvestedPodMaterial);
    harvestedPod.position.set(
      (Math.random() - 0.5) * 1.2,
      0.8,
      (Math.random() - 0.5) * 1.2
    );
    
    harvestedPod.rotation.x = Math.random() * Math.PI;
    harvestedPod.rotation.z = Math.random() * Math.PI;
    
    harvestedPod.castShadow = true;
    harvestedPod.receiveShadow = true;
    toolsGroup.add(harvestedPod);
  }
  
  // Ferramenta de colheita
  const toolHandleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 6);
  const toolHandleMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8d6e63,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const toolHandle = new THREE.Mesh(toolHandleGeometry, toolHandleMaterial);
  toolHandle.position.set(1.5, 1, 0);
  toolHandle.rotation.z = Math.PI / 4;
  toolHandle.castShadow = true;
  toolsGroup.add(toolHandle);
  
  // Lâmina da ferramenta
  const bladeGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.05);
  const bladeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x9e9e9e,
    roughness: 0.5,
    metalness: 0.7
  });
  
  const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
  blade.position.set(2.3, 1.8, 0);
  blade.rotation.z = Math.PI / 4;
  blade.castShadow = true;
  toolsGroup.add(blade);
  
  scene.add(toolsGroup);
};
