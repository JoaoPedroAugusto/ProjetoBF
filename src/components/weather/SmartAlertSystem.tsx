import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Settings, Filter, Archive, X, Eye, EyeOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface SmartAlert {
  id: string;
  tipo: 'clima' | 'doenca' | 'praga' | 'irrigacao' | 'nutricao' | 'manejo' | 'sistema';
  severidade: 'baixo' | 'medio' | 'alto' | 'critico';
  titulo: string;
  descricao: string;
  recomendacao: string;
  timestamp: string;
  status: 'ativo' | 'resolvido' | 'ignorado';
  zona?: string;
  cultura?: string;
  urgencia: boolean;
  lido: boolean;
  configuravel: boolean;
}

interface AlertConfig {
  tipo: string;
  ativo: boolean;
  severidadeMinima: 'baixo' | 'medio' | 'alto' | 'critico';
  notificacoes: boolean;
}

interface AlertStats {
  periodo: string;
  total: number;
  criticos: number;
  resolvidos: number;
  ativos: number;
}

interface SmartAlertSystemProps {
  cultura?: string;
}

// Dados históricos de alertas
const alertHistory: AlertStats[] = [
  { periodo: 'S1', total: 12, criticos: 2, resolvidos: 8, ativos: 4 },
  { periodo: 'S2', total: 15, criticos: 3, resolvidos: 10, ativos: 5 },
  { periodo: 'S3', total: 18, criticos: 4, resolvidos: 12, ativos: 6 },
  { periodo: 'S4', total: 22, criticos: 5, resolvidos: 15, ativos: 7 },
  { periodo: 'S5', total: 19, criticos: 3, resolvidos: 14, ativos: 5 },
  { periodo: 'S6', total: 16, criticos: 2, resolvidos: 12, ativos: 4 },
];

// Alertas simulados
const generateSmartAlerts = (cultura: string): SmartAlert[] => [
  {
    id: 'alert_001',
    tipo: 'clima',
    severidade: 'critico',
    titulo: 'Tempestade Severa Aproximando',
    descricao: 'Sistema meteorológico com ventos de até 80 km/h e granizo previsto para as próximas 6 horas.',
    recomendacao: 'Suspender todas as atividades no campo. Proteger equipamentos e estruturas. Monitorar condições continuamente.',
    timestamp: '2025-06-20T14:30:00Z',
    status: 'ativo',
    zona: 'Todas as zonas',
    cultura,
    urgencia: true,
    lido: false,
    configuravel: false
  },
  {
    id: 'alert_002',
    tipo: 'doenca',
    severidade: 'alto',
    titulo: 'Condições Críticas para Ferrugem',
    descricao: 'Umidade relativa acima de 90% por mais de 12 horas consecutivas com temperatura ideal para ferrugem.',
    recomendacao: 'Aplicar fungicida preventivo nas próximas 24 horas. Monitorar sintomas nas folhas inferiores.',
    timestamp: '2025-06-20T12:15:00Z',
    status: 'ativo',
    zona: 'Zonas A, B, D',
    cultura,
    urgencia: true,
    lido: false,
    configuravel: true
  },
  {
    id: 'alert_003',
    tipo: 'irrigacao',
    severidade: 'alto',
    titulo: 'Falha no Sistema de Irrigação',
    descricao: 'Sensor detectou interrupção no fornecimento de água na Zona C há 3 horas.',
    recomendacao: 'Verificar bomba e sistema de distribuição imediatamente. Implementar irrigação manual se necessário.',
    timestamp: '2025-06-20T11:45:00Z',
    status: 'ativo',
    zona: 'Zona C',
    cultura,
    urgencia: true,
    lido: true,
    configuravel: false
  },
  {
    id: 'alert_004',
    tipo: 'praga',
    severidade: 'medio',
    titulo: 'Aumento de Capturas em Armadilhas',
    descricao: 'Armadilhas de feromônio registraram aumento de 150% nas capturas na última semana.',
    recomendacao: 'Intensificar monitoramento visual. Preparar para possível aplicação de inseticida.',
    timestamp: '2025-06-20T09:30:00Z',
    status: 'ativo',
    zona: 'Zona A',
    cultura,
    urgencia: false,
    lido: true,
    configuravel: true
  },
  {
    id: 'alert_005',
    tipo: 'nutricao',
    severidade: 'medio',
    titulo: 'Deficiência Nutricional Detectada',
    descricao: 'Análise de imagem por drone detectou sintomas de deficiência de nitrogênio em 15% da área.',
    recomendacao: 'Realizar análise foliar para confirmar. Considerar adubação nitrogenada suplementar.',
    timestamp: '2025-06-20T08:00:00Z',
    status: 'ativo',
    zona: 'Zona B',
    cultura,
    urgencia: false,
    lido: true,
    configuravel: true
  },
  {
    id: 'alert_006',
    tipo: 'sistema',
    severidade: 'baixo',
    titulo: 'Manutenção Programada de Sensores',
    descricao: 'Manutenção preventiva dos sensores meteorológicos agendada para amanhã às 8h.',
    recomendacao: 'Dados meteorológicos podem ter breve interrupção. Usar fontes alternativas se necessário.',
    timestamp: '2025-06-20T07:00:00Z',
    status: 'ativo',
    zona: 'Estação meteorológica',
    cultura,
    urgencia: false,
    lido: true,
    configuravel: false
  },
  {
    id: 'alert_007',
    tipo: 'clima',
    severidade: 'baixo',
    titulo: 'Mudança de Padrão Climático',
    descricao: 'Previsão indica mudança para padrão mais seco nos próximos 10 dias.',
    recomendacao: 'Ajustar cronograma de irrigação. Monitorar umidade do solo mais frequentemente.',
    timestamp: '2025-06-19T18:00:00Z',
    status: 'resolvido',
    zona: 'Todas as zonas',
    cultura,
    urgencia: false,
    lido: true,
    configuravel: true
  }
];

// Configurações padrão de alertas
const defaultAlertConfigs: AlertConfig[] = [
  { tipo: 'clima', ativo: true, severidadeMinima: 'medio', notificacoes: true },
  { tipo: 'doenca', ativo: true, severidadeMinima: 'medio', notificacoes: true },
  { tipo: 'praga', ativo: true, severidadeMinima: 'medio', notificacoes: true },
  { tipo: 'irrigacao', ativo: true, severidadeMinima: 'baixo', notificacoes: true },
  { tipo: 'nutricao', ativo: true, severidadeMinima: 'medio', notificacoes: false },
  { tipo: 'manejo', ativo: true, severidadeMinima: 'medio', notificacoes: false },
  { tipo: 'sistema', ativo: false, severidadeMinima: 'baixo', notificacoes: false },
];

export const SmartAlertSystem: React.FC<SmartAlertSystemProps> = ({ cultura = 'soja' }) => {
  const [alerts, setAlerts] = useState<SmartAlert[]>(generateSmartAlerts(cultura));
  const [configs, setConfigs] = useState<AlertConfig[]>(defaultAlertConfigs);
  const [activeTab, setActiveTab] = useState<'alertas' | 'historico' | 'configuracoes'>('alertas');
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterSeverity, setFilterSeverity] = useState<string>('todos');
  const [showResolved, setShowResolved] = useState(false);

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
      case 'sistema':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, lido: true } : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolvido' } : alert
    ));
  };

  const ignoreAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'ignorado' } : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!showResolved && alert.status !== 'ativo') return false;
    if (filterType !== 'todos' && alert.tipo !== filterType) return false;
    if (filterSeverity !== 'todos' && alert.severidade !== filterSeverity) return false;
    return true;
  });

  const alertStats = {
    total: alerts.length,
    ativos: alerts.filter(a => a.status === 'ativo').length,
    criticos: alerts.filter(a => a.severidade === 'critico' && a.status === 'ativo').length,
    naoLidos: alerts.filter(a => !a.lido && a.status === 'ativo').length,
  };

  // Dados para gráfico de pizza
  const pieData = [
    { name: 'Críticos', value: alerts.filter(a => a.severidade === 'critico').length, color: '#dc2626' },
    { name: 'Altos', value: alerts.filter(a => a.severidade === 'alto').length, color: '#ea580c' },
    { name: 'Médios', value: alerts.filter(a => a.severidade === 'medio').length, color: '#ca8a04' },
    { name: 'Baixos', value: alerts.filter(a => a.severidade === 'baixo').length, color: '#16a34a' },
  ];

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Sistema de Alertas Inteligentes
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('alertas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'alertas' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Alertas
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'historico' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'configuracoes' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Configurações
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-900">{alertStats.total}</div>
            <div className="text-sm text-blue-700">Total de Alertas</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-900">{alertStats.ativos}</div>
            <div className="text-sm text-green-700">Alertas Ativos</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-900">{alertStats.criticos}</div>
            <div className="text-sm text-red-700">Críticos</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
            <div className="text-2xl font-bold text-orange-900">{alertStats.naoLidos}</div>
            <div className="text-sm text-orange-700">Não Lidos</div>
          </div>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'alertas' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="todos">Todos os tipos</option>
                <option value="clima">Clima</option>
                <option value="doenca">Doenças</option>
                <option value="praga">Pragas</option>
                <option value="irrigacao">Irrigação</option>
                <option value="nutricao">Nutrição</option>
                <option value="manejo">Manejo</option>
                <option value="sistema">Sistema</option>
              </select>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="todos">Todas as severidades</option>
                <option value="critico">Crítico</option>
                <option value="alto">Alto</option>
                <option value="medio">Médio</option>
                <option value="baixo">Baixo</option>
              </select>

              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={showResolved}
                  onChange={(e) => setShowResolved(e.target.checked)}
                  className="rounded"
                />
                <span>Mostrar resolvidos</span>
              </label>
            </div>
          </div>

          {/* Lista de Alertas */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Alertas Ativos ({filteredAlerts.length})
            </h4>
            
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severidade)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {!alert.lido && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <h5 className="font-medium">{alert.titulo}</h5>
                        {alert.urgencia && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
                            URGENTE
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${getTypeColor(alert.tipo)}`}>
                          {alert.tipo.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/50">
                          {alert.severidade.toUpperCase()}
                        </span>
                        {alert.zona && (
                          <span className="text-gray-600">{alert.zona}</span>
                        )}
                        <span className="text-gray-500">
                          {new Date(alert.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-2 opacity-90">{alert.descricao}</p>
                      
                      <div className="bg-white/50 p-3 rounded border text-sm">
                        <strong>Recomendação:</strong> {alert.recomendacao}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      {!alert.lido && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Marcar como lido"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      
                      {alert.status === 'ativo' && (
                        <>
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded"
                            title="Resolver"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => ignoreAlert(alert.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                            title="Ignorar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="space-y-6">
          {/* Gráficos de Histórico */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendência Temporal */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Tendência de Alertas</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={alertHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="periodo" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total" />
                    <Line type="monotone" dataKey="criticos" stroke="#dc2626" strokeWidth={2} name="Críticos" />
                    <Line type="monotone" dataKey="resolvidos" stroke="#16a34a" strokeWidth={2} name="Resolvidos" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribuição por Severidade */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Distribuição por Severidade</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Estatísticas Detalhadas */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Estatísticas dos Últimos 30 Dias</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">127</div>
                <div className="text-sm text-gray-600">Total de Alertas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">23</div>
                <div className="text-sm text-gray-600">Alertas Críticos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98</div>
                <div className="text-sm text-gray-600">Resolvidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.2h</div>
                <div className="text-sm text-gray-600">Tempo Médio de Resolução</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'configuracoes' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configurações de Alertas
          </h4>
          
          <div className="space-y-4">
            {configs.map((config, index) => (
              <div key={config.tipo} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium capitalize">{config.tipo}</h5>
                  <p className="text-sm text-gray-600">
                    Severidade mínima: {config.severidadeMinima} | 
                    Notificações: {config.notificacoes ? 'Ativadas' : 'Desativadas'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={config.severidadeMinima}
                    onChange={(e) => {
                      const newConfigs = [...configs];
                      newConfigs[index].severidadeMinima = e.target.value as any;
                      setConfigs(newConfigs);
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="baixo">Baixo</option>
                    <option value="medio">Médio</option>
                    <option value="alto">Alto</option>
                    <option value="critico">Crítico</option>
                  </select>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.notificacoes}
                      onChange={(e) => {
                        const newConfigs = [...configs];
                        newConfigs[index].notificacoes = e.target.checked;
                        setConfigs(newConfigs);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">Notificar</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.ativo}
                      onChange={(e) => {
                        const newConfigs = [...configs];
                        newConfigs[index].ativo = e.target.checked;
                        setConfigs(newConfigs);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">Ativo</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Salvar Configurações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

