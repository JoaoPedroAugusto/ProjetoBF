import React, { useState } from 'react';
import { Activity, BarChart3, TrendingUp, DollarSign, Target, AlertTriangle, CheckCircle, Thermometer, Droplets, Wind, Calendar, Presentation } from 'lucide-react';
import { PresentationManager } from '../../components/presentation';

export const CottonPage = () => {
  const [showPresentation, setShowPresentation] = useState(false);

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
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Algodão</h1>
              <p className="text-gray-600 mt-1">Monitoramento e gestão da produção de algodão</p>
            </div>
          </div>
          <button
            onClick={() => setShowPresentation(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Presentation className="h-5 w-5" />
            <span>Apresentação</span>
          </button>
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
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+8.7%</span>
              <span className="text-sm text-gray-600 ml-1">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Produção</p>
                <p className="text-2xl font-bold text-green-900">95.200 toneladas</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12.3%</span>
              <span className="text-sm text-gray-600 ml-1">vs ano anterior</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Produtividade</p>
                <p className="text-2xl font-bold text-purple-900">51.5 ton/ha</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">Eficiência: </span>
              <span className="text-sm text-purple-600 font-medium ml-1">89%</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Receita</p>
                <p className="text-2xl font-bold text-amber-900">R$ 19.040.000</p>
              </div>
              <div className="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+18.2%</span>
              <span className="text-sm text-gray-600 ml-1">vs ano anterior</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alertas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas e Monitoramento</h3>
            <div className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Alerta Climático</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Chuvas intensas previstas para as próximas 48 horas. Considere ajustar cronogramas de irrigação.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Época de Plantio</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Condições ideais para plantio de algodão nas próximas duas semanas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Qualidade da Fibra</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Qualidade da fibra acima da média para a época do ano.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Condições Climáticas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Condições Climáticas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Temperatura</p>
                <p className="text-xl font-bold text-gray-900">26°C</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Droplets className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Umidade</p>
                <p className="text-xl font-bold text-gray-900">72%</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Wind className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Vento</p>
                <p className="text-xl font-bold text-gray-900">8 km/h</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Chuva</p>
                <p className="text-xl font-bold text-gray-900">15mm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Informações Rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Rápidas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Variedade Principal</span>
                <span className="text-sm font-medium text-gray-900">BRS 368</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ciclo de Cultivo</span>
                <span className="text-sm font-medium text-gray-900">150 dias</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Próxima Colheita</span>
                <span className="text-sm font-medium text-gray-900">Julho 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trabalhadores</span>
                <span className="text-sm font-medium text-gray-900">98 pessoas</span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Programar Irrigação
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Gerar Relatório
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                Agendar Manutenção
              </button>
              <button className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors">
                Ver Histórico
              </button>
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Aplicação de Defensivo</p>
                  <p className="text-xs text-gray-600">320 hectares</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Concluído</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Irrigação por Gotejamento</p>
                  <p className="text-xs text-gray-600">850 hectares</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Em Andamento</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Análise de Qualidade</p>
                  <p className="text-xs text-gray-600">200 hectares</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Agendado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

