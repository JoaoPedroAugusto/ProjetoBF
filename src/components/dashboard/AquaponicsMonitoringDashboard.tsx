import React, { useState, useEffect } from 'react';
import {
  Fish,
  Droplets,
  Thermometer,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Presentation,
  Gauge,
  Waves,
  Leaf
} from 'lucide-react';

interface DashboardProps {
  onBack?: () => void;
}

export const AquaponicsMonitoringDashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulação de dados em tempo real
  interface SensorData {
    waterQuality: {
      ph: number;
      temperature: number;
      oxygenLevel: number;
      ammonia: number;
      nitrite: number;
      nitrate: number;
    };
    fishHealth: {
      count: number;
      feedingRate: number;
      mortality: number;
      growth: number;
    };
    plantGrowth: {
      leafyGreens: number;
      herbs: number;
      tomatoes: number;
      peppers: number;
    };
    systemStatus: {
      pumps: string;
      filters: string;
      heaters: string;
      lights: string;
    };
    alerts: {
      id: number;
      type: string;
      message: string;
      time: string;
    }[];
  }

  const [sensorData, setSensorData] = useState<SensorData>({
    waterQuality: {
      ph: 7.2,
      temperature: 24.5,
      oxygenLevel: 8.2,
      ammonia: 0.1,
      nitrite: 0.05,
      nitrate: 15.2
    },
    fishHealth: {
      count: 245,
      feedingRate: 92,
      mortality: 0.8,
      growth: 15.3
    },
    plantGrowth: {
      leafyGreens: 87,
      herbs: 93,
      tomatoes: 78,
      peppers: 82
    },
    systemStatus: {
      pumps: 'operational',
      filters: 'operational',
      heaters: 'operational',
      lights: 'operational'
    },
    alerts: [
      { id: 1, type: 'warning', message: 'Nível de nitrato ligeiramente elevado', time: '14:30' },
      { id: 2, type: 'info', message: 'Alimentação automática realizada', time: '12:00' },
      { id: 3, type: 'success', message: 'pH estabilizado', time: '10:15' }
    ]
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simular mudanças nos dados
      setSensorData(prev => ({
        ...prev,
        waterQuality: {
          ...prev.waterQuality,
          temperature: 24.5 + (Math.random() - 0.5) * 0.5,
          oxygenLevel: 8.2 + (Math.random() - 0.5) * 0.3
        }
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (showPresentation) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Modo Apresentação</h2>
          <button
            onClick={() => setShowPresentation(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'operational': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  interface AlertIconProps {
    alertType: string;
  }

  const getAlertIcon = (alertType: string): JSX.Element => {
    switch (alertType) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Fish className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">AquaSense Dashboard</h1>
                <p className="text-blue-100">Monitoramento Inteligente de Aquaponia</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Última atualização</p>
                <p className="font-semibold">{currentTime.toLocaleTimeString()}</p>
              </div>
              <button
                onClick={() => setShowPresentation(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
              >
                <Presentation className="h-4 w-4" />
                <span>Apresentação</span>
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg ml-4"
                >
                  Voltar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualidade da Água</p>
                <p className="text-2xl font-bold text-blue-600">Excelente</p>
              </div>
              <Droplets className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>pH: {sensorData.waterQuality.ph}</span>
                <span className="text-green-500">●</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Peixes Ativos</p>
                <p className="text-2xl font-bold text-green-600">{sensorData.fishHealth.count}</p>
              </div>
              <Fish className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>Taxa de crescimento</span>
                <span className="text-green-500">+{sensorData.fishHealth.growth}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temperatura</p>
                <p className="text-2xl font-bold text-yellow-600">{sensorData.waterQuality.temperature.toFixed(1)}°C</p>
              </div>
              <Thermometer className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>Ideal: 24-26°C</span>
                <span className="text-green-500">●</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtividade</p>
                <p className="text-2xl font-bold text-purple-600">+25%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>vs. mês anterior</span>
                <span className="text-green-500">↗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Water Quality Monitoring */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Waves className="h-6 w-6 mr-2 text-blue-500" />
                Monitoramento da Qualidade da Água
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Gauge className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600">pH</p>
                  <p className="text-xl font-bold text-blue-600">{sensorData.waterQuality.ph}</p>
                  <p className="text-xs text-green-500">Normal</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm text-gray-600">Oxigênio</p>
                  <p className="text-xl font-bold text-green-600">{sensorData.waterQuality.oxygenLevel.toFixed(1)} mg/L</p>
                  <p className="text-xs text-green-500">Ótimo</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Thermometer className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-sm text-gray-600">Temperatura</p>
                  <p className="text-xl font-bold text-yellow-600">{sensorData.waterQuality.temperature.toFixed(1)}°C</p>
                  <p className="text-xs text-green-500">Ideal</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Droplets className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-gray-600">Amônia</p>
                  <p className="text-xl font-bold text-purple-600">{sensorData.waterQuality.ammonia} mg/L</p>
                  <p className="text-xs text-green-500">Baixo</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <p className="text-sm text-gray-600">Nitrito</p>
                  <p className="text-xl font-bold text-red-600">{sensorData.waterQuality.nitrite} mg/L</p>
                  <p className="text-xs text-green-500">Seguro</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-gray-600">Nitrato</p>
                  <p className="text-xl font-bold text-orange-600">{sensorData.waterQuality.nitrate} mg/L</p>
                  <p className="text-xs text-yellow-500">Atenção</p>
                </div>
              </div>
            </div>

            {/* Plant Growth Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Leaf className="h-6 w-6 mr-2 text-green-500" />
                Status do Crescimento das Plantas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Folhas Verdes</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${sensorData.plantGrowth.leafyGreens}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{sensorData.plantGrowth.leafyGreens}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Ervas</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${sensorData.plantGrowth.herbs}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{sensorData.plantGrowth.herbs}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Tomates</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${sensorData.plantGrowth.tomatoes}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold text-red-600">{sensorData.plantGrowth.tomatoes}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Pimentões</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${sensorData.plantGrowth.peppers}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold text-yellow-600">{sensorData.plantGrowth.peppers}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Settings className="h-6 w-6 mr-2 text-gray-500" />
                Status do Sistema
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Bombas</span>
                  <span className={`font-semibold ${getStatusColor(sensorData.systemStatus.pumps)}`}>
                    Operacional
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Filtros</span>
                  <span className={`font-semibold ${getStatusColor(sensorData.systemStatus.filters)}`}>
                    Operacional
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Aquecedores</span>
                  <span className={`font-semibold ${getStatusColor(sensorData.systemStatus.heaters)}`}>
                    Operacional
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Iluminação</span>
                  <span className={`font-semibold ${getStatusColor(sensorData.systemStatus.lights)}`}>
                    Operacional
                  </span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-yellow-500" />
                Alertas Recentes
              </h3>
              <div className="space-y-3">
                {sensorData.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Estatísticas Rápidas</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg">
                  <p className="text-sm">Economia de Água</p>
                  <p className="text-2xl font-bold">25%</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg">
                  <p className="text-sm">Redução de Perdas</p>
                  <p className="text-2xl font-bold">30%</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg">
                  <p className="text-sm">Aumento Produtividade</p>
                  <p className="text-2xl font-bold">20%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
