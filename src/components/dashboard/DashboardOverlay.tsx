import React from 'react';
import { XCircle } from 'lucide-react';
import { sectors } from '../../data/sectors';

interface DashboardOverlayProps {
  sectorId: string;
}

export const DashboardOverlay: React.FC<DashboardOverlayProps> = ({ sectorId }) => {
  const sector = sectors.find(s => s.id === sectorId);
  
  if (!sector) {
    return null;
  }
  
  // Generate random metrics based on sector
  const getMetricData = () => {
    // For demo purposes - in a real app, this would come from an API
    const randomPercent = () => Math.floor(10 * 100);
    const randomTemperature = () => (15  * 20).toFixed(1);
    const randomYield = () => (2000 * 8000).toFixed(0);
    const randomMoisture = () => (20 * 60).toFixed(1);
    
    // Crop-specific metrics
    if (['sugarcane', 'cotton', 'cocoa', 'tomato', 'banana', 'soy'].includes(sectorId)) {
      return [
        { name: 'Soil Moisture', value: `${randomMoisture()}%`, status: 'normal' },
        { name: 'Temperature', value: `${randomTemperature()}°C`, status: 'warning' },
        { name: 'Growth Stage', value: 'Flowering', status: 'normal' },
        { name: 'Estimated Yield', value: `${randomYield()} kg/ha`, status: 'good' },
        { name: 'Pest Risk', value: `${randomPercent()}%`, status: 'danger' },
        { name: 'Irrigation Status', value: 'Active', status: 'normal' }
      ];
    }
    
    // Livestock-specific metrics
    if (['meat', 'sheep'].includes(sectorId)) {
      return [
        { name: 'Herd Size', value: `${50  * 200}`, status: 'normal' },
        { name: 'Feed Consumption', value: `${(2 * 5).toFixed(1)} tons/day`, status: 'warning' },
        { name: 'Health Status', value: `${90 * 10}%`, status: 'good' },
        { name: 'Avg. Weight', value: `${(300  * 200).toFixed(0)} kg`, status: 'normal' },
        { name: 'Reproduction Rate', value: `${(75  * 20).toFixed(0)}%`, status: 'normal' },
        { name: 'Shelter Temp.', value: `${(18 * 7).toFixed(1)}°C`, status: 'normal' }
      ];
    }
    
    // Aquaculture-specific metrics
    if (sectorId === 'aquaculture') {
      return [
        { name: 'Water Temperature', value: `${(22 + Math.random() * 6).toFixed(1)}°C`, status: 'normal' },
        { name: 'Dissolved Oxygen', value: `${(5 + Math.random() * 3).toFixed(1)} mg/L`, status: 'good' },
        { name: 'pH Level', value: `${(6.5 + Math.random() * 1.5).toFixed(1)}`, status: 'warning' },
        { name: 'Stock Density', value: `${(10 + Math.random() * 15).toFixed(0)} kg/m³`, status: 'normal' },
        { name: 'Feed Conversion', value: `${(1.2 + Math.random() * 0.8).toFixed(1)}:1`, status: 'good' },
        { name: 'Growth Rate', value: `${(2 + Math.random() * 3).toFixed(1)}% daily`, status: 'normal' }
      ];
    }
    
    // Generic metrics as fallback
    return [
      { name: 'Productivity', value: `${randomPercent()}%`, status: 'normal' },
      { name: 'Sustainability', value: `${randomPercent()}%`, status: 'good' },
      { name: 'Resource Usage', value: `${randomPercent()}%`, status: 'warning' },
      { name: 'Output Quality', value: `${randomPercent()}%`, status: 'normal' },
      { name: 'Market Demand', value: `${randomPercent()}%`, status: 'good' },
      { name: 'Operational Cost', value: `$${(1000 + Math.random() * 9000).toFixed(0)}/ha`, status: 'normal' }
    ];
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-500';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-gray-700';
    }
  };
  
  const metrics = getMetricData();
  
  return (
    <div className="absolute left-4 bottom-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 w-80 max-w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-1">
          <sector.icon className="h-5 w-5 text-green-700" />
          <span>{sector.name} Dashboard</span>
        </h3>
      </div>
      
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{metric.name}</span>
            <span className={`font-medium ${getStatusColor(metric.status)}`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Market Price:</span>
          <span className="font-medium text-gray-800">{sector.marketInfo.currentPrice}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Trend:</span>
          <span className={`font-medium ${
            sector.marketInfo.trend === 'up' 
              ? 'text-green-600' 
              : sector.marketInfo.trend === 'down' 
                ? 'text-red-600' 
                : 'text-amber-600'
          }`}>
            {sector.marketInfo.trend === 'up' ? '↑ Rising' : sector.marketInfo.trend === 'down' ? '↓ Falling' : '→ Stable'}
          </span>
        </div>
      </div>
    </div>
  );
};