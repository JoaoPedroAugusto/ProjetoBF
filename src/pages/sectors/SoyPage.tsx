import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingUp, MapPin, Presentation } from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';
import { PresentationManager } from '../../components/presentation';
import Dashboard from '../../components/dashboard_Manejo/src/components/Dashboard';

export const SoyPage: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Simulação de dados dinâmicos
  const [production, setProduction] = useState(340);
  const [growthRate, setGrowthRate] = useState(3.9);

  useEffect(() => {
    const interval = setInterval(() => {
      setProduction(prev => Math.min(350, prev + Math.random() * 0.3));
      setGrowthRate(Math.random() * 0.2 + 3.9);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Narração por áudio
  const handlePlayAudio = () => {
    const audio = new Audio('/audio/soja-intro.mp3');
    audio.play();
  };

  // Tela de apresentação
  if (showPresentation) {
    return (
      <PresentationManager
        sectorId="soy"
        sectorName="Soja"
        onClose={() => setShowPresentation(false)}
      />
    );
  }

  // Otherwise, render the main Soy page content
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-lime-600 text-white">
        {/* Overlay for background image effect, if any */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Leaf className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">Soja</h1>
            </div>
            <button
              onClick={() => setShowPresentation(true)}
              className="bg-white dark:bg-gray-800 bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
            >
              <Presentation className="h-5 w-5" />
              <span>Apresentação</span>
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
      <div className="container mx-auto px-4 py-12">
        {/* Key Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Produção Global</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">350 milhões</p>
            <p className="text-gray-600 dark:text-gray-400">toneladas anuais</p>
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
            <p className="text-3xl font-bold text-emerald-600">4.1%</p>
            <p className="text-gray-600 dark:text-gray-400">taxa de crescimento</p>
          </div>
        </div>

        {/* 3D Model Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Modelo 3D Interativo</h2>
          <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <ThreeDModelView sectorId="soy" />
          </div>
        </div>

        {/* Navigation Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};
