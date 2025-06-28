import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Status, TimeRange } from '../types';

interface StatusOverviewProps {
  averageMoisture: number;
  status: Status;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const StatusOverview: React.FC<StatusOverviewProps> = ({
  averageMoisture,
  status,
  timeRange,
  onTimeRangeChange
}) => {
  const statusColors = {
    ideal: 'bg-green-500',
    attention: 'bg-yellow-500',
    critical: 'bg-red-500'
  };

  const statusText = {
    ideal: 'Ideal',
    attention: 'Atenção',
    critical: 'Crítico'
  };

  const getTrendData = (range: TimeRange) => {
    // Simulated trend data based on time range
    switch (range) {
      case '24h':
        return { value: 2.5, direction: 'up' as const };
      case '7d':
        return { value: 1.8, direction: 'down' as const };
      case '30d':
        return { value: 3.2, direction: 'up' as const };
      default:
        return { value: 2.5, direction: 'up' as const };
    }
  };

  const trend = getTrendData(timeRange);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Visão Geral da Umidade</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['24h', '7d', '30d'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-end">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {averageMoisture}%
            </h3>
            <div className={`flex items-center ml-3 ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{trend.value}%</span>
            </div>
          </div>
          <p className="text-gray-500 mt-1">Umidade média do solo</p>

          <div className="mt-6">
            <div className="flex items-center mb-2">
              <div className={`h-3 w-3 rounded-full ${statusColors[status]} mr-2`}></div>
              <span className="text-sm font-medium text-gray-700">Status: {statusText[status]}</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full w-full mt-2">
              <div 
                className={`h-2 rounded-full ${statusColors[status]} transition-all duration-300`} 
                style={{ width: `${averageMoisture}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Distribuição por Profundidade</h3>
            <div className="space-y-3">
              {[
                { depth: '0-20 cm', value: 28 },
                { depth: '20-40 cm', value: 32 },
                { depth: '40-60 cm', value: 38 }
              ].map(item => (
                <div key={item.depth}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.depth}</span>
                    <span className="font-medium text-gray-800">{item.value}%</span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full w-full">
                    <div 
                      className="h-2 rounded-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;