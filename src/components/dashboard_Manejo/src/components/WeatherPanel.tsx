import React from 'react';
import { Cloud, Droplets, Sun, Wind, CloudRain } from 'lucide-react';
import { WeatherData, ForecastDay } from '../types';

interface WeatherPanelProps {
  precipitation: number;
  evapotranspiration: number;
  forecast: ForecastDay[];
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({
  precipitation,
  evapotranspiration,
  forecast
}) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-400" />;
      case 'partlyCloudy': return (
        <div className="relative">
          <Cloud className="h-6 w-6 text-gray-400" />
          <Sun className="h-4 w-4 text-yellow-500 absolute -right-1 -bottom-1" />
        </div>
      );
      case 'rain': return <CloudRain className="h-6 w-6 text-blue-500" />;
      default: return <Cloud className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados Meteorológicos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Droplets className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Precipitação (24h)</h3>
          </div>
          <div className="flex items-end">
            <span className="text-2xl font-bold text-gray-800">{precipitation}</span>
            <span className="text-gray-600 ml-1 mb-0.5">mm</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {precipitation === 0 
              ? 'Sem chuva nas últimas 24 horas' 
              : 'Última chuva: Hoje, 06:30'}
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Wind className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Evapotranspiração (ETO)</h3>
          </div>
          <div className="flex items-end">
            <span className="text-2xl font-bold text-gray-800">{evapotranspiration}</span>
            <span className="text-gray-600 ml-1 mb-0.5">mm/dia</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {evapotranspiration > 5 
              ? 'Alta demanda evaporativa' 
              : 'Demanda evaporativa moderada'}
          </div>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-700 mb-3">Previsão - Próximos 5 dias</h3>
      <div className="grid grid-cols-5 gap-2">
        {forecast.map((day, index) => (
          <div 
            key={index} 
            className="bg-gray-50 rounded-lg p-3 text-center transition-transform hover:transform hover:scale-105"
          >
            <div className="text-xs text-gray-500 mb-2">{day.day}</div>
            <div className="flex justify-center mb-2">
              {getWeatherIcon(day.condition)}
            </div>
            <div className="text-sm font-medium text-gray-800">{day.temperature}°C</div>
            <div className="flex items-center justify-center mt-1">
              <Droplets className="h-3 w-3 text-blue-500 mr-1" />
              <span className="text-xs text-gray-600">{day.precipitation}mm</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherPanel;