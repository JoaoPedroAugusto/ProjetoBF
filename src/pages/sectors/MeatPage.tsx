import React from 'react';
import { Link } from 'react-router-dom';
import { Beef, TrendingUp, MapPin, Leaf, AlertTriangle, DollarSign } from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';

export const MeatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-rose-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center mb-6">
            <Beef className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">Carne</h1>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            A produção de carne abrange a criação e processamento de animais de gado para consumo humano, incluindo bovinos, aves, suínos e outras espécies. Este setor é vital para o fornecimento global de proteínas.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Produção Global</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">340 milhões</p>
            <p className="text-gray-600">toneladas anuais</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-rose-500">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-rose-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Principais Regiões</h3>
            </div>
            <ul className="space-y-1 text-gray-700">
              <li>• Estados Unidos</li>
              <li>• China</li>
              <li>• Brasil</li>
              <li>• União Europeia</li>
              <li>• Índia</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-pink-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Crescimento Anual</h3>
            </div>
            <p className="text-3xl font-bold text-pink-600">1.7%</p>
            <p className="text-gray-600">taxa de crescimento</p>
          </div>
        </div>

        {/* 3D Model Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Modelo 3D Interativo</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <ThreeDModelView sectorId="meat" />
          </div>
        </div>

        {/* Techniques Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Técnicas de Produção</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Sistemas de pastoreio rotacional para bovinos</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Habitação com controle climático para aves</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Tecnologias de alimentação de precisão</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Seleção genética para produtividade melhorada</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Problemas Comuns</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 pl-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">Febre aftosa</h3>
                </div>
                <p className="text-gray-600 text-sm">Doença viral altamente contagiosa que afeta animais de casco fendido.</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">Gripe aviária</h3>
                </div>
                <p className="text-gray-600 text-sm">Infecção viral que pode causar alta mortalidade em bandos de aves.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex items-center mb-6">
            <DollarSign className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Informações de Mercado</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Preço Atual</p>
              <p className="text-xl font-bold text-red-600">Bovina: $4.50/kg</p>
              <p className="text-xl font-bold text-red-600">Aves: $2.20/kg</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Tendência</p>
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 bg-yellow-500 rounded-full mr-2"></div>
                <p className="text-lg font-semibold text-yellow-600">Estável</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Previsão</p>
              <p className="text-sm text-gray-700">Demanda crescente em países em desenvolvimento equilibrada por alternativas vegetais</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};

