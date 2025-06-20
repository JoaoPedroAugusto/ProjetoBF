import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, // Used for the main icon, similar to BananaIcon
  TrendingUp,
  MapPin,
  Leaf, // Can be used for growth rate/productivity icon
  Presentation,
  BarChart3,
  DollarSign,
  Target,
  Droplets,
  Thermometer,
  Wind,
} from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView'; // Assuming this component exists
import { PresentationManager } from '../../components/presentation'; // Assuming this component exists

export const SugarcanePage = () => {
  const [showPresentation, setShowPresentation] = useState(false);

  // Simulated data for sugarcane
  const sectorData = {
    overview: {
      totalArea: '2.847 hectares',
      production: '142.350 toneladas',
      productivity: '50 ton/ha',
      revenue: 'R$ 28.470.000',
      growthRate: '+12.5%',
      efficiency: '87%',
      mainVariety: 'RB92579',
      cutCycle: '3º Corte',
      nextHarvest: 'Maio 2025',
      workers: '156 pessoas',
    },
    weather: {
      temperature: '28°C',
      humidity: '65%',
      rainfall: '1.250mm/ano',
      windSpeed: '12 km/h',
      soilMoisture: '72%',
    },
    alerts: [
      { type: 'warning', message: 'Período de seca previsto para próximas 2 semanas', priority: 'alta' },
      { type: 'info', message: 'Época ideal para aplicação de fertilizantes', priority: 'média' },
      { type: 'success', message: 'Crescimento dentro do esperado para a época', priority: 'baixa' },
    ],
    recentActivities: [
      { date: '2024-06-15', activity: 'Aplicação de herbicida', area: '450 ha', status: 'concluído' },
      { date: '2024-06-12', activity: 'Irrigação por aspersão', area: '1.200 ha', status: 'concluído' },
      { date: '2024-06-10', activity: 'Análise de solo', area: '300 ha', status: 'em andamento' },
      { date: '2024-06-08', activity: 'Plantio de mudas', area: '180 ha', status: 'concluído' },
    ],
  };

  if (showPresentation) {
    return (
      <PresentationManager
        sectorId="sugarcane"
        sectorName="Cana-de-Açúcar"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
      <div className="relative bg-gradient-to-r from-green-700 to-lime-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Activity className="h-12 w-12 mr-4" /> {/* Changed to Activity icon for sugarcane */}
              <h1 className="text-4xl md:text-6xl font-bold">Cana-de-Açúcar</h1>
            </div>
            <button
              onClick={() => setShowPresentation(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
            >
              <Presentation className="h-5 w-5" />
              <span>Apresentação</span>
            </button>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            A cana-de-açúcar é uma cultura de grande importância agrícola e econômica, utilizada na produção de açúcar, etanol e bioenergia.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Area Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-green-700 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Área Total</h3>
            </div>
            <p className="text-3xl font-bold text-green-700">{sectorData.overview.totalArea}</p>
            <div className="mt-2 flex items-center text-gray-600">
              <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
              <span>{sectorData.overview.growthRate} vs mês anterior</span>
            </div>
          </div>

          {/* Production Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-lime-600">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-lime-700 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Produção</h3>
            </div>
            <p className="text-3xl font-bold text-lime-700">{sectorData.overview.production}</p>
            <div className="mt-2 flex items-center text-gray-600">
              <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
              <span>+8.2% vs ano anterior</span>
            </div>
          </div>

          {/* Productivity Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-600">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-emerald-700 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Produtividade</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-700">{sectorData.overview.productivity}</p>
            <div className="mt-2 flex items-center text-gray-600">
              <Leaf className="h-5 w-5 text-emerald-500 mr-1" />
              <span>Eficiência: {sectorData.overview.efficiency}</span>
            </div>
          </div>
        </div>

        {/* 3D Model Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Modelo 3D Interativo</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Placeholder for 3D Model View. Replace with actual 3D model component if available. */}
            <ThreeDModelView sectorId="sugarcane" />
          </div>
        </div>

        {/* Detailed Sections: Quick Info & Weather (Combined and Simplified) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Quick Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações Rápidas</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-base text-gray-600">Variedade Principal</span>
                <span className="text-base font-semibold text-gray-900">{sectorData.overview.mainVariety}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-base text-gray-600">Ciclo de Corte</span>
                <span className="text-base font-semibold text-gray-900">{sectorData.overview.cutCycle}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-base text-gray-600">Próxima Colheita</span>
                <span className="text-base font-semibold text-gray-900">{sectorData.overview.nextHarvest}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base text-gray-600">Trabalhadores</span>
                <span className="text-base font-semibold text-gray-900">{sectorData.overview.workers}</span>
              </div>
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Condições Climáticas</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg shadow-sm">
                <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Temperatura</p>
                <p className="text-xl font-bold text-gray-900">{sectorData.weather.temperature}</p>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg shadow-sm">
                <Droplets className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Umidade</p>
                <p className="text-xl font-bold text-gray-900">{sectorData.weather.humidity}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg shadow-sm">
                <Wind className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Vento</p>
                <p className="text-xl font-bold text-gray-900">{sectorData.weather.windSpeed}</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg shadow-sm">
                <Leaf className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Umidade do Solo</p>
                <p className="text-xl font-bold text-gray-900">{sectorData.weather.soilMoisture}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts and Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Alertas e Notificações</h2>
          <div className="space-y-4">
            {sectorData.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-400'
                    : alert.type === 'info'
                    ? 'bg-blue-50 border-blue-400'
                    : 'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                    {alert.type === 'info' && <BarChart3 className="h-5 w-5 text-blue-600" />}
                    {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        alert.type === 'warning'
                          ? 'text-yellow-800'
                          : alert.type === 'info'
                          ? 'text-blue-800'
                          : 'text-green-800'
                      }`}
                    >
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Prioridade: {alert.priority}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Atividades Recentes</h2>
          <div className="space-y-4">
            {sectorData.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.activity}</p>
                  <p className="text-sm text-gray-600">Área: {activity.area}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'concluído'
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'em andamento'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};