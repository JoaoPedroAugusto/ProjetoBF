import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, TrendingUp, MapPin, Presentation, Target, Eye, Heart, Users, Shield, Zap, BarChart3, Leaf, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { PresentationManager } from '../../components/presentation';

export const SoyPage: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);

  // If showPresentation is true, render the PresentationManager component
  if (showPresentation) {
    return (
      <PresentationManager
        sectorId="soy"
        sectorName="Soja"
        onClose={() => setShowPresentation(false)}
      />
    );
  }

  // Otherwise, render the main Manejo Digital page content
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-lime-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-lime-300 opacity-10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-green-300 opacity-10 rounded-full animate-ping"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-8">
          <div className="flex items-center group">
              <div className="relative">
                <Droplets className="h-16 w-16 mr-6 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white opacity-20 rounded-full blur-md group-hover:opacity-30 transition-opacity"></div>
              </div>
              <div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-lime-200 bg-clip-text text-transparent pb-3"> {/* Adicione pb-1 ou pb-2 */}
                  Manejo Digital
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-lime-400 to-green-400 rounded-full mt-2"></div>
              </div>
            </div>
            <button
              onClick={() => setShowPresentation(true)}
              className="group bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-300 backdrop-blur-lg border border-white border-opacity-20 hover:border-opacity-40 shadow-lg hover:shadow-xl"
            >
              <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Apresentação</span>
            </button>
          </div>
          <p className="text-2xl md:text-3xl max-w-4xl leading-relaxed font-light">
            <span className="font-semibold text-lime-200">Otimizando a água</span>, 
            <span className="text-white"> impulsionando a </span>
            <span className="font-semibold text-green-200">produtividade</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full border border-white border-opacity-20">
              <span className="text-sm font-medium">🌱 Sustentável</span>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full border border-white border-opacity-20">
              <span className="text-sm font-medium">📊 Inteligente</span>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full border border-white border-opacity-20">
              <span className="text-sm font-medium">⚡ Eficiente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-16">
        {/* Key Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 border-l-4 border-green-500 transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 ml-4">Produção Global</h3>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">350 milhões</p>
            <p className="text-gray-600">toneladas anuais</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full w-4/5"></div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 border-l-4 border-lime-500 transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="bg-lime-100 p-3 rounded-xl group-hover:bg-lime-200 transition-colors">
                <MapPin className="h-8 w-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 ml-4">Principais Regiões</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lime-500 mr-2" />Estados Unidos</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lime-500 mr-2" />Brasil</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lime-500 mr-2" />Argentina</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lime-500 mr-2" />China</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lime-500 mr-2" />Índia</li>
            </ul>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 border-l-4 border-red-500 transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-200 transition-colors">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 ml-4">Redução de Perdas</h3>
            </div>
            <p className="text-4xl font-bold text-red-600 mb-2">47%</p>
            <p className="text-gray-600">potencial de economia</p>
            <div className="mt-4 flex items-center text-sm text-red-600 font-medium">
              <ArrowRight className="h-4 w-4 mr-1" />
              Impacto significativo
            </div>
          </div>
        </div>

        {/* Water Stress Section */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-12 mb-20 border border-gray-100">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6">
              <Droplets className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              O ESTRESSE HÍDRICO
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <p className="text-xl text-gray-700 mb-10 leading-relaxed text-center">
              A disponibilidade hídrica é um dos principais fatores limitantes para o estabelecimento das plantas. 
              O estresse hídrico pode ser causado pelo esgotamento da água armazenada no solo ou por fatores do 
              ambiente, fazendo com que a planta não consiga transpirar em taxas adequadas.
            </p>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white rounded-2xl p-10 text-center shadow-2xl">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
                <p className="text-6xl font-bold mb-4 drop-shadow-lg">47% DE PERDA</p>
                <p className="text-2xl font-semibold mb-2">NA LAVOURA</p>
                <p className="text-lg opacity-90">Essa condição pode causar perdas significativas na produtividade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Solution Section */}
        <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-3xl shadow-xl p-12 mb-20 border border-green-100">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-lime-500 rounded-2xl mb-6">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              NOSSA SOLUÇÃO
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-lime-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Diante disso, o Manejo Digital surge como uma alternativa tecnológica para mitigar esse problema 
                que diversos produtores enfrentam.
              </p>
              <p className="text-xl text-gray-700 mb-10 leading-relaxed font-medium">
                O Manejo Digital é uma agrotech inovadora, focada em otimizar a gestão hídrica em lavouras de 
                soja através de tecnologia de ponta.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-200">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl mb-6 group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                  <BarChart3 className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">Hardware</h3>
                <p className="text-gray-700 leading-relaxed">
                  Kits de sensores de solo e estações meteorológicas instalados na lavoura para coleta precisa de dados.
                </p>
                <div className="mt-6 flex items-center text-green-600 font-medium">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Monitoramento 24/7
                </div>
              </div>
              
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-200">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                  <Presentation className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">Plataforma Digital</h3>
                <p className="text-gray-700 leading-relaxed">
                  Um software intuitivo (acessível via web e app responsivo) que processa e analisa os dados coletados.
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-medium">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Interface intuitiva
                </div>
              </div>
              
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-200">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl mb-6 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors">
                  <Users className="h-8 w-8 text-purple-700" />
                </div>
                <h3 className="text-2xl font-bold text-purple-800 mb-4">Serviços de Suporte</h3>
                <p className="text-gray-700 leading-relaxed">
                  Análises climáticas e consultoria técnica especializada para interpretar os dados e gerar recomendações de manejo hídrico.
                </p>
                <div className="mt-6 flex items-center text-purple-600 font-medium">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Suporte especializado
                </div>
              </div>
            </div>

            {/* Beneficiaries */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 mr-3 text-gray-600" />
                Beneficiários
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center group">
                  <div className="bg-white p-4 rounded-xl shadow-md group-hover:shadow-lg transition-shadow mb-3">
                    <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-800">Produtores Rurais</p>
                    <p className="text-sm text-gray-500">(Pequenos, Médios)</p>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white p-4 rounded-xl shadow-md group-hover:shadow-lg transition-shadow mb-3">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-800">Cooperativas</p>
                    <p className="text-sm text-gray-500">Agrícolas</p>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white p-4 rounded-xl shadow-md group-hover:shadow-lg transition-shadow mb-3">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-800">Consultores e</p>
                    <p className="text-sm text-gray-500">Agrônomos</p>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white p-4 rounded-xl shadow-md group-hover:shadow-lg transition-shadow mb-3">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-800">Indústria, Comércio,</p>
                    <p className="text-sm text-gray-500">Consumidores</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Mission, Vision, Values Section */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-12 mb-20 border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nossos Fundamentos
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-200">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                  <Target className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-6">Missão</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Solucionar o estresse hídrico na plantação de soja por meio de tecnologias sustentáveis.
              </p>
            </div>

            <div className="group text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-200">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                  <Eye className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-6">Visão</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Ser referência em gestão hídrica para a sojicultura.
              </p>
            </div>

            <div className="group text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-200">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-purple-800 mb-6">Valores</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Sustentabilidade, praticidade e compromisso com o produtor.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-green-600 to-lime-600 rounded-3xl shadow-2xl p-12 text-center text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">Pronto para Revolucionar sua Lavoura?</h2>
          <p className="text-xl mb-8 opacity-90">Junte-se aos produtores que já estão otimizando sua gestão hídrica</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowPresentation(true)}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              Ver Apresentação
            </button>
            <Link
              to="/"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-green-600 transition-colors flex items-center justify-center"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};