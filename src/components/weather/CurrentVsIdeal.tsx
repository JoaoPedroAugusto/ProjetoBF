import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ConditionComparison {
  parameter: string;
  atual: number;
  ideal: number;
  unidade: string;
  status: 'acima' | 'abaixo' | 'ideal';
}

interface CurrentVsIdealProps {
  cultura?: string;
}

// Dados simulados baseados na cultura selecionada
const getComparisonData = (cultura: string): ConditionComparison[] => {
  const baseData = {
    soja: [
      { parameter: 'Temperatura', atual: 28, ideal: 25, unidade: '°C', status: 'acima' as const },
      { parameter: 'Umidade Ar', atual: 65, ideal: 70, unidade: '%', status: 'abaixo' as const },
      { parameter: 'Umidade Solo', atual: 45, ideal: 60, unidade: '%', status: 'abaixo' as const },
      { parameter: 'Precipitação', atual: 3.2, ideal: 4.0, unidade: 'mm/dia', status: 'abaixo' as const },
      { parameter: 'Radiação Solar', atual: 85, ideal: 80, unidade: '%', status: 'acima' as const },
      { parameter: 'Vento', atual: 12, ideal: 15, unidade: 'km/h', status: 'abaixo' as const },
    ],
    milho: [
      { parameter: 'Temperatura', atual: 28, ideal: 27, unidade: '°C', status: 'acima' as const },
      { parameter: 'Umidade Ar', atual: 65, ideal: 65, unidade: '%', status: 'ideal' as const },
      { parameter: 'Umidade Solo', atual: 45, ideal: 55, unidade: '%', status: 'abaixo' as const },
      { parameter: 'Precipitação', atual: 3.2, ideal: 3.5, unidade: 'mm/dia', status: 'abaixo' as const },
      { parameter: 'Radiação Solar', atual: 85, ideal: 85, unidade: '%', status: 'ideal' as const },
      { parameter: 'Vento', atual: 12, ideal: 10, unidade: 'km/h', status: 'acima' as const },
    ],
    tomate: [
      { parameter: 'Temperatura', atual: 28, ideal: 24, unidade: '°C', status: 'acima' as const },
      { parameter: 'Umidade Ar', atual: 65, ideal: 75, unidade: '%', status: 'abaixo' as const },
      { parameter: 'Umidade Solo', atual: 45, ideal: 70, unidade: '%', status: 'abaixo' as const },
      { parameter: 'Precipitação', atual: 3.2, ideal: 5.0, unidade: 'mm/dia', status: 'abaixo' as const },
      { parameter: 'Radiação Solar', atual: 85, ideal: 75, unidade: '%', status: 'acima' as const },
      { parameter: 'Vento', atual: 12, ideal: 8, unidade: 'km/h', status: 'acima' as const },
    ],
    algodao: [
      { parameter: 'Temperatura', atual: 28, ideal: 30, unidade: '°C', status: 'abaixo' as const },
      { parameter: 'Umidade Ar', atual: 65, ideal: 60, unidade: '%', status: 'acima' as const },
      { parameter: 'Umidade Solo', atual: 45, ideal: 50, unidade: '%', status: 'abaixo' as const },
      { parameter: 'Precipitação', atual: 3.2, ideal: 3.0, unidade: 'mm/dia', status: 'acima' as const },
      { parameter: 'Radiação Solar', atual: 85, ideal: 90, unidade: '%', status: 'abaixo' as const },
      { parameter: 'Vento', atual: 12, ideal: 12, unidade: 'km/h', status: 'ideal' as const },
    ],
    cana: [
      { parameter: 'Temperatura', atual: 28, ideal: 26, unidade: '°C', status: 'acima' as const },
      { parameter: 'Umidade Ar', atual: 65, ideal: 80, unidade: '%', status: 'abaixo' as const },
      { parameter: 'Umidade Solo', atual: 45, ideal: 65, unidade: '%', status: 'abaixo' as const },
      { parameter: 'Precipitação', atual: 3.2, ideal: 4.5, unidade: 'mm/dia', status: 'abaixo' as const },
      { parameter: 'Radiação Solar', atual: 85, ideal: 85, unidade: '%', status: 'ideal' as const },
      { parameter: 'Vento', atual: 12, ideal: 14, unidade: 'km/h', status: 'abaixo' as const },
    ],
  };

  return baseData[cultura as keyof typeof baseData] || baseData.soja;
};

export const CurrentVsIdeal: React.FC<CurrentVsIdealProps> = ({ cultura = 'soja' }) => {
  const comparisonData = getComparisonData(cultura);

  // Preparar dados para o gráfico radar
  const radarData = comparisonData.map(item => ({
    parameter: item.parameter,
    atual: (item.atual / item.ideal) * 100,
    ideal: 100,
  }));

  // Preparar dados para o gráfico de barras
  const barData = comparisonData.map(item => ({
    parameter: item.parameter,
    atual: item.atual,
    ideal: item.ideal,
    diferenca: item.atual - item.ideal,
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'acima':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'abaixo':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case 'ideal':
        return <Minus className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'acima':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'abaixo':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'ideal':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const statusCounts = {
    ideal: comparisonData.filter(item => item.status === 'ideal').length,
    acima: comparisonData.filter(item => item.status === 'acima').length,
    abaixo: comparisonData.filter(item => item.status === 'abaixo').length,
  };

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Condições Atuais vs Ideais - {cultura.charAt(0).toUpperCase() + cultura.slice(1)}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-900">{statusCounts.ideal}</div>
            <div className="text-sm text-green-700">Parâmetros Ideais</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-900">{statusCounts.acima}</div>
            <div className="text-sm text-red-700">Acima do Ideal</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-900">{statusCounts.abaixo}</div>
            <div className="text-sm text-blue-700">Abaixo do Ideal</div>
          </div>
        </div>

        {/* Gráfico Radar */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="parameter" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 150]} 
                tick={{ fontSize: 10, fill: '#6b7280' }}
              />
              <Radar
                name="Condições Atuais"
                dataKey="atual"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Condições Ideais"
                dataKey="ideal"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparação Detalhada */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Comparação Detalhada</h4>
        
        <div className="space-y-3">
          {comparisonData.map((item, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <div className="font-medium">{item.parameter}</div>
                    <div className="text-sm opacity-75">
                      Atual: {item.atual}{item.unidade} | Ideal: {item.ideal}{item.unidade}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {item.status === 'acima' && '+'}
                    {item.status === 'abaixo' && ''}
                    {item.status === 'ideal' && '±'}
                    {item.status !== 'ideal' && (item.atual - item.ideal).toFixed(1)}
                    {item.status === 'ideal' && '0'}
                    {item.unidade}
                  </div>
                  <div className="text-xs opacity-75">
                    {((item.atual / item.ideal - 1) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Barras Comparativo */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Comparação Visual</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="parameter" 
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="atual" 
                fill="#ef4444" 
                name="Atual"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="ideal" 
                fill="#10b981" 
                name="Ideal"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

