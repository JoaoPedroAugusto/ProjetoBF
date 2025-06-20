import React from 'react';
import { Link } from 'react-router-dom';
import { Flower, TrendingUp, MapPin, Leaf } from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';

export const SheepPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center mb-6">
            <Flower className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">Ovinocultura</h1>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            A criação de ovelhas envolve a criação de ovelhas para lã, carne (cordeiro e carneiro) e produção de leite.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Produção Global</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">9.3 milhões</p>
            <p className="text-gray-600">toneladas de carne anuais</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-pink-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Principais Regiões</h3>
            </div>
            <ul className="space-y-1 text-gray-700">
              <li>• China</li>
              <li>• Austrália</li>
              <li>• Nova Zelândia</li>
              <li>• Reino Unido</li>
              <li>• Turquia</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-rose-500">
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-rose-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Crescimento Anual</h3>
            </div>
            <p className="text-3xl font-bold text-rose-600">1.9%</p>
            <p className="text-gray-600">taxa de crescimento</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Modelo 3D Interativo</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <ThreeDModelView sectorId="sheep" />
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};

