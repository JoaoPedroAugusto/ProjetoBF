import React, { useState, Suspense } from 'react';
import { Activity, BarChart3, TrendingUp, DollarSign, Target, AlertTriangle, CheckCircle, Thermometer, Droplets, Wind, Calendar, Presentation, Map, X, Leaf } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PresentationManager } from '../../components/presentation';

// Importar componentes do mapa 3D
import WaterAccessMap from '../../3Dcotton/components/WaterAccessMap';
import MapLegend from '../../3Dcotton/components/MapLegend';
import MapControls from '../../3Dcotton/components/MapControls';
import InfoPanel from '../../3Dcotton/components/InfoPanel';
import RegionDetail from '../../3Dcotton/components/RegionDetail';
import { AppProvider as MapAppProvider, useAppContext } from '../../3Dcotton/context/AppContext';
import { RegionData } from '../../3Dcotton/types';

// Componente do Mapa 3D Dinâmico
const MapContainer3D: React.FC<{ onSelectRegion: (region: RegionData | null) => void }> = ({ onSelectRegion }) => {
  const { isLoading, seasonType, setSeasonType } = useAppContext();
  
  return (
    <div className="relative w-full h-full bg-sky-50">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Carregando mapa 3D...</p>
          </div>
        </div>
      )}
      
      <Canvas
        camera={{ position: [0, 20, 25], fov: 45 }}
        shadows
        className="w-full h-full"
      >
        <color attach="background" args={['#f0f9ff']} />
        <Suspense fallback={null}>
          <WaterAccessMap onSelectRegion={onSelectRegion} />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={15}
            maxDistance={35}
          />
          <MapControls />
        </Suspense>
      </Canvas>
      
      <div className="absolute top-4 left-4 z-20">
        <MapLegend />
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
          <div className="space-y-1">
            <select 
              value={seasonType} 
              onChange={(e) => setSeasonType(e.target.value as 'dry' | 'wet')}
              className="w-full text-xs p-1.5 border border-gray-200 rounded"
            >
              <option value="dry">Estação Seca</option>
              <option value="wet">Estação Chuvosa</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CottonPage = () => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showMap3D, setShowMap3D] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);

  if (showPresentation) {
    return (
      <PresentationManager 
        sectorId="cotton" 
        sectorName="Algodão"
      />
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <Leaf className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Algodão</h1>
              <p className="text-gray-600 mt-1">Monitoramento e gestão da produção de algodão</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowMap3D(!showMap3D)}
              className={`${
                showMap3D 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors`}
            >
              {showMap3D ? <X className="h-5 w-5" /> : <Map className="h-5 w-5" />}
              <span>{showMap3D ? 'Fechar Mapa' : 'Mapa 3D Dinâmico'}</span>
            </button>
            <button
              onClick={() => setShowPresentation(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Presentation className="h-5 w-5" />
              <span>Apresentação</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Área Plantada</p>
                <p className="text-2xl font-bold text-blue-900">1.850 hectares</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12% vs mês anterior</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Produção Estimada</p>
                <p className="text-2xl font-bold text-green-900">4.250 toneladas</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">Meta: 95% atingida</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Preço Médio</p>
                <p className="text-2xl font-bold text-yellow-900">R$ 4,80/kg</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">+8% vs trimestre</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Qualidade</p>
                <p className="text-2xl font-bold text-purple-900">92%</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">Padrão excelente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área do Mapa 3D - Carregado na mesma página */}
      {showMap3D && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Map className="h-6 w-6 text-blue-600 mr-2" />
              Mapa 3D Dinâmico - Acesso à Água
            </h2>
            <p className="text-gray-600 mt-1">Visualização interativa dos dados de acesso à água nas regiões de cultivo</p>
          </div>
          
          <div className="flex" style={{ height: '600px' }}>
            {/* Área do Mapa 3D */}
            <div className="flex-1 relative">
              <MapAppProvider>
                <MapContainer3D onSelectRegion={setSelectedRegion} />
              </MapAppProvider>
            </div>

            {/* Painel de Informações */}
            <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
              <MapAppProvider>
                {selectedRegion ? (
                  <RegionDetail region={selectedRegion} />
                ) : (
                  <InfoPanel />
                )}
              </MapAppProvider>
            </div>
          </div>
        </div>
      )}

      {/* Condições Climáticas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Condições Climáticas Atuais</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-100">
            <Thermometer className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Temperatura</p>
              <p className="text-xl font-bold text-gray-900">28°C</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Droplets className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Umidade</p>
              <p className="text-xl font-bold text-gray-900">65%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <Wind className="h-8 w-8 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Vento</p>
              <p className="text-xl font-bold text-gray-900">12 km/h</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
            <Calendar className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Última Chuva</p>
              <p className="text-xl font-bold text-gray-900">3 dias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas e Recomendações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            Alertas Ativos
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
              <p className="text-sm font-medium text-orange-800">Irrigação Necessária</p>
              <p className="text-xs text-orange-600">Setor Norte - Umidade do solo abaixo de 40%</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm font-medium text-yellow-800">Monitoramento de Pragas</p>
              <p className="text-xs text-yellow-600">Verificar presença de bicudo nas próximas 48h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Recomendações
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-sm font-medium text-blue-800">Otimização de Irrigação</p>
              <p className="text-xs text-blue-600">Implementar sistema de gotejamento no setor leste</p>
            </div>
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <p className="text-sm font-medium text-green-800">Aplicação de Fertilizante</p>
              <p className="text-xs text-green-600">Período ideal para aplicação de potássio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

