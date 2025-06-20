import * as THREE from 'three';

// Shader para grama animada - cores mais naturais
export const grassVertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec3 pos = position;
    
    // Animação de vento na grama mais sutil
    if (pos.y > 0.0) {
      float windStrength = sin(time * 1.5 + pos.x * 0.3 + pos.z * 0.2) * 0.05;
      pos.x += windStrength * pos.y;
      pos.z += windStrength * 0.3 * pos.y;
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const grassFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    // Cores de grama mais naturais e menos saturadas
    vec3 grassColor1 = vec3(0.3, 0.5, 0.2);
    vec3 grassColor2 = vec3(0.2, 0.4, 0.15);
    
    // Gradiente baseado na altura
    float heightFactor = vUv.y;
    vec3 color = mix(grassColor2, grassColor1, heightFactor);
    
    // Adiciona variação temporal mais sutil
    float timeVariation = sin(time * 0.3 + vUv.x * 8.0) * 0.05;
    color += timeVariation;
    
    // Adiciona iluminação básica
    float lighting = dot(vNormal, normalize(vec3(1.0, 1.0, 0.5))) * 0.5 + 0.5;
    color *= lighting;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Shader para água animada - mais realista
export const waterVertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    
    vec3 pos = position;
    
    // Ondas na água mais suaves
    pos.y += sin(time * 1.2 + pos.x * 0.4) * 0.08;
    pos.y += cos(time * 0.8 + pos.z * 0.3) * 0.04;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const waterFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    // Cores de água mais realistas
    vec3 waterColor1 = vec3(0.1, 0.4, 0.6);
    vec3 waterColor2 = vec3(0.2, 0.6, 0.8);
    
    // Padrão de ondas
    float wave = sin(time * 2.0 + vPosition.x * 1.5 + vPosition.z * 1.0) * 0.5 + 0.5;
    vec3 color = mix(waterColor1, waterColor2, wave);
    
    // Adiciona reflexo mais sutil
    float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 1.0, 0.0)), 1.5);
    color += fresnel * 0.2;
    
    gl_FragColor = vec4(color, 0.85);
  }
`;

// Shader para folhagem com movimento - cores mais naturais
export const foliageVertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec3 pos = position;
    
    // Movimento suave das folhas mais realista
    float windEffect = sin(time * 1.0 + pos.x * 0.2 + pos.y * 0.15) * 0.03;
    pos.x += windEffect;
    pos.z += windEffect * 0.3;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const foliageFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    // Cores de folhagem mais naturais e variadas
    vec3 leafColor1 = vec3(0.25, 0.6, 0.2);
    vec3 leafColor2 = vec3(0.15, 0.4, 0.1);
    vec3 leafColor3 = vec3(0.3, 0.7, 0.25);
    
    // Variação de cor baseada na normal e posição
    float normalFactor = dot(vNormal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
    float uvFactor = (vUv.x + vUv.y) * 0.5;
    
    vec3 color = mix(leafColor2, leafColor1, normalFactor);
    color = mix(color, leafColor3, uvFactor * 0.3);
    
    // Adiciona variação temporal muito sutil
    float timeVariation = sin(time * 0.5 + vUv.x * 3.0 + vUv.y * 2.0) * 0.03;
    color += timeVariation;
    
    // Iluminação básica
    float lighting = dot(vNormal, normalize(vec3(1.0, 1.0, 0.5))) * 0.4 + 0.6;
    color *= lighting;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Função para criar material de grama animada
export const createGrassMaterial = () => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: grassVertexShader,
    fragmentShader: grassFragmentShader,
    side: THREE.DoubleSide
  });
};

// Função para criar material de água animada
export const createWaterMaterial = () => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  });
};

// Função para criar material de folhagem animada
export const createFoliageMaterial = () => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: foliageVertexShader,
    fragmentShader: foliageFragmentShader,
    side: THREE.DoubleSide
  });
};

// Função para atualizar todos os shaders com o tempo
export const updateShaders = (scene: THREE.Scene, time: number) => {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh && object.material instanceof THREE.ShaderMaterial) {
      object.material.uniforms.time.value = time;
    }
  });
};

