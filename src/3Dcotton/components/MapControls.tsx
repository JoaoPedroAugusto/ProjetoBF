import React from 'react';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
// Importamos OrbitControls com a extensão .js para resolver o erro de compilação.
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const MapControls: React.FC = () => {
  // Removido 'camera' da desestruturação, pois não está sendo usado diretamente neste componente,
  // resolvendo o aviso de variável não utilizada.
  const { controls } = useThree();

  /**
   * Função auxiliar para garantir que o objeto 'controls' é uma instância de OrbitControls.
   * Isso nos permite usar os métodos específicos de OrbitControls com segurança e tipagem correta.
   * @returns {OrbitControls | undefined} A instância de OrbitControls se encontrada, caso contrário, undefined.
   */
  const getOrbitControls = (): OrbitControls | undefined => {
    // Verifica se 'controls' existe e é uma instância de OrbitControls.
    if (controls && controls instanceof OrbitControls) {
      return controls;
    }
    // Emite um aviso se o tipo de controle não for o esperado, o que pode indicar
    // uma configuração incorreta na cena Three.js pai.
    console.warn('Os controles não são uma instância de OrbitControls ou estão indefinidos.');
    return undefined;
  };

  /**
   * Lida com a ação de zoom in (aproximar) para os controles do mapa.
   * Usa o método 'dolly' do OrbitControls para aproximar a câmera.
   */
  const handleZoomIn = () => {
    const orbitControls = getOrbitControls();
    if (orbitControls) {
      // O método 'dolly' do OrbitControls controla o zoom.
      // Um fator menor que 1 (ex: 0.8) faz a câmera se aproximar (zoom in).
      // FIX: Adicionado 'as any' para a chamada de dolly para contornar o problema de tipagem.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (orbitControls as any).dolly(0.8);
      // Atualiza os controles para aplicar a mudança.
      orbitControls.update();
    }
  };

  /**
   * Lida com a ação de zoom out (afastar) para os controles do mapa.
   * Usa o método 'dolly' do OrbitControls para afastar a câmera.
   */
  const handleZoomOut = () => {
    const orbitControls = getOrbitControls();
    if (orbitControls) {
      // Um fator maior que 1 (ex: 1.2) faz a câmera se afastar (zoom out).
      // FIX: Adicionado 'as any' para a chamada de dolly para contornar o problema de tipagem.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (orbitControls as any).dolly(1.2);
      // Atualiza os controles para aplicar a mudança.
      orbitControls.update();
    }
  };

  /**
   * Lida com a ação de reset dos controles do mapa.
   * Redefine a posição da câmera e o alvo para seus estados iniciais.
   */
  const handleReset = () => {
    const orbitControls = getOrbitControls();
    if (orbitControls) {
      // Chama o método 'reset()' do OrbitControls para retornar à vista inicial.
      orbitControls.reset();
      // Atualiza os controles para aplicar a mudança.
      orbitControls.update();
    }
  };

  /**
   * Lida com a alternância do modo de tela cheia para o documento inteiro.
   */
  const handleFullscreen = () => {
    const element = document.documentElement; // Obtém o elemento HTML raiz.
    if (!document.fullscreenElement) {
      // Se não estiver em tela cheia, solicita o modo tela cheia.
      // O 'as any' ainda é usado aqui devido a pequenas variações nas implementações
      // da API Fullscreen entre navegadores e a tipagem estrita do TypeScript.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (element as any).requestFullscreen().catch((err: Error) => {
        console.error(`Erro ao tentar ativar tela cheia: ${err.message}`);
      });
    } else {
      // Se estiver em tela cheia, sai do modo tela cheia.
      document.exitFullscreen().catch((err: Error) => {
        console.error(`Erro ao tentar sair da tela cheia: ${err.message}`);
      });
    }
  };

  return (
    // O componente Html do @react-three/drei permite renderizar elementos HTML padrão
    // dentro da cena Three.js, posicionados em relação ao espaço 3D.
    <Html position={[0, 0, 0]} style={{ position: 'absolute', right: '-470px', top: '-245px', zIndex: 30 }}>
      <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
        <div className="flex flex-col space-y-2">
          {/* Botão de Zoom In */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded"
            title="Zoom In"
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-5 h-5 text-gray-600" />
          </button>
          {/* Botão de Zoom Out */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded"
            title="Zoom Out"
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-5 h-5 text-gray-600" />
          </button>
          {/* Botão de Resetar Vista */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded"
            title="Resetar Vista"
            onClick={handleReset}
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
          {/* Botão de Tela Cheia */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded"
            title="Tela Cheia"
            onClick={handleFullscreen}
          >
            <Maximize className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </Html>
  );
};

export default MapControls;
