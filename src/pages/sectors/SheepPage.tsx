import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower, TrendingUp, MapPin, Leaf, Presentation, Users, Target, Award, Play } from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';
import { PresentationManager } from '../../components/presentation';
import { CultureSheepDemo } from '../../components/CultureSheepDemo';

export const SheepPage: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return (
      <CultureSheepDemo onClose={() => setShowDemo(false)} />
    );
  }

  if (showPresentation) {
    return (
      <PresentationManager
        sectorId="sheep"
        sectorName="Ovinocultura"
        onClose={() => setShowPresentation(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section with Banner */}
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/Banner_culture_sheep.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-4 py-16 h-full flex items-center">
          <div className="text-white">
            <div className="max-w-4xl">



              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowPresentation(true)}
                  className="bg-white dark:bg-gray-800 bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm font-semibold"
                >
                  <Presentation className="h-5 w-5" />
                  <span>Ver Apresentação</span>
                </button>
                <button
                  onClick={() => setShowDemo(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg flex items-center space-x-2 transition-all duration-200 font-semibold shadow-lg"
                >
                  <Play className="h-5 w-5" />
                  <span>Demonstração Interativa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6">Por que escolher a Culture Sheep?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Descubra como nossa abordagem inovadora está revolucionando a ovinocultura brasileira, oferecendo soluções que realmente funcionam para pequenos produtores.
          </p>
        </div>

        {/* Mission, Vision, Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Nossa Missão</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Revolucionar a ovinocultura brasileira, proporcionando soluções nutricionais inteligentes e personalizadas que transformam resultados.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <Award className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Nossa Visão</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Ser a plataforma líder em nutrição ovina inteligente da América Latina, transformando fazendas em operações de alta performance.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <Leaf className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Nossos Valores</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Inovação, tecnologia, personalização, bem-estar animal, confiança e transparência em cada solução que oferecemos.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-10 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-10">Nossas Soluções Exclusivas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <Users className="h-10 w-10 text-green-600 mt-1" />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Consultorias Personalizadas</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Desenvolvemos planos nutricionais únicos para cada rebanho, considerando suas características específicas e objetivos de produção. Nossa abordagem personalizada garante resultados superiores e otimização de custos.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <Leaf className="h-10 w-10 text-emerald-600 mt-1" />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Soluções Sustentáveis</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Nossos kits de nutrição utilizam insumos e embalagens sustentáveis, com fornecedores responsáveis e formulações puras. Construa uma ovinocultura mais verde e lucrativa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-10">Uma Oportunidade de Mercado Única</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border-l-4 border-green-500">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Mercado em Expansão</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Centro-Oeste em destaque:</p>
              <p className="text-3xl font-bold text-green-600">Crescimento</p>
              <p className="text-gray-600 dark:text-gray-400">acelerado nos últimos anos</p>
            </div>

            <div className="text-center p-6 border-l-4 border-emerald-500">
              <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Regiões Estratégicas</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>🏆 Nordeste (maior rebanho)</p>
                <p>🏆 Sul (tradição)</p>
                <p>🚀 Centro-Oeste (crescimento)</p>
                <p>🎯 Mato Grosso (nosso foco)</p>
              </div>
            </div>

            <div className="text-center p-6 border-l-4 border-teal-500">
              <Users className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Nosso Público-Alvo</h3>
              <p className="text-3xl font-bold text-teal-600">Pequenos</p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">produtores rurais</p>
              <p className="text-sm text-gray-500">com orientação técnica especializada</p>
            </div>
          </div>
        </div>

        {/* Problems and Solutions */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-10 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
            Os Desafios que Resolvemos
          </h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
            Identificamos os principais obstáculos que impedem a ovinocultura de atingir seu potencial máximo e desenvolvemos soluções específicas para cada um deles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-red-600 font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Manejo Nutricional Inadequado</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A falta de conhecimento técnico especializado resulta em nutrição inadequada, afetando diretamente a produtividade e saúde do rebanho.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-orange-600 font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Alimentação Genérica</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Gastos desnecessários com alimentação não personalizada levam a desperdícios financeiros e resultados abaixo do esperado.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-yellow-600 font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Custos Elevados</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A dificuldade de acesso a soluções adequadas para pequenos produtores cria barreiras para o crescimento sustentável.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Pronto para Revolucionar Sua Ovinocultura?</h2>
          <p className="text-xl mb-8 leading-relaxed max-w-4xl mx-auto">
            Não perca mais tempo com soluções genéricas que não atendem às necessidades específicas do seu rebanho.
            Descubra como a Culture Sheep pode transformar sua produção, otimizar custos e garantir resultados excepcionais.
            O futuro da sua ovinocultura começa agora!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center bg-green-700 text-white px-10 py-4 rounded-lg hover:bg-green-800 transition-colors font-bold text-lg shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Demonstração Interativa
            </button>
            <button
              onClick={() => setShowPresentation(true)}
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg hover:bg-white dark:bg-gray-800 hover:text-green-600 transition-colors font-bold text-lg"
            >
              <Presentation className="h-5 w-5 mr-2" />
              Ver Apresentação Completa
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-12">
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

// End of SheepPage.tsx