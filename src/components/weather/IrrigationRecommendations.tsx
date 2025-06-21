import React from 'react';
import { Droplets, Clock, MapPin, Thermometer, Wind, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface IrrigationRecommendation {
  horario: string;
  quantidade: number;
  duracao: number;
  prioridade: 'alta' | 'media' | 'baixa';
  motivo: string;
  eficiencia: number;
}

interface IrrigationZone {
  zona: string;
  area: number;
  tipoSolo: string;
  umidadeAtual: number;
  umidadeIdeal: number;
  necessidadeAgua: number;
  status: 'critico' | 'atencao' | 'adequado';
}

interface WeeklyIrrigation {
  dia: string;
  quantidade: number;
  eficiencia: number;
  economia: number;
}

interface IrrigationRecommendationsProps {
  cultura?: string;
}

// Dados simulados para a semana
const weeklyData: WeeklyIrrigation[] = [
  { dia: 'Seg', quantidade: 25, eficiencia: 85, economia: 15 },
  { dia: 'Ter', quantidade: 30, eficiencia: 82, economia: 18 },
  { dia: 'Qua', quantidade: 20, eficiencia: 88, economia: 12 },
  { dia: 'Qui', quantidade: 0, eficiencia: 0, economia: 0 }, // Dia de chuva
  { dia: 'Sex', quantidade: 28, eficiencia: 84, economia: 16 },
  { dia: 'Sab', quantidade: 22, eficiencia: 87, economia: 13 },
  { dia: 'Dom', quantidade: 26, eficiencia: 86, economia: 14 },
];

// Recomendações baseadas na cultura
const getIrrigationRecommendations = (cultura: string): IrrigationRecommendation[] => {
  const baseRecommendations = {
    soja: [
      {
        horario: '05:30',
        quantidade: 15,
        duracao: 45,
        prioridade: 'alta' as const,
        motivo: 'Período de menor evaporação e melhor absorção',
        eficiencia: 92
      },
      {
        horario: '18:00',
        quantidade: 12,
        duracao: 35,
        prioridade: 'media' as const,
        motivo: 'Complemento vespertino para manter umidade noturna',
        eficiencia: 85
      },
      {
        horario: '22:00',
        quantidade: 8,
        duracao: 25,
        prioridade: 'baixa' as const,
        motivo: 'Irrigação noturna para zonas críticas apenas',
        eficiencia: 78
      }
    ],
    milho: [
      {
        horario: '06:00',
        quantidade: 18,
        duracao: 50,
        prioridade: 'alta' as const,
        motivo: 'Fase crítica de desenvolvimento - maior demanda hídrica',
        eficiencia: 90
      },
      {
        horario: '17:30',
        quantidade: 14,
        duracao: 40,
        prioridade: 'media' as const,
        motivo: 'Manutenção da umidade para crescimento vegetativo',
        eficiencia: 83
      }
    ],
    tomate: [
      {
        horario: '05:00',
        quantidade: 20,
        duracao: 60,
        prioridade: 'alta' as const,
        motivo: 'Alta demanda hídrica - irrigação principal matinal',
        eficiencia: 94
      },
      {
        horario: '11:00',
        quantidade: 10,
        duracao: 30,
        prioridade: 'alta' as const,
        motivo: 'Irrigação complementar devido ao estresse térmico',
        eficiencia: 75
      },
      {
        horario: '18:30',
        quantidade: 15,
        duracao: 45,
        prioridade: 'media' as const,
        motivo: 'Manutenção da umidade para desenvolvimento dos frutos',
        eficiencia: 87
      }
    ],
    algodao: [
      {
        horario: '06:30',
        quantidade: 12,
        duracao: 40,
        prioridade: 'media' as const,
        motivo: 'Irrigação moderada - cultura resistente à seca',
        eficiencia: 88
      },
      {
        horario: '19:00',
        quantidade: 8,
        duracao: 25,
        prioridade: 'baixa' as const,
        motivo: 'Complemento vespertino em períodos secos',
        eficiencia: 82
      }
    ],
    cana: [
      {
        horario: '05:45',
        quantidade: 25,
        duracao: 70,
        prioridade: 'alta' as const,
        motivo: 'Alta demanda hídrica - irrigação principal',
        eficiencia: 89
      },
      {
        horario: '17:00',
        quantidade: 18,
        duracao: 50,
        prioridade: 'media' as const,
        motivo: 'Manutenção da umidade para crescimento',
        eficiencia: 84
      }
    ]
  };

  return baseRecommendations[cultura as keyof typeof baseRecommendations] || baseRecommendations.soja;
};

// Zonas de irrigação baseadas na cultura
const getIrrigationZones = (cultura: string): IrrigationZone[] => {
  const baseZones = {
    soja: [
      { zona: 'Zona A', area: 15.5, tipoSolo: 'Argiloso', umidadeAtual: 45, umidadeIdeal: 60, necessidadeAgua: 15, status: 'atencao' as const },
      { zona: 'Zona B', area: 12.3, tipoSolo: 'Franco', umidadeAtual: 35, umidadeIdeal: 55, necessidadeAgua: 20, status: 'critico' as const },
      { zona: 'Zona C', area: 18.7, tipoSolo: 'Arenoso', umidadeAtual: 55, umidadeIdeal: 65, necessidadeAgua: 10, status: 'adequado' as const },
      { zona: 'Zona D', area: 9.2, tipoSolo: 'Franco-argiloso', umidadeAtual: 40, umidadeIdeal: 58, necessidadeAgua: 18, status: 'atencao' as const }
    ],
    milho: [
      { zona: 'Zona A', area: 20.1, tipoSolo: 'Franco', umidadeAtual: 50, umidadeIdeal: 65, necessidadeAgua: 15, status: 'atencao' as const },
      { zona: 'Zona B', area: 16.8, tipoSolo: 'Argiloso', umidadeAtual: 42, umidadeIdeal: 62, necessidadeAgua: 20, status: 'critico' as const },
      { zona: 'Zona C', area: 14.5, tipoSolo: 'Franco-arenoso', umidadeAtual: 58, umidadeIdeal: 68, necessidadeAgua: 10, status: 'adequado' as const }
    ],
    tomate: [
      { zona: 'Zona A', area: 8.3, tipoSolo: 'Franco', umidadeAtual: 60, umidadeIdeal: 75, necessidadeAgua: 15, status: 'atencao' as const },
      { zona: 'Zona B', area: 6.7, tipoSolo: 'Franco-argiloso', umidadeAtual: 45, umidadeIdeal: 70, necessidadeAgua: 25, status: 'critico' as const },
      { zona: 'Zona C', area: 5.2, tipoSolo: 'Argiloso', umidadeAtual: 68, umidadeIdeal: 72, necessidadeAgua: 4, status: 'adequado' as const }
    ],
    algodao: [
      { zona: 'Zona A', area: 25.4, tipoSolo: 'Franco-arenoso', umidadeAtual: 48, umidadeIdeal: 55, necessidadeAgua: 7, status: 'adequado' as const },
      { zona: 'Zona B', area: 18.9, tipoSolo: 'Arenoso', umidadeAtual: 35, umidadeIdeal: 50, necessidadeAgua: 15, status: 'atencao' as const },
      { zona: 'Zona C', area: 12.1, tipoSolo: 'Franco', umidadeAtual: 52, umidadeIdeal: 58, necessidadeAgua: 6, status: 'adequado' as const }
    ],
    cana: [
      { zona: 'Zona A', area: 35.2, tipoSolo: 'Argiloso', umidadeAtual: 55, umidadeIdeal: 70, necessidadeAgua: 15, status: 'atencao' as const },
      { zona: 'Zona B', area: 28.7, tipoSolo: 'Franco', umidadeAtual: 45, umidadeIdeal: 68, necessidadeAgua: 23, status: 'critico' as const },
      { zona: 'Zona C', area: 22.3, tipoSolo: 'Franco-argiloso', umidadeAtual: 62, umidadeIdeal: 65, necessidadeAgua: 3, status: 'adequado' as const }
    ]
  };

  return baseZones[cultura as keyof typeof baseZones] || baseZones.soja;
};

export const IrrigationRecommendations: React.FC<IrrigationRecommendationsProps> = ({ cultura = 'soja' }) => {
  const recommendations = getIrrigationRecommendations(cultura);
  const zones = getIrrigationZones(cultura);

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'media':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'baixa':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getZoneStatusColor = (status: string) => {
    switch (status) {
      case 'critico':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'atencao':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'adequado':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'media':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'baixa':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const totalQuantidade = recommendations.reduce((acc, rec) => acc + rec.quantidade, 0);
  const eficienciaMedia = recommendations.reduce((acc, rec) => acc + rec.eficiencia, 0) / recommendations.length;
  const zonasCriticas = zones.filter(z => z.status === 'critico').length;
  const economiaAgua = weeklyData.reduce((acc, day) => acc + day.economia, 0);

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recomendações de Irrigação - {cultura.charAt(0).toUpperCase() + cultura.slice(1)}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-900">{totalQuantidade} mm</div>
            <div className="text-sm text-blue-700">Total Diário</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-900">{eficienciaMedia.toFixed(0)}%</div>
            <div className="text-sm text-green-700">Eficiência Média</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-900">{zonasCriticas}</div>
            <div className="text-sm text-red-700">Zonas Críticas</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-900">{economiaAgua}%</div>
            <div className="text-sm text-purple-700">Economia Semanal</div>
          </div>
        </div>
      </div>

      {/* Cronograma de Irrigação */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Cronograma Diário de Irrigação</h4>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.prioridade)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getPriorityIcon(rec.prioridade)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-bold text-lg">{rec.horario}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4" />
                        <span className="font-medium">{rec.quantidade} mm</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{rec.duracao} min</span>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{rec.motivo}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                        Prioridade {rec.prioridade.toUpperCase()}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                        Eficiência: {rec.eficiencia}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zonas de Irrigação */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Status das Zonas de Irrigação</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getZoneStatusColor(zone.status)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <h5 className="font-medium">{zone.zona}</h5>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                  {zone.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="opacity-75">Área:</div>
                    <div className="font-medium">{zone.area} ha</div>
                  </div>
                  <div>
                    <div className="opacity-75">Solo:</div>
                    <div className="font-medium">{zone.tipoSolo}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Umidade Atual:</span>
                    <span className="font-medium">{zone.umidadeAtual}%</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(zone.umidadeAtual / zone.umidadeIdeal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs opacity-75">
                    <span>Meta: {zone.umidadeIdeal}%</span>
                    <span>Necessidade: {zone.necessidadeAgua} mm</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico Semanal */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Planejamento Semanal</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dia" 
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
              <Bar 
                dataKey="quantidade" 
                fill="#3b82f6" 
                name="Quantidade (mm)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Condições Ambientais */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Condições Ambientais para Irrigação</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <Thermometer className="h-6 w-6 text-blue-600" />
              <h5 className="font-medium text-blue-800">Temperatura</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Atual:</span>
                <span className="font-medium text-blue-900">28°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Ideal para irrigação:</span>
                <span className="font-medium text-blue-900">&lt; 30°C</span>
              </div>
              <div className="text-xs text-blue-600 mt-2">
                ✓ Condições favoráveis para irrigação
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Wind className="h-6 w-6 text-gray-600" />
              <h5 className="font-medium text-gray-800">Vento</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Velocidade:</span>
                <span className="font-medium text-gray-900">12 km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Ideal:</span>
                <span className="font-medium text-gray-900">&lt; 15 km/h</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                ✓ Vento moderado - boa distribuição
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <Droplets className="h-6 w-6 text-green-600" />
              <h5 className="font-medium text-green-800">Umidade do Ar</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Atual:</span>
                <span className="font-medium text-green-900">65%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Ideal:</span>
                <span className="font-medium text-green-900">60-80%</span>
              </div>
              <div className="text-xs text-green-600 mt-2">
                ✓ Umidade adequada para irrigação
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dicas de Otimização */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Dicas de Otimização</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">Economia de Água</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Irrigar preferencialmente nas primeiras horas da manhã</li>
              <li>• Evitar irrigação durante ventos fortes (&gt; 15 km/h)</li>
              <li>• Usar sensores de umidade do solo para precisão</li>
              <li>• Ajustar quantidade conforme previsão de chuva</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h5 className="font-medium text-green-800 mb-2">Eficiência Energética</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Programar irrigação fora do horário de pico elétrico</li>
              <li>• Manter sistema de irrigação bem calibrado</li>
              <li>• Verificar vazamentos regularmente</li>
              <li>• Considerar irrigação por gotejamento em zonas críticas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

