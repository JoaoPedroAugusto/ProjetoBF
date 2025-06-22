import React, { useState } from 'react';
import { 
  Zap, 
  Users, 
  BarChart3, 
  Package, 
  Truck, 
  TrendingUp,
  Calendar,
  MapPin,
  Scale,
  Heart,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface CultureSheepDemoProps {
  onClose: () => void;
}

export const CultureSheepDemo: React.FC<CultureSheepDemoProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    numeroAnimais: '',
    raca: '',
    idade: '',
    peso: '',
    faseProducao: '',
    historicoSaude: '',
    objetivosProducao: ''
  });

  const steps = [
    { id: 1, title: 'Cadastro e Inserção de Dados', icon: Users },
    { id: 2, title: 'Diagnóstico e Geração da Fórmula', icon: BarChart3 },
    { id: 3, title: 'Pedido e Processamento', icon: Package },
    { id: 4, title: 'Logística e Entrega', icon: Truck },
    { id: 5, title: 'Acompanhamento e Resultados', icon: TrendingUp }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar</span>
              </button>
              <div className="h-6 w-px bg-gray-300 mx-4"></div>
              <Zap className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Culture Sheep</h1>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Sistema Demonstrativo
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Nutrição Personalizada para seu Rebanho
              </h2>
              <p className="text-xl mb-6 text-green-100">
                Conheça em detalhes como funciona nosso processo de desenvolvimento 
                de planos nutricionais personalizados para ovinos.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white text-green-600 px-3 py-1 rounded text-sm font-medium">
                  Plano Acesso Social
                </div>
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded text-sm font-medium">
                  Plano Resultado Estratégico
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/img/Banner_culture_sheep.png" 
                alt="Culture Sheep Hero" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-100 border-green-600 text-green-600'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h3>
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Cadastro e Inserção de Dados */}
          {currentStep === 1 && (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold">Cadastro e Inserção de Dados</h3>
                </div>
                <p className="text-gray-600">
                  O processo começa com seu cadastro em nossa plataforma. Após criar sua conta, 
                  você terá acesso à área do produtor, onde poderá inserir os dados do seu rebanho.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Número de Animais</label>
                    <input
                      type="number"
                      placeholder="Ex: 50"
                      value={formData.numeroAnimais}
                      onChange={(e) => handleInputChange('numeroAnimais', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Raça</label>
                    <select 
                      value={formData.raca}
                      onChange={(e) => handleInputChange('raca', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecione a raça</option>
                      <option value="santa-ines">Santa Inês</option>
                      <option value="morada-nova">Morada Nova</option>
                      <option value="dorper">Dorper</option>
                      <option value="somalis">Somalis</option>
                      <option value="outras">Outras</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Idade Média (meses)</label>
                    <input
                      type="number"
                      placeholder="Ex: 12"
                      value={formData.idade}
                      onChange={(e) => handleInputChange('idade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Peso Médio (kg)</label>
                    <input
                      type="number"
                      placeholder="Ex: 35"
                      value={formData.peso}
                      onChange={(e) => handleInputChange('peso', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Fase de Produção</label>
                    <select 
                      value={formData.faseProducao}
                      onChange={(e) => handleInputChange('faseProducao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecione a fase</option>
                      <option value="crescimento">Crescimento</option>
                      <option value="gestacao">Gestação</option>
                      <option value="lactacao">Lactação</option>
                      <option value="terminacao">Terminação</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Objetivos de Produção</label>
                    <select 
                      value={formData.objetivosProducao}
                      onChange={(e) => handleInputChange('objetivosProducao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecione o objetivo</option>
                      <option value="carne">Produção de Carne</option>
                      <option value="leite">Produção de Leite</option>
                      <option value="reproducao">Reprodução</option>
                      <option value="misto">Misto</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Histórico de Saúde</label>
                  <textarea
                    placeholder="Descreva o histórico de saúde do rebanho, vacinações, tratamentos recentes..."
                    value={formData.historicoSaude}
                    onChange={(e) => handleInputChange('historicoSaude', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Informações Importantes:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Essas informações são fundamentais para desenvolver um plano nutricional personalizado</li>
                    <li>• Todos os dados são tratados com confidencialidade</li>
                    <li>• Você pode atualizar essas informações a qualquer momento</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Diagnóstico e Geração da Fórmula */}
          {currentStep === 2 && (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold">Diagnóstico e Geração da Fórmula</h3>
                </div>
                <p className="text-gray-600">
                  Com base nos dados fornecidos, nossa equipe de zootecnistas, apoiada por sistemas de 
                  inteligência artificial, analisa as necessidades nutricionais específicas do seu rebanho.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Scale className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">Necessidades Energéticas</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Energia Metabolizável</span>
                        <span className="font-medium">2.8 Mcal/kg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Heart className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold">Proteína Bruta</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Requerimento</span>
                        <span className="font-medium">16.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Target className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold">Minerais</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cálcio</span>
                        <span>0.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fósforo</span>
                        <span>0.4%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold">Condições Locais</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Clima</span>
                        <span>Semiárido</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Forragem Local</span>
                        <span>Caatinga</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Fórmula Personalizada Gerada
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Ingredientes Principais:</h5>
                      <ul className="space-y-1 text-green-800">
                        <li>• Milho moído - 45%</li>
                        <li>• Farelo de soja - 25%</li>
                        <li>• Feno de capim - 20%</li>
                        <li>• Suplemento mineral - 10%</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Valores Nutricionais:</h5>
                      <ul className="space-y-1 text-green-800">
                        <li>• Proteína Bruta: 16.8%</li>
                        <li>• Energia: 2.85 Mcal/kg</li>
                        <li>• Fibra Bruta: 12%</li>
                        <li>• Matéria Seca: 88%</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pedido e Processamento */}
          {currentStep === 3 && (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold">Pedido e Processamento</h3>
                </div>
                <p className="text-gray-600">
                  Após a geração do plano nutricional, você poderá visualizá-lo em sua área do produtor 
                  e fazer o pedido conforme seu plano escolhido.
                </p>
              </div>
              <div className="p-6">
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-3">Plano Resultado Estratégico</h4>
                  <p className="text-yellow-800 mb-4">
                    Você poderá fazer o pedido das rações personalizadas diretamente pela plataforma.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Quantidade (kg)</label>
                        <input type="number" placeholder="1000" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Data de Entrega Desejada</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border">
                      <h5 className="font-medium mb-2">Resumo do Pedido:</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Ração Personalizada (1000kg)</span>
                          <span>R$ 2.850,00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frete</span>
                          <span>R$ 150,00</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>R$ 3.000,00</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Confirmar Pedido</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Logística e Entrega */}
          {currentStep === 4 && (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold">Logística e Entrega</h3>
                </div>
                <p className="text-gray-600">
                  Para clientes do plano Resultado Estratégico, acompanhe todo o processo de 
                  produção e entrega através da plataforma.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Pedido Confirmado</h4>
                    <p className="text-xs text-gray-600 mt-1">20/06/2025</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Em Produção</h4>
                    <p className="text-xs text-gray-600 mt-1">21/06/2025</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Controle de Qualidade</h4>
                    <p className="text-xs text-gray-600 mt-1">Em andamento</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Entrega</h4>
                    <p className="text-xs text-gray-600 mt-1">Prevista: 25/06/2025</p>
                  </div>
                </div>
                
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Informações de Entrega
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Endereço de Entrega:</h5>
                      <p className="text-blue-800">
                        Fazenda São João<br />
                        Zona Rural, s/n<br />
                        Petrolina - PE, 56300-000
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Detalhes do Transporte:</h5>
                      <ul className="space-y-1 text-blue-800">
                        <li>• Transportadora: LogiAgro</li>
                        <li>• Veículo: Caminhão Baú</li>
                        <li>• Rastreamento: LA123456</li>
                        <li>• Contato: (87) 9999-9999</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Acompanhamento e Resultados */}
          {currentStep === 5 && (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold">Acompanhamento e Resultados</h3>
                </div>
                <p className="text-gray-600">
                  O acompanhamento contínuo é fundamental para o sucesso do plano nutricional. 
                  Monitore o desempenho do seu rebanho em tempo real.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Scale className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Peso Médio</h4>
                    <p className="text-2xl font-bold text-blue-600">38.5 kg</p>
                    <p className="text-xs text-green-600">+10% vs mês anterior</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Saúde do Rebanho</h4>
                    <p className="text-2xl font-bold text-green-600">95%</p>
                    <p className="text-xs text-gray-600">Animais saudáveis</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Ganho de Peso</h4>
                    <p className="text-2xl font-bold text-green-600">250g/dia</p>
                    <p className="text-xs text-green-600">Acima da meta</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Eficiência</h4>
                    <p className="text-2xl font-bold text-purple-600">92%</p>
                    <p className="text-xs text-gray-600">Conversão alimentar</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">Frequência de Visitas:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Plano Acesso Social:</h5>
                      <p className="text-green-800">
                        Visitas trimestrais para avaliação presencial do rebanho e 
                        ajustes no plano nutricional quando necessário.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Plano Resultado Estratégico:</h5>
                      <p className="text-green-800">
                        Visitas mensais para acompanhamento mais próximo e 
                        otimização contínua dos resultados.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
            <button 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span>← Anterior</span>
            </button>
            
            <div className="text-sm text-gray-600">
              Etapa {currentStep} de {steps.length}
            </div>
            
            <button 
              onClick={nextStep} 
              disabled={currentStep === 5}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentStep === 5 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <span>Próximo →</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Zap className="h-6 w-6" />
            <span className="text-xl font-bold">Culture Sheep</span>
          </div>
          <p className="text-gray-400">
            Sistema Demonstrativo - Nutrição Personalizada para Ovinos
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Este é um sistema demonstrativo não funcional criado para apresentar o processo da Culture Sheep.
          </p>
        </div>
      </footer>
    </div>
  );
};

