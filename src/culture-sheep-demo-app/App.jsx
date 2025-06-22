import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
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
  AlertCircle
} from 'lucide-react'
import bannerImage from './assets/Banner_culture_sheep.png'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    numeroAnimais: '',
    raca: '',
    idade: '',
    peso: '',
    faseProducao: '',
    historicoSaude: '',
    objetivosProducao: ''
  })

  const steps = [
    { id: 1, title: 'Cadastro e Inserção de Dados', icon: Users },
    { id: 2, title: 'Diagnóstico e Geração da Fórmula', icon: BarChart3 },
    { id: 3, title: 'Pedido e Processamento', icon: Package },
    { id: 4, title: 'Logística e Entrega', icon: Truck },
    { id: 5, title: 'Acompanhamento e Resultados', icon: TrendingUp }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Culture Sheep</h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Sistema Demonstrativo
            </Badge>
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
                <Badge className="bg-white text-green-600 px-3 py-1">
                  Plano Acesso Social
                </Badge>
                <Badge className="bg-yellow-400 text-yellow-900 px-3 py-1">
                  Plano Resultado Estratégico
                </Badge>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src={bannerImage} 
                alt="Culture Sheep Banner" 
                className="rounded-lg shadow-xl max-w-full h-auto"
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
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
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
              )
            })}
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h3>
            <Progress value={(currentStep / 5) * 100} className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Cadastro e Inserção de Dados */}
          {currentStep === 1 && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-green-600" />
                  <span>Cadastro e Inserção de Dados</span>
                </CardTitle>
                <CardDescription>
                  O processo começa com seu cadastro em nossa plataforma. Após criar sua conta, 
                  você terá acesso à área do produtor, onde poderá inserir os dados do seu rebanho.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="numeroAnimais">Número de Animais</Label>
                    <Input
                      id="numeroAnimais"
                      type="number"
                      placeholder="Ex: 50"
                      value={formData.numeroAnimais}
                      onChange={(e) => handleInputChange('numeroAnimais', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="raca">Raça</Label>
                    <Select onValueChange={(value) => handleInputChange('raca', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a raça" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="santa-ines">Santa Inês</SelectItem>
                        <SelectItem value="morada-nova">Morada Nova</SelectItem>
                        <SelectItem value="dorper">Dorper</SelectItem>
                        <SelectItem value="somalis">Somalis</SelectItem>
                        <SelectItem value="outras">Outras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade Média (meses)</Label>
                    <Input
                      id="idade"
                      type="number"
                      placeholder="Ex: 12"
                      value={formData.idade}
                      onChange={(e) => handleInputChange('idade', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso Médio (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      placeholder="Ex: 35"
                      value={formData.peso}
                      onChange={(e) => handleInputChange('peso', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="faseProducao">Fase de Produção</Label>
                    <Select onValueChange={(value) => handleInputChange('faseProducao', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a fase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crescimento">Crescimento</SelectItem>
                        <SelectItem value="gestacao">Gestação</SelectItem>
                        <SelectItem value="lactacao">Lactação</SelectItem>
                        <SelectItem value="terminacao">Terminação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="objetivosProducao">Objetivos de Produção</Label>
                    <Select onValueChange={(value) => handleInputChange('objetivosProducao', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carne">Produção de Carne</SelectItem>
                        <SelectItem value="leite">Produção de Leite</SelectItem>
                        <SelectItem value="reproducao">Reprodução</SelectItem>
                        <SelectItem value="misto">Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="historicoSaude">Histórico de Saúde</Label>
                  <Textarea
                    id="historicoSaude"
                    placeholder="Descreva o histórico de saúde do rebanho, vacinações, tratamentos recentes..."
                    value={formData.historicoSaude}
                    onChange={(e) => handleInputChange('historicoSaude', e.target.value)}
                    rows={4}
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
              </CardContent>
            </Card>
          )}

          {/* Step 2: Diagnóstico e Geração da Fórmula */}
          {currentStep === 2 && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <span>Diagnóstico e Geração da Fórmula</span>
                </CardTitle>
                <CardDescription>
                  Com base nos dados fornecidos, nossa equipe de zootecnistas, apoiada por sistemas de 
                  inteligência artificial, analisa as necessidades nutricionais específicas do seu rebanho.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Scale className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">Necessidades Energéticas</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Energia Metabolizável</span>
                        <span className="font-medium">2.8 Mcal/kg</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Heart className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold">Proteína Bruta</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Requerimento</span>
                        <span className="font-medium">16.5%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </Card>
                  
                  <Card className="p-4">
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
                  </Card>
                  
                  <Card className="p-4">
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
                  </Card>
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
              </CardContent>
            </Card>
          )}

          {/* Step 3: Pedido e Processamento */}
          {currentStep === 3 && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-6 w-6 text-green-600" />
                  <span>Pedido e Processamento</span>
                </CardTitle>
                <CardDescription>
                  Após a geração do plano nutricional, você poderá visualizá-lo em sua área do produtor 
                  e fazer o pedido conforme seu plano escolhido.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="acesso-social" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="acesso-social">Plano Acesso Social</TabsTrigger>
                    <TabsTrigger value="resultado-estrategico">Plano Resultado Estratégico</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="acesso-social" className="space-y-4">
                    <Card className="p-6 bg-blue-50">
                      <h4 className="font-semibold text-blue-900 mb-3">Plano Acesso Social</h4>
                      <p className="text-blue-800 mb-4">
                        Você receberá as receitas detalhadas para preparar as rações em sua propriedade.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="font-medium">Receita Completa (PDF)</span>
                          <Button size="sm" variant="outline">
                            <Package className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="font-medium">Lista de Fornecedores</span>
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="font-medium">Guia de Preparo</span>
                          <Button size="sm" variant="outline">
                            <Target className="h-4 w-4 mr-2" />
                            Acessar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="resultado-estrategico" className="space-y-4">
                    <Card className="p-6 bg-yellow-50">
                      <h4 className="font-semibold text-yellow-900 mb-3">Plano Resultado Estratégico</h4>
                      <p className="text-yellow-800 mb-4">
                        Você poderá fazer o pedido das rações personalizadas diretamente pela plataforma.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Quantidade (kg)</Label>
                            <Input type="number" placeholder="1000" />
                          </div>
                          <div className="space-y-2">
                            <Label>Data de Entrega Desejada</Label>
                            <Input type="date" />
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg">
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
                        
                        <Button className="w-full">
                          <Package className="h-4 w-4 mr-2" />
                          Confirmar Pedido
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Processo de Produção:</h4>
                  <p className="text-sm text-gray-700">
                    Para o plano Resultado Estratégico, após a confirmação do pedido, nossas empresas 
                    parceiras desenvolvem as rações baseadas nas receitas criadas por nossos zootecnistas, 
                    garantindo a qualidade e precisão das formulações.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Logística e Entrega */}
          {currentStep === 4 && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-6 w-6 text-green-600" />
                  <span>Logística e Entrega</span>
                </CardTitle>
                <CardDescription>
                  Para clientes do plano Resultado Estratégico, acompanhe todo o processo de 
                  produção e entrega através da plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Pedido Confirmado</h4>
                    <p className="text-xs text-gray-600 mt-1">20/06/2025</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Em Produção</h4>
                    <p className="text-xs text-gray-600 mt-1">21/06/2025</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Controle de Qualidade</h4>
                    <p className="text-xs text-gray-600 mt-1">Em andamento</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Entrega</h4>
                    <p className="text-xs text-gray-600 mt-1">Prevista: 25/06/2025</p>
                  </Card>
                </div>
                
                <Card className="p-6 bg-blue-50">
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
                </Card>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Processo Culture Sheep:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Package className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-sm">Recebimento</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        As rações são recebidas pela Culture Sheep para controle de qualidade.
                      </p>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-sm">Controle de Qualidade</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Realizamos um controle de qualidade rigoroso antes da entrega.
                      </p>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Truck className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-sm">Logística</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Organizamos a logística de entrega diretamente na sua fazenda.
                      </p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Acompanhamento e Resultados */}
          {currentStep === 5 && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <span>Acompanhamento e Resultados</span>
                </CardTitle>
                <CardDescription>
                  O acompanhamento contínuo é fundamental para o sucesso do plano nutricional. 
                  Monitore o desempenho do seu rebanho em tempo real.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <Scale className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Peso Médio</h4>
                    <p className="text-2xl font-bold text-blue-600">38.5 kg</p>
                    <p className="text-xs text-green-600">+10% vs mês anterior</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Saúde do Rebanho</h4>
                    <p className="text-2xl font-bold text-green-600">95%</p>
                    <p className="text-xs text-gray-600">Animais saudáveis</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Ganho de Peso</h4>
                    <p className="text-2xl font-bold text-green-600">250g/dia</p>
                    <p className="text-xs text-green-600">Acima da meta</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Eficiência</h4>
                    <p className="text-2xl font-bold text-purple-600">92%</p>
                    <p className="text-xs text-gray-600">Conversão alimentar</p>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                      Evolução de Peso (últimos 6 meses)
                    </h4>
                    <div className="space-y-3">
                      {[
                        { mes: 'Jan', peso: 32 },
                        { mes: 'Fev', peso: 33.5 },
                        { mes: 'Mar', peso: 35 },
                        { mes: 'Abr', peso: 36.2 },
                        { mes: 'Mai', peso: 37.8 },
                        { mes: 'Jun', peso: 38.5 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <span className="text-sm font-medium w-8">{item.mes}</span>
                          <Progress value={(item.peso / 40) * 100} className="flex-1" />
                          <span className="text-sm font-medium w-12">{item.peso}kg</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-green-600" />
                      Próximas Visitas
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-green-900">Visita Técnica</p>
                          <p className="text-sm text-green-700">Dr. João Silva - Zootecnista</p>
                        </div>
                        <Badge className="bg-green-600">30/06</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-blue-900">Avaliação Nutricional</p>
                          <p className="text-sm text-blue-700">Ajustes na formulação</p>
                        </div>
                        <Badge variant="outline">15/07</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <Card className="p-6 bg-green-50">
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
                </Card>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <span>← Anterior</span>
            </Button>
            
            <div className="text-sm text-gray-600">
              Etapa {currentStep} de {steps.length}
            </div>
            
            <Button 
              onClick={nextStep} 
              disabled={currentStep === 5}
              className="flex items-center space-x-2"
            >
              <span>Próximo →</span>
            </Button>
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
  )
}

export default App

