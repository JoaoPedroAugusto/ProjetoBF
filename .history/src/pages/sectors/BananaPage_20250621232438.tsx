import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Banana as BananaIcon, 
  TrendingUp, 
  MapPin, 
  Leaf, 
  Presentation, 
  Users, 
  Target, 
  Award,
  Shield,
  AlertTriangle,
  Microscope,
  BookOpen,
  Phone
} from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';
import { PresentationManager } from '../../components/presentation';

export const BananaPage: React.FC = () => {
  const [showPresentation, setShowPresentation] = useState(false);

  if (showPresentation) {
    return (
      <PresentationManager 
        sectorId="banana" 
        sectorName="Bananicultura"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Hero Section with Banner */}
      <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BananaIcon className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-4xl md:text-6xl font-bold">Bananicultura</h1>
                <h2 className="text-xl md:text-2xl font-light mt-2">Protegendo o Futuro da Banana em Mato Grosso</h2>
              </div>
            </div>
            <button
              onClick={() => setShowPresentation(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm"
            >
              <Presentation className="h-5 w-5" />
              <span>Apresentação</span>
            </button>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            Combatendo o Mal-do-Panamá com ciência, inovação e soluções sustentáveis para proteger a produção de banana em Mato Grosso.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Projeto Floresça Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Projeto Floresça</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Uma startup sem fins lucrativos dedicada a proteger a bananicultura de Mato Grosso do Mal-do-Panamá (TR4), 
            fortalecendo a agricultura familiar e promovendo soluções inovadoras e sustentáveis.
          </p>
        </div>

        {/* Mission, Vision, Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <Target className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">Nossa Missão</h3>
            <p className="text-gray-600 leading-relaxed">
              Fortalecer a agricultura familiar e a cadeia produtiva da banana em MT, atuando na conscientização, 
              prevenção e disseminação de soluções inovadoras.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">Nossa Visão</h3>
            <p className="text-gray-600 leading-relaxed">
              Construir um futuro mais seguro para os produtores e para o agronegócio mato-grossense através 
              da informação e ação conjunta.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">Nossos Valores</h3>
            <p className="text-gray-600 leading-relaxed">
              Compromisso social, inovação científica, sustentabilidade agrícola e colaboração para 
              um impacto ampliado na comunidade.
            </p>
          </div>
        </div>

        {/* Market Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Produção Global</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">114 milhões</p>
            <p className="text-gray-600">toneladas anuais</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-orange-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Principais Regiões</h3>
            </div>
            <ul className="space-y-1 text-gray-700">
              <li>• Índia</li>
              <li>• China</li>
              <li>• Filipinas</li>
              <li>• Equador</li>
              <li>• Brasil</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-8 w-8 text-amber-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Ameaça TR4</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">Alto Risco</p>
            <p className="text-gray-600">para Mato Grosso</p>
          </div>
        </div>

        {/* O Mal-do-Panamá Section */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-10 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            O Mal-do-Panamá: Uma Ameaça Global
          </h2>
          <p className="text-xl text-center text-gray-600 mb-10 max-w-4xl mx-auto">
            O Fusarium oxysporum f. sp. cubense (Foc) Raça 4 Tropical (TR4) é uma das doenças mais devastadoras 
            para a cultura da banana em todo o mundo, representando um desafio sem precedentes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Sintomas Iniciais</h3>
              <p className="text-gray-600 leading-relaxed">
                Amarelecimento e murcha das folhas mais velhas, começando pelas bordas e progredindo para o centro.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Progressão</h3>
              <p className="text-gray-600 leading-relaxed">
                Rachadura na base do pseudocaule e descoloração vascular interna (avermelhada/marrom).
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Propagação</h3>
              <p className="text-gray-600 leading-relaxed">
                Solo contaminado, mudas infectadas, água, ferramentas e até mesmo calçados podem disseminar a doença.
              </p>
            </div>
          </div>
        </div>

        {/* Soluções Integradas */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Estratégias Integradas de Solução</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-4xl mx-auto">
            Desenvolvemos e promovemos um conjunto de soluções baseadas em pesquisa e tecnologia para proteger sua lavoura.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Protocolos de Biossegurança</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Implementação rigorosa de medidas preventivas para evitar a entrada e disseminação do fungo.
              </p>
              <div className="text-sm text-blue-600 font-medium">
                Sanitização • Controle de Acesso • Quarentena
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Microscope className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Diagnóstico Rápido</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Identificação precoce do TR4 através de análises laboratoriais avançadas e precisas.
              </p>
              <div className="text-sm text-purple-600 font-medium">
                Análises Laboratoriais • Resposta Imediata
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Variedades Resistentes</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pesquisa e disponibilização de cultivares com maior resistência ou tolerância ao TR4.
              </p>
              <div className="text-sm text-green-600 font-medium">
                Cultivares Resistentes • Replantio Seguro
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Leaf className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bioinsumos e Manejo</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Estratégias de manejo do solo e uso de bioinsumos para promover a saúde da planta.
              </p>
              <div className="text-sm text-amber-600 font-medium">
                Solo Saudável • Ambiente Desfavorável ao Fungo
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Capacitação</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Programas de treinamento e workshops sobre as melhores práticas de prevenção.
              </p>
              <div className="text-sm text-indigo-600 font-medium">
                Treinamentos • Workshops • Melhores Práticas
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Suporte Técnico</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Consultoria especializada e acompanhamento técnico personalizado para sua propriedade.
              </p>
              <div className="text-sm text-teal-600 font-medium">
                Consultoria • Acompanhamento • Personalização
              </div>
            </div>
          </div>
        </div>

        {/* Impactos em Mato Grosso */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-10 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">A Realidade em Mato Grosso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Mato Grosso, com sua crescente produção de banana, é vulnerável à entrada e disseminação do TR4. 
                A chegada desta doença pode significar perdas econômicas severas para produtores rurais.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-yellow-500 rounded-full w-3 h-3 mr-3"></div>
                  <span className="text-gray-700 font-medium">Sustento de milhares de famílias produtoras</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-500 rounded-full w-3 h-3 mr-3"></div>
                  <span className="text-gray-700 font-medium">Proteção da biodiversidade agrícola regional</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-red-500 rounded-full w-3 h-3 mr-3"></div>
                  <span className="text-gray-700 font-medium">Precedente nacional para ações preventivas</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <MapPin className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Mato Grosso</h3>
                <p className="text-gray-600 mb-4">Estado em crescimento na bananicultura</p>
                <div className="text-3xl font-bold text-orange-600">PREVENÇÃO</div>
                <p className="text-sm text-gray-500">é nossa principal arma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Sua Lavoura Protegida. Seu Futuro Garantido.</h2>
          <p className="text-xl mb-8 leading-relaxed max-w-4xl mx-auto">
            Junte-se a nós nesta luta contra o Mal-do-Panamá. A informação e a ação conjunta são as chaves 
            para proteger a bananicultura de Mato Grosso. Não espere a doença chegar - previna-se agora!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="inline-flex items-center bg-white text-orange-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              Fale Conosco e Comece a Prevenção!
            </Link>
            <button
              onClick={() => setShowPresentation(true)}
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-bold text-lg"
            >
              <Presentation className="h-5 w-5 mr-2" />
              Ver Apresentação Completa
            </button>
          </div>
        </div>

        {/* Parcerias Section */}
        <div className="bg-gray-50 rounded-2xl p-10 mb-16 mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Parcerias Estratégicas</h2>
          <p className="text-xl text-center text-gray-600 mb-10 max-w-4xl mx-auto">
            Trabalhamos em conjunto com instituições de pesquisa, órgãos governamentais e empresas do setor 
            para fortalecer a defesa contra o TR4.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Leaf className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">SENAR</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Governo MT</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="h-10 w-10 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">UNEMAT</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-10 w-10 text-yellow-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Produtores</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};

