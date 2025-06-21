import React from 'react';
import { Bug, Shield, AlertTriangle, Eye, Calendar, Thermometer, Droplets, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface PhytosanitaryThreat {
  nome: string;
  tipo: 'doenca' | 'praga';
  risco: number;
  nivel: 'baixo' | 'medio' | 'alto' | 'critico';
  tendencia: 'subindo' | 'descendo' | 'estavel';
  fatoresRisco: string[];
  sintomas: string[];
  prevencao: string[];
  tratamento: string;
  monitoramento: string;
  icone: React.ReactNode;
}

interface MonitoringSchedule {
  atividade: string;
  frequencia: string;
  proximaData: string;
  responsavel: string;
  status: 'pendente' | 'concluido' | 'atrasado';
}

interface ThreatHistory {
  semana: string;
  doencas: number;
  pragas: number;
  tratamentos: number;
}

interface PhytosanitaryMonitoringProps {
  cultura?: string;
}

// Dados históricos simulados
const threatHistory: ThreatHistory[] = [
  { semana: 'S1', doencas: 15, pragas: 8, tratamentos: 3 },
  { semana: 'S2', doencas: 18, pragas: 12, tratamentos: 5 },
  { semana: 'S3', doencas: 22, pragas: 15, tratamentos: 7 },
  { semana: 'S4', doencas: 25, pragas: 18, tratamentos: 8 },
  { semana: 'S5', doencas: 20, pragas: 14, tratamentos: 6 },
  { semana: 'S6', doencas: 16, pragas: 10, tratamentos: 4 },
];

// Ameaças baseadas na cultura
const getPhytosanitaryThreats = (cultura: string): PhytosanitaryThreat[] => {
  const baseThreats = {
    soja: [
      {
        nome: 'Ferrugem Asiática',
        tipo: 'doenca' as const,
        risco: 75,
        nivel: 'alto' as const,
        tendencia: 'subindo' as const,
        fatoresRisco: ['Alta umidade (>80%)', 'Temperatura 18-28°C', 'Molhamento foliar'],
        sintomas: ['Pústulas alaranjadas na face inferior das folhas', 'Amarelecimento das folhas', 'Desfolha precoce'],
        prevencao: ['Monitoramento semanal', 'Aplicação preventiva de fungicidas', 'Rotação de culturas'],
        tratamento: 'Fungicidas sistêmicos (triazóis + estrobilurinas)',
        monitoramento: 'Inspeção visual semanal das folhas inferiores',
        icone: <Shield className="h-5 w-5" />
      },
      {
        nome: 'Percevejo Marrom',
        tipo: 'praga' as const,
        risco: 60,
        nivel: 'medio' as const,
        tendencia: 'estavel' as const,
        fatoresRisco: ['Temperatura elevada', 'Baixa umidade', 'Período reprodutivo'],
        sintomas: ['Vagens murchas e escuras', 'Grãos pequenos e enrugados', 'Retenção foliar'],
        prevencao: ['Monitoramento com pano de batida', 'Controle de plantas daninhas', 'MIP'],
        tratamento: 'Inseticidas seletivos (neonicotinoides)',
        monitoramento: 'Pano de batida 2x por semana',
        icone: <Bug className="h-5 w-5" />
      },
      {
        nome: 'Mofo Branco',
        tipo: 'doenca' as const,
        risco: 45,
        nivel: 'medio' as const,
        tendencia: 'descendo' as const,
        fatoresRisco: ['Alta umidade', 'Temperatura amena (15-20°C)', 'Adensamento'],
        sintomas: ['Lesões encharcadas no caule', 'Micélio branco', 'Escleródios pretos'],
        prevencao: ['Espaçamento adequado', 'Drenagem', 'Rotação de culturas'],
        tratamento: 'Fungicidas específicos (procimidona)',
        monitoramento: 'Inspeção da base das plantas semanalmente',
        icone: <Shield className="h-5 w-5" />
      },
      {
        nome: 'Lagarta da Soja',
        tipo: 'praga' as const,
        risco: 55,
        nivel: 'medio' as const,
        tendencia: 'subindo' as const,
        fatoresRisco: ['Temperatura favorável', 'Presença de adultos', 'Fase vegetativa'],
        sintomas: ['Desfolha', 'Presença de lagartas', 'Fezes nas folhas'],
        prevencao: ['Monitoramento de adultos', 'Controle biológico', 'MIP'],
        tratamento: 'Inseticidas biológicos (Bt) ou químicos',
        monitoramento: 'Contagem de lagartas por metro linear',
        icone: <Bug className="h-5 w-5" />
      }
    ],
    milho: [
      {
        nome: 'Lagarta do Cartucho',
        tipo: 'praga' as const,
        risco: 80,
        nivel: 'alto' as const,
        tendencia: 'subindo' as const,
        fatoresRisco: ['Temperatura alta', 'Baixa precipitação', 'Fase inicial da cultura'],
        sintomas: ['Furos nas folhas', 'Raspagem do cartucho', 'Presença de lagartas'],
        prevencao: ['Monitoramento de posturas', 'Controle biológico', 'Plantas refugio'],
        tratamento: 'Inseticidas específicos ou Bt',
        monitoramento: 'Inspeção do cartucho 2x por semana',
        icone: <Bug className="h-5 w-5" />
      },
      {
        nome: 'Cercosporiose',
        tipo: 'doenca' as const,
        risco: 55,
        nivel: 'medio' as const,
        tendencia: 'estavel' as const,
        fatoresRisco: ['Umidade elevada', 'Temperatura 22-30°C', 'Molhamento foliar'],
        sintomas: ['Manchas retangulares nas folhas', 'Lesões pardas', 'Amarelecimento'],
        prevencao: ['Híbridos resistentes', 'Rotação de culturas', 'Manejo de restos culturais'],
        tratamento: 'Fungicidas sistêmicos (triazóis)',
        monitoramento: 'Inspeção foliar semanal',
        icone: <Shield className="h-5 w-5" />
      },
      {
        nome: 'Cigarrinha do Milho',
        tipo: 'praga' as const,
        risco: 40,
        nivel: 'medio' as const,
        tendencia: 'descendo' as const,
        fatoresRisco: ['Condições secas', 'Plantas estressadas', 'Presença de adultos'],
        sintomas: ['Amarelecimento das folhas', 'Nanismo', 'Avermelhamento'],
        prevencao: ['Eliminação de plantas daninhas', 'Controle de adultos', 'MIP'],
        tratamento: 'Inseticidas sistêmicos',
        monitoramento: 'Armadilhas amarelas',
        icone: <Bug className="h-5 w-5" />
      }
    ],
    tomate: [
      {
        nome: 'Requeima',
        tipo: 'doenca' as const,
        risco: 85,
        nivel: 'critico' as const,
        tendencia: 'subindo' as const,
        fatoresRisco: ['Alta umidade (>90%)', 'Temperatura 15-25°C', 'Molhamento foliar'],
        sintomas: ['Manchas escuras nas folhas', 'Lesões nos frutos', 'Odor característico'],
        prevencao: ['Espaçamento adequado', 'Irrigação localizada', 'Variedades resistentes'],
        tratamento: 'Fungicidas sistêmicos (metalaxil + mancozeb)',
        monitoramento: 'Inspeção diária em condições favoráveis',
        icone: <Shield className="h-5 w-5" />
      },
      {
        nome: 'Mosca Branca',
        tipo: 'praga' as const,
        risco: 70,
        nivel: 'alto' as const,
        tendencia: 'estavel' as const,
        fatoresRisco: ['Temperatura alta', 'Baixa umidade', 'Plantas hospedeiras'],
        sintomas: ['Amarelecimento das folhas', 'Fumagina', 'Presença de adultos'],
        prevencao: ['Controle de plantas daninhas', 'Barreiras físicas', 'Controle biológico'],
        tratamento: 'Inseticidas sistêmicos (imidacloprido)',
        monitoramento: 'Armadilhas amarelas adesivas',
        icone: <Bug className="h-5 w-5" />
      },
      {
        nome: 'Pinta Preta',
        tipo: 'doenca' as const,
        risco: 50,
        nivel: 'medio' as const,
        tendencia: 'descendo' as const,
        fatoresRisco: ['Umidade elevada', 'Temperatura 24-29°C', 'Ferimentos'],
        sintomas: ['Manchas circulares escuras', 'Anéis concêntricos', 'Desfolha'],
        prevencao: ['Rotação de culturas', 'Eliminação de restos culturais', 'Irrigação localizada'],
        tratamento: 'Fungicidas protetores (mancozeb)',
        monitoramento: 'Inspeção foliar 2x por semana',
        icone: <Shield className="h-5 w-5" />
      }
    ],
    algodao: [
      {
        nome: 'Bicudo do Algodoeiro',
        tipo: 'praga' as const,
        risco: 65,
        nivel: 'alto' as const,
        tendencia: 'estavel' as const,
        fatoresRisco: ['Umidade moderada', 'Presença de botões florais', 'Temperatura favorável'],
        sintomas: ['Botões florais perfurados', 'Presença de adultos', 'Queda de botões'],
        prevencao: ['Destruição de restos culturais', 'Monitoramento com feromônios', 'MIP'],
        tratamento: 'Inseticidas específicos (organofosforados)',
        monitoramento: 'Armadilhas com feromônio sexual',
        icone: <Bug className="h-5 w-5" />
      },
      {
        nome: 'Ramulária',
        tipo: 'doenca' as const,
        risco: 70,
        nivel: 'alto' as const,
        tendencia: 'subindo' as const,
        fatoresRisco: ['Alta umidade', 'Temperatura moderada', 'Molhamento foliar'],
        sintomas: ['Manchas brancas nas folhas', 'Desfolha', 'Redução da qualidade da fibra'],
        prevencao: ['Variedades resistentes', 'Espaçamento adequado', 'Manejo da irrigação'],
        tratamento: 'Fungicidas sistêmicos (triazóis)',
        monitoramento: 'Inspeção foliar semanal',
        icone: <Shield className="h-5 w-5" />
      }
    ],
    cana: [
      {
        nome: 'Broca da Cana',
        tipo: 'praga' as const,
        risco: 55,
        nivel: 'medio' as const,
        tendencia: 'estavel' as const,
        fatoresRisco: ['Temperatura elevada', 'Umidade moderada', 'Presença de adultos'],
        sintomas: ['Galerias no colmo', 'Presença de lagartas', 'Quebra do colmo'],
        prevencao: ['Controle biológico', 'Variedades resistentes', 'Manejo cultural'],
        tratamento: 'Controle biológico (Cotesia flavipes)',
        monitoramento: 'Dissecação de colmos mensalmente',
        icone: <Bug className="h-5 w-5" />
      },
      {
        nome: 'Ferrugem da Cana',
        tipo: 'doenca' as const,
        risco: 40,
        nivel: 'medio' as const,
        tendencia: 'descendo' as const,
        fatoresRisco: ['Umidade moderada', 'Temperatura 22-28°C', 'Variedades suscetíveis'],
        sintomas: ['Pústulas alaranjadas nas folhas', 'Amarelecimento', 'Redução do crescimento'],
        prevencao: ['Variedades resistentes', 'Manejo nutricional', 'Controle de plantas daninhas'],
        tratamento: 'Fungicidas sistêmicos se necessário',
        monitoramento: 'Inspeção foliar quinzenal',
        icone: <Shield className="h-5 w-5" />
      }
    ]
  };

  return baseThreats[cultura as keyof typeof baseThreats] || baseThreats.soja;
};

// Cronograma de monitoramento
const getMonitoringSchedule = (cultura: string): MonitoringSchedule[] => {
  return [
    { atividade: 'Inspeção visual geral', frequencia: 'Semanal', proximaData: '22/06/2025', responsavel: 'Técnico A', status: 'pendente' },
    { atividade: 'Monitoramento de pragas', frequencia: '2x por semana', proximaData: '21/06/2025', responsavel: 'Técnico B', status: 'concluido' },
    { atividade: 'Análise de doenças foliares', frequencia: 'Semanal', proximaData: '23/06/2025', responsavel: 'Técnico A', status: 'pendente' },
    { atividade: 'Verificação de armadilhas', frequencia: 'Diária', proximaData: '20/06/2025', responsavel: 'Técnico C', status: 'atrasado' },
    { atividade: 'Coleta de amostras', frequencia: 'Quinzenal', proximaData: '25/06/2025', responsavel: 'Técnico B', status: 'pendente' },
  ];
};

export const PhytosanitaryMonitoring: React.FC<PhytosanitaryMonitoringProps> = ({ cultura = 'soja' }) => {
  const threats = getPhytosanitaryThreats(cultura);
  const schedule = getMonitoringSchedule(cultura);

  const getRiskColor = (nivel: string) => {
    switch (nivel) {
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

  const getTrendIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subindo':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'descendo':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'estavel':
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'pendente':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'atrasado':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const riskCounts = {
    critico: threats.filter(t => t.nivel === 'critico').length,
    alto: threats.filter(t => t.nivel === 'alto').length,
    medio: threats.filter(t => t.nivel === 'medio').length,
    baixo: threats.filter(t => t.nivel === 'baixo').length,
  };

  const threatTypes = {
    doencas: threats.filter(t => t.tipo === 'doenca').length,
    pragas: threats.filter(t => t.tipo === 'praga').length,
  };

  // Dados para gráfico de pizza
  const pieData = [
    { name: 'Doenças', value: threatTypes.doencas, color: '#ef4444' },
    { name: 'Pragas', value: threatTypes.pragas, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monitoramento Fitossanitário - {cultura.charAt(0).toUpperCase() + cultura.slice(1)}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-900">{riskCounts.critico + riskCounts.alto}</div>
            <div className="text-sm text-red-700">Riscos Altos</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-900">{riskCounts.medio}</div>
            <div className="text-sm text-yellow-700">Riscos Médios</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-900">{threatTypes.doencas}</div>
            <div className="text-sm text-blue-700">Doenças</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
            <div className="text-2xl font-bold text-orange-900">{threatTypes.pragas}</div>
            <div className="text-sm text-orange-700">Pragas</div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição de Tipos */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Distribuição de Ameaças</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={60}
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

          {/* Histórico de Ameaças */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Histórico Semanal</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={threatHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="semana" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="doencas" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Doenças"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pragas" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Pragas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tratamentos" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Tratamentos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Ameaças Detalhadas */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Ameaças Identificadas</h4>
        
        <div className="space-y-4">
          {threats.map((threat, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getRiskColor(threat.nivel)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {threat.icone}
                  <div>
                    <h5 className="font-medium">{threat.nome}</h5>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                        {threat.tipo.toUpperCase()}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                        {threat.nivel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(threat.tendencia)}
                  <div className="text-right">
                    <div className="text-2xl font-bold">{threat.risco}%</div>
                    <div className="text-xs opacity-75">Risco</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <h6 className="font-medium text-sm mb-2">Fatores de Risco</h6>
                  <ul className="text-xs space-y-1">
                    {threat.fatoresRisco.map((fator, i) => (
                      <li key={i}>• {fator}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h6 className="font-medium text-sm mb-2">Sintomas</h6>
                  <ul className="text-xs space-y-1">
                    {threat.sintomas.map((sintoma, i) => (
                      <li key={i}>• {sintoma}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h6 className="font-medium text-sm mb-2">Prevenção</h6>
                  <ul className="text-xs space-y-1">
                    {threat.prevencao.map((prev, i) => (
                      <li key={i}>• {prev}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h6 className="font-medium text-sm mb-2">Tratamento</h6>
                  <p className="text-xs mb-2">{threat.tratamento}</p>
                  <h6 className="font-medium text-sm mb-1">Monitoramento</h6>
                  <p className="text-xs">{threat.monitoramento}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cronograma de Monitoramento */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Cronograma de Monitoramento</h4>
        
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5" />
                  <div>
                    <h5 className="font-medium">{item.atividade}</h5>
                    <div className="flex items-center space-x-4 mt-1 text-sm opacity-75">
                      <span>Frequência: {item.frequencia}</span>
                      <span>Responsável: {item.responsavel}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{item.proximaData}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condições Ambientais */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Condições Ambientais Atuais</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3 mb-3">
              <Thermometer className="h-6 w-6 text-red-600" />
              <h5 className="font-medium text-red-800">Temperatura</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-red-700">Atual:</span>
                <span className="font-medium text-red-900">28°C</span>
              </div>
              <div className="text-xs text-red-600">
                ⚠️ Favorável para pragas termófilas
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <Droplets className="h-6 w-6 text-blue-600" />
              <h5 className="font-medium text-blue-800">Umidade</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Atual:</span>
                <span className="font-medium text-blue-900">65%</span>
              </div>
              <div className="text-xs text-blue-600">
                ⚠️ Condições moderadas para doenças
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-green-600" />
              <h5 className="font-medium text-green-800">Risco Geral</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Nível:</span>
                <span className="font-medium text-green-900">Médio</span>
              </div>
              <div className="text-xs text-green-600">
                ✓ Monitoramento regular recomendado
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendações Gerais */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Recomendações Gerais</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h5 className="font-medium text-yellow-800 mb-2">Ações Imediatas</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Intensificar monitoramento de ferrugem asiática</li>
              <li>• Verificar armadilhas de feromônio</li>
              <li>• Aplicar tratamento preventivo em zonas críticas</li>
              <li>• Atualizar cronograma de inspeções</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">Medidas Preventivas</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Manter controle de plantas daninhas</li>
              <li>• Implementar rotação de princípios ativos</li>
              <li>• Fortalecer programa de MIP</li>
              <li>• Capacitar equipe de monitoramento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

