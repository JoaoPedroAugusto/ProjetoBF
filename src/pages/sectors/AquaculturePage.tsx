import React from 'react';
import { Link } from 'react-router-dom';
import { Fish, TrendingUp, MapPin, Leaf } from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';

export const AquaculturePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center mb-6">
            <Fish className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">Piscicultura</h1>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            A aquicultura envolve a criação, cultivo e colheita de peixes, crustáceos e plantas aquáticas em ambientes controlados.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Produção Global</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">82 milhões</p>
            <p className="text-gray-600">toneladas anuais</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-500">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-cyan-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Principais Regiões</h3>
            </div>
            <ul className="space-y-1 text-gray-700">
              <li>• China</li>
              <li>• Indonésia</li>
              <li>• Índia</li>
              <li>• Vietnã</li>
              <li>• Bangladesh</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-teal-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Crescimento Anual</h3>
            </div>
            <p className="text-3xl font-bold text-teal-600">5.3%</p>
            <p className="text-gray-600">taxa de crescimento</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Modelo 3D Interativo</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <ThreeDModelView sectorId="aquaculture" />
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};

