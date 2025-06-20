import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Droplets, Thermometer, Wind, Sun, BarChart3, Calendar, MapPin, Users, DollarSign, Activity, Target, Zap } from 'lucide-react';
import { PresentationManager } from '../../components/presentation';


export const SugarcanePage = () => {
  const [showPresentation, setShowPresentation, activeTab, setActiveTab] = useState('overview');

    if (showPresentation) {
      return (
        <PresentationManager 
          sectorId="sugarcane" 
          sectorName="cana-de-açúcar"
        />
      );
    }
  
  // Dados simulados para cana-de-açúcar
  const sectorData = {
    overview: {
      totalArea: '2.847 hectares',
      production: '142.350 toneladas',
      productivity: '50 ton/ha',
      revenue: 'R$ 28.470.000',
      growthRate: '+12.5%',
      efficiency: '87%'
    },
    weather: {
      temperature: '28°C',
      humidity: '65%',
      rainfall: '1.250mm/ano',
      windSpeed: '12 km/h',
      soilMoisture: '72%'
    },
    alerts: [
      { type: 'warning', message: 'Período de seca previsto para próximas 2 semanas', priority: 'alta' },
      { type: 'info', message: 'Época ideal para aplicação de fertilizantes', priority: 'média' },
      { type: 'success', message: 'Crescimento dentro do esperado para a época', priority: 'baixa' }
    ],
    recentActivities: [
      { date: '2024-06-15', activity: 'Aplicação de herbicida', area: '450 ha', status: 'concluído' },
      { date: '2024-06-12', activity: 'Irrigação por aspersão', area: '1.200 ha', status: 'concluído' },
      { date: '2024-06-10', activity: 'Análise de solo', area: '300 ha', status: 'em andamento' },
      { date: '2024-06-08', activity: 'Plantio de mudas', area: '180 ha', status: 'concluído' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'production', label: 'Produção', icon: TrendingUp },
    { id: 'weather', label: 'Clima', icon: Sun },
    { id: 'activities', label: 'Atividades', icon: Calendar }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cana-de-Açúcar</h1>
            <p className="text-gray-600 mt-1">Monitoramento e gestão da produção de cana-de-açúcar</p>
          </div>
              <button
              onClick={() => setShowPresentation(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
            >
              <Presentation className="h-5 w-5" />
              <span>Apresentação</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Área Total</p>
                <p className="text-2xl font-bold text-green-900">{sectorData.overview.totalArea}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">{sectorData.overview.growthRate}</span>
              <span className="text-sm text-gray-600 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Produção</p>
                <p className="text-2xl font-bold text-blue-900">{sectorData.overview.production}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+8.2%</span>
              <span className="text-sm text-gray-600 ml-1">vs ano anterior</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Produtividade</p>
                <p className="text-2xl font-bold text-purple-900">{sectorData.overview.productivity}</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">Eficiência: </span>
              <span className="text-sm text-purple-600 font-medium ml-1">{sectorData.overview.efficiency}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Receita</p>
                <p className="text-2xl font-bold text-amber-900">{sectorData.overview.revenue}</p>
              </div>
              <div className="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+15.3%</span>
              <span className="text-sm text-gray-600 ml-1">vs ano anterior</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Alertas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas e Notificações</h3>
                  <div className="space-y-4">
                    {sectorData.alerts.map((alert, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 ${
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                        alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                        'bg-green-50 border-green-400'
                      }`}>
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                            {alert.type === 'info' && <BarChart3 className="h-5 w-5 text-blue-600" />}
                            {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className={`text-sm font-medium ${
                              alert.type === 'warning' ? 'text-yellow-800' :
                              alert.type === 'info' ? 'text-blue-800' :
                              'text-green-800'
                            }`}>
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Prioridade: {alert.priority}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfico de Produção */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução da Produção</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Gráfico de produção mensal</p>
                      <p className="text-sm text-gray-400">Dados dos últimos 12 meses</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Informações Rápidas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Rápidas</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Variedade Principal</span>
                      <span className="text-sm font-medium text-gray-900">RB92579</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ciclo de Corte</span>
                      <span className="text-sm font-medium text-gray-900">3º Corte</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Próxima Colheita</span>
                      <span className="text-sm font-medium text-gray-900">Maio 2025</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trabalhadores</span>
                      <span className="text-sm font-medium text-gray-900">156 pessoas</span>
                    </div>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Programar Irrigação
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Gerar Relatório
                    </button>
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                      Agendar Manutenção
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Condições Climáticas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Temperatura</p>
                  <p className="text-xl font-bold text-gray-900">{sectorData.weather.temperature}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Umidade</p>
                  <p className="text-xl font-bold text-gray-900">{sectorData.weather.humidity}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Wind className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Vento</p>
                  <p className="text-xl font-bold text-gray-900">{sectorData.weather.windSpeed}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Atividades Recentes</h3>
              <div className="space-y-4">
                {sectorData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.activity}</p>
                      <p className="text-sm text-gray-600">Área: {activity.area}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'concluído' ? 'bg-green-100 text-green-800' :
                      activity.status === 'em andamento' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

