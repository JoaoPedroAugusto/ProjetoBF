import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wheat, TrendingUp, MapPin, Leaf, DollarSign, Award, Target, 
  Shield, Zap, Database, Wifi, Brain, Eye, Heart, Users, 
  Presentation, Monitor 
} from 'lucide-react';
import { PresentationManager } from '../../components/presentation';
import { DashboardProdutor } from '../../components/dashboard/DashboardProdutor';
import { DashboardUsina } from '../../components/dashboard/DashboardUsina';
import { DashboardCliente } from '../../components/dashboard/DashboardCliente';

export const SugarcanePage: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showDashboard, setShowDashboard] = useState<string | null>(null);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const startPresentation = () => {
    setShowPresentation(true);
    console.log("Starting presentation...");
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.shiftKey && (event.key === 'p' || event.key === 'P')) {
      event.preventDefault();
      if (!isViewing && !isEditing) {
        startPresentation();
      }
    }
  }, [isViewing, isEditing]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (showPresentation) {
    return (
      <PresentationManager
        sectorId="sugarcane"
        sectorName="cana-de-açúcar"
      />
    );
  }

  if (showDashboard === 'produtor') {
    return <DashboardProdutor onClose={() => setShowDashboard(null)} />;
  }

  if (showDashboard === 'usina') {
    return <DashboardUsina onClose={() => setShowDashboard(null)} />;
  }

  if (showDashboard === 'cliente') {
    return <DashboardCliente onClose={() => setShowDashboard(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section with Banner */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: "url('/src/public/images/sugarcane/banner_pisca_trace.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-4 py-16 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center mb-6">
              <Wheat className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">PISCA Trace: Cana-de-Açúcar</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-4xl leading-relaxed">
              Revolucionando a rastreabilidade da cana-de-açúcar com tecnologias de ponta: Blockchain, IoT e IA.
              Garantimos a origem, sustentabilidade e qualidade do produto, proporcionando transparência total da fazenda à gôndola.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2">
                <span className="font-semibold">100% Rastreável</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2">
                <span className="font-semibold">Blockchain Seguro</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2">
                <span className="font-semibold">IoT + IA</span>
              </div>
              <button
                onClick={() => setShowPresentation(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
              >
                <Presentation className="h-5 w-5" />
                <span>Apresentação</span>
              </button>
              
              {/* Demo Button with User Selection Modal */}
              <div className="relative">
                <button
                  onClick={() => setShowUserSelection(!showUserSelection)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm shadow-lg"
                >
                  <Monitor className="h-5 w-5" />
                  <span>Demonstração</span>
                </button>

                {/* User Selection Modal */}
                {showUserSelection && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-80 z-50">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Selecione seu perfil:</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setShowDashboard('produtor');
                          setShowUserSelection(false);
                        }}
                        className="w-full text-left p-4 rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <Leaf className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Produtor Rural</h4>
                            <p className="text-sm text-gray-600">Monitoramento da plantação, alertas e histórico de entregas</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowDashboard('usina');
                          setShowUserSelection(false);
                        }}
                        className="w-full text-left p-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <Shield className="h-6 w-6 text-blue-600 mr-3" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Usina</h4>
                            <p className="text-sm text-gray-600">Rastreabilidade, certificações e análise de qualidade</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setShowDashboard('cliente');
                          setShowUserSelection(false);
                        }}
                        className="w-full text-left p-4 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <Users className="h-6 w-6 text-purple-600 mr-3" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Cliente Final</h4>
                            <p className="text-sm text-gray-600">Verificação de origem, certificações e sustentabilidade</p>
                          </div>
                        </div>
                      </button>
                    </div>
                    <button
                      onClick={() => setShowUserSelection(false)}
                      className="mt-4 w-full text-center text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Fechar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for closing modal */}
      {showUserSelection && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setShowUserSelection(false)}
        ></div>
      )}

      {/* About PISCA - Mission, Vision and Values */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Conheça a PISCA</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Nossa Visão</h3>
              <p className="text-gray-700">
                Ser a plataforma líder mundial em rastreabilidade agrícola, transformando a forma como
                o mundo produz, processa e consome alimentos, criando um futuro mais transparente e sustentável.
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Nossa Missão</h3>
              <p className="text-gray-700">
                Revolucionar a cadeia produtiva agrícola através de tecnologias inovadoras como Blockchain,
                IoT e IA, garantindo transparência total, sustentabilidade comprovada e valor agregado para
                todos os elos da cadeia, desde o produtor até o consumidor final.
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Nossos Valores</h3>
              <div className="text-gray-700 space-y-2 text-sm">
                <p><strong>Transparência:</strong> Informações claras e acessíveis</p>
                <p><strong>Sustentabilidade:</strong> Compromisso com o meio ambiente</p>
                <p><strong>Inovação:</strong> Tecnologia de ponta para soluções reais</p>
                <p><strong>Confiança:</strong> Segurança e integridade dos dados</p>
                <p><strong>Parceria:</strong> Crescimento conjunto de toda a cadeia</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">Nosso Compromisso</h3>
              </div>
              <p className="text-gray-700 text-lg">
                Na PISCA, acreditamos que a tecnologia deve servir às pessoas e ao planeta.
                Trabalhamos incansavelmente para criar soluções que não apenas aumentem a lucratividade,
                mas também promovam práticas agrícolas responsáveis e sustentáveis.
                <strong>Juntos, estamos construindo o futuro da agricultura.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* How PISCA Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Como a PISCA Funciona na Prática</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">🔄 Fluxo de Dados em Tempo Real</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Coleta Automatizada</h4>
                    <p className="text-gray-600 text-sm">Sensores IoT no campo capturam dados de solo, clima, crescimento e aplicação de insumos a cada 15 minutos</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Processamento Inteligente</h4>
                    <p className="text-gray-600 text-sm">IA analisa os dados, detecta padrões e gera insights para otimização da produção</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Registro Blockchain</h4>
                    <p className="text-gray-600 text-sm">Todas as informações são criptografadas e registradas de forma imutável na blockchain</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Certificação Automática</h4>
                    <p className="text-gray-600 text-sm">Sistema valida automaticamente conformidade com padrões Bonsucro e ISCC</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">📱 Interface do Usuário</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 mb-2">Dashboard do Produtor</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Monitoramento em tempo real das condições do campo</li>
                      <li>• Alertas de irrigação, pragas e doenças</li>
                      <li>• Histórico completo de cada talhão</li>
                      <li>• Relatórios de sustentabilidade</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-800 mb-2">Portal da Usina</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Rastreabilidade completa da matéria-prima</li>
                      <li>• Certificados digitais automáticos</li>
                      <li>• Análise de qualidade por lote</li>
                      <li>• Compliance regulatório</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-800 mb-2">App do Consumidor</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• QR Code para verificar origem</li>
                      <li>• Histórico de sustentabilidade</li>
                      <li>• Certificações válidas</li>
                      <li>• Impacto ambiental do produto</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎯 Exemplo Prático de Funcionamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Campo</h4>
                <p className="text-xs text-gray-600">Sensor detecta que a cana atingiu 18° Brix (teor de açúcar ideal)</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">IA</h4>
                <p className="text-xs text-gray-600">Sistema recomenda colheita imediata e agenda máquinas disponíveis</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Blockchain</h4>
                <p className="text-xs text-gray-600">Registra data, hora, operador e qualidade da cana colhida</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Certificação</h4>
                <p className="text-xs text-gray-600">Gera automaticamente certificado digital de qualidade e origem</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tecnologias que Impulsionam a Rastreabilidade</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Blockchain</h3>
              <p className="text-gray-600 mb-4">Segurança e Imutabilidade</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Registros imutáveis e criptografados</li>
                <li>• Consenso distribuído para validação</li>
                <li>• Auditoria transparente em tempo real</li>
                <li>• Integração com smart contracts</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Internet das Coisas (IoT)</h3>
              <p className="text-gray-600 mb-4">Coleta Automatizada de Dados</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Sensores de umidade, temperatura e pH</li>
                <li>• Estações meteorológicas automatizadas</li>
                <li>• Monitoramento por drones e satélites</li>
                <li>• Balanças e medidores inteligentes</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Inteligência Artificial</h3>
              <p className="text-gray-600 mb-4">Análise e Otimização</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Análise preditiva de safras</li>
                <li>• Detecção de anomalias em tempo real</li>
                <li>• Otimização de recursos e insumos</li>
                <li>• Validação automática de dados</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits for the Production Chain */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Benefícios para a Cadeia Produtiva</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Para Produtores Rurais</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Reconhecimento</h4>
                    <p className="text-sm text-gray-700">Valorização das práticas sustentáveis e qualidade superior</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Otimização</h4>
                    <p className="text-sm text-gray-700">Dados para melhorar produtividade e reduzir custos</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Acesso a Mercados</h4>
                    <p className="text-sm text-gray-700">Abertura de novos mercados premium e certificados</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Para Usinas e Indústrias</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Conformidade</h4>
                    <p className="text-sm text-gray-700">Atendimento a regulamentações e padrões internacionais</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Eficiência</h4>
                    <p className="text-sm text-gray-700">Otimização de processos e redução de desperdícios</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Marca Forte</h4>
                    <p className="text-sm text-gray-700">Diferenciação competitiva e valor agregado</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Para Consumidores</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Confiança</h4>
                    <p className="text-sm text-gray-700">Garantia de origem e autenticidade do produto</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Heart className="h-5 w-5 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Escolha Consciente</h4>
                    <p className="text-sm text-gray-700">Decisões informadas sobre sustentabilidade</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Qualidade</h4>
                    <p className="text-sm text-gray-700">Acesso a produtos de qualidade comprovada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications and Compliance */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Certificações e Conformidade</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">Bonsucro</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Certificação global líder para a cana-de-açúcar sustentável. Avalia a sustentabilidade dos produtos
                fabricados a partir da cana-de-açúcar, considerando indicadores de produção, consumo de energia e água,
                e emissão de gases de efeito estufa.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">ISCC</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Sistema de certificação internacional que abrange a sustentabilidade e a rastreabilidade de biomassa
                e biocombustíveis, incluindo a cana-de-açúcar. Garante que a produção atende a rigorosos critérios
                ambientais, sociais e de governança.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Objetivos de Desenvolvimento Sustentável (ODS)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600 mb-1">2</div>
                <p className="text-xs text-gray-700">Fome Zero e Agricultura Sustentável</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-600 mb-1">7</div>
                <p className="text-xs text-gray-700">Energia Limpa e Acessível</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-red-600 mb-1">8</div>
                <p className="text-xs text-gray-700">Trabalho Decente e Crescimento Econômico</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600 mb-1">9</div>
                <p className="text-xs text-gray-700">Indústria, Inovação e Infraestrutura</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-600 mb-1">12</div>
                <p className="text-xs text-gray-700">Consumo e Produção Responsáveis</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600 mb-1">13</div>
                <p className="text-xs text-gray-700">Ação Contra a Mudança do Clima</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Analysis and Profitability */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Análise de Custos e Lucratividade</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 text-red-600 mr-3" />
                Investimento Inicial
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Hardware (IoT)</span>
                  <span className="font-semibold text-gray-800">R$ 50.000 - R$ 200.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Software (PISCA Trace)</span>
                  <span className="font-semibold text-gray-800">R$ 100.000 - R$ 500.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Infraestrutura Cloud</span>
                  <span className="font-semibold text-gray-800">R$ 30.000 - R$ 150.000/ano</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total Estimado</span>
                    <span className="font-bold text-red-600 text-lg">R$ 200.000 - R$ 930.000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                Retorno sobre Investimento
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Aumento do Valor do Produto</span>
                  <span className="font-semibold text-green-600">15% a 30% premium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Redução de Custos</span>
                  <span className="font-semibold text-green-600">15-20% economia</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">ROI Estimado</span>
                    <span className="font-bold text-green-600 text-lg">20% a 50% margem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};