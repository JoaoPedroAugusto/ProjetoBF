import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, LineChart } from 'recharts';

interface PrecipitationData {
  date: string;
  precipitacao: number;
  umidadeAr: number;
  umidadeSolo: number;
}

interface PrecipitationAnalysisProps {
  data?: PrecipitationData[];
}

// Dados simulados para demonstração
const defaultData: PrecipitationData[] = [
  { date: '01/06', precipitacao: 0, umidadeAr: 65, umidadeSolo: 45 },
  { date: '02/06', precipitacao: 2, umidadeAr: 70, umidadeSolo: 48 },
  { date: '03/06', precipitacao: 0, umidadeAr: 60, umidadeSolo: 42 },
  { date: '04/06', precipitacao: 0, umidadeAr: 55, umidadeSolo: 38 },
  { date: '05/06', precipitacao: 15, umidadeAr: 85, umidadeSolo: 65 },
  { date: '06/06', precipitacao: 8, umidadeAr: 78, umidadeSolo: 58 },
  { date: '07/06', precipitacao: 0, umidadeAr: 68, umidadeSolo: 52 },
  { date: '08/06', precipitacao: 0, umidadeAr: 62, umidadeSolo: 46 },
  { date: '09/06', precipitacao: 0, umidadeAr: 58, umidadeSolo: 41 },
  { date: '10/06', precipitacao: 5, umidadeAr: 72, umidadeSolo: 50 },
  { date: '11/06', precipitacao: 12, umidadeAr: 80, umidadeSolo: 62 },
  { date: '12/06', precipitacao: 0, umidadeAr: 70, umidadeSolo: 55 },
  { date: '13/06', precipitacao: 0, umidadeAr: 65, umidadeSolo: 48 },
  { date: '14/06', precipitacao: 0, umidadeAr: 60, umidadeSolo: 44 },
];

export const PrecipitationAnalysis: React.FC<PrecipitationAnalysisProps> = ({ data = defaultData }) => {
  const totalPrecipitacao = data.reduce((acc, item) => acc + item.precipitacao, 0);
  const mediaPrecipitacao = totalPrecipitacao / data.length;
  const mediaUmidadeAr = data.reduce((acc, item) => acc + item.umidadeAr, 0) / data.length;
  const mediaUmidadeSolo = data.reduce((acc, item) => acc + item.umidadeSolo, 0) / data.length;

  return (
    <div className="space-y-6">
      {/* Gráfico de Precipitação */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Precipitação (mm)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
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
              <Bar 
                dataKey="precipitacao" 
                fill="#3b82f6" 
                name="Precipitação (mm)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Umidade */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Umidade (%)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 100]}
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
              <Line 
                type="monotone" 
                dataKey="umidadeAr" 
                stroke="#06b6d4" 
                strokeWidth={2}
                name="Umidade do Ar"
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="umidadeSolo" 
                stroke="#84cc16" 
                strokeWidth={2}
                name="Umidade do Solo"
                dot={{ fill: '#84cc16', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Métricas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-800">Precipitação Total</div>
          <div className="text-2xl font-bold text-blue-900">{totalPrecipitacao.toFixed(1)} mm</div>
          <div className="text-xs text-blue-600">Últimos 14 dias</div>
        </div>
        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
          <div className="text-sm font-medium text-cyan-800">Umidade Ar Média</div>
          <div className="text-2xl font-bold text-cyan-900">{mediaUmidadeAr.toFixed(1)}%</div>
          <div className="text-xs text-cyan-600">Últimos 14 dias</div>
        </div>
        <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
          <div className="text-sm font-medium text-lime-800">Umidade Solo Média</div>
          <div className="text-2xl font-bold text-lime-900">{mediaUmidadeSolo.toFixed(1)}%</div>
          <div className="text-xs text-lime-600">Últimos 14 dias</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="text-sm font-medium text-indigo-800">Dias com Chuva</div>
          <div className="text-2xl font-bold text-indigo-900">
            {data.filter(item => item.precipitacao > 0).length}
          </div>
          <div className="text-xs text-indigo-600">Últimos 14 dias</div>
        </div>
      </div>

      {/* Análise de Correlação */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Análise de Correlação</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-800 mb-2">Precipitação vs Umidade do Solo</h5>
            <p className="text-sm text-gray-600">
              Correlação positiva observada: aumentos na precipitação resultam em maior umidade do solo com delay de 1-2 dias.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-800 mb-2">Umidade do Ar vs Solo</h5>
            <p className="text-sm text-gray-600">
              Correlação moderada: umidade do ar elevada geralmente acompanha maior umidade do solo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

