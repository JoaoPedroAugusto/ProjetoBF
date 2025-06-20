import * as THREE from 'three';
import { ModelProps } from './types';

export const createSoyField = ({ scene }: ModelProps) => {
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
    color: 0x8B4513 // Marrom para solo arado
  });
  
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMaterial
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Adicionar textura de solo arado com sulcos
  for (let i = 0; i < 20; i++) {
    const furrowGeometry = new THREE.BoxGeometry(80, 0.1, 0.3);
    const furrowMaterial = new THREE.MeshStandardMaterial({
      color: 0x6d4c41,
      roughness: 1.0,
      metalness: 0.0
    });
    
    const furrow = new THREE.Mesh(furrowGeometry, furrowMaterial);
    furrow.position.set(0, 0.05, -40 + i * 4);
    furrow.receiveShadow = true;
    scene.add(furrow);
  }

  // Criar fileiras de plantas de soja com densidade reduzida e detalhes aprimorados
  // Aumentando o espaçamento entre plantas para reduzir a quantidade
  for (let x = -20; x <= 20; x += 2.5) {
    for (let z = -20; z <= 20; z += 2.5) {
      // Adicionar variação para naturalidade
      const offsetX = (Math.random() - 0.5) * 1.0;
      const offsetZ = (Math.random() - 0.5) * 1.0;
      
      // Grupo para cada planta de soja
      const soyPlantGroup = new THREE.Group();
      soyPlantGroup.position.set(x + offsetX, 0, z + offsetZ);
      
      // Altura da planta com variação
      const plantHeight = 0.8 + Math.random() * 0.4;
      
      // Caule principal com textura aprimorada
      const baseGeometry = new THREE.CylinderGeometry(0.05, 0.08, plantHeight, 8);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8d6e63,
        roughness: 0.9,
        metalness: 0.0
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = plantHeight / 2;
      base.castShadow = true;
      soyPlantGroup.add(base);

      // Adicionar ramificações mais detalhadas
      const branchCount = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < branchCount; i++) {
        const branchHeight = 0.3 + Math.random() * 0.2;
        const branchGeometry = new THREE.CylinderGeometry(0.02, 0.03, branchHeight, 6);
        const branch = new THREE.Mesh(branchGeometry, baseMaterial);
        
        // Posicionar ao longo do caule principal
        const heightPosition = (i / branchCount) * plantHeight * 0.8 + plantHeight * 0.2;
        const angle = (i / branchCount) * Math.PI * 2 + Math.random() * 0.5;
        
        branch.position.set(
          Math.cos(angle) * 0.1,
          heightPosition,
          Math.sin(angle) * 0.1
        );
        
        // Rotação para parecer que está crescendo para fora
        branch.rotation.z = Math.PI / 3;
        branch.rotation.y = angle;
        branch.castShadow = true;
        soyPlantGroup.add(branch);
        
        // Adicionar folhas trifoliadas nas pontas dos ramos
        if (Math.random() > 0.3) {
          const leafGroup = new THREE.Group();
          leafGroup.position.copy(branch.position);
          leafGroup.position.x += Math.cos(angle) * branchHeight * 0.6;
          leafGroup.position.z += Math.sin(angle) * branchHeight * 0.6;
          
          // Criar três folíolos para cada folha trifoliada
          for (let j = 0; j < 3; j++) {
            const leafAngle = (j / 3) * Math.PI * 2;
            
            // Geometria da folha mais detalhada
            const leafShape = new THREE.Shape();
            leafShape.moveTo(0, 0);
            leafShape.bezierCurveTo(0.05, 0.05, 0.1, 0.1, 0.15, 0);
            leafShape.bezierCurveTo(0.2, -0.05, 0.15, -0.15, 0.1, -0.2);
            leafShape.bezierCurveTo(0.05, -0.25, -0.05, -0.25, -0.1, -0.2);
            leafShape.bezierCurveTo(-0.15, -0.15, -0.2, -0.05, -0.15, 0);
            leafShape.bezierCurveTo(-0.1, 0.1, -0.05, 0.05, 0, 0);
            
            const leafGeometry = new THREE.ShapeGeometry(leafShape, 12);
            
            // Variação de cor para as folhas
            const leafColor = new THREE.Color();
            leafColor.setHSL(0.3, 0.7, 0.4 + Math.random() * 0.1);
            
            const leafMaterial = new THREE.MeshStandardMaterial({
              color: leafColor,
              roughness: 0.9,
              metalness: 0.0,
              side: THREE.DoubleSide
            });
            
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.scale.set(1.5, 1.5, 1.5);
            
            // Posicionar os folíolos em torno do ponto central
            leaf.position.set(
              Math.cos(leafAngle) * 0.1,
              0.05,
              Math.sin(leafAngle) * 0.1
            );
            
            // Rotação para orientação natural
            leaf.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
            leaf.rotation.y = leafAngle + (Math.random() - 0.5) * 0.3;
            
            leaf.castShadow = true;
            leafGroup.add(leaf);
          }
          
          soyPlantGroup.add(leafGroup);
        }
      }

      // Adicionar folhas trifoliadas ao longo do caule principal
      const mainLeafCount = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < mainLeafCount; i++) {
        const leafGroup = new THREE.Group();
        const heightPosition = (i / mainLeafCount) * plantHeight * 0.7 + plantHeight * 0.2;
        const angle = (i / mainLeafCount) * Math.PI * 2 + Math.random() * Math.PI;
        
        leafGroup.position.set(
          Math.cos(angle) * 0.05,
          heightPosition,
          Math.sin(angle) * 0.05
        );
        
        // Criar três folíolos para cada folha trifoliada
        for (let j = 0; j < 3; j++) {
          const leafAngle = (j / 3) * Math.PI * 2;
          
          // Geometria da folha mais detalhada
          const leafShape = new THREE.Shape();
          leafShape.moveTo(0, 0);
          leafShape.bezierCurveTo(0.05, 0.05, 0.1, 0.1, 0.15, 0);
          leafShape.bezierCurveTo(0.2, -0.05, 0.15, -0.15, 0.1, -0.2);
          leafShape.bezierCurveTo(0.05, -0.25, -0.05, -0.25, -0.1, -0.2);
          leafShape.bezierCurveTo(-0.15, -0.15, -0.2, -0.05, -0.15, 0);
          leafShape.bezierCurveTo(-0.1, 0.1, -0.05, 0.05, 0, 0);
          
          const leafGeometry = new THREE.ShapeGeometry(leafShape, 12);
          
          // Variação de cor para as folhas
          const leafColor = new THREE.Color();
          leafColor.setHSL(0.3, 0.7, 0.4 + Math.random() * 0.1);
          
          const leafMaterial = new THREE.MeshStandardMaterial({
            color: leafColor,
            roughness: 0.9,
            metalness: 0.0,
            side: THREE.DoubleSide
          });
          
          const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
          leaf.scale.set(1.5, 1.5, 1.5);
          
          // Posicionar os folíolos em torno do ponto central
          leaf.position.set(
            Math.cos(leafAngle) * 0.1,
            0.05,
            Math.sin(leafAngle) * 0.1
          );
          
          // Rotação para orientação natural
          leaf.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
          leaf.rotation.y = leafAngle + (Math.random() - 0.5) * 0.3;
          
          leaf.castShadow = true;
          leafGroup.add(leaf);
        }
        
        soyPlantGroup.add(leafGroup);
      }

      // Adicionar vagens de soja com geometria e materiais aprimorados
      if (Math.random() > 0.3) { // Nem todas as plantas têm vagens
        const podCount = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < podCount; i++) {
          // Grupo para cada vagem
          const podGroup = new THREE.Group();
          
          // Posição da vagem na planta
          const heightPosition = (i / podCount) * plantHeight * 0.6 + plantHeight * 0.3;
          const angle = (i / podCount) * Math.PI * 2 + Math.random() * Math.PI;
          
          podGroup.position.set(
            Math.cos(angle) * 0.1,
            heightPosition,
            Math.sin(angle) * 0.1
          );
          
          // Vagem principal
          const podLength = 0.15 + Math.random() * 0.1;
          const podGeometry = new THREE.CapsuleGeometry(0.04, podLength, 8, 8);
          
          // Variar cor da vagem para realismo
          let podColor;
          if (Math.random() > 0.7) {
            podColor = 0xc5e1a5; // Verde claro
          } else if (Math.random() > 0.4) {
            podColor = 0xaed581; // Verde médio
          } else {
            podColor = 0x9ccc65; // Verde mais escuro
          }
          
          const podMaterial = new THREE.MeshStandardMaterial({ 
            color: podColor,
            roughness: 0.8,
            metalness: 0.1
          });
          
          const pod = new THREE.Mesh(podGeometry, podMaterial);
          pod.rotation.z = Math.PI / 2; // Orientar horizontalmente
          pod.rotation.y = Math.random() * Math.PI; // Rotação aleatória
          pod.castShadow = true;
          podGroup.add(pod);
          
          // Adicionar pequenas protuberâncias para simular grãos dentro da vagem
          const beanCount = 2 + Math.floor(Math.random() * 3);
          for (let j = 0; j < beanCount; j++) {
            const beanGeometry = new THREE.SphereGeometry(0.035, 8, 8);
            const bean = new THREE.Mesh(beanGeometry, podMaterial);
            
            bean.position.set(
              (j / beanCount - 0.5) * podLength,
              0,
              0
            );
            
            bean.scale.y = 0.8; // Achatado
            podGroup.add(bean);
          }
          
          // Adicionar pequeno caule conectando a vagem à planta
          const stemGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 4);
          const stem = new THREE.Mesh(stemGeometry, baseMaterial);
          stem.position.set(0, -0.05, 0);
          stem.rotation.x = Math.PI / 2;
          podGroup.add(stem);
          
          soyPlantGroup.add(podGroup);
        }
      }
      
      scene.add(soyPlantGroup);
    }
  }
  
  // Adicionar colheitadeira ao fundo com mais detalhes
  const harvesterGroup = new THREE.Group();
  harvesterGroup.position.set(-30, 0, 30);
  harvesterGroup.rotation.y = Math.PI / 4; // Orientação diagonal
  
  // Corpo da colheitadeira
  const harvesterBodyGeometry = new THREE.BoxGeometry(5, 3, 8);
  const harvesterMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x388e3c,
    roughness: 0.7,
    metalness: 0.3
  });
  const harvesterBody = new THREE.Mesh(harvesterBodyGeometry, harvesterMaterial);
  harvesterBody.position.y = 2.5;
  harvesterBody.castShadow = true;
  harvesterGroup.add(harvesterBody);
  
  // Cabine da colheitadeira
  const cabGeometry = new THREE.BoxGeometry(3, 2, 4);
  const cabMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1b5e20,
    roughness: 0.7,
    metalness: 0.3
  });
  const cab = new THREE.Mesh(cabGeometry, cabMaterial);
  cab.position.set(0, 5, 0);
  cab.castShadow = true;
  harvesterGroup.add(cab);
  
  // Janelas da cabine
  const windowGeometry = new THREE.PlaneGeometry(2.5, 1.5);
  const windowMaterial = new THREE.MeshPhysicalMaterial({ 
    color: 0xb3e5fc,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.7,
    transmission: 0.5
  });
  
  // Janela frontal
  const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
  frontWindow.position.set(0, 5, 2.01);
  harvesterGroup.add(frontWindow);
  
  // Janelas laterais
  const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
  leftWindow.position.set(-1.51, 5, 0);
  leftWindow.rotation.y = Math.PI / 2;
  harvesterGroup.add(leftWindow);
  
  const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
  rightWindow.position.set(1.51, 5, 0);
  rightWindow.rotation.y = Math.PI / 2;
  harvesterGroup.add(rightWindow);
  
  // Adicionar escada para a cabine
  const ladderGroup = new THREE.Group();
  ladderGroup.position.set(-1.5, 0, -1);
  
  for (let i = 0; i < 5; i++) {
    const stepGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.8);
    const stepMaterial = new THREE.MeshStandardMaterial({
      color: 0x424242,
      roughness: 0.8,
      metalness: 0.3
    });
    
    const step = new THREE.Mesh(stepGeometry, stepMaterial);
    step.position.y = 0.5 + i * 0.8;
    ladderGroup.add(step);
    
    // Suportes verticais
    if (i === 0) {
      const supportGeometry = new THREE.CylinderGeometry(0.03, 0.03, 4, 6);
      
      const leftSupport = new THREE.Mesh(supportGeometry, stepMaterial);
      leftSupport.position.set(0, 2, 0.35);
      ladderGroup.add(leftSupport);
      
      const rightSupport = new THREE.Mesh(supportGeometry, stepMaterial);
      rightSupport.position.set(0, 2, -0.35);
      ladderGroup.add(rightSupport);
    }
  }
  
  harvesterGroup.add(ladderGroup);
  
  // Rodas da colheitadeira
  for (let i = 0; i < 4; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    
    const wheelGeometry = new THREE.CylinderGeometry(1, 1, 0.8, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x212121,
      roughness: 0.9,
      metalness: 0.2
    });
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(
      -1.5 + col * 3,
      1,
      -3 + row * 6
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.castShadow = true;
    harvesterGroup.add(wheel);
    
    // Adicionar detalhes às rodas
    const hubGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.82, 16);
    const hubMaterial = new THREE.MeshStandardMaterial({
      color: 0xbdbdbd,
      roughness: 0.5,
      metalness: 0.7
    });
    
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.position.copy(wheel.position);
    hub.rotation.z = Math.PI / 2;
    harvesterGroup.add(hub);
    
    // Adicionar padrão de pneu
    for (let j = 0; j < 8; j++) {
      const treadGeometry = new THREE.BoxGeometry(0.1, 1.05, 0.2);
      const treadMaterial = new THREE.MeshStandardMaterial({
        color: 0x424242,
        roughness: 1.0,
        metalness: 0.0
      });
      
      const tread = new THREE.Mesh(treadGeometry, treadMaterial);
      const angle = (j / 8) * Math.PI * 2;
      
      tread.position.copy(wheel.position);
      tread.position.y += Math.sin(angle) * 0.95;
      tread.position.z += Math.cos(angle) * 0.95;
      
      tread.rotation.x = angle;
      
      harvesterGroup.add(tread);
    }
  }
  
  // Plataforma de corte (header)
  const headerGroup = new THREE.Group();
  headerGroup.position.set(0, 1.5, 4);
  
  const headerGeometry = new THREE.BoxGeometry(8, 1, 2);
  const headerMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffa000,
    roughness: 0.7,
    metalness: 0.3
  });
  const header = new THREE.Mesh(headerGeometry, headerMaterial);
  headerGroup.add(header);
  
  // Divisores da plataforma
  for (let i = 0; i < 5; i++) {
    const dividerGeometry = new THREE.BoxGeometry(0.1, 0.8, 1.8);
    const dividerMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe65100,
      roughness: 0.7,
      metalness: 0.3
    });
    const divider = new THREE.Mesh(dividerGeometry, dividerMaterial);
    divider.position.set(
      -3 + i * 1.5,
      0,
      0
    );
    divider.castShadow = true;
    headerGroup.add(divider);
  }
  
  // Molinete (reel)
  const reelGroup = new THREE.Group();
  reelGroup.position.set(0, 1, 1);
  
  // Eixo central
  const axleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8.5, 8);
  const axleMaterial = new THREE.MeshStandardMaterial({
    color: 0x757575,
    roughness: 0.7,
    metalness: 0.5
  });
  
  const axle = new THREE.Mesh(axleGeometry, axleMaterial);
  axle.rotation.z = Math.PI / 2;
  reelGroup.add(axle);
  
  // Barras do molinete
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    
    for (let j = 0; j < 5; j++) {
      const barGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6);
      const bar = new THREE.Mesh(barGeometry, axleMaterial);
      
      bar.position.set(
        -3 + j * 1.5,
        Math.sin(angle) * 1,
        Math.cos(angle) * 1
      );
      
      bar.rotation.x = angle;
      reelGroup.add(bar);
    }
  }
  
  headerGroup.add(reelGroup);
  harvesterGroup.add(headerGroup);
  
  // Tubo de descarga
  const dischargeGeometry = new THREE.CylinderGeometry(0.4, 0.4, 6, 12);
  const dischargeMaterial = new THREE.MeshStandardMaterial({
    color: 0x1b5e20,
    roughness: 0.8,
    metalness: 0.2
  });
  
  const discharge = new THREE.Mesh(dischargeGeometry, dischargeMaterial);
  discharge.position.set(3, 4, 0);
  discharge.rotation.z = Math.PI / 4;
  harvesterGroup.add(discharge);
  
  // Adicionar detalhes ao tubo de descarga
  const nozzleGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1, 12);
  const nozzle = new THREE.Mesh(nozzleGeometry, dischargeMaterial);
  nozzle.position.set(5.5, 6.5, 0);
  nozzle.rotation.z = Math.PI / 2;
  harvesterGroup.add(nozzle);
  
  // Adicionar grãos saindo do tubo (se estiver descarregando)
  if (Math.random() > 0.5) {
    const grainGroup = new THREE.Group();
    grainGroup.position.set(6, 6.5, 0);
    
    for (let i = 0; i < 20; i++) {
      const grainGeometry = new THREE.SphereGeometry(0.05, 6, 6);
      const grainMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        roughness: 0.8,
        metalness: 0.1
      });
      
      const grain = new THREE.Mesh(grainGeometry, grainMaterial);
      grain.position.set(
        Math.random() * 0.5,
        -Math.random() * i * 0.1,
        Math.random() * 0.5 - 0.25
      );
      
      grainGroup.add(grain);
    }
    
    harvesterGroup.add(grainGroup);
  }
  
  // Adicionar luzes à colheitadeira
  for (let i = 0; i < 2; i++) {
    const lightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffeb3b,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0xffeb3b,
      emissiveIntensity: 0.5
    });
    
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(-1 + i * 2, 3.5, 4.1);
    harvesterGroup.add(light);
  }
  
  // Adicionar operador na cabine
  const operatorGroup = new THREE.Group();
  operatorGroup.position.set(0, 4.5, 0.5);
  
  // Corpo do operador
  const operatorBodyGeometry = new THREE.CapsuleGeometry(0.25, 0.5, 8, 8);
  const operatorBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1565c0,
    roughness: 0.9,
    metalness: 0.0
  });
  
  const operatorBody = new THREE.Mesh(operatorBodyGeometry, operatorBodyMaterial);
  operatorBody.position.y = 0.25;
  operatorGroup.add(operatorBody);
  
  // Cabeça do operador
  const headGeometry = new THREE.SphereGeometry(0.2, 12, 12);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xd7ccc8,
    roughness: 0.9,
    metalness: 0.0
  });
  
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 0.7;
  operatorGroup.add(head);
  
  // Chapéu/boné
  const hatGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.1, 12);
  const hatMaterial = new THREE.MeshStandardMaterial({
    color: 0x388e3c,
    roughness: 0.9,
    metalness: 0.0
  });
  
  const hat = new THREE.Mesh(hatGeometry, hatMaterial);
  hat.position.y = 0.85;
  operatorGroup.add(hat);
  
  // Aba do boné
  const brimGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.3);
  const brim = new THREE.Mesh(brimGeometry, hatMaterial);
  brim.position.set(0, 0.85, 0.15);
  operatorGroup.add(brim);
  
  harvesterGroup.add(operatorGroup);
  
  scene.add(harvesterGroup);
  
  // Adicionar silo no horizonte
  const siloGroup = new THREE.Group();
  siloGroup.position.set(30, 0, -30);
  
  // Corpo do silo
  const siloGeometry = new THREE.CylinderGeometry(5, 5, 15, 16);
  const siloMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xe0e0e0,
    roughness: 0.7,
    metalness: 0.2
  });
  const silo = new THREE.Mesh(siloGeometry, siloMaterial);
  silo.position.y = 7.5;
  silo.castShadow = true;
  siloGroup.add(silo);
  
  // Topo do silo
  const siloTopGeometry = new THREE.ConeGeometry(5.2, 3, 16);
  const siloTopMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xbdbdbd,
    roughness: 0.7,
    metalness: 0.3
  });
  const siloTop = new THREE.Mesh(siloTopGeometry, siloTopMaterial);
  siloTop.position.y = 16.5;
  siloTop.castShadow = true;
  siloGroup.add(siloTop);
  
  // Adicionar detalhes ao silo
  // Porta
  const doorGeometry = new THREE.PlaneGeometry(2, 3);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x757575,
    roughness: 0.8,
    metalness: 0.3
  });
  
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 1.5, 5.1);
  door.rotation.y = Math.PI;
  siloGroup.add(door);
  
  // Escada
  const siloLadderGroup = new THREE.Group();
  siloLadderGroup.position.set(0, 0, 5.1);
  
  // Trilhos verticais
  for (let side = -1; side <= 1; side += 2) {
    const railGeometry = new THREE.CylinderGeometry(0.1, 0.1, 15, 8);
    const railMaterial = new THREE.MeshStandardMaterial({
      color: 0x757575,
      roughness: 0.7,
      metalness: 0.5
    });
    
    const rail = new THREE.Mesh(railGeometry, railMaterial);
    rail.position.set(side * 0.5, 7.5, 0.1);
    siloLadderGroup.add(rail);
  }
  
  // Degraus
  for (let i = 0; i < 15; i++) {
    const stepGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.3);
    const stepMaterial = new THREE.MeshStandardMaterial({
      color: 0x757575,
      roughness: 0.7,
      metalness: 0.5
    });
    
    const step = new THREE.Mesh(stepGeometry, stepMaterial);
    step.position.y = i * 1;
    step.position.z = 0.2;
    siloLadderGroup.add(step);
  }
  
  siloGroup.add(siloLadderGroup);
  
  // Tubo de descarga
  const siloDischargeGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 12);
  const siloDischarge = new THREE.Mesh(siloDischargeGeometry, siloMaterial);
  siloDischarge.position.set(0, 1.5, 0);
  siloDischarge.rotation.x = Math.PI / 2;
  siloDischarge.position.z -= 5;
  siloGroup.add(siloDischarge);
  
  // Base de concreto
  const baseGeometry = new THREE.CylinderGeometry(5.5, 5.5, 1, 16);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x9e9e9e,
    roughness: 1.0,
    metalness: 0.0
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -0.5;
  siloGroup.add(base);
  
  scene.add(siloGroup);
  
  // Adicionar caminhão de transporte de grãos
  const truckGroup = new THREE.Group();
  truckGroup.position.set(15, 0, 15);
  truckGroup.rotation.y = -Math.PI / 6;
  
  // Cabine
  const truckCabinGeometry = new THREE.BoxGeometry(3, 2.5, 2.5);
  const truckCabinMaterial = new THREE.MeshStandardMaterial({
    color: 0xd32f2f,
    roughness: 0.7,
    metalness: 0.3
  });
  
  const truckCabin = new THREE.Mesh(truckCabinGeometry, truckCabinMaterial);
  truckCabin.position.y = 1.75;
  truckCabin.castShadow = true;
  truckGroup.add(truckCabin);
  
  // Para-brisa
  const windshieldGeometry = new THREE.PlaneGeometry(2, 1.5);
  const windshieldMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xb3e5fc,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.7,
    transmission: 0.5
  });
  
  const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
  windshield.position.set(0, 2, 1.26);
  truckGroup.add(windshield);
  
  // Carroceria
  const truckBedGeometry = new THREE.BoxGeometry(6, 2, 2.8);
  const truckBedMaterial = new THREE.MeshStandardMaterial({
    color: 0x424242,
    roughness: 0.8,
    metalness: 0.2
  });
  
  const truckBed = new THREE.Mesh(truckBedGeometry, truckBedMaterial);
  truckBed.position.set(-4.5, 1.5, 0);
  truckBed.castShadow = true;
  truckGroup.add(truckBed);
  
  // Adicionar grãos na carroceria
  const grainPileGeometry = new THREE.CylinderGeometry(1.3, 1.3, 1, 16);
  grainPileGeometry.scale(2, 1, 1);
  
  const grainPileMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd54f,
    roughness: 0.9,
    metalness: 0.1
  });
  
  const grainPile = new THREE.Mesh(grainPileGeometry, grainPileMaterial);
  grainPile.position.set(-4.5, 2, 0);
  grainPile.rotation.x = Math.PI / 2;
  truckGroup.add(grainPile);
  
  // Rodas
  const truckWheelGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 16);
  const truckWheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.9,
    metalness: 0.2
  });
  
  const wheelPositions = [
    {x: 1, y: 0.7, z: 1.5},
    {x: 1, y: 0.7, z: -1.5},
    {x: -3, y: 0.7, z: 1.5},
    {x: -3, y: 0.7, z: -1.5},
    {x: -6, y: 0.7, z: 1.5},
    {x: -6, y: 0.7, z: -1.5}
  ];
  
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(truckWheelGeometry, truckWheelMaterial);
    wheel.position.set(pos.x, pos.y, pos.z);
    wheel.rotation.z = Math.PI / 2;
    wheel.castShadow = true;
    truckGroup.add(wheel);
  });
  
  scene.add(truckGroup);
  
  // Adicionar pequenos montes de soja colhida
  for (let i = 0; i < 3; i++) {
    const pileGroup = new THREE.Group();
    pileGroup.position.set(
      Math.random() * 40 - 20,
      0,
      Math.random() * 40 - 20
    );
    
    // Base do monte
    const pileGeometry = new THREE.ConeGeometry(1.5, 1, 16);
    const pileMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const pile = new THREE.Mesh(pileGeometry, pileMaterial);
    pile.position.y = 0.5;
    pile.scale.y = 0.5;
    pileGroup.add(pile);
    
    // Adicionar grãos individuais
    for (let j = 0; j < 30; j++) {
      const grainGeometry = new THREE.SphereGeometry(0.05, 6, 6);
      const grain = new THREE.Mesh(grainGeometry, pileMaterial);
      
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.3;
      const height = Math.random() * 0.5;
      
      grain.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      
      pileGroup.add(grain);
    }
    
    scene.add(pileGroup);
  }
  
  // Adicionar algumas aves (pássaros) sobrevoando o campo
  for (let i = 0; i < 5; i++) {
    const birdGroup = new THREE.Group();
    
    // Posição aleatória no céu
    birdGroup.position.set(
      Math.random() * 80 - 40,
      10 + Math.random() * 5,
      Math.random() * 80 - 40
    );
    
    // Corpo do pássaro
    const birdBodyGeometry = new THREE.CapsuleGeometry(0.1, 0.3, 8, 8);
    const birdMaterial = new THREE.MeshStandardMaterial({
      color: 0x212121,
      roughness: 0.9,
      metalness: 0.0
    });
    
    const birdBody = new THREE.Mesh(birdBodyGeometry, birdMaterial);
    birdBody.rotation.z = Math.PI / 2;
    birdGroup.add(birdBody);
    
    // Asas
    for (let j = 0; j < 2; j++) {
      const wingGeometry = new THREE.PlaneGeometry(0.4, 0.2);
      const wing = new THREE.Mesh(wingGeometry, birdMaterial);
      
      wing.position.set(0, 0, (j * 2 - 1) * 0.15);
      wing.rotation.y = (j * 2 - 1) * Math.PI / 2;
      wing.rotation.x = Math.PI / 6;
      
      birdGroup.add(wing);
    }
    
    // Rotação aleatória
    birdGroup.rotation.y = Math.random() * Math.PI * 2;
    
    scene.add(birdGroup);
  }
};
