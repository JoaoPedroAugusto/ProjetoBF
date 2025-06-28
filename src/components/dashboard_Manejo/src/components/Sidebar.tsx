import React from 'react';
import { Droplets } from 'lucide-react';

interface SidebarProps {
  onViewChange: (view: string) => void;
  activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onViewChange, activeView }) => {
  // Mock data - In a real app, this would come from your data source
  const essentialInfo = {
    moisture: {
      average: 32,
      critical: 2,
      attention: 3,
    },
    irrigation: {
      nextScheduled: '14:30',
      lastIrrigation: '08:00',
      waterUsed: '2.5m³',
    },
    weather: {
      temperature: '28°C',
      humidity: '65%',
      rainChance: '30%',
    }
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
          <Droplets className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Fazenda Verde</h2>
          <p className="text-sm text-gray-500">Monitoramento</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Moisture Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Status de Umidade</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Média Geral</span>
              <span className="font-medium text-gray-800">{essentialInfo.moisture.average}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-red-600">Crítico</span>
              <span className="font-medium">{essentialInfo.moisture.critical} setores</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-yellow-600">Atenção</span>
              <span className="font-medium">{essentialInfo.moisture.attention} setores</span>
            </div>
          </div>
        </div>

        {/* Irrigation Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Irrigação</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Próxima</span>
              <span className="font-medium text-gray-800">{essentialInfo.irrigation.nextScheduled}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Última</span>
              <span className="font-medium text-gray-800">{essentialInfo.irrigation.lastIrrigation}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Água Utilizada</span>
              <span className="font-medium text-gray-800">{essentialInfo.irrigation.waterUsed}</span>
            </div>
          </div>
        </div>

        {/* Weather Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Condições Atuais</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Temperatura</span>
              <span className="font-medium text-gray-800">{essentialInfo.weather.temperature}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Umidade Ar</span>
              <span className="font-medium text-gray-800">{essentialInfo.weather.humidity}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Chance Chuva</span>
              <span className="font-medium text-gray-800">{essentialInfo.weather.rainChance}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <button 
          className="w-full py-2 px-4 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
          onClick={() => onViewChange('irrigation')}
        >
          Ajustar Irrigação
        </button>
      </div>
    </div>
  );
};

export default Sidebar;