import React from 'react';
import { ChevronLeft, Droplets, CloudRain, Thermometer, Wind, ArrowUpRight } from 'lucide-react';
import { RegionData } from '../types';
import SolutionRecommendations from './SolutionRecommendations';

interface RegionDetailProps {
  region: RegionData;
}

const RegionDetail: React.FC<RegionDetailProps> = ({ region }) => {
  // FIX: Removido 'id' da desestruturação, pois não é utilizado neste componente.
  const { name, currentData } = region;
  const { waterAccessLevel, precipitation, temperature, soilMoisture } = currentData;

  /**
   * Determina a categoria de nível de acesso à água com base no valor.
   * @param {number} level - O nível de acesso à água (0-100).
   * @returns {string} A categoria correspondente (Ótimo, Bom, Moderado, Deficiente, Crítico).
   */
  const getAccessLevelCategory = (level: number): string => {
    if (level >= 80) return 'Ótimo';
    if (level >= 60) return 'Bom';
    if (level >= 40) return 'Moderado';
    if (level >= 20) return 'Deficiente';
    return 'Crítico';
  };

  /**
   * Retorna a classe CSS de cor Tailwind para o nível de acesso à água.
   * @param {number} level - O nível de acesso à água (0-100).
   * @returns {string} A classe CSS de cor.
   */
  const getAccessLevelColor = (level: number): string => {
    if (level >= 80) return 'text-green-600';
    if (level >= 60) return 'text-blue-600';
    if (level >= 40) return 'text-yellow-600';
    if (level >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        {/* Botão para voltar à tela anterior usando o histórico do navegador */}
        <button
          onClick={() => window.history.back()}
          className="p-1 rounded-full hover:bg-gray-100 mr-2"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        {/* Título da região */}
        <h2 className="text-xl font-semibold text-gray-800">Região {name}</h2>
      </div>

      {/* Cartão de Acesso Hídrico */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Droplets className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-sm text-gray-600">Acesso Hídrico</span>
          </div>
          <div className="flex items-center">
            <span className={`text-xl font-bold ${getAccessLevelColor(waterAccessLevel)}`}>
              {waterAccessLevel}%
            </span>
          </div>
        </div>
        <div className="mt-2">
          {/* Barra de progresso do nível de acesso à água */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${waterAccessLevel}%`,
                backgroundColor: waterAccessLevel >= 80 ? '#22c55e' :
                               waterAccessLevel >= 60 ? '#3b82f6' :
                               waterAccessLevel >= 40 ? '#eab308' :
                               waterAccessLevel >= 20 ? '#f97316' : '#ef4444'
              }}
            ></div>
          </div>
          {/* Classificação do nível de acesso à água */}
          <p className="text-sm mt-1 text-gray-600">
            Classificação: <span className={`font-medium ${getAccessLevelColor(waterAccessLevel)}`}>
              {getAccessLevelCategory(waterAccessLevel)}
            </span>
          </p>
        </div>
      </div>

      {/* Grid de informações adicionais (Precipitação, Temperatura, Umidade do Solo) */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Cartão de Precipitação */}
        <div className="bg-white border border-gray-200 p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <CloudRain className="h-5 w-5 text-blue-500 mr-1" />
            <p className="text-sm text-gray-600">Precipitação</p>
          </div>
          <p className="text-lg font-medium">{precipitation} mm</p>
        </div>

        {/* Cartão de Temperatura */}
        <div className="bg-white border border-gray-200 p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <Thermometer className="h-5 w-5 text-orange-500 mr-1" />
            <p className="text-sm text-gray-600">Temperatura</p>
          </div>
          <p className="text-lg font-medium">{temperature}°C</p>
        </div>

        {/* Cartão de Umidade do Solo */}
        <div className="bg-white border border-gray-200 p-3 rounded-lg">
          <div className="flex items-center mb-2">
            <Wind className="h-5 w-5 text-teal-500 mr-1" />
            <p className="text-sm text-gray-600">Umidade do Solo</p>
          </div>
          <p className="text-lg font-medium">{soilMoisture}%</p>
        </div>

        {/* Botão para ver dados históricos */}
        <div className="bg-white border border-gray-200 p-3 rounded-lg flex items-center justify-center">
          <button className="text-blue-600 text-sm font-medium flex items-center">
            Ver dados históricos
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Componente de Recomendações de Solução, exibido apenas se o acesso à água for baixo */}
      {waterAccessLevel < 60 && (
        <SolutionRecommendations waterAccessLevel={waterAccessLevel} />
      )}
    </div>
  );
};

export default RegionDetail;
