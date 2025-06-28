import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { TimeRange, Sensor, TrendData } from '../types';

interface TrendsChartProps {
  data: TrendData;
  timeRange: TimeRange;
  selectedSensor: Sensor | null;
}

const TrendsChart: React.FC<TrendsChartProps> = ({ data, timeRange, selectedSensor }) => {
  const [dataType, setDataType] = useState<'moisture' | 'temperature'>('moisture');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock chart data
  const chartLabels = {
    '24h': ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    '7d': ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    '30d': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
  };

  // In a real app, this would be dynamically generated from the data
  // Here we'll just simulate a chart with SVG
  const generateChartPath = () => {
    const points = [];
    const width = 100; // percentage width
    const height = 100; // percentage height
    
    // Generate different paths based on data type and time range
    const segments = chartLabels[timeRange].length;
    const segmentWidth = width / (segments - 1);
    
    for (let i = 0; i < segments; i++) {
      // Generate a value between 20 and 80 (percentage of height)
      // In a real app, this would use actual data values
      const value = dataType === 'moisture' 
        ? 40 + Math.sin(i / 2) * 20 + Math.random() * 10 
        : 30 + Math.cos(i / 3) * 15 + Math.random() * 8;
      
      points.push(`${i * segmentWidth},${100 - value}`);
    }
    
    return `M${points.join(' L')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedSensor ? `Tendências: ${selectedSensor.name}` : 'Tendências Gerais'}
        </h2>
        
        <div className="relative">
          <button 
            className="flex items-center bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {dataType === 'moisture' ? 'Umidade do Solo' : 'Temperatura do Solo'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    dataType === 'moisture' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setDataType('moisture');
                    setIsDropdownOpen(false);
                  }}
                >
                  Umidade do Solo
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    dataType === 'temperature' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setDataType('temperature');
                    setIsDropdownOpen(false);
                  }}
                >
                  Temperatura do Solo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative h-64">
        {/* Chart visualization */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.5" />
          
          {/* Ideal moisture range zone (only for moisture view) */}
          {dataType === 'moisture' && (
            <rect x="0\" y="30\" width="100\" height="20\" fill="rgba(34, 197, 94, 0.1)" />
          )}
          
          {/* Chart line */}
          <path 
            d={generateChartPath()} 
            fill="none" 
            stroke={dataType === 'moisture' ? '#3b82f6' : '#f97316'} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Area under the line */}
          <path 
            d={`${generateChartPath()} L100,100 L0,100 Z`} 
            fill={dataType === 'moisture' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(249, 115, 22, 0.1)'} 
          />
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2">
          <div>
            {dataType === 'moisture' ? '50%' : '35°C'}
          </div>
          <div>
            {dataType === 'moisture' ? '35%' : '25°C'}
          </div>
          <div>
            {dataType === 'moisture' ? '20%' : '15°C'}
          </div>
          <div>
            {dataType === 'moisture' ? '5%' : '5°C'}
          </div>
        </div>
        
        {/* Ideal range indicator (only for moisture) */}
        {dataType === 'moisture' && (
          <div className="absolute right-0 top-[30%] h-[20%] flex items-center">
            <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
              Ideal
            </div>
          </div>
        )}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {chartLabels[timeRange].map((label, index) => (
          <div key={index}>{label}</div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full ${dataType === 'moisture' ? 'bg-blue-500' : 'bg-orange-500'} mr-2`}></div>
          <span>{dataType === 'moisture' ? 'Umidade' : 'Temperatura'}</span>
        </div>
        {dataType === 'moisture' && (
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-100 border border-green-300 mr-2"></div>
            <span>Faixa Ideal</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsChart;