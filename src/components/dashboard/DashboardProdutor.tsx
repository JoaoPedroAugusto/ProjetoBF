import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Truck,
  Leaf,
  BarChart3,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export interface DashboardProdutorProps {
  
  onNext: () => void;
  onClose?: () => void; // Opcional, se quiser botão de fechar
}

export const DashboardProdutor: React.FC<DashboardProdutorProps> = ({  onNext, onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dados simulados em tempo real
  const dadosTempoReal = {
    temperatura: 28.5,
    umidade: 65,
    ph: 6.2,
    umidadeSolo: 45,
    luminosidade: 85,
    vento: 12.3
  };

  const alertas = [
    {
      id: 1,
      tipo: 'irrigacao',
      nivel: 'medio',
      mensagem: 'Talhão 3 necessita irrigação em 2 horas',
      tempo: '15 min atrás'
    },
    {
      id: 2,
      tipo: 'praga',
      nivel: 'alto',
      mensagem: 'Possível infestação de broca detectada no Talhão 1',
      tempo: '1 hora atrás'
    },
    {
      id: 3,
      tipo: 'clima',
      nivel: 'baixo',
      mensagem: 'Previsão de chuva para amanhã - 70% de probabilidade',
      tempo: '2 horas atrás'
    }
  ];

  const historicoEntregas = [
    {
      id: 1,
      data: '2024-06-15',
      talhao: 'Talhão 1',
      quantidade: '45.2 ton',
      qualidade: 'A+',
      destino: 'Usina São João',
      status: 'Entregue',
      valor: 'R$ 67.800,00'
    },
    {
      id: 2,
      data: '2024-06-10',
      talhao: 'Talhão 2',
      quantidade: '38.7 ton',
      qualidade: 'A',
      destino: 'Usina São João',
      status: 'Entregue',
      valor: 'R$ 54.180,00'
    },
    {
      id: 3,
      data: '2024-06-05',
      talhao: 'Talhão 3',
      quantidade: '52.1 ton',
      qualidade: 'A+',
      destino: 'Usina Verde',
      status: 'Entregue',
      valor: 'R$ 78.150,00'
    },
    {
      id: 4,
      data: '2024-05-28',
      talhao: 'Talhão 1',
      quantidade: '41.8 ton',
      qualidade: 'A',
      destino: 'Usina São João',
      status: 'Entregue',
      valor: 'R$ 58.520,00'
    }
  ];

  const dadosSustentabilidade = {
    economiaAgua: 25,
    reducaoEmissoes: 18,
    eficienciaEnergetica: 32,
    certificacoes: ['Bonsucro', 'ISCC', 'Orgânico']
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'irrigacao': return <Droplets className="h-5 w-5" />;
      case 'praga': return <AlertTriangle className="h-5 w-5" />;
      case 'clima': return <Info className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getAlertColor = (nivel: string) => {
    switch (nivel) {
      case 'alto': return 'bg-red-100 border-red-500 text-red-700';
      case 'medio': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'baixo': return 'bg-blue-100 border-blue-500 text-blue-700';
      default: return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard do Produtor</h1>
              <p className="text-gray-600">Fazenda São José - Ribeirão Preto, SP</p>
              <p className="text-sm text-gray-500">
                Última atualização: {currentTime.toLocaleString('pt-BR')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
             
              <button
                onClick={onNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Próximo
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Monitoramento em Tempo Real */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Thermometer className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Temperatura</h3>
              </div>
              <span className="text-2xl font-bold text-red-500">{dadosTempoReal.temperatura}°C</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(dadosTempoReal.temperatura / 40) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Ideal: 25-30°C</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Droplets className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Umidade do Ar</h3>
              </div>
              <span className="text-2xl font-bold text-blue-500">{dadosTempoReal.umidade}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${dadosTempoReal.umidade}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Ideal: 60-80%</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-purple-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">pH do Solo</h3>
              </div>
              <span className="text-2xl font-bold text-purple-500">{dadosTempoReal.ph}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${(dadosTempoReal.ph / 14) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Ideal: 5.5-6.5</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Droplets className="h-8 w-8 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Umidade do Solo</h3>
              </div>
              <span className="text-2xl font-bold text-green-500">{dadosTempoReal.umidadeSolo}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${dadosTempoReal.umidadeSolo}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Ideal: 40-60%</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Luminosidade</h3>
              </div>
              <span className="text-2xl font-bold text-yellow-500">{dadosTempoReal.luminosidade}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${dadosTempoReal.luminosidade}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Excelente</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-gray-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Vento</h3>
              </div>
              <span className="text-2xl font-bold text-gray-500">{dadosTempoReal.vento} km/h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-500 h-2 rounded-full" 
                style={{ width: `${(dadosTempoReal.vento / 30) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Moderado</p>
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Alertas e Notificações</h2>
          <div className="space-y-3">
            {alertas.map((alerta) => (
              <div 
                key={alerta.id} 
                className={`p-4 rounded-lg border-l-4 ${getAlertColor(alerta.nivel)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getAlertIcon(alerta.tipo)}
                    <div className="ml-3">
                      <p className="font-semibold">{alerta.mensagem}</p>
                      <p className="text-sm opacity-75">{alerta.tempo}</p>
                    </div>
                  </div>
                  <button className="text-sm underline hover:no-underline">
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de Entregas */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Histórico de Entregas</h2>
            <div className="flex items-center text-green-600">
              <Truck className="h-5 w-5 mr-2" />
              <span className="font-semibold">Total: R$ 258.650,00</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Talhão</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Qualidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Destino</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor</th>
                </tr>
              </thead>
              <tbody>
                {historicoEntregas.map((entrega) => (
                  <tr key={entrega.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(entrega.data).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4">{entrega.talhao}</td>
                    <td className="py-3 px-4 font-semibold">{entrega.quantidade}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        entrega.qualidade === 'A+' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {entrega.qualidade}
                      </span>
                    </td>
                    <td className="py-3 px-4">{entrega.destino}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-green-600 font-semibold">{entrega.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-600">{entrega.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Relatórios de Sustentabilidade */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Relatórios de Sustentabilidade</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Economia de Água</h3>
              <p className="text-2xl font-bold text-blue-600">{dadosSustentabilidade.economiaAgua}%</p>
              <p className="text-sm text-gray-600">vs. ano anterior</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Redução de Emissões</h3>
              <p className="text-2xl font-bold text-green-600">{dadosSustentabilidade.reducaoEmissoes}%</p>
              <p className="text-sm text-gray-600">CO2 equivalente</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Eficiência Energética</h3>
              <p className="text-2xl font-bold text-yellow-600">{dadosSustentabilidade.eficienciaEnergetica}%</p>
              <p className="text-sm text-gray-600">melhoria</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Certificações</h3>
              <p className="text-2xl font-bold text-purple-600">{dadosSustentabilidade.certificacoes.length}</p>
              <p className="text-sm text-gray-600">ativas</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Certificações Ativas</h4>
            <div className="flex flex-wrap gap-2">
              {dadosSustentabilidade.certificacoes.map((cert, index) => (
                <span 
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div> 
      </div>
      
    </div>
  );
};

