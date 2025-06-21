import React from 'react';
import { Thermometer, Droplets, Activity, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AgroclimateIndex {
  nome: string;
  valor: number;
  unidade: string;
  status: 'excelente' | 'bom' | 'regular' | 'ruim';
  tendencia: 'subindo' | 'descendo' | 'estavel';
  meta: number;
  descricao: string;
  icone: React.ReactNode;
}

interface HistoricalIndexData {
  data: string;
  grausDia: number;
  estresseHidrico: number;
  evapotranspiracao: number;
  indiceConforto: number;
}

interface AgroclimateIndicesProps {
  cultura?: string;
}

// Dados históricos simulados
const historicalData: HistoricalIndexData[] = [
  { data: '01/06', grausDia: 15, estresseHidrico: 20, evapotranspiracao: 4.2, indiceConforto: 85 },
  { data: '02/06', grausDia: 18, estresseHidrico: 25, evapotranspiracao: 4.5, indiceConforto: 82 },
  { data: '03/06', grausDia: 22, estresseHidrico: 30, evapotranspiracao: 4.8, indiceConforto: 78 },
  { data: '04/06', grausDia: 25, estresseHidrico: 35, evapotranspiracao: 5.1, indiceConforto: 75 },
  { data: '05/06', grausDia: 20, estresseHidrico: 15, evapotranspiracao: 3.8, indiceConforto: 88 },
  { data: '06/06', grausDia: 16, estresseHidrico: 18, evapotranspiracao: 4.0, indiceConforto: 86 },
  { data: '07/06', grausDia: 19, estresseHidrico: 22, evapotranspiracao: 4.3, indiceConforto: 84 },
  { data: '08/06', grausDia: 23, estresseHidrico: 28, evapotranspiracao: 4.9, indiceConforto: 79 },
  { data: '09/06', grausDia: 26, estresseHidrico: 32, evapotranspiracao: 5.2, indiceConforto: 76 },
  { data: '10/06', grausDia: 21, estresseHidrico: 20, evapotranspiracao: 4.1, indiceConforto: 85 },
  { data: '11/06', grausDia: 17, estresseHidrico: 16, evapotranspiracao: 3.9, indiceConforto: 87 },
  { data: '12/06', grausDia: 14, estresseHidrico: 14, evapotranspiracao: 3.6, indiceConforto: 89 },
  { data: '13/06', grausDia: 16, estresseHidrico: 18, evapotranspiracao: 4.0, indiceConforto: 86 },
  { data: '14/06', grausDia: 20, estresseHidrico: 24, evapotranspiracao: 4.4, indiceConforto: 83 },
];

// Índices baseados na cultura
const getAgroclimateIndices = (cultura: string): AgroclimateIndex[] => {
  const baseIndices = {
    soja: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 1250,
        unidade: 'GDD',
        status: 'bom' as const,
        tendencia: 'subindo' as const,
        meta: 1200,
        descricao: 'Acúmulo térmico necessário para desenvolvimento da cultura',
        icone: <Thermometer className="h-6 w-6" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 25,
        unidade: '%',
        status: 'regular' as const,
        tendencia: 'descendo' as const,
        meta: 20,
        descricao: 'Nível de estresse por deficiência hídrica',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 4.2,
        unidade: 'mm/dia',
        status: 'bom' as const,
        tendencia: 'estavel' as const,
        meta: 4.0,
        descricao: 'Taxa de perda de água por evaporação e transpiração',
        icone: <Activity className="h-6 w-6" />
      },
      {
        nome: 'Índice de Conforto Térmico',
        valor: 82,
        unidade: '%',
        status: 'bom' as const,
        tendencia: 'subindo' as const,
        meta: 80,
        descricao: 'Adequação das condições térmicas para a cultura',
        icone: <TrendingUp className="h-6 w-6" />
      },
      {
        nome: 'Balanço Hídrico',
        valor: 15,
        unidade: 'mm',
        status: 'regular' as const,
        tendencia: 'descendo' as const,
        meta: 20,
        descricao: 'Diferença entre precipitação e evapotranspiração',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Eficiência Fotossintética',
        valor: 78,
        unidade: '%',
        status: 'bom' as const,
        tendencia: 'estavel' as const,
        meta: 75,
        descricao: 'Eficiência do processo fotossintético nas condições atuais',
        icone: <Activity className="h-6 w-6" />
      }
    ],
    milho: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 1180,
        unidade: 'GDD',
        status: 'excelente' as const,
        tendencia: 'subindo' as const,
        meta: 1150,
        descricao: 'Acúmulo térmico necessário para desenvolvimento da cultura',
        icone: <Thermometer className="h-6 w-6" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 30,
        unidade: '%',
        status: 'regular' as const,
        tendencia: 'descendo' as const,
        meta: 25,
        descricao: 'Nível de estresse por deficiência hídrica',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 3.8,
        unidade: 'mm/dia',
        status: 'bom' as const,
        tendencia: 'estavel' as const,
        meta: 3.5,
        descricao: 'Taxa de perda de água por evaporação e transpiração',
        icone: <Activity className="h-6 w-6" />
      },
      {
        nome: 'Índice de Conforto Térmico',
        valor: 85,
        unidade: '%',
        status: 'excelente' as const,
        tendencia: 'subindo' as const,
        meta: 80,
        descricao: 'Adequação das condições térmicas para a cultura',
        icone: <TrendingUp className="h-6 w-6" />
      },
      {
        nome: 'Balanço Hídrico',
        valor: 18,
        unidade: 'mm',
        status: 'regular' as const,
        tendencia: 'estavel' as const,
        meta: 22,
        descricao: 'Diferença entre precipitação e evapotranspiração',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Eficiência Fotossintética',
        valor: 82,
        unidade: '%',
        status: 'excelente' as const,
        tendencia: 'subindo' as const,
        meta: 78,
        descricao: 'Eficiência do processo fotossintético nas condições atuais',
        icone: <Activity className="h-6 w-6" />
      }
    ],
    tomate: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 980,
        unidade: 'GDD',
        status: 'regular' as const,
        tendencia: 'subindo' as const,
        meta: 1000,
        descricao: 'Acúmulo térmico necessário para desenvolvimento da cultura',
        icone: <Thermometer className="h-6 w-6" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 35,
        unidade: '%',
        status: 'ruim' as const,
        tendencia: 'subindo' as const,
        meta: 25,
        descricao: 'Nível de estresse por deficiência hídrica',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 5.2,
        unidade: 'mm/dia',
        status: 'bom' as const,
        tendencia: 'estavel' as const,
        meta: 5.0,
        descricao: 'Taxa de perda de água por evaporação e transpiração',
        icone: <Activity className="h-6 w-6" />
      },
      {
        nome: 'Índice de Conforto Térmico',
        valor: 72,
        unidade: '%',
        status: 'regular' as const,
        tendencia: 'descendo' as const,
        meta: 75,
        descricao: 'Adequação das condições térmicas para a cultura',
        icone: <TrendingDown className="h-6 w-6" />
      },
      {
        nome: 'Balanço Hídrico',
        valor: 8,
        unidade: 'mm',
        status: 'ruim' as const,
        tendencia: 'descendo' as const,
        meta: 18,
        descricao: 'Diferença entre precipitação e evapotranspiração',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Eficiência Fotossintética',
        valor: 68,
        unidade: '%',
        status: 'regular' as const,
        tendencia: 'descendo' as const,
        meta: 72,
        descricao: 'Eficiência do processo fotossintético nas condições atuais',
        icone: <Activity className="h-6 w-6" />
      }
    ],
    algodao: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 1350,
        unidade: 'GDD',
        status: 'excelente' as const,
        tendencia: 'subindo' as const,
        meta: 1300,
        descricao: 'Acúmulo térmico necessário para desenvolvimento da cultura',
        icone: <Thermometer className="h-6 w-6" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 20,
        unidade: '%',
        status: 'excelente' as const,
        tendencia: 'descendo' as const,
        meta: 25,
        descricao: 'Nível de estresse por deficiência hídrica',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 4.5,
        unidade: 'mm/dia',
        status: 'bom' as const,
        tendencia: 'estavel' as const,
        meta: 4.2,
        descricao: 'Taxa de perda de água por evaporação e transpiração',
        icone: <Activity className="h-6 w-6" />
      },
      {
        nome: 'Índice de Conforto Térmico',
        valor: 88,
        unidade: '%',
        status: 'excelente' as const,
        tendencia: 'subindo' as const,
        meta: 85,
        descricao: 'Adequação das condições térmicas para a cultura',
        icone: <TrendingUp className="h-6 w-6" />
      },
      {
        nome: 'Balanço Hídrico',
        valor: 25,
        unidade: 'mm',
        status: 'excelente' as const,
        tendencia: 'estavel' as const,
        meta: 20,
        descricao: 'Diferença entre precipitação e evapotranspiração',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Eficiência Fotossintética',
        valor: 85,
        unidade: '%',
        status: 'excelente' as const,
        tendencia: 'subindo' as const,
        meta: 80,
        descricao: 'Eficiência do processo fotossintético nas condições atuais',
        icone: <Activity className="h-6 w-6" />
      }
    ],
    cana: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 1420,
        unidade: 'GDD',
        status: 'bom' as const,
        tendencia: 'subindo' as const,
        meta: 1400,
        descricao: 'Acúmulo térmico necessário para desenvolvimento da cultura',
        icone: <Thermometer className="h-6 w-6" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 40,
        unidade: '%',
        status: 'ruim' as const,
        tendencia: 'subindo' as const,
        meta: 30,
        descricao: 'Nível de estresse por deficiência hídrica',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 4.8,
        unidade: 'mm/dia',
        status: 'bom' as const,
        tendencia: 'estavel' as const,
        meta: 4.5,
        descricao: 'Taxa de perda de água por evaporação e transpiração',
        icone: <Activity className="h-6 w-6" />
      },
      {
        nome: 'Índice de Conforto Térmico',
        valor: 75,
        unidade: '%',
        status: 'regular' as const,
        tendencia: 'estavel' as const,
        meta: 78,
        descricao: 'Adequação das condições térmicas para a cultura',
        icone: <TrendingUp className="h-6 w-6" />
      },
      {
        nome: 'Balanço Hídrico',
        valor: 12,
        unidade: 'mm',
        status: 'regular' as const,
        tendencia: 'descendo' as const,
        meta: 18,
        descricao: 'Diferença entre precipitação e evapotranspiração',
        icone: <Droplets className="h-6 w-6" />
      },
      {
        nome: 'Eficiência Fotossintética',
        valor: 72,
        unidade: '%',
        status: 'regular' as const,
        tendencia: 'estavel' as const,
        meta: 75,
        descricao: 'Eficiência do processo fotossintético nas condições atuais',
        icone: <Activity className="h-6 w-6" />
      }
    ]
  };

  return baseIndices[cultura as keyof typeof baseIndices] || baseIndices.soja;
};

export const AgroclimateIndices: React.FC<AgroclimateIndicesProps> = ({ cultura = 'soja' }) => {
  const indices = getAgroclimateIndices(cultura);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excelente':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'bom':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'regular':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'ruim':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTrendIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subindo':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'descendo':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'estavel':
        return <Activity className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const statusCounts = {
    excelente: indices.filter(i => i.status === 'excelente').length,
    bom: indices.filter(i => i.status === 'bom').length,
    regular: indices.filter(i => i.status === 'regular').length,
    ruim: indices.filter(i => i.status === 'ruim').length,
  };

  const overallScore = Math.round(
    (statusCounts.excelente * 100 + statusCounts.bom * 80 + statusCounts.regular * 60 + statusCounts.ruim * 40) / indices.length
  );

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Índices Agroclimáticos - {cultura.charAt(0).toUpperCase() + cultura.slice(1)}
        </h3>
        
        {/* Score Geral */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">{overallScore}%</div>
          <div className="text-gray-600">Score Geral dos Índices</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Distribuição por Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-900">{statusCounts.excelente}</div>
            <div className="text-sm text-green-700">Excelente</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-900">{statusCounts.bom}</div>
            <div className="text-sm text-blue-700">Bom</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-900">{statusCounts.regular}</div>
            <div className="text-sm text-yellow-700">Regular</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-900">{statusCounts.ruim}</div>
            <div className="text-sm text-red-700">Ruim</div>
          </div>
        </div>
      </div>

      {/* Índices Detalhados */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Índices Detalhados</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indices.map((indice, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(indice.status)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {indice.icone}
                  <h5 className="font-medium text-sm">{indice.nome}</h5>
                </div>
                {getTrendIcon(indice.tendencia)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">{indice.valor}</div>
                    <div className="text-xs opacity-75">{indice.unidade}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Meta: {indice.meta}</div>
                    <div className="text-xs opacity-75">
                      {indice.valor >= indice.meta ? '+' : ''}
                      {(indice.valor - indice.meta).toFixed(1)}
                    </div>
                  </div>
                </div>
                
                {/* Barra de progresso */}
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div 
                    className="bg-current h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((indice.valor / indice.meta) * 100, 100)}%` }}
                  ></div>
                </div>
                
                {/* Descrição */}
                <p className="text-xs opacity-75 mt-2">{indice.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráficos Históricos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graus-Dia e Evapotranspiração */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Tendências Térmicas e Hídricas</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="data" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
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
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="grausDia" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Graus-Dia"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="evapotranspiracao" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Evapotranspiração"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estresse Hídrico e Conforto */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Estresse e Conforto</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="data" 
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
                <Legend />
                <Area
                  type="monotone"
                  dataKey="indiceConforto"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Índice de Conforto (%)"
                />
                <Area
                  type="monotone"
                  dataKey="estresseHidrico"
                  stackId="2"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                  name="Estresse Hídrico (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interpretação e Recomendações */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Interpretação dos Índices</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="font-medium text-gray-800">Índices Favoráveis</h5>
            {indices
              .filter(i => i.status === 'excelente' || i.status === 'bom')
              .slice(0, 3)
              .map((indice, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  {indice.icone}
                  <div>
                    <div className="font-medium text-green-800">{indice.nome}</div>
                    <div className="text-sm text-green-600">
                      {indice.valor} {indice.unidade} - {indice.status === 'excelente' ? 'Excelente' : 'Bom'}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="space-y-4">
            <h5 className="font-medium text-gray-800">Índices que Precisam de Atenção</h5>
            {indices
              .filter(i => i.status === 'regular' || i.status === 'ruim')
              .slice(0, 3)
              .map((indice, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-800">{indice.nome}</div>
                    <div className="text-sm text-yellow-600">
                      {indice.valor} {indice.unidade} - Meta: {indice.meta} {indice.unidade}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

