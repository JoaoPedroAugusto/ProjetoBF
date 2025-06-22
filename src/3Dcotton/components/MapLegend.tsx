import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold mb-2">Acesso Hídrico</h3>
      <div className="space-y-1.5">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
          <span className="text-xs text-gray-700">Ótimo (80-100%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
          <span className="text-xs text-gray-700">Bom (60-80%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
          <span className="text-xs text-gray-700">Moderado (40-60%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-orange-500 mr-2"></div>
          <span className="text-xs text-gray-700">Deficiente (20-40%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
          <span className="text-xs text-gray-700">Crítico (0-20%)</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend