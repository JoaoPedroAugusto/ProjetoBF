import React from 'react';
import { Link } from 'react-router-dom';
import { Cherry, TrendingUp, MapPin, Leaf, AlertTriangle, DollarSign } from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';

export const TomatoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="relative bg-gradient-to-r from-red-500 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center mb-6">
            <Cherry className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">Tomate</h1>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            Os tomates são a baga comestível da planta Solanum lycopersicum, cultivada mundialmente por seu valor nutricional e versatilidade culinária.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Produção Global</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">180 milhões</p>
            <p className="text-gray-600">toneladas anuais</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
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

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Crescimento Anual</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">3.0%</p>
            <p className="text-gray-600">taxa de crescimento</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Modelo 3D Interativo</h2>
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <ThreeDModelView sectorId="tomato" />
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};

