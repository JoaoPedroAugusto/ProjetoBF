import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, TrendingUp, MapPin, Leaf, AlertTriangle, DollarSign } from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';

export const CocoaPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-orange-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center mb-6">
            <Coffee className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">Cacau</h1>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            O cacau é a semente seca e totalmente fermentada do Theobroma cacao, da qual são extraídos os sólidos de cacau e a manteiga de cacau. Estes são a base do chocolate, bem como de muitos outros produtos.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-amber-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Produção Global</h3>
            </div>
            <p className="text-3xl font-bold text-amber-600">4.8 milhões</p>
            <p className="text-gray-600">toneladas anuais</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-orange-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Principais Regiões</h3>
            </div>
            <ul className="space-y-1 text-gray-700">
              <li>• Costa do Marfim</li>
              <li>• Gana</li>
              <li>• Equador</li>
              <li>• Camarões</li>
              <li>• Nigéria</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Crescimento Anual</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">2.8%</p>
            <p className="text-gray-600">taxa de crescimento</p>
          </div>
        </div>

        {/* 3D Model Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Modelo 3D Interativo</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <ThreeDModelView sectorId="cocoa" />
          </div>
        </div>

        {/* Techniques Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Técnicas de Cultivo</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Cultivo sombreado sob dossel florestal</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Técnicas de fermentação para desenvolvimento de sabor</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Métodos de poda para manejo de doenças</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Processamento pós-colheita para controle de qualidade</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Problemas Comuns</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 pl-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">Doença da vagem preta</h3>
                </div>
                <p className="text-gray-600 text-sm">Doença fúngica que faz com que as vagens fiquem pretas e apodreçam.</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">Vírus do inchaço do broto do cacau</h3>
                </div>
                <p className="text-gray-600 text-sm">Doença viral que causa inchaço dos brotos, avermelhamento das folhas e, eventualmente, morte da árvore.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex items-center mb-6">
            <DollarSign className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Informações de Mercado</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Preço Atual</p>
              <p className="text-2xl font-bold text-amber-600">$2.50</p>
              <p className="text-sm text-gray-500">por quilograma</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Tendência</p>
              <div className="flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
                <p className="text-lg font-semibold text-green-500">Alta</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Previsão</p>
              <p className="text-sm text-gray-700">Demanda global crescente por chocolate impulsiona preços para cima</p>
            </div>
          </div>
        </div>

        {/* Sustainability Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sustentabilidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <Leaf className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Sistemas agroflorestais que preservam a biodiversidade</p>
              </div>
              <div className="flex items-start">
                <Leaf className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Certificação de comércio justo para melhor subsistência dos agricultores</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <Leaf className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Práticas de conservação de água no processamento</p>
              </div>
              <div className="flex items-start">
                <Leaf className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Métodos de cultivo orgânico reduzindo insumos químicos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};

