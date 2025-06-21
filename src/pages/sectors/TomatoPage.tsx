import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cherry,
  TrendingUp,
  MapPin,
  Leaf,
  Presentation,
  Package,
  Truck,
  Target,
  Users,
  BarChart3,
  Heart,
  Lightbulb,
  Globe
} from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';
import { PresentationManager } from '../../components/presentation';

export const TomatoPage: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);

  if (showPresentation) {
    return (
      <PresentationManager
        sectorId="tomato"
        sectorName="Tomate"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: "url('/src/public/img/tomatech_banner.png')" }}>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
            </div>
            <button
              onClick={() => setShowPresentation(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
            >
              <Presentation className="h-5 w-5" />
              <span>Apresentação</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resumo da Ideia */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border-l-4 border-red-500">
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Resumo da Ideia</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Somos uma startup focada em gerar impacto sustentável por meio da tecnologia e da inovação em toda a cadeia de valor.
            Desenvolvemos uma plataforma que conecta projetos sociais e ambientais a investidores comprometidos com o futuro do planeta.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Através de uma interface intuitiva e dados em tempo real, nossa solução oferece transparência, indicadores confiáveis
            e oportunidades reais de investimento com propósito.
          </p>
        </div>

        {/* Inovações Diferenciais */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <Lightbulb className="h-8 w-8 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Inovações Diferenciais</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Embalagem EPEA */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Package className="h-10 w-10 text-green-600 mr-4" />
                <h3 className="text-xl font-bold text-gray-800">Embalagem Inteligente EPEA</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Nossa startup adota embalagens com tecnologia EPEA, desenvolvidas para prolongar a vida útil dos alimentos,
                preservar a qualidade e reduzir o desperdício. Essa inovação contribui para a sustentabilidade desde o
                pós-colheita até o consumidor final, evitando perdas e garantindo segurança alimentar.
              </p>
            </div>

            {/* Transporte Refrigerado */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Truck className="h-10 w-10 text-blue-600 mr-4" />
                <h3 className="text-xl font-bold text-gray-800">Transporte com Refrigeração Sustentável</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Implantamos uma logística refrigerada eficiente, garantindo que os produtos perecíveis cheguem em perfeitas condições.
                Essa solução é essencial para manter o frescor dos alimentos e evitar o descarte precoce por deterioração.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Produção Global</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">180 milhões</p>
            <p className="text-gray-600">toneladas anuais</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-orange-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Principais Regiões</h3>
            </div>
            <ul className="space-y-1 text-gray-700">
              <li>• China</li>
              <li>• Índia</li>
              <li>• Estados Unidos</li>
              <li>• Turquia</li>
              <li>• Egito</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Crescimento Anual</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">3.0%</p>
            <p className="text-gray-600">taxa de crescimento</p>
          </div>
        </div>

        {/* Seções Principais da Página */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <Globe className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Como Funciona Nossa Plataforma</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Introdução à Iniciativa */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Introdução à Iniciativa</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Apresenta a missão da startup: aliar inovação, sustentabilidade e tecnologia aplicada.
                Conecta o visitante com a visão da empresa logo no primeiro contato.
              </p>
            </div>

            {/* Como Funciona */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Tomada de Decisão</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Explica de forma visual e objetiva como os usuários interagem com a plataforma.
                Destaque para a tomada de decisão baseada em dados reais e monitoramento de resultados.
              </p>
            </div>

            {/* Impacto em Números */}
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Impacto em Números</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Mostra indicadores reais como número de comunidades atendidas, projetos sustentáveis cadastrados
                e volume investido. Inclui gráficos para visualização do crescimento.
              </p>
            </div>

            {/* Depoimentos */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Credibilidade</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Exibe testemunhos de investidores e parceiros para reforçar confiança e autoridade no mercado.
                Linguagem inspiradora e convite à participação ativa.
              </p>
            </div>
          </div>
        </div>       {/* Resultado Esperado */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Resultado Esperado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg leading-relaxed mb-4">
                Essa página reforça o posicionamento da nossa startup como uma plataforma confiável, inovadora e
                comprometida com resultados mensuráveis, com destaque para as soluções práticas e tecnológicas
                que reduzem desperdício e agregam valor ao produto final.
              </p>
            </div>
            <div>
              <p className="text-lg leading-relaxed">
                Esses diferenciais fortalecem nossa apresentação junto a parceiros estratégicos, aceleradoras
                como a Tomatech, e potenciais investidores do setor agroalimentar.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};

