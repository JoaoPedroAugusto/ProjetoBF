import React, { useRef, useState, useEffect, memo } from 'react';
import { useFrame, ThreeEvent, useThree } from '@react-three/fiber';
import { useAppContext } from '../context/AppContext';
import { RegionData } from '../types';
import { getRegionColor } from '../utils/colorUtils';
import * as THREE from 'three';

interface WaterAccessMapProps {
  onSelectRegion: (region: RegionData | null) => void;
}

// Componente para o modelo do Estábulo
const Stable: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Base do estábulo */}
    <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[4, 3, 6]} /> {/* Largura, Altura, Profundidade */}
      <meshStandardMaterial color="#8B4513" roughness={0.7} metalness={0.1} /> {/* Marrom */}
    </mesh>
    {/* Telhado (prisma triangular) */}
    <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
      <cylinderGeometry args={[3, 3, 6.2, 3]} /> {/* Raio superior, raio inferior, altura, segmentos radiais */}
      <meshStandardMaterial color="#5a2d00" roughness={0.7} metalness={0.1} /> {/* Marrom mais escuro */}
    </mesh>
    {/* Porta do estábulo */}
    <mesh position={[0, 0.75, 3.01]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 2, 0.05]} />
      <meshStandardMaterial color="#5a2d00" />
    </mesh>
  </group>
);
 
// Componente para o Sol
const Sun: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <mesh position={position}>
    <sphereGeometry args={[2, 32, 32]} />
    <meshBasicMaterial color="#FFD700" /> {/* Cor amarela/dourada para o sol */}
  </mesh>
);

// Componente para uma única nuvem
const Cloud: React.FC<{ position: [number, number, number], scale: number }> = ({ position, scale }) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[-0.5, 0, 0]}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshStandardMaterial color="#FFFFFF" transparent opacity={0.7} />
    </mesh>
    <mesh position={[0.5, 0, 0]}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshStandardMaterial color="#FFFFFF" transparent opacity={0.7} />
    </mesh>
    <mesh position={[0, 0.5, 0]}>
      <sphereGeometry args={[0.6, 16, 16]} />
      <meshStandardMaterial color="#FFFFFF" transparent opacity={0.7} />
    </mesh>
  </group>
);

// Componente para as nuvens no céu
const Clouds: React.FC = () => {
  const cloudsRef = useRef<THREE.Group>(null);

  // Usando 'delta' para animação independente da taxa de quadros.
  useFrame((_, delta) => {
    if (cloudsRef.current) {
      // Animação de deslocamento das nuvens
      // Multiplicar por delta e um fator para ajustar a velocidade.
      cloudsRef.current.position.x += 0.002 * delta * 60; // Multiplicado por 60 para uma velocidade razoável
      if (cloudsRef.current.position.x > 30) {
        cloudsRef.current.position.x = -30;
      }
    }
  });

  return (
    <group ref={cloudsRef}>
      {/* Múltiplas instâncias de nuvens */}
      <Cloud position={[-15, 15, -10]} scale={2} />
      <Cloud position={[-5, 17, -15]} scale={1.5} />
      <Cloud position={[10, 16, -12]} scale={2.5} />
      <Cloud position={[20, 18, -8]} scale={1.8} />
      <Cloud position={[-20, 14, 5]} scale={2.2} />
      <Cloud position={[0, 15, 10]} scale={1.7} />
      <Cloud position={[15, 17, 15]} scale={2.1} />
    </group>
  );
};

// Componente para as gotas de chuva
const Rain: React.FC = () => {
  const rainDrops = useRef<THREE.Group>(null);
  const numDrops = 1000; // Número de gotas de chuva

  // Posições iniciais aleatórias para as gotas
  const initialPositions = useRef<Float32Array>(new Float32Array(numDrops * 3));
  useEffect(() => {
    for (let i = 0; i < numDrops; i++) {
      initialPositions.current[i * 3] = (Math.random() - 0.5) * 60; // X
      initialPositions.current[i * 3 + 1] = Math.random() * 30; // Y (altura inicial)
      initialPositions.current[i * 3 + 2] = (Math.random() - 0.5) * 60; // Z
    }
  }, []);

  // O parâmetro '_' não é utilizado, mas é um padrão comum para ignorar.
  // O parâmetro 'delta' É utilizado.
  useFrame((_, delta) => {
    if (rainDrops.current) {
      // É mais eficiente manipular a geometria diretamente se for um sistema de partículas,
      // mas para este exemplo, a manipulação direta das posições dos filhos é funcional.
      // Para alta performance com muitas gotas, considere usar Points ou InstancedMesh.
      rainDrops.current.children.forEach(child => {
        child.position.y -= 20 * delta; // Velocidade da queda, agora frame-rate independent
        if (child.position.y < -5) { // Resetar gota quando ela cair abaixo do terreno
          child.position.y = 30; // Altura para resetar
        }
      });
    }
  });

  return (
    <group ref={rainDrops}>
      {Array.from({ length: numDrops }).map((_, i) => (
        <mesh key={i} position={[initialPositions.current[i * 3], initialPositions.current[i * 3 + 1], initialPositions.current[i * 3 + 2]]}>
          <sphereGeometry args={[0.05, 8, 8]} /> {/* Pequenas esferas para gotas */}
          <meshBasicMaterial color="#ADD8E6" transparent opacity={0.6} /> {/* Azul claro transparente */}
        </mesh>
      ))}
    </group>
  );
};


const WaterAccessMap: React.FC<WaterAccessMapProps> = ({ onSelectRegion }) => {
  const { regions, seasonType } = useAppContext();
  const terrainGroup = useRef<THREE.Group>(null);
  const { scene } = useThree(); // Obter a cena para ajustar o nevoeiro.

  // Removido o estado hoveredRegionId, pois a manipulação direta da cor é mais robusta aqui.
  // const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // Estado para controlar as propriedades da luz e nevoeiro
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(1.5);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.4);
  const [fogColor, setFogColor] = useState(new THREE.Color('#f0f9ff'));
  const [fogNear, setFogNear] = useState(25);
  const [fogFar, setFogFar] = useState(45);

  // Adicionado um useRef para armazenar os dados das árvores gerados uma única vez.
  const treeData = useRef<{ x: number; z: number; scale: number }[]>([]);

  // Efeito para gerar os dados das árvores apenas uma vez ao montar o componente.
  useEffect(() => {
    if (treeData.current.length === 0) { // Garante que os dados sejam gerados apenas na primeira vez
      const generatedTrees = Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const radius = 15 + Math.random() * 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 1.5 + Math.random() * 0.8;
        return { x, z, scale };
      });
      treeData.current = generatedTrees;
    }
  }, []); // Array de dependências vazio para rodar apenas uma vez

  // Efeito para ajustar luzes e nevoeiro com base na estação
  useEffect(() => {
    if (seasonType === 'wet') {
      // Estação chuvosa: mais escuro, mais nevoeiro
      setDirectionalLightIntensity(0.8);
      setAmbientLightIntensity(0.6);
      setFogColor(new THREE.Color('#a0a0a0')); // Cor mais cinzenta para o nevoeiro
      setFogNear(15); // Nevoeiro começa mais perto
      setFogFar(35); // Nevoeiro mais denso
    } else {
      // Estação seca: mais claro, menos nevoeiro
      setDirectionalLightIntensity(1.5);
      setAmbientLightIntensity(0.4);
      setFogColor(new THREE.Color('#f0f9ff'));
      setFogNear(25);
      setFogFar(45);
    }
  }, [seasonType]);

  // Atualizar o nevoeiro da cena
  // A atualização de scene.fog é suficiente, e useFrame cuidará da renderização.
  useEffect(() => {
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
  }, [fogColor, fogNear, fogFar, scene]);


  // Removida a rotação do terrainGroup para que o mapa fique fixo.
  useFrame(() => {
    if (terrainGroup.current) {
      // A rotação do terreno foi removida para manter o mapa fixo,
      // conforme solicitado pelo usuário.
    }
  });

  /**
   * Lida com o clique em uma região do mapa.
   * Interrompe a propagação do evento e chama a função onSelectRegion.
   * @param {ThreeEvent<MouseEvent>} event - O evento de clique do @react-three/fiber.
   * @param {RegionData} region - Os dados da região clicada.
   */
  const handleRegionClick = (event: ThreeEvent<MouseEvent>, region: RegionData) => {
    event.stopPropagation();
    onSelectRegion(region);
  };

  /**
   * Cria um modelo 3D de árvore.
   * @param {number} scale - Fator de escala para a árvore.
   * @returns {JSX.Element} Grupo 3D representando uma árvore.
   */
  const createTree = (scale = 1) => (
    <group scale={[scale, scale, scale]}>
      {/* Tronco da árvore */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.5]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
      {/* Folhagem da árvore */}
      <mesh position={[0, 1.75, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.6, 2, 8]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>
    </group>
  );

  /**
   * Cria um segmento de rio.
   * @param {[number, number, number]} position - Posição do segmento do rio.
   * @returns {JSX.Element} Malha 3D representando um segmento de rio.
   */
  const createRiverSegment = (position: [number, number, number]) => (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} position-y={0.05}>
      <planeGeometry args={[2, 4]} />
      <meshStandardMaterial
        color="#3b82f6"
        transparent={true}
        opacity={0.4}
        metalness={0.33}
        roughness={0.6}
      />
    </mesh>
  );

  /**
   * Cria um modelo 3D de montanha.
   * @param {[number, number, number]} position - Posição da montanha.
   * @param {number} scale - Fator de escala para a montanha.
   * @returns {JSX.Element} Grupo 3D representando uma montanha.
   */
  const createMountain = (position: [number, number, number], scale = 1) => (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Base da montanha */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <coneGeometry args={[4, 8, 16]} />
        <meshStandardMaterial color="#7a7a7a" roughness={0.9} metalness={0.2} />
      </mesh>
      {/* Pico nevado opcional */}
      <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 2, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );

  /**
   * Cria um modelo 3D de morro (terreno irregular).
   * @param {[number, number, number]} position - Posição do morro.
   * @param {number} scale - Fator de escala para o morro.
   * @returns {JSX.Element} Grupo 3D representando um morro.
   */
  const createHill = (position: [number, number, number], scale = 1) => (
    <mesh position={position} scale={[scale, scale * 0.5, scale]} castShadow receiveShadow>
      <sphereGeometry args={[2, 16, 16]} /> {/* Esfera achatada para parecer um morro */}
      <meshStandardMaterial color="#90a955" roughness={0.9} metalness={0.1} />
    </mesh>
  );


  return (
    <group ref={terrainGroup} position={[0, -2, 0]}>
      {/* Plano de base do terreno */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40, 64, 64]} />
        <meshStandardMaterial
          color="#90a955"
          wireframe={false}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Grupo para os segmentos do rio */}
      <group position={[0, 0.1, 0]}>
        {createRiverSegment([0, 0, -8])}
        {createRiverSegment([1, 0, -4])}
        {createRiverSegment([0, 0, 0])}
        {createRiverSegment([-1, 0, 4])}
        {createRiverSegment([0, 0, 8])}
      </group>

      {/* Renderiza as regiões do mapa */}
      {regions.map((region) => {
        const regionData = region[seasonType];
        const baseColor = getRegionColor(regionData.waterAccessLevel);
        // Removido o uso de hoveredRegionId para a cor, pois a manipulação direta é mais robusta.
        // const displayColor = hoveredRegionId === region.id ? new THREE.Color(0xADD8E6) : new THREE.Color(baseColor);
        const elevation = 0.1 + (regionData.waterAccessLevel / 100) * 0.3;

        return (
          <group key={region.id} position={[region.x, 0.2, region.z]}>
            {/* Malha da região clicável */}
            <mesh
              castShadow
              receiveShadow
              onClick={(e) => handleRegionClick(e, { ...region, currentData: regionData })}
              onPointerOver={(e) => {
                document.body.style.cursor = 'pointer';
                if (e.object instanceof THREE.Mesh && e.object.material instanceof THREE.MeshStandardMaterial) {
                  // Armazena a cor original no userData do objeto Three.js
                  e.object.userData.originalColor = e.object.material.color.getHex();
                  // Define uma cor de destaque ao passar o mouse
                  e.object.material.color.set(0xADD8E6); // Ex: Azul claro para destaque
                }
                e.object.scale.y = 1.2; // Aumenta a escala Y ao passar o mouse
              }}
              onPointerOut={(e) => {
                document.body.style.cursor = 'default';
                if (e.object instanceof THREE.Mesh && e.object.material instanceof THREE.MeshStandardMaterial && e.object.userData.originalColor !== undefined) {
                  // Restaura a cor original ao tirar o mouse
                  e.object.material.color.set(e.object.userData.originalColor);
                }
                e.object.scale.y = 1; // Restaura a escala Y ao sair do mouse
              }}
            >
              <boxGeometry args={[region.width, elevation, region.depth]} />
              <meshStandardMaterial
                color={new THREE.Color(baseColor)} // FIX: Sempre usa a cor base original.
                roughness={0.7}
                metalness={0.1}
              />
            </mesh>

            {/* Renderiza árvores se o nível de acesso à água for alto */}
            {regionData.waterAccessLevel > 70 && (
              <group position={[0, elevation, 0]}>
                {[[-0.4, 0.4], [0.4, -0.4], [-0.4, -0.4], [0.4, 0.4]].map(([x, z], i) => (
                  <mesh key={i} position={[x, 0, z]} rotation={[0, Math.random() * Math.PI, 0]}>
                    <coneGeometry args={[0.15, 0.3, 4]} />
                    <meshStandardMaterial color="#4a5a23" />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        );
      })}

      {/* Renderiza árvores espalhadas pelo mapa */}
      {treeData.current.map((tree, i) => (
        <group key={`tree-${i}`} position={[tree.x, 0, tree.z]}>
          {createTree(tree.scale)}
        </group>
      ))}

      {/* Adicionar um estábulo */}
      <Stable position={[10, 0, -10]} /> {/* Posição do estábulo */}

     

      {/* Adicionar algumas montanhas de terra e morrinhos */}
      {createMountain([-18, 0, -18], 2)}
      {createMountain([18, 0, -18], 1.5)}
      {createMountain([-15, 0, 15], 1.8)}
      {createMountain([10, 0, 18], 2.2)}
      {createHill([-5, 0, -15], 1.5)} {/* Exemplo de morro */}
     


      {/* Sol */}
      <Sun position={[20, 15, -20]} />

      {/* Nuvens */}
      <Clouds />

      {/* Chuva (condicionalmente renderizada) */}
      {seasonType === 'wet' && <Rain />}

      {/* Luzes da cena */}
      <directionalLight position={[5, 10, 5]} intensity={directionalLightIntensity} castShadow>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
      </directionalLight>
      <directionalLight position={[-5, 8, -5]} intensity={ambientLightIntensity * 0.5} /> {/* Luz auxiliar */}
      <ambientLight intensity={ambientLightIntensity} />

      {/* Nevoeiro para profundidade visual */}
      {/* O nevoeiro é atualizado via useEffect */}
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
    </group>
  );
};

// Envolva o componente com React.memo para otimização de renderização.
export default memo(WaterAccessMap);
