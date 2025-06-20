import * as THREE from 'three';
import { ModelProps } from './types';

export const createSugarcaneField = ({ scene }: ModelProps) => {
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
    color: 0x3d2314 // Solo marrom escuro
  });
  
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMaterial
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Criar plantação de cana-de-açúcar baseada na imagem de referência
  // Cana com caules amarelados/esverdeados e folhas verdes
  
  // Criar fileiras de cana-de-açúcar como na imagem
  const rowCount = 8;
  const canasPerRow = 12;
  const rowSpacing = 5;
  const canaSpacing = 3;
  
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < canasPerRow; col++) {
      // Posição em fileiras organizadas
      const x = -35 + col * canaSpacing;
      const z = -20 + row * rowSpacing;
      
      // Pequena variação para naturalidade
      const offsetX = (Math.random() - 0.5) * 0.8;
      const offsetZ = (Math.random() - 0.5) * 0.8;
      
      // Altura baseada na imagem de referência
      const height = 3.5 + Math.random() * 1.0;
      
      // Grupo para cada planta de cana
      const sugarcaneGroup = new THREE.Group();
      sugarcaneGroup.position.set(x + offsetX, 0, z + offsetZ);
      
      // Caule principal com cor amarelada/esverdeada como na imagem
      const stalkGeometry = new THREE.CylinderGeometry(0.08, 0.12, height, 8);
      
      // Cor do caule baseada na imagem (amarelado/esverdeado)
      const stalkColor = new THREE.Color(0xd9cb84);
      
      const stalkMaterial = new THREE.MeshStandardMaterial({ 
        color: stalkColor,
        roughness: 0.8,
        metalness: 0.1
      });
      
      const stalk = new THREE.Mesh(stalkGeometry, stalkMaterial);
      stalk.position.y = height/2;
      stalk.castShadow = true;
      stalk.receiveShadow = true;
      
      // Pequena inclinação aleatória
      stalk.rotation.x = (Math.random() - 0.5) * 0.15;
      stalk.rotation.z = (Math.random() - 0.5) * 0.15;
      
      sugarcaneGroup.add(stalk);
      
      // Adicionar nós ao caule como na imagem
      const segments = Math.floor(height / 0.6);
      for (let i = 1; i < segments; i++) {
        const nodeGeometry = new THREE.TorusGeometry(0.12, 0.03, 8, 12);
        const nodeMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(stalkColor).multiplyScalar(0.9),
          roughness: 0.9,
          metalness: 0.0
        });
        
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.y = i * 0.6;
        node.rotation.x = Math.PI / 2;
        node.scale.set(1, 1, 0.3);
        sugarcaneGroup.add(node);
      }
      
      // Adicionar folhas como na imagem (longas, finas e verdes)
      const leafCount = 4 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < leafCount; i++) {
        // Posição da folha ao longo do caule
        const leafHeight = 0.6 + i * (height - 0.6) / leafCount;
        
        // Geometria da folha - longa e fina como na imagem
        const leafLength = 1.8 + Math.random() * 0.8;
        const leafWidth = 0.15 + Math.random() * 0.1;
        
        // Forma simplificada para as folhas
        const leafShape = new THREE.Shape();
        leafShape.moveTo(0, 0);
        leafShape.lineTo(leafLength * 0.3, leafWidth * 0.7);
        leafShape.lineTo(leafLength * 0.7, leafWidth);
        leafShape.lineTo(leafLength, leafWidth * 0.5);
        leafShape.lineTo(leafLength * 0.7, -leafWidth);
        leafShape.lineTo(leafLength * 0.3, -leafWidth * 0.7);
        leafShape.lineTo(0, 0);
        
        const leafGeometry = new THREE.ShapeGeometry(leafShape, 12);
        
        // Cor verde das folhas como na imagem
        const leafMaterial = new THREE.MeshStandardMaterial({
          color: 0x4caf50,
          roughness: 1.0,
          metalness: 0.0,
          side: THREE.DoubleSide
        });
        
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        
        // Posicionar folha no caule
        leaf.position.y = leafHeight;
        
        // Rotação ao redor do caule
        const angle = (i / leafCount) * Math.PI * 2;
        leaf.rotation.y = angle;
        
        // Inclinação para baixo como na imagem
        const leafDroop = Math.PI / 3;
        leaf.rotation.x = leafDroop;
        
        leaf.castShadow = true;
        leaf.receiveShadow = true;
        
        sugarcaneGroup.add(leaf);
      }
      
      scene.add(sugarcaneGroup);
    }
  }
  
  // Adicionar algumas plantas de cana cortadas/caídas como na imagem
  for (let i = 0; i < 15; i++) {
    const fallenGroup = new THREE.Group();
    
    // Posição aleatória no campo
    const x = Math.random() * 80 - 40;
    const z = Math.random() * 80 - 40;
    
    fallenGroup.position.set(x, 0, z);
    
    // Caule caído
    const fallenHeight = 2 + Math.random() * 1.5;
    const fallenGeometry = new THREE.CylinderGeometry(0.08, 0.12, fallenHeight, 8);
    const fallenMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd9cb84,
      roughness: 0.8,
      metalness: 0.1
    });
    
    const fallenStalk = new THREE.Mesh(fallenGeometry, fallenMaterial);
    fallenStalk.position.set(0, 0.1, 0);
    
    // Rotação para parecer caído no chão
    fallenStalk.rotation.x = Math.PI / 2;
    fallenStalk.rotation.z = Math.random() * Math.PI * 2;
    
    fallenStalk.castShadow = true;
    fallenStalk.receiveShadow = true;
    
    fallenGroup.add(fallenStalk);
    
    // Adicionar algumas folhas murchas
    const fallenLeafCount = 2 + Math.floor(Math.random() * 2);
    
    for (let j = 0; j < fallenLeafCount; j++) {
      const leafPos = Math.random() * fallenHeight - fallenHeight / 2;
      
      const fallenLeafGeometry = new THREE.PlaneGeometry(1.2 + Math.random() * 0.8, 0.15 + Math.random() * 0.1);
      const fallenLeafMaterial = new THREE.MeshStandardMaterial({
        color: 0x7d8c4d, // Verde mais escuro/amarronzado
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.DoubleSide
      });
      
      const fallenLeaf = new THREE.Mesh(fallenLeafGeometry, fallenLeafMaterial);
      
      // Posicionar ao longo do caule caído
      fallenLeaf.position.set(
        Math.cos(fallenStalk.rotation.z) * leafPos,
        0.12,
        Math.sin(fallenStalk.rotation.z) * leafPos
      );
      
      // Rotação aleatória
      fallenLeaf.rotation.x = -Math.PI / 2;
      fallenLeaf.rotation.z = Math.random() * Math.PI * 2;
      
      fallenGroup.add(fallenLeaf);
    }
    
    scene.add(fallenGroup);
  }
  
  // Adicionar solo arado em algumas áreas como na imagem
  for (let i = 0; i < 5; i++) {
    const plowedAreaGroup = new THREE.Group();
    
    // Posição das áreas aradas
    const areaX = Math.random() * 60 - 30;
    const areaZ = Math.random() * 60 - 30;
    
    plowedAreaGroup.position.set(areaX, 0, areaZ);
    
    // Criar sulcos no solo
    for (let j = 0; j < 6; j++) {
      const furrowGeometry = new THREE.BoxGeometry(10, 0.2, 0.5);
      const furrowMaterial = new THREE.MeshStandardMaterial({
        color: 0x33281b, // Solo mais escuro
        roughness: 1.0,
        metalness: 0.0
      });
      
      const furrow = new THREE.Mesh(furrowGeometry, furrowMaterial);
      furrow.position.set(0, 0.1, j * 1.2 - 3);
      furrow.castShadow = false;
      furrow.receiveShadow = true;
      
      plowedAreaGroup.add(furrow);
    }
    
    scene.add(plowedAreaGroup);
  }
  
  // Adicionar algumas árvores ao fundo como na imagem
  for (let i = 0; i < 10; i++) {
    const treeGroup = new THREE.Group();
    
    // Posicionar árvores ao fundo
    const angle = (i / 10) * Math.PI * 2;
    const radius = 45 + Math.random() * 5;
    
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
};
