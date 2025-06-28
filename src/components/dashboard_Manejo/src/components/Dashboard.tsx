import React, { useState } from 'react';
import StatusOverview from './StatusOverview';
import SensorMap from './SensorMap';
import WeatherPanel from './WeatherPanel';
import TrendsChart from './TrendsChart';
import AlertsPanel from './AlertsPanel';
import IrrigationAdvice from './IrrigationAdvice';
import { mockData } from '../data/mockData';
import { TimeRange } from '../types';

interface DashboardProps {
  onClose: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onClose }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('24h');
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
  };

  const handleSensorSelect = (sensorId: string) => {
    setSelectedSensorId(sensorId === selectedSensorId ? null : sensorId);
  };

  const selectedSensor = selectedSensorId
    ? mockData.sensors.find(sensor => sensor.id === selectedSensorId) || null
    : null;

  return (
    <main className="px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusOverview
          averageMoisture={mockData.overview.averageMoisture}
          status={mockData.overview.status}
          timeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
        <WeatherPanel
          precipitation={mockData.weather.precipitation}
          evapotranspiration={mockData.weather.evapotranspiration}
          forecast={mockData.weather.forecast}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <SensorMap
            sensors={mockData.sensors}
            selectedSensorId={selectedSensorId}
            onSensorSelect={handleSensorSelect}
          />
        </div>
        <div>
          <IrrigationAdvice
            idealMoistureRange={mockData.irrigation.idealMoistureRange}
            currentDeficit={mockData.irrigation.currentDeficit}
            recommendation={mockData.irrigation.recommendation}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <TrendsChart
            data={mockData.trends}
            timeRange={selectedTimeRange}
            selectedSensor={selectedSensor}
          />
        </div>
        <div>
          <AlertsPanel alerts={mockData.alerts} />
        </div>
      </div>

      {/* Botão de voltar */}
      <div className="mt-10 text-center">
        <button
          onClick={onClose}
          className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          ⬅️ Voltar
        </button>
      </div>
    </main>
  );
};

export default Dashboard;
  