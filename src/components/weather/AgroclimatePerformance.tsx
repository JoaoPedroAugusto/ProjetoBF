import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target, Calendar, Thermometer } from 'lucide-react';

interface PerformanceMetric {
  nome: string;
  valor: number;
  unidade: string;
  meta: number;
  tendencia: 'subindo' | 'descendo' | 'estavel';
  status: 'excelente' | 'bom' | 'regular' | 'ruim';
  icone: React.ReactNode;
}

interface HistoricalData {
  periodo: string;
  gdd: number;
  eto: number;
  estresseHidrico: number;
  eficienciaClimatica: number;
}

interface AgroclimatePerformanceProps {
  cultura?: string;
}

// Dados históricos simulados
const historicalData: HistoricalData[] = [
  { periodo: 'Jan', gdd: 450, eto: 4.2, estresseHidrico: 15, eficienciaClimatica: 85 },
  { periodo: 'Fev', gdd: 420, eto: 3.8, estresseHidrico: 20, eficienciaClimatica: 82 },
  { periodo: 'Mar', gdd: 380, eto: 3.5, estresseHidrico: 25, eficienciaClimatica: 78 },
  { periodo: 'Abr', gdd: 340, eto: 3.0, estresseHidrico: 30, eficienciaClimatica: 75 },
  { periodo: 'Mai', gdd: 300, eto: 2.5, estresseHidrico: 35, eficienciaClimatica: 72 },
  { periodo: 'Jun', gdd: 280, eto: 2.2, estresseHidrico: 40, eficienciaClimatica: 70 },
];

// Métricas baseadas na cultura
const getPerformanceMetrics = (cultura: string): PerformanceMetric[] => {
  const baseMetrics = {
    soja: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 1250,
        unidade: 'GDD',
        meta: 1200,
        tendencia: 'subindo' as const,
        status: 'bom' as const,
        icone: <Thermometer className="h-5 w-5" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 4.2,
        unidade: 'mm/dia',
        meta: 4.0,
        tendencia: 'estavel' as const,
        status: 'bom' as const,
        icone: <Activity className="h-5 w-5" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 25,
        unidade: '%',
        meta: 20,
        tendencia: 'descendo' as const,
        status: 'regular' as const,
        icone: <TrendingDown className="h-5 w-5" />
      },
      {
        nome: 'Eficiência Climática',
        valor: 82,
        unidade: '%',
        meta: 85,
        tendencia: 'subindo' as const,
        status: 'bom' as const,
        icone: <Target className="h-5 w-5" />
      },
      {
        nome: 'Índice de Favorabilidade',
        valor: 78,
        unidade: '%',
        meta: 80,
        tendencia: 'estavel' as const,
        status: 'bom' as const,
        icone: <TrendingUp className="h-5 w-5" />
      },
      {
        nome: 'Dias Favoráveis',
        valor: 18,
        unidade: 'dias',
        meta: 20,
        tendencia: 'subindo' as const,
        status: 'regular' as const,
        icone: <Calendar className="h-5 w-5" />
      }
    ],
    milho: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 1180,
        unidade: 'GDD',
        meta: 1150,
        tendencia: 'subindo' as const,
        status: 'excelente' as const,
        icone: <Thermometer className="h-5 w-5" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 3.8,
        unidade: 'mm/dia',
        meta: 3.5,
        tendencia: 'estavel' as const,
        status: 'bom' as const,
        icone: <Activity className="h-5 w-5" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 30,
        unidade: '%',
        meta: 25,
        tendencia: 'descendo' as const,
        status: 'regular' as const,
        icone: <TrendingDown className="h-5 w-5" />
      },
      {
        nome: 'Eficiência Climática',
        valor: 85,
        unidade: '%',
        meta: 80,
        tendencia: 'subindo' as const,
        status: 'excelente' as const,
        icone: <Target className="h-5 w-5" />
      },
      {
        nome: 'Índice de Favorabilidade',
        valor: 80,
        unidade: '%',
        meta: 75,
        tendencia: 'estavel' as const,
        status: 'excelente' as const,
        icone: <TrendingUp className="h-5 w-5" />
      },
      {
        nome: 'Dias Favoráveis',
        valor: 22,
        unidade: 'dias',
        meta: 20,
        tendencia: 'subindo' as const,
        status: 'excelente' as const,
        icone: <Calendar className="h-5 w-5" />
      }
    ],
    tomate: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 980,
        unidade: 'GDD',
        meta: 1000,
        tendencia: 'subindo' as const,
        status: 'regular' as const,
        icone: <Thermometer className="h-5 w-5" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 5.2,
        unidade: 'mm/dia',
        meta: 5.0,
        tendencia: 'estavel' as const,
        status: 'bom' as const,
        icone: <Activity className="h-5 w-5" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 35,
        unidade: '%',
        meta: 30,
        tendencia: 'descendo' as const,
        status: 'regular' as const,
        icone: <TrendingDown className="h-5 w-5" />
      },
      {
        nome: 'Eficiência Climática',
        valor: 75,
        unidade: '%',
        meta: 80,
        tendencia: 'subindo' as const,
        status: 'regular' as const,
        icone: <Target className="h-5 w-5" />
      },
      {
        nome: 'Índice de Favorabilidade',
        valor: 72,
        unidade: '%',
        meta: 75,
        tendencia: 'estavel' as const,
        status: 'regular' as const,
        icone: <TrendingUp className="h-5 w-5" />
      },
      {
        nome: 'Dias Favoráveis',
        valor: 15,
        unidade: 'dias',
        meta: 18,
        tendencia: 'subindo' as const,
        status: 'regular' as const,
        icone: <Calendar className="h-5 w-5" />
      }
    ],
    algodao: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 1350,
        unidade: 'GDD',
        meta: 1300,
        tendencia: 'subindo' as const,
        status: 'excelente' as const,
        icone: <Thermometer className="h-5 w-5" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 4.5,
        unidade: 'mm/dia',
        meta: 4.2,
        tendencia: 'estavel' as const,
        status: 'bom' as const,
        icone: <Activity className="h-5 w-5" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 20,
        unidade: '%',
        meta: 25,
        tendencia: 'descendo' as const,
        status: 'excelente' as const,
        icone: <TrendingDown className="h-5 w-5" />
      },
      {
        nome: 'Eficiência Climática',
        valor: 88,
        unidade: '%',
        meta: 85,
        tendencia: 'subindo' as const,
        status: 'excelente' as const,
        icone: <Target className="h-5 w-5" />
      },
      {
        nome: 'Índice de Favorabilidade',
        valor: 85,
        unidade: '%',
        meta: 80,
        tendencia: 'estavel' as const,
        status: 'excelente' as const,
        icone: <TrendingUp className="h-5 w-5" />
      },
      {
        nome: 'Dias Favoráveis',
        valor: 25,
        unidade: 'dias',
        meta: 22,
        tendencia: 'subindo' as const,
        status: 'excelente' as const,
        icone: <Calendar className="h-5 w-5" />
      }
    ],
    cana: [
      {
        nome: 'Graus-Dia Acumulados',
        valor: 1420,
        unidade: 'GDD',
        meta: 1400,
        tendencia: 'subindo' as const,
        status: 'bom' as const,
        icone: <Thermometer className="h-5 w-5" />
      },
      {
        nome: 'Evapotranspiração',
        valor: 4.8,
        unidade: 'mm/dia',
        meta: 4.5,
        tendencia: 'estavel' as const,
        status: 'bom' as const,
        icone: <Activity className="h-5 w-5" />
      },
      {
        nome: 'Estresse Hídrico',
        valor: 40,
        unidade: '%',
        meta: 35,
        tendencia: 'descendo' as const,
        status: 'regular' as const,
        icone: <TrendingDown className="h-5 w-5" />
      },
      {
        nome: 'Eficiência Climática',
        valor: 78,
        unidade: '%',
        meta: 80,
        tendencia: 'subindo' as const,
        status: 'regular' as const,
        icone: <Target className="h-5 w-5" />
      },
      {
        nome: 'Índice de Favorabilidade',
        valor: 75,
        unidade: '%',
        meta: 78,
        tendencia: 'estavel' as const,
        status: 'regular' as const,
        icone: <TrendingUp className="h-5 w-5" />
      },
      {
        nome: 'Dias Favoráveis',
        valor: 20,
        unidade: 'dias',
        meta: 22,
        tendencia: 'subindo' as const,
        status: 'regular' as const,
        icone: <Calendar className="h-5 w-5" />
      }
    ]
  };

  return baseMetrics[cultura as keyof typeof baseMetrics] || baseMetrics.soja;
};

export const AgroclimatePerformance: React.FC<AgroclimatePerformanceProps> = ({ cultura = 'soja' }) => {
  const metrics = getPerformanceMetrics(cultura);

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
    excelente: metrics.filter(m => m.status === 'excelente').length,
    bom: metrics.filter(m => m.status === 'bom').length,
    regular: metrics.filter(m => m.status === 'regular').length,
    ruim: metrics.filter(m => m.status === 'ruim').length,
  };

  const performanceScore = Math.round(
    (statusCounts.excelente * 100 + statusCounts.bom * 80 + statusCounts.regular * 60 + statusCounts.ruim * 40) / metrics.length
  );

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Agroclimática - {cultura.charAt(0).toUpperCase() + cultura.slice(1)}
        </h3>
        
        {/* Score Geral */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">{performanceScore}%</div>
          <div className="text-gray-600">Score Geral de Performance</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${performanceScore}%` }}
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

      {/* Métricas Detalhadas */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Métricas Detalhadas</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {metric.icone}
                  <h5 className="font-medium text-sm">{metric.nome}</h5>
                </div>
                {getTrendIcon(metric.tendencia)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">{metric.valor}</div>
                    <div className="text-xs opacity-75">{metric.unidade}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Meta: {metric.meta}</div>
                    <div className="text-xs opacity-75">
                      {metric.valor >= metric.meta ? '+' : ''}
                      {(metric.valor - metric.meta).toFixed(1)}
                    </div>
                  </div>
                </div>
                
                {/* Barra de progresso */}
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div 
                    className="bg-current h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((metric.valor / metric.meta) * 100, 100)}%` }}
                  ></div>
                </div>
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
                  dataKey="periodo" 
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
                  dataKey="gdd" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Graus-Dia"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="eto" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Evapotranspiração"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estresse Hídrico e Eficiência */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Estresse e Eficiência</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="periodo" 
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
                  dataKey="eficienciaClimatica"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Eficiência Climática (%)"
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

      {/* Insights e Recomendações */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Insights e Recomendações</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">Pontos Fortes</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              {metrics
                .filter(m => m.status === 'excelente' || m.status === 'bom')
                .slice(0, 3)
                .map((metric, index) => (
                  <li key={index}>• {metric.nome} está {metric.valor >= metric.meta ? 'acima' : 'próximo'} da meta</li>
                ))}
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h5 className="font-medium text-yellow-800 mb-2">Áreas de Melhoria</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              {metrics
                .filter(m => m.status === 'regular' || m.status === 'ruim')
                .slice(0, 3)
                .map((metric, index) => (
                  <li key={index}>• Melhorar {metric.nome} para atingir meta de {metric.meta}{metric.unidade}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

