import * as THREE from 'three';

export interface ModelProps {
  scene: THREE.Scene;
}

export interface TreeProps {
  x: number;
  z: number;
  scene: THREE.Scene;
}

export interface FenceProps {
  scene: THREE.Scene;
}
