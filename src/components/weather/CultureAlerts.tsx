import React from 'react';
import { AlertTriangle, Clock, MapPin, Thermometer, Droplets, Wind, Sun, CloudRain, Bug, Shield, Sprout, Calendar } from 'lucide-react';

interface CultureAlert {
  id: string;
  tipo: 'clima' | 'doenca' | 'praga' | 'irrigacao' | 'nutricao' | 'manejo';
  severidade: 'baixo' | 'medio' | 'alto' | 'critico';
  titulo: string;
  descricao: string;
  recomendacao: string;
  validadeInicio: string;
  validadeFim: string;
  zona?: string;
  urgencia: boolean;
  icone: React.ReactNode;
}

interface CultureAlertsProps {
  cultura?: string;
}

// Alertas baseados na cultura
const getCultureAlerts = (cultura: string): CultureAlert[] => {
  const baseAlerts = {
    soja: [
      {
        id: 'soja_001',
        tipo: 'clima' as const,
        severidade: 'alto' as const,
        titulo: 'Alerta de Temperatura Elevada',
        descricao: 'Temperaturas acima de 32°C previstas para os próximos 3 dias, podendo causar estresse térmico durante o florescimento.',
        recomendacao: 'Aumentar frequência de irrigação em 30% e aplicar nos horários mais frescos (5h-7h e 18h-20h). Monitorar sinais de murcha.',
        validadeInicio: '20/06/2025',
        validadeFim: '23/06/2025',
        zona: 'Todas as zonas',
        urgencia: true,
        icone: <Thermometer className="h-5 w-5" />
      },
      {
        id: 'soja_002',
        tipo: 'doenca' as const,
        severidade: 'critico' as const,
        titulo: 'Risco Crítico de Ferrugem Asiática',
        descricao: 'Condições climáticas extremamente favoráveis para desenvolvimento de ferrugem. Umidade >85% e temperatura entre 20-25°C.',
        recomendacao: 'Aplicar fungicida sistêmico imediatamente. Usar mistura de triazol + estrobilurina. Repetir aplicação em 14 dias.',
        validadeInicio: '20/06/2025',
        validadeFim: '27/06/2025',
        zona: 'Zonas A, B e D',
        urgencia: true,
        icone: <Shield className="h-5 w-5" />
      },
      {
        id: 'soja_003',
        tipo: 'irrigacao' as const,
        severidade: 'medio' as const,
        titulo: 'Déficit Hídrico Moderado',
        descricao: 'Umidade do solo abaixo de 50% em várias zonas. Cultura em estágio crítico de enchimento de grãos.',
        recomendacao: 'Implementar irrigação suplementar de 15-20mm. Priorizar zonas com menor umidade do solo.',
        validadeInicio: '20/06/2025',
        validadeFim: '25/06/2025',
        zona: 'Zonas B e C',
        urgencia: false,
        icone: <Droplets className="h-5 w-5" />
      },
      {
        id: 'soja_004',
        tipo: 'praga' as const,
        severidade: 'medio' as const,
        titulo: 'Aumento Populacional de Percevejos',
        descricao: 'Monitoramento detectou aumento significativo na população de percevejos marrons nas últimas semanas.',
        recomendacao: 'Intensificar monitoramento com pano de batida 3x por semana. Preparar para aplicação de inseticida se atingir nível de controle.',
        validadeInicio: '20/06/2025',
        validadeFim: '30/06/2025',
        zona: 'Zona A',
        urgencia: false,
        icone: <Bug className="h-5 w-5" />
      },
      {
        id: 'soja_005',
        tipo: 'nutricao' as const,
        severidade: 'baixo' as const,
        titulo: 'Deficiência Nutricional Leve',
        descricao: 'Análise foliar indica níveis ligeiramente baixos de potássio em algumas áreas.',
        recomendacao: 'Aplicar adubação foliar com KCl 2% nas próximas 2 semanas. Reavaliar em 15 dias.',
        validadeInicio: '20/06/2025',
        validadeFim: '05/07/2025',
        zona: 'Zona C',
        urgencia: false,
        icone: <Sprout className="h-5 w-5" />
      }
    ],
    milho: [
      {
        id: 'milho_001',
        tipo: 'praga' as const,
        severidade: 'critico' as const,
        titulo: 'Infestação Severa de Lagarta do Cartucho',
        descricao: 'Detectada alta infestação de lagarta do cartucho em estágio inicial. Risco de perdas significativas.',
        recomendacao: 'Aplicar inseticida específico (Bt ou químico) imediatamente. Focar no cartucho das plantas. Reaplicar em 7 dias se necessário.',
        validadeInicio: '20/06/2025',
        validadeFim: '27/06/2025',
        zona: 'Todas as zonas',
        urgencia: true,
        icone: <Bug className="h-5 w-5" />
      },
      {
        id: 'milho_002',
        tipo: 'clima' as const,
        severidade: 'alto' as const,
        titulo: 'Período Seco Prolongado',
        descricao: 'Ausência de chuvas por mais de 10 dias durante fase crítica de desenvolvimento vegetativo.',
        recomendacao: 'Implementar irrigação de emergência. Aplicar 25-30mm imediatamente. Monitorar estresse hídrico diariamente.',
        validadeInicio: '20/06/2025',
        validadeFim: '28/06/2025',
        zona: 'Zonas A e B',
        urgencia: true,
        icone: <Sun className="h-5 w-5" />
      },
      {
        id: 'milho_003',
        tipo: 'doenca' as const,
        severidade: 'medio' as const,
        titulo: 'Risco de Cercosporiose',
        descricao: 'Condições de umidade e temperatura favoráveis para desenvolvimento de cercosporiose.',
        recomendacao: 'Monitorar sintomas nas folhas inferiores. Aplicar fungicida preventivo se necessário.',
        validadeInicio: '20/06/2025',
        validadeFim: '30/06/2025',
        zona: 'Zona C',
        urgencia: false,
        icone: <Shield className="h-5 w-5" />
      }
    ],
    tomate: [
      {
        id: 'tomate_001',
        tipo: 'doenca' as const,
        severidade: 'critico' as const,
        titulo: 'Risco Extremo de Requeima',
        descricao: 'Condições perfeitas para requeima: umidade >90%, temperatura 18-22°C e molhamento foliar prolongado.',
        recomendacao: 'Aplicar fungicida sistêmico urgentemente. Melhorar ventilação. Evitar irrigação por aspersão. Monitorar diariamente.',
        validadeInicio: '20/06/2025',
        validadeFim: '25/06/2025',
        zona: 'Todas as zonas',
        urgencia: true,
        icone: <Shield className="h-5 w-5" />
      },
      {
        id: 'tomate_002',
        tipo: 'irrigacao' as const,
        severidade: 'alto' as const,
        titulo: 'Estresse Hídrico Severo',
        descricao: 'Plantas apresentando sinais de murcha durante desenvolvimento dos frutos. Demanda hídrica elevada.',
        recomendacao: 'Aumentar irrigação para 40-50mm diários. Aplicar em múltiplas vezes. Usar irrigação localizada.',
        validadeInicio: '20/06/2025',
        validadeFim: '30/06/2025',
        zona: 'Zonas A e C',
        urgencia: true,
        icone: <Droplets className="h-5 w-5" />
      },
      {
        id: 'tomate_003',
        tipo: 'praga' as const,
        severidade: 'alto' as const,
        titulo: 'Infestação de Mosca Branca',
        descricao: 'População de mosca branca acima do nível de controle. Risco de transmissão de viroses.',
        recomendacao: 'Aplicar inseticida sistêmico. Instalar armadilhas amarelas. Eliminar plantas daninhas hospedeiras.',
        validadeInicio: '20/06/2025',
        validadeFim: '02/07/2025',
        zona: 'Zona B',
        urgencia: false,
        icone: <Bug className="h-5 w-5" />
      }
    ],
    algodao: [
      {
        id: 'algodao_001',
        tipo: 'praga' as const,
        severidade: 'alto' as const,
        titulo: 'Detecção de Bicudo do Algodoeiro',
        descricao: 'Armadilhas detectaram presença significativa de bicudo durante formação de botões florais.',
        recomendacao: 'Aplicar inseticida específico para bicudo. Intensificar monitoramento com armadilhas. Destruir botões atacados.',
        validadeInicio: '20/06/2025',
        validadeFim: '10/07/2025',
        zona: 'Zonas A e D',
        urgencia: true,
        icone: <Bug className="h-5 w-5" />
      },
      {
        id: 'algodao_002',
        tipo: 'doenca' as const,
        severidade: 'medio' as const,
        titulo: 'Risco de Ramulária',
        descricao: 'Condições climáticas favoráveis para desenvolvimento de ramulária do algodoeiro.',
        recomendacao: 'Monitorar aparecimento de manchas brancas nas folhas. Aplicar fungicida preventivo se necessário.',
        validadeInicio: '20/06/2025',
        validadeFim: '05/07/2025',
        zona: 'Zona B',
        urgencia: false,
        icone: <Shield className="h-5 w-5" />
      }
    ],
    cana: [
      {
        id: 'cana_001',
        tipo: 'irrigacao' as const,
        severidade: 'alto' as const,
        titulo: 'Déficit Hídrico Crítico',
        descricao: 'Umidade do solo muito baixa durante fase de crescimento ativo. Risco de redução significativa na produtividade.',
        recomendacao: 'Implementar irrigação intensiva: 40-50mm por aplicação. Aplicar 2-3 vezes por semana até normalização.',
        validadeInicio: '20/06/2025',
        validadeFim: '15/07/2025',
        zona: 'Zonas A e B',
        urgencia: true,
        icone: <Droplets className="h-5 w-5" />
      },
      {
        id: 'cana_002',
        tipo: 'praga' as const,
        severidade: 'medio' as const,
        titulo: 'Monitoramento de Broca da Cana',
        descricao: 'Período favorável para infestação de broca da cana. Necessário intensificar monitoramento.',
        recomendacao: 'Realizar dissecação de colmos semanalmente. Liberar parasitoides (Cotesia flavipes) se disponível.',
        validadeInicio: '20/06/2025',
        validadeFim: '30/07/2025',
        zona: 'Todas as zonas',
        urgencia: false,
        icone: <Bug className="h-5 w-5" />
      }
    ]
  };

  return baseAlerts[cultura as keyof typeof baseAlerts] || baseAlerts.soja;
};

export const CultureAlerts: React.FC<CultureAlertsProps> = ({ cultura = 'soja' }) => {
  const alerts = getCultureAlerts(cultura);

  const getSeverityColor = (severidade: string) => {
    switch (severidade) {
      case 'critico':
        return 'bg-red-100 border-red-300 text-red-900';
      case 'alto':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medio':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'baixo':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'clima':
        return 'bg-blue-100 text-blue-800';
      case 'doenca':
        return 'bg-red-100 text-red-800';
      case 'praga':
        return 'bg-orange-100 text-orange-800';
      case 'irrigacao':
        return 'bg-cyan-100 text-cyan-800';
      case 'nutricao':
        return 'bg-green-100 text-green-800';
      case 'manejo':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'clima':
        return <Sun className="h-4 w-4" />;
      case 'doenca':
        return <Shield className="h-4 w-4" />;
      case 'praga':
        return <Bug className="h-4 w-4" />;
      case 'irrigacao':
        return <Droplets className="h-4 w-4" />;
      case 'nutricao':
        return <Sprout className="h-4 w-4" />;
      case 'manejo':
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const severityCounts = {
    critico: alerts.filter(a => a.severidade === 'critico').length,
    alto: alerts.filter(a => a.severidade === 'alto').length,
    medio: alerts.filter(a => a.severidade === 'medio').length,
    baixo: alerts.filter(a => a.severidade === 'baixo').length,
  };

  const typeCounts = {
    clima: alerts.filter(a => a.tipo === 'clima').length,
    doenca: alerts.filter(a => a.tipo === 'doenca').length,
    praga: alerts.filter(a => a.tipo === 'praga').length,
    irrigacao: alerts.filter(a => a.tipo === 'irrigacao').length,
    nutricao: alerts.filter(a => a.tipo === 'nutricao').length,
    manejo: alerts.filter(a => a.tipo === 'manejo').length,
  };

  const urgentAlerts = alerts.filter(a => a.urgencia);

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Alertas Específicos - {cultura.charAt(0).toUpperCase() + cultura.slice(1)}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-900">{severityCounts.critico + severityCounts.alto}</div>
            <div className="text-sm text-red-700">Alertas Críticos/Altos</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-900">{severityCounts.medio}</div>
            <div className="text-sm text-yellow-700">Alertas Médios</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
            <div className="text-2xl font-bold text-orange-900">{urgentAlerts.length}</div>
            <div className="text-sm text-orange-700">Ação Urgente</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-900">{alerts.length}</div>
            <div className="text-sm text-blue-700">Total de Alertas</div>
          </div>
        </div>

        {/* Distribuição por Tipo */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(typeCounts).map(([tipo, count]) => (
            <div key={tipo} className={`p-2 rounded text-center text-xs ${getTypeColor(tipo)}`}>
              <div className="flex items-center justify-center mb-1">
                {getTypeIcon(tipo)}
              </div>
              <div className="font-bold">{count}</div>
              <div className="capitalize">{tipo}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas Urgentes */}
      {urgentAlerts.length > 0 && (
        <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-400">
          <h4 className="text-md font-semibold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alertas que Requerem Ação Urgente
          </h4>
          <div className="space-y-3">
            {urgentAlerts.map((alert, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-red-900">{alert.titulo}</h5>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                    URGENTE
                  </span>
                </div>
                <p className="text-sm text-red-700 mb-2">{alert.descricao}</p>
                <div className="bg-red-100 p-3 rounded border border-red-200">
                  <p className="text-sm text-red-800">
                    <strong>Ação Recomendada:</strong> {alert.recomendacao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todos os Alertas */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Todos os Alertas Ativos</h4>
        
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(alert.severidade)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  {alert.icone}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-medium">{alert.titulo}</h5>
                      {alert.urgencia && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
                          URGENTE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(alert.tipo)}`}>
                        {alert.tipo.toUpperCase()}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                        {alert.severidade.toUpperCase()}
                      </span>
                      {alert.zona && (
                        <div className="flex items-center space-x-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          <span>{alert.zona}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs opacity-75">
                  <div className="flex items-center space-x-1 mb-1">
                    <Clock className="h-3 w-3" />
                    <span>Válido até {alert.validadeFim}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h6 className="font-medium text-sm mb-1">Descrição</h6>
                  <p className="text-sm opacity-90">{alert.descricao}</p>
                </div>
                
                <div className="bg-white/50 p-3 rounded border">
                  <h6 className="font-medium text-sm mb-1">Recomendação</h6>
                  <p className="text-sm">{alert.recomendacao}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs opacity-75">
                  <span>Válido de {alert.validadeInicio} até {alert.validadeFim}</span>
                  <span>ID: {alert.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumo de Ações */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Resumo de Ações Recomendadas</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-800 mb-3">Ações Imediatas (24-48h)</h5>
            <div className="space-y-2">
              {alerts
                .filter(a => a.urgencia || a.severidade === 'critico')
                .map((alert, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded border border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">
                      <strong>{alert.titulo}:</strong> {alert.recomendacao.substring(0, 100)}...
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-800 mb-3">Ações de Médio Prazo (1-2 semanas)</h5>
            <div className="space-y-2">
              {alerts
                .filter(a => !a.urgencia && (a.severidade === 'alto' || a.severidade === 'medio'))
                .slice(0, 3)
                .map((alert, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <Clock className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <strong>{alert.titulo}:</strong> {alert.recomendacao.substring(0, 100)}...
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Próximas Verificações */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Próximas Verificações Programadas</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h5 className="font-medium text-blue-800">Hoje (20/06)</h5>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Monitoramento de ferrugem asiática</li>
              <li>• Verificação de armadilhas</li>
              <li>• Inspeção de irrigação</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <h5 className="font-medium text-green-800">Amanhã (21/06)</h5>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Aplicação de fungicida</li>
              <li>• Monitoramento de pragas</li>
              <li>• Análise de umidade do solo</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h5 className="font-medium text-purple-800">Esta Semana</h5>
            </div>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Reavaliação de tratamentos</li>
              <li>• Coleta de amostras</li>
              <li>• Relatório semanal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

