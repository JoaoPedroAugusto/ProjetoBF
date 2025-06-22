import React, { createContext, useContext, useState, useEffect, useRef, memo, useMemo, Suspense } from 'react';
import { Activity, BarChart3, TrendingUp, DollarSign, Target, Droplets, Presentation, Info, Lightbulb, Leaf, Map, BarChart, FileText, Thermometer, CloudRain, Sprout, CalendarDays } from 'lucide-react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './App.css';

interface RegionWaterData {
  waterAccessLevel: number;  // 0-100 percentage
  precipitation: number;     // mm
  temperature: number;       // Celsius
  soilMoisture: number;      // percentage
  lastUpdated: Date;
}

interface RegionShape {
  id: string;
  name: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  dry: RegionWaterData;
  wet: RegionWaterData;
}

interface RegionData extends RegionShape {
  currentData: RegionWaterData;
}

type RegionDataset = RegionShape[];

/* --- Funções Utilitárias --- */
const getRegionColor = (waterAccessLevel: number): string => {
  if (waterAccessLevel >= 80) return "#22c55e"; // Green
  if (waterAccessLevel >= 60) return "#3b82f6"; // Blue
  if (waterAccessLevel >= 40) return "#eab308"; // Yellow
  if (waterAccessLevel >= 20) return "#f97316"; // Orange
  return "#ef4444"; // Red
};

/* --- Dados Mock --- */
const generateMockData = (): RegionDataset => {
  const regions: RegionDataset = [];
  const gridSize = 8;
  const spacing = 2.5;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = (i - gridSize / 2) * spacing;
      const z = (j - gridSize / 2) * spacing;

      // Calculate water access based on distance from river (centered at x=0)
      const distanceFromRiver = Math.abs(x);

      // Add some natural variation
      const variation = Math.random() * 10;

      // Base water access levels - higher near river, lower at edges
      const baseWaterAccessDry = Math.min(95, Math.max(20,
        distanceFromRiver < 2 ?
          85 + variation : // Near river (Ótimo/Bom)
          distanceFromRiver < 4 ?
            60 + variation : // Medium distance (Moderado)
            30 + variation   // Far from river (Deficiente/Crítico)
      ));

      const baseWaterAccessWet = Math.min(100, baseWaterAccessDry + 15 + Math.random() * 5);

      regions.push({
        id: `region-${i}-${j}`,
        name: `Field ${String.fromCharCode(65 + i)}${j + 1}`,
        x,
        z,
        width: 2,
        depth: 2,
        dry: {
          waterAccessLevel: Math.round(baseWaterAccessDry),
          precipitation: Math.round(100 + Math.random() * 150),
          temperature: Math.round(28 + Math.random() * 5),
          soilMoisture: Math.round(baseWaterAccessDry * 0.8),
          lastUpdated: new Date()
        },
        wet: {
          waterAccessLevel: Math.round(baseWaterAccessWet),
          precipitation: Math.round(300 + Math.random() * 200),
          temperature: Math.round(24 + Math.random() * 3),
          soilMoisture: Math.round(baseWaterAccessWet * 0.9),
          lastUpdated: new Date()
        }
      });
    }
  }

  return regions;
};

/* --- Contexto da Aplicação --- */
interface AppContextType {
  regions: RegionDataset;
  isLoading: boolean;
  seasonType: 'dry' | 'wet';
  setSeasonType: (season: 'dry' | 'wet') => void;
  toggleSimulation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [regions, setRegions] = useState<RegionDataset>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seasonType, setSeasonType] = useState<'dry' | 'wet'>('dry');
  
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData = generateMockData();
      setRegions(mockData);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [seasonType]);
  
  const toggleSimulation = () => {
    setSeasonType(prev => prev === 'dry' ? 'wet' : 'dry');
  };
  
  return (
    <AppContext.Provider value={{
      regions,
      isLoading,
      seasonType,
      setSeasonType,
      toggleSimulation
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

/* --- Componentes --- */
interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  unit?: string;
  color?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, icon, unit, color = 'text-blue-600' }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
    <div className={`p-2 rounded-full bg-opacity-20 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value}{unit && <span className="text-sm font-normal"> {unit}</span>}</p>
    </div>
  </div>
);

const InfoPanel: React.FC = () => {
  return (
    <div className="p-4 text-gray-600">
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <Info className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecione uma Região</h3>
          <p className="text-gray-500">Clique em uma das regiões no mapa 3D para ver detalhes sobre o acesso à água e outras informações.</p>
        </div>
      </div>
    </div>
  );
};

const MapLegend: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Acesso à Água</h4>
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
          <span className="text-xs text-gray-700">Ótimo (80-100%)</span>
        </div>
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
          <span className="text-xs text-gray-700">Bom (60-79%)</span>
        </div>
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
          <span className="text-xs text-gray-700">Moderado (40-59%)</span>
        </div>
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-orange-500 mr-2"></span>
          <span className="text-xs text-gray-700">Deficiente (20-39%)</span>
        </div>
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-red-500 mr-2"></span>
          <span className="text-xs text-gray-700">Crítico (0-19%)</span>
        </div>
      </div>
    </div>
  );
};

interface RegionDetailProps {
  region: RegionData;
}

const RegionDetail: React.FC<RegionDetailProps> = ({ region }) => {
  const { name, currentData } = region;
  const { waterAccessLevel, precipitation, temperature, soilMoisture, lastUpdated } = currentData;

  const getWaterAccessStatus = (level: number) => {
    if (level >= 80) return { text: 'Ótimo', color: 'text-green-600' };
    if (level >= 60) return { text: 'Bom', color: 'text-blue-600' };
    if (level >= 40) return { text: 'Moderado', color: 'text-yellow-600' };
    if (level >= 20) return { text: 'Deficiente', color: 'text-orange-600' };
    return { text: 'Crítico', color: 'text-red-600' };
  };

  const waterStatus = getWaterAccessStatus(waterAccessLevel);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">Detalhes da Região: {name}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg flex items-center space-x-3">
          <Droplets className="h-6 w-6 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Acesso à Água</p>
            <p className={`text-lg font-semibold ${waterStatus.color}`}>{waterAccessLevel}% ({waterStatus.text})</p>
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg flex items-center space-x-3">
          <CloudRain className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Precipitação (últimas 24h)</p>
            <p className="text-lg font-semibold text-green-800">{precipitation} mm</p>
          </div>
        </div>

        <div className="bg-red-50 p-3 rounded-lg flex items-center space-x-3">
          <Thermometer className="h-6 w-6 text-red-600" />
          <div>
            <p className="text-sm text-gray-600">Temperatura Média</p>
            <p className="text-lg font-semibold text-red-800">{temperature}°C</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg flex items-center space-x-3">
          <Sprout className="h-6 w-6 text-yellow-600" />
          <div>
            <p className="text-sm text-gray-600">Umidade do Solo</p>
            <p className="text-lg font-semibold text-yellow-800">{soilMoisture}%</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4 text-sm text-gray-500 flex items-center space-x-2">
        <CalendarDays className="h-4 w-4" />
        <span>Última atualização: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

const SolutionRecommendations: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Recomendações de Soluções</h3>
      <p className="text-gray-600">Com base nos dados, aqui estão algumas recomendações para otimizar o acesso à água e a produtividade:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm flex items-start space-x-3">
          <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-blue-800">Monitoramento Inteligente</h4>
            <p className="text-sm text-gray-700">Utilize sensores de solo e estações meteorológicas para monitorar em tempo real a umidade do solo e as condições climáticas.</p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow-sm flex items-start space-x-3">
          <Leaf className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-green-800">Irrigação de Precisão</h4>
            <p className="text-sm text-gray-700">Adote sistemas de irrigação que entregam água diretamente às raízes das plantas, minimizando o desperdício e otimizando o uso da água.</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm flex items-start space-x-3">
          <DollarSign className="h-6 w-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-yellow-800">Análise de Custo-Benefício</h4>
            <p className="text-sm text-gray-700">Avalie o retorno sobre o investimento de novas tecnologias e práticas, garantindo que as soluções sejam economicamente viáveis.</p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg shadow-sm flex items-start space-x-3">
          <Target className="h-6 w-6 text-purple-600 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-purple-800">Manejo Integrado</h4>
            <p className="text-sm text-gray-700">Combine diferentes estratégias, como rotação de culturas e uso de variedades resistentes, para melhorar a resiliência e a produtividade.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WaterAccessChartProps {
  region: RegionData;
}

const WaterAccessChart: React.FC<WaterAccessChartProps> = ({ region }) => {
  const data = [
    { name: 'Acesso à Água', value: region.currentData.waterAccessLevel, unit: '%' },
    { name: 'Precipitação', value: region.currentData.precipitation, unit: 'mm' },
    { name: 'Temperatura', value: region.currentData.temperature, unit: '°C' },
    { name: 'Umidade do Solo', value: region.currentData.soilMoisture, unit: '%' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Dados Detalhados da Região</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number, name: string, props: any) => [`${value} ${props.payload.unit}`, name]} />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente principal simplificado para demonstração
const MapaDinamico: React.FC = () => {
  const { regions, isLoading, seasonType, toggleSimulation } = useAppContext();
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);

  const processedRegions = useMemo(() => {
    return regions.map(region => ({
      ...region,
      currentData: seasonType === 'dry' ? region.dry : region.wet
    }));
  }, [regions, seasonType]);

  // Simular seleção de região para demonstração
  const handleRegionSelect = (regionId: string) => {
    const region = processedRegions.find(r => r.id === regionId);
    if (region) {
      setSelectedRegion(region);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Carregando dados das regiões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mapa Dinâmico de Acesso à Água - Algodão
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Visualização interativa dos dados de acesso à água nas regiões de cultivo
          </p>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={toggleSimulation}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Alternar para {seasonType === 'dry' ? 'Estação Chuvosa' : 'Estação Seca'}
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Estação atual: <span className="font-semibold">{seasonType === 'dry' ? 'Seca' : 'Chuvosa'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de informações */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações da Região</h2>
              {selectedRegion ? (
                <RegionDetail region={selectedRegion} />
              ) : (
                <InfoPanel />
              )}
            </div>
            
            {selectedRegion && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <WaterAccessChart region={selectedRegion} />
              </div>
            )}
          </div>

          {/* Área do mapa */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <div className="absolute top-4 right-4 z-10">
                <MapLegend />
              </div>
              
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Map className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Mapa 3D Interativo</p>
                  <p className="text-sm">Clique nas regiões para ver detalhes</p>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {processedRegions.slice(0, 8).map((region) => (
                      <button
                        key={region.id}
                        onClick={() => handleRegionSelect(region.id)}
                        className="p-2 rounded text-xs text-white font-semibold"
                        style={{ backgroundColor: getRegionColor(region.currentData.waterAccessLevel) }}
                      >
                        {region.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <SolutionRecommendations />
            </div>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <InfoCard
            title="Regiões Monitoradas"
            value={processedRegions.length}
            icon={<Map className="h-6 w-6" />}
            color="text-blue-600"
          />
          <InfoCard
            title="Acesso Médio à Água"
            value={Math.round(processedRegions.reduce((acc, r) => acc + r.currentData.waterAccessLevel, 0) / processedRegions.length)}
            unit="%"
            icon={<Droplets className="h-6 w-6" />}
            color="text-green-600"
          />
          <InfoCard
            title="Temperatura Média"
            value={Math.round(processedRegions.reduce((acc, r) => acc + r.currentData.temperature, 0) / processedRegions.length)}
            unit="°C"
            icon={<Thermometer className="h-6 w-6" />}
            color="text-red-600"
          />
          <InfoCard
            title="Precipitação Média"
            value={Math.round(processedRegions.reduce((acc, r) => acc + r.currentData.precipitation, 0) / processedRegions.length)}
            unit="mm"
            icon={<CloudRain className="h-6 w-6" />}
            color="text-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MapaDinamico />
    </AppProvider>
  );
}

export default App;
  waterAccessLevel: number;  // 0-100 percentage
  precipitation: number;     // mm
  temperature: number;       // Celsius
  soilMoisture: number;      // percentage
  lastUpdated: Date;
}

interface RegionShape {
  id: string;
  name: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  dry: RegionWaterData;
  wet: RegionWaterData;
}

interface RegionData extends RegionShape {
  currentData: RegionWaterData;
}

type RegionDataset = RegionShape[];

/* --- Funções Utilitárias --- */
const getRegionColor = (waterAccessLevel: number): string => {
  if (waterAccessLevel >= 80) return "#22c55e"; // Green
  if (waterAccessLevel >= 60) return "#3b82f6"; // Blue
  if (waterAccessLevel >= 40) return "#eab308"; // Yellow
  if (waterAccessLevel >= 20) return "#f97316"; // Orange
  return "#ef4444"; // Red
};

/* --- Dados Mock --- */
const generateMockData = (): RegionDataset => {
  const regions: RegionDataset = [];
  const gridSize = 8;
  const spacing = 2.5;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = (i - gridSize / 2) * spacing;
      const z = (j - gridSize / 2) * spacing;

      // Calculate water access based on distance from river (centered at x=0)
      const distanceFromRiver = Math.abs(x);

      // Add some natural variation
      const variation = Math.random() * 10;

      // Base water access levels - higher near river, lower at edges
      const baseWaterAccessDry = Math.min(95, Math.max(20,
        distanceFromRiver < 2 ?
          85 + variation : // Near river (Ótimo/Bom)
          distanceFromRiver < 4 ?
            60 + variation : // Medium distance (Moderado)
            30 + variation   // Far from river (Deficiente/Crítico)
      ));

      const baseWaterAccessWet = Math.min(100, baseWaterAccessDry + 15 + Math.random() * 5);

      regions.push({
        id: `region-${i}-${j}`,
        name: `Field ${String.fromCharCode(65 + i)}${j + 1}`,
        x,
        z,
        width: 2,
        depth: 2,
        dry: {
          waterAccessLevel: Math.round(baseWaterAccessDry),
          precipitation: Math.round(100 + Math.random() * 150),
          temperature: Math.round(28 + Math.random() * 5),
          soilMoisture: Math.round(baseWaterAccessDry * 0.8),
          lastUpdated: new Date()
        },
        wet: {
          waterAccessLevel: Math.round(baseWaterAccessWet),
          precipitation: Math.round(300 + Math.random() * 200),
          temperature: Math.round(24 + Math.random() * 3),
          soilMoisture: Math.round(baseWaterAccessWet * 0.9),
          lastUpdated: new Date()
        }
      });
    }
  }

  return regions;
};

/* --- Contexto da Aplicação --- */
interface AppContextType {
  regions: RegionDataset;
  isLoading: boolean;
  seasonType: 'dry' | 'wet';
  setSeasonType: (season: 'dry' | 'wet') => void;
  toggleSimulation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [regions, setRegions] = useState<RegionDataset>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seasonType, setSeasonType] = useState<'dry' | 'wet'>('dry');
  
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData = generateMockData();
      setRegions(mockData);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [seasonType]);
  
  const toggleSimulation = () => {
    setSeasonType(prev => prev === 'dry' ? 'wet' : 'dry');
  };
  
  return (
    <AppContext.Provider value={{
      regions,
      isLoading,
      seasonType,
      setSeasonType,
      toggleSimulation
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

/* --- Componentes --- */
interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  unit?: string;
  color?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, icon, unit, color = 'text-blue-600' }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
    <div className={`p-2 rounded-full bg-opacity-20 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value}{unit && <span className="text-sm font-normal"> {unit}</span>}</p>
    </div>
  </div>
);

const InfoPanel: React.FC = () => {
  return (
    <div className="p-4 text-gray-600">
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <Info className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecione uma Região</h3>
          <p className="text-gray-500">Clique em uma das regiões no mapa 3D para ver detalhes sobre o acesso à água e outras informações.</p>
        </div>
      </div>
    </div>
  );
};

const MapLegend: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Acesso à Água</h4>
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
          <span className="text-xs text-gray-700">Ótimo (80-100%)</span>
        </div>
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
          <span className="text-xs text-gray-700">Bom (60-79%)</span>
        </div>
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
          <span className="text-xs text-gray-700">Moderado (40-59%)</span>
        </div>
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-orange-500 mr-2"></span>
          <span className="text-xs text-gray-700">Deficiente (20-39%)</span>
        </div>
        <div className="flex items-center">
          <span className="block w-4 h-4 rounded-full bg-red-500 mr-2"></span>
          <span className="text-xs text-gray-700">Crítico (0-19%)</span>
        </div>
      </div>
    </div>
  );
};

interface RegionDetailProps {
  region: RegionData;
}

const RegionDetail: React.FC<RegionDetailProps> = ({ region }) => {
  const { name, currentData } = region;
  const { waterAccessLevel, precipitation, temperature, soilMoisture, lastUpdated } = currentData;

  const getWaterAccessStatus = (level: number) => {
    if (level >= 80) return { text: 'Ótimo', color: 'text-green-600' };
    if (level >= 60) return { text: 'Bom', color: 'text-blue-600' };
    if (level >= 40) return { text: 'Moderado', color: 'text-yellow-600' };
    if (level >= 20) return { text: 'Deficiente', color: 'text-orange-600' };
    return { text: 'Crítico', color: 'text-red-600' };
  };

  const waterStatus = getWaterAccessStatus(waterAccessLevel);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">Detalhes da Região: {name}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg flex items-center space-x-3">
          <Droplets className="h-6 w-6 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Acesso à Água</p>
            <p className={`text-lg font-semibold ${waterStatus.color}`}>{waterAccessLevel}% ({waterStatus.text})</p>
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg flex items-center space-x-3">
          <CloudRain className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Precipitação (últimas 24h)</p>
            <p className="text-lg font-semibold text-green-800">{precipitation} mm</p>
          </div>
        </div>

        <div className="bg-red-50 p-3 rounded-lg flex items-center space-x-3">
          <Thermometer className="h-6 w-6 text-red-600" />
          <div>
            <p className="text-sm text-gray-600">Temperatura Média</p>
            <p className="text-lg font-semibold text-red-800">{temperature}°C</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg flex items-center space-x-3">
          <Sprout className="h-6 w-6 text-yellow-600" />
          <div>
            <p className="text-sm text-gray-600">Umidade do Solo</p>
            <p className="text-lg font-semibold text-yellow-800">{soilMoisture}%</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4 text-sm text-gray-500 flex items-center space-x-2">
        <CalendarDays className="h-4 w-4" />
        <span>Última atualização: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

const MapControls: React.FC = () => {
  const { camera, gl } = useThree();
  return (
    <OrbitControls 
      args={[camera, gl.domElement]}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={15}
      maxDistance={35}
    />
  );
};

const SolutionRecommendations: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Recomendações de Soluções</h3>
      <p className="text-gray-600">Com base nos dados, aqui estão algumas recomendações para otimizar o acesso à água e a produtividade:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm flex items-start space-x-3">
          <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-blue-800">Monitoramento Inteligente</h4>
            <p className="text-sm text-gray-700">Utilize sensores de solo e estações meteorológicas para monitorar em tempo real a umidade do solo e as condições climáticas.</p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow-sm flex items-start space-x-3">
          <Leaf className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-green-800">Irrigação de Precisão</h4>
            <p className="text-sm text-gray-700">Adote sistemas de irrigação que entregam água diretamente às raízes das plantas, minimizando o desperdício e otimizando o uso da água.</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm flex items-start space-x-3">
          <DollarSign className="h-6 w-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-yellow-800">Análise de Custo-Benefício</h4>
            <p className="text-sm text-gray-700">Avalie o retorno sobre o investimento de novas tecnologias e práticas, garantindo que as soluções sejam economicamente viáveis.</p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg shadow-sm flex items-start space-x-3">
          <Target className="h-6 w-6 text-purple-600 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-purple-800">Manejo Integrado</h4>
            <p className="text-sm text-gray-700">Combine diferentes estratégias, como rotação de culturas e uso de variedades resistentes, para melhorar a resiliência e a produtividade.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WaterAccessChartProps {
  region: RegionData;
}

const WaterAccessChart: React.FC<WaterAccessChartProps> = ({ region }) => {
  const data = [
    { name: 'Acesso à Água', value: region.currentData.waterAccessLevel, unit: '%' },
    { name: 'Precipitação', value: region.currentData.precipitation, unit: 'mm' },
    { name: 'Temperatura', value: region.currentData.temperature, unit: '°C' },
    { name: 'Umidade do Solo', value: region.currentData.soilMoisture, unit: '%' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Dados Detalhados da Região</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number, name: string, props: any) => [`${value} ${props.payload.unit}`, name]} />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente principal simplificado para demonstração
const MapaDinamico: React.FC = () => {
  const { regions, isLoading, seasonType, toggleSimulation } = useAppContext();
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);

  const processedRegions = useMemo(() => {
    return regions.map(region => ({
      ...region,
      currentData: seasonType === 'dry' ? region.dry : region.wet
    }));
  }, [regions, seasonType]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Carregando dados das regiões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mapa Dinâmico de Acesso à Água - Algodão
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Visualização interativa dos dados de acesso à água nas regiões de cultivo
          </p>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={toggleSimulation}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Alternar para {seasonType === 'dry' ? 'Estação Chuvosa' : 'Estação Seca'}
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Estação atual: <span className="font-semibold">{seasonType === 'dry' ? 'Seca' : 'Chuvosa'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de informações */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações da Região</h2>
              {selectedRegion ? (
                <RegionDetail region={selectedRegion} />
              ) : (
                <InfoPanel />
              )}
            </div>
            
            {selectedRegion && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <WaterAccessChart region={selectedRegion} />
              </div>
            )}
          </div>

          {/* Área do mapa */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <div className="absolute top-4 right-4 z-10">
                <MapLegend />
              </div>
              
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Map className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Mapa 3D Interativo</p>
                  <p className="text-sm">Clique nas regiões para ver detalhes</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <SolutionRecommendations />
            </div>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <InfoCard
            title="Regiões Monitoradas"
            value={processedRegions.length}
            icon={<Map className="h-6 w-6" />}
            color="text-blue-600"
          />
          <InfoCard
            title="Acesso Médio à Água"
            value={Math.round(processedRegions.reduce((acc, r) => acc + r.currentData.waterAccessLevel, 0) / processedRegions.length)}
            unit="%"
            icon={<Droplets className="h-6 w-6" />}
            color="text-green-600"
          />
          <InfoCard
            title="Temperatura Média"
            value={Math.round(processedRegions.reduce((acc, r) => acc + r.currentData.temperature, 0) / processedRegions.length)}
            unit="°C"
            icon={<Thermometer className="h-6 w-6" />}
            color="text-red-600"
          />
          <InfoCard
            title="Precipitação Média"
            value={Math.round(processedRegions.reduce((acc, r) => acc + r.currentData.precipitation, 0) / processedRegions.length)}
            unit="mm"
            icon={<CloudRain className="h-6 w-6" />}
            color="text-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MapaDinamico />
    </AppProvider>
  );
}

export default App;>
    </>
  )
}

export default App
