import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Gauge, Sprout, Beaker } from 'lucide-react';
import { Tabs } from './Tabs';
import { CultureSelector, culturas } from './CultureSelector';
import { TemperatureTrends } from './TemperatureTrends';
import { PrecipitationAnalysis } from './PrecipitationAnalysis';
import { CurrentVsIdeal } from './CurrentVsIdeal';
import { PhytosanitaryRisks } from './PhytosanitaryRisks';
import { AgroclimatePerformance } from './AgroclimatePerformance';
import { AgroclimateIndices } from './AgroclimateIndices';
import { IrrigationRecommendations } from './IrrigationRecommendations';
import { PhytosanitaryMonitoring } from './PhytosanitaryMonitoring';
import { CultureAlerts } from './CultureAlerts';
import { SmartAlertSystem } from './SmartAlertSystem';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  // Novos dados meteorológicos expandidos
  temperaturaSolo: number;
  umidadeSolo: number;
  evapotranspiracao: number;
  pontoOrvalho: number;
}

export const WeatherModule = () => {
  const [selectedCulture, setSelectedCulture] = useState('soja');
  const [currentWeather, setCurrentWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    visibility: 10,
    uvIndex: 8,
    condition: 'sunny',
    // Novos dados
    temperaturaSolo: 25,
    umidadeSolo: 45,
    evapotranspiracao: 4.2,
    pontoOrvalho: 18
  });

  const [forecast, setForecast] = useState([
    { day: 'Hoje', temp: 28, condition: 'sunny', humidity: 65 },
    { day: 'Amanhã', temp: 26, condition: 'cloudy', humidity: 70 },
    { day: 'Quinta', temp: 24, condition: 'rainy', humidity: 85 },
    { day: 'Sexta', temp: 27, condition: 'sunny', humidity: 60 },
    { day: 'Sábado', temp: 29, condition: 'sunny', humidity: 55 }
  ]);

  const getWeatherIcon = (condition: string) => {
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

  // Aba Visão Geral
  const VisaoGeralTab = () => (
    <div className="p-6 space-y-6">
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

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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
            <div className="text-sm text-blue-100">Temp. Solo</div>
            <div className="text-lg font-semibold">{currentWeather.temperaturaSolo}°C</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Sprout className="h-6 w-6 mx-auto mb-2 text-blue-200" />
            <div className="text-sm text-blue-100">Umid. Solo</div>
            <div className="text-lg font-semibold">{currentWeather.umidadeSolo}%</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Beaker className="h-6 w-6 mx-auto mb-2 text-blue-200" />
            <div className="text-sm text-blue-100">Evapotrans.</div>
            <div className="text-lg font-semibold">{currentWeather.evapotranspiracao} mm</div>
          </div>
        </div>

        {/* Ponto de Orvalho */}
        <div className="mt-4 bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-200" />
              <span className="text-blue-100">Ponto de Orvalho</span>
            </div>
            <span className="text-lg font-semibold">{currentWeather.pontoOrvalho}°C</span>
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
    </div>
  );

  // Aba Análises (agora com componentes avançados)
  const AnalisesTab = () => (
    <div className="p-6 space-y-8">
      {/* Tendências de Temperatura */}
      <TemperatureTrends />
      
      {/* Análise de Precipitação e Umidade */}
      <PrecipitationAnalysis />
      
      {/* Comparação Atual vs Ideal */}
      <CurrentVsIdeal cultura={selectedCulture} />
      
      {/* Riscos Fitossanitários */}
      <PhytosanitaryRisks cultura={selectedCulture} />
      
      {/* Performance Agroclimática */}
      <AgroclimatePerformance cultura={selectedCulture} />
    </div>
  );

  // Aba Recomendações (agora com componentes completos)
  const RecomendacoesTab = () => (
    <div className="p-6 space-y-8">
      {/* Índices Agroclimáticos */}
      <AgroclimateIndices cultura={selectedCulture} />
      
      {/* Recomendações de Irrigação */}
      <IrrigationRecommendations cultura={selectedCulture} />
      
      {/* Monitoramento Fitossanitário */}
      <PhytosanitaryMonitoring cultura={selectedCulture} />
      
      {/* Alertas Específicos por Cultura */}
      <CultureAlerts cultura={selectedCulture} />
    </div>
  );

  const tabs = [
    {
      id: 'visao-geral',
      label: 'Visão Geral',
      content: <VisaoGeralTab />
    },
    {
      id: 'analises',
      label: 'Análises',
      content: <AnalisesTab />
    },
    {
      id: 'recomendacoes',
      label: 'Recomendações',
      content: <RecomendacoesTab />
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meteorologia Agrícola</h1>
            <p className="text-gray-600">Sistema avançado de análise climática e recomendações por cultura</p>
          </div>
          
          {/* Culture Selector */}
          <div className="lg:w-80">
            <CultureSelector
              selectedCulture={selectedCulture}
              onCultureChange={setSelectedCulture}
            />
          </div>
        </div>
      </div>

      {/* Sistema de Alertas Inteligentes */}
      <SmartAlertSystem cultura={selectedCulture} />

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="visao-geral" className="shadow-sm" />
    </div>
  );
};

