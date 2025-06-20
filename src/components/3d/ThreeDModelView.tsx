import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { sectors } from '../../data/sectors';
import { DashboardOverlay } from '../dashboard/DashboardOverlay';
import { Maximize2, Minimize2, RotateCcw, ZoomIn, BarChart3 } from 'lucide-react';
import { createSectorModel } from './models';
import { updateShaders } from './shaders/AnimatedShaders';

export const ThreeDModelView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModel, setActiveModel] = useState('farm');
  const [showOverlay, setShowOverlay] = useState(true);
  
  const { id: sectorId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 8, 15);
    cameraRef.current = camera;
    
    // Renderer setup with improved settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controlsRef.current = controls;
    
    // Animation loop with shader updates
    const animate = () => {
      requestAnimationFrame(animate);
      
      const elapsedTime = clockRef.current.getElapsedTime();
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (sceneRef.current) {
        updateShaders(sceneRef.current, elapsedTime);
      }
      
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener('resize', handleResize);
    
    // Create initial model
    if (sceneRef.current) {
      createSectorModel(sceneRef.current, activeModel);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  // Reset camera position
  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    cameraRef.current.position.set(15, 8, 15);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };
  
  // Zoom to center
  const zoomToCenter = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const newPosition = new THREE.Vector3(0, 15, 0);
    cameraRef.current.position.copy(newPosition);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  // Update model when sector changes
  useEffect(() => {
    if (activeModel !== sectorId && sectorId && sceneRef.current) {
      setActiveModel(sectorId);
      createSectorModel(sceneRef.current, sectorId);
    }
  }, [sectorId, activeModel]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold mb-2">Visualização 3D Interativa</h2>
        <p className="text-gray-600 mb-4">
          Explore o modelo 3D interativo dos setores agrícolas. Selecione um setor para visualizar dados específicos com animações e shaders aprimorados.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {sectors.map(sector => (
            <button
              key={sector.id}
              onClick={() => {
                setActiveModel(sector.id);
                if (sceneRef.current) {
                  createSectorModel(sceneRef.current, sector.id);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeModel === sector.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <sector.icon className="h-4 w-4" />
                <span>{sector.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative flex-1 bg-gray-100 rounded-lg shadow-md overflow-hidden">
        <div 
          ref={containerRef} 
          className="w-full h-full"
        ></div>
        
        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={toggleFullscreen}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5 text-gray-700" />
            ) : (
              <Maximize2 className="h-5 w-5 text-gray-700" />
            )}
          </button>
          
          <button 
            onClick={resetCamera}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={zoomToCenter}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={() => setShowOverlay(!showOverlay)}
            className={`p-2 rounded-full shadow-md transition-colors ${
              showOverlay ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
          </button>
        </div>
        
        {/* Dashboard Overlay */}
        {showOverlay && (
          <DashboardOverlay sectorId={activeModel} />
        )}
      </div>
    </div>
  );
};
