import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Gauge } from 'lucide-react';

export const WeatherModule = () => {
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    visibility: 10,
    uvIndex: 8,
    condition: 'sunny'
  });

  const [forecast, setForecast] = useState([
    { day: 'Hoje', temp: 28, condition: 'sunny', humidity: 65 },
    { day: 'Amanhã', temp: 26, condition: 'cloudy', humidity: 70 },
    { day: 'Quinta', temp: 24, condition: 'rainy', humidity: 85 },
    { day: 'Sexta', temp: 27, condition: 'sunny', humidity: 60 },
    { day: 'Sábado', temp: 29, condition: 'sunny', humidity: 55 }
  ]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meteorologia</h1>
        <p className="text-gray-600">Condições climáticas atuais e previsão para os próximos dias</p>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Condições Atuais</h2>
            <p className="text-blue-100">São Paulo, SP - Atualizado agora</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{currentWeather.temperature}°C</div>
            <div className="text-blue-100 mt-2">Ensolarado</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-200" />
            <div className="text-sm text-blue-100">Umidade</div>
            <div className="text-lg font-semibold">{currentWeather.humidity}%</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Wind className="h-6 w-6 mx-auto mb-2 text-blue-200" />
            <div className="text-sm text-blue-100">Vento</div>
            <div className="text-lg font-semibold">{currentWeather.windSpeed} km/h</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Gauge className="h-6 w-6 mx-auto mb-2 text-blue-200" />
            <div className="text-sm text-blue-100">Pressão</div>
            <div className="text-lg font-semibold">{currentWeather.pressure} hPa</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Eye className="h-6 w-6 mx-auto mb-2 text-blue-200" />
            <div className="text-sm text-blue-100">Visibilidade</div>
            <div className="text-lg font-semibold">{currentWeather.visibility} km</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Sun className="h-6 w-6 mx-auto mb-2 text-blue-200" />
            <div className="text-sm text-blue-100">Índice UV</div>
            <div className="text-lg font-semibold">{currentWeather.uvIndex}</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Thermometer className="h-6 w-6 mx-auto mb-2 text-blue-200" />
            <div className="text-sm text-blue-100">Sensação</div>
            <div className="text-lg font-semibold">30°C</div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Previsão dos Próximos Dias</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="text-sm font-medium text-gray-600 mb-2">{day.day}</div>
              <div className="flex justify-center mb-3">
                {getWeatherIcon(day.condition)}
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">{day.temp}°C</div>
              <div className="text-xs text-gray-500">Umidade: {day.humidity}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Alertas Meteorológicos</h3>
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Sun className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">Alerta de Calor</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Temperaturas acima de 30°C previstas para os próximos 3 dias. Recomenda-se aumentar a irrigação.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CloudRain className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Previsão de Chuva</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Possibilidade de chuva na quinta-feira. Considere ajustar o cronograma de aplicação de defensivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agricultural Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recomendações Agrícolas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Irrigação</h4>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Recomendação:</strong> Aumentar irrigação em 20% devido às altas temperaturas previstas.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Aplicação de Defensivos</h4>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Atenção:</strong> Evitar aplicações na quinta-feira devido à previsão de chuva.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

