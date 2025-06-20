import * as THREE from 'three';
import { ModelProps } from './types';

export const createTomatoGreenhouse = ({ scene }: ModelProps) => {
  if (!scene) return;

  // Create greenhouse structure with improved materials
  const greenhouseGeometry = new THREE.BoxGeometry(40, 5, 30);
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.9,
    envMapIntensity: 1.5
  });
  const greenhouse = new THREE.Mesh(greenhouseGeometry, glassMaterial);
  greenhouse.position.set(0, 2.5, 0);
  scene.add(greenhouse);
  
  // Add greenhouse frame structure
  const frameGeometry = new THREE.BoxGeometry(40.2, 5.2, 30.2);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x757575,
    roughness: 0.7,
    metalness: 0.8,
    transparent: true,
    opacity: 0.9,
    wireframe: true
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(0, 2.5, 0);
  scene.add(frame);
  
  // Add structural beams
  for (let x = -20; x <= 20; x += 5) {
    const beamGeometry = new THREE.BoxGeometry(0.3, 5, 0.3);
    const beamMaterial = new THREE.MeshStandardMaterial({
      color: 0x616161,
      roughness: 0.5,
      metalness: 0.8
    });
    
    // Vertical beams along length
    for (let z = -15; z <= 15; z += 15) {
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.set(x, 2.5, z);
      beam.castShadow = true;
      scene.add(beam);
    }
  }
  
  // Roof beams
  for (let z = -15; z <= 15; z += 5) {
    const roofBeamGeometry = new THREE.BoxGeometry(40, 0.3, 0.3);
    const roofBeamMaterial = new THREE.MeshStandardMaterial({
      color: 0x616161,
      roughness: 0.5,
      metalness: 0.8
    });
    const roofBeam = new THREE.Mesh(roofBeamGeometry, roofBeamMaterial);
    roofBeam.position.set(0, 5, z);
    roofBeam.castShadow = true;
    scene.add(roofBeam);
  }

  // Create tomato plants with improved visuals
  for (let x = -15; x <= 15; x += 2) {
    for (let z = -10; z <= 10; z += 2) {
      // Plant stem with improved texture
      const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
      const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228b22,
        roughness: 0.9,
        metalness: 0.0
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.set(x, 1.5, z);
      stem.castShadow = true;
      scene.add(stem);
      
      // Add support stakes
      const stakeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3.5, 6);
      const stakeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xa1887f,
        roughness: 1.0,
        metalness: 0.0
      });
      const stake = new THREE.Mesh(stakeGeometry, stakeMaterial);
      stake.position.set(x + 0.15, 1.75, z);
      stake.castShadow = true;
      scene.add(stake);
      
      // Add twine supports
      for (let i = 0; i < 3; i++) {
        const twineGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 4);
        const twineMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xf5f5dc,
          roughness: 1.0,
          metalness: 0.0
        });
        const twine = new THREE.Mesh(twineGeometry, twineMaterial);
        twine.position.set(x + 0.075, 1 + i * 0.8, z);
        twine.rotation.z = Math.PI / 2;
        twine.castShadow = true;
        scene.add(twine);
      }

      // Tomatoes with more realistic appearance
      const tomatoGeometry = new THREE.SphereGeometry(0.2, 12, 12);
      const tomatoMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff6347,
        roughness: 0.7,
        metalness: 0.1
      });
      
      // Add multiple tomatoes with better positioning
      for (let i = 0; i < 6; i++) {
        // Vary tomato ripeness
        let tomatoColor;
        if (Math.random() > 0.7) {
          tomatoColor = 0xff6347; // Ripe
        } else if (Math.random() > 0.5) {
          tomatoColor = 0xff8c69; // Almost ripe
        } else {
          tomatoColor = 0x90ee90; // Green
        }
        
        const tomato = new THREE.Mesh(
          tomatoGeometry, 
          new THREE.MeshStandardMaterial({ 
            color: tomatoColor,
            roughness: 0.7,
            metalness: 0.1
          })
        );
        
        tomato.position.set(
          x + Math.random() * 0.4 - 0.2,
          1 + Math.random() * 2,
          z + Math.random() * 0.4 - 0.2
        );
        tomato.scale.set(
          0.8 + Math.random() * 0.4,
          0.8 + Math.random() * 0.4,
          0.8 + Math.random() * 0.4
        );
        tomato.castShadow = true;
        scene.add(tomato);
        
        // Add tomato stems
        if (Math.random() > 0.3) {
          const stemCapGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 6);
          const stemCapMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x228b22,
            roughness: 0.9,
            metalness: 0.0
          });
          const stemCap = new THREE.Mesh(stemCapGeometry, stemCapMaterial);
          stemCap.position.copy(tomato.position);
          stemCap.position.y += 0.2;
          stemCap.castShadow = true;
          scene.add(stemCap);
        }
      }

      // Leaves with improved geometry
      const leafGeometry = new THREE.PlaneGeometry(0.5, 0.5, 3, 3);
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x228b22,
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.DoubleSide
      });
      
      for (let i = 0; i < 8; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(
          x + Math.random() * 0.6 - 0.3,
          0.5 + Math.random() * 2,
          z + Math.random() * 0.6 - 0.3
        );
        leaf.rotation.x = Math.random() * Math.PI;
        leaf.rotation.y = Math.random() * Math.PI;
        leaf.rotation.z = Math.random() * Math.PI;
        leaf.castShadow = true;
        scene.add(leaf);
      }
    }
  }
  
  // Add irrigation system
  for (let x = -15; x <= 15; x += 10) {
    const pipeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 30, 8);
    const pipeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x607d8b,
      roughness: 0.7,
      metalness: 0.3
    });
    const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe.position.set(x, 0.1, 0);
    pipe.rotation.z = Math.PI / 2;
    pipe.castShadow = true;
    scene.add(pipe);
    
    // Add drippers
    for (let z = -10; z <= 10; z += 2) {
      const dripperGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 6);
      const dripperMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x212121,
        roughness: 0.8,
        metalness: 0.2
      });
      const dripper = new THREE.Mesh(dripperGeometry, dripperMaterial);
      dripper.position.set(x, 0.05, z);
      dripper.castShadow = true;
      scene.add(dripper);
    }
  }
  
  // Add control panel
  const panelGeometry = new THREE.BoxGeometry(1, 1.5, 0.2);
  const panelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x424242,
    roughness: 0.7,
    metalness: 0.5
  });
  const panel = new THREE.Mesh(panelGeometry, panelMaterial);
  panel.position.set(-19, 1.5, -14);
  panel.castShadow = true;
  scene.add(panel);
  
  // Add buttons to panel
  for (let i = 0; i < 6; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    
    const buttonGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 8);
    const buttonMaterial = new THREE.MeshStandardMaterial({ 
      color: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff][i],
      roughness: 0.5,
      metalness: 0.8
    });
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.set(-19.1, 1.7 - row * 0.3, -14.2 + col * 0.2);
    button.rotation.z = Math.PI / 2;
    button.castShadow = true;
    scene.add(button);
  }
};
