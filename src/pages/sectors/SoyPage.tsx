import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingUp, MapPin, Presentation } from 'lucide-react';
import { ThreeDModelView } from '../../components/3d/ThreeDModelView';
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

  // Otherwise, render the main Soy page content
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
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
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            A soja são leguminosas nativas do Leste Asiático, agora cultivadas globalmente como uma das culturas oleaginosas mais importantes.
          </p>
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

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-lime-500">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-lime-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Principais Regiões</h3>
            </div>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Estados Unidos</li>
              <li>• Brasil</li>
              <li>• Argentina</li>
              <li>• China</li>
              <li>• Índia</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-emerald-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Crescimento Anual</h3>
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