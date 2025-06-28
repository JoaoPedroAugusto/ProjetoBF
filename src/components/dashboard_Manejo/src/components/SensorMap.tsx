import React, { useState } from 'react';
import { MapPin, X, Droplets } from 'lucide-react';
import { Sensor } from '../types';

interface SensorMapProps {
  sensors: Sensor[];
  selectedSensorId: string | null;
  onSensorSelect: (id: string) => void;
}

const SensorMap: React.FC<SensorMapProps> = ({ 
  sensors, 
  selectedSensorId, 
  onSensorSelect 
}) => {
  const [hoveredSensorId, setHoveredSensorId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideal': return 'text-green-500 bg-green-100';
      case 'attention': return 'text-yellow-500 bg-yellow-100';
      case 'critical': return 'text-red-500 bg-red-100';
      default: return 'text-blue-500 bg-blue-100';
    }
  };

  const getMoistureOverlay = (moisture: number) => {
    if (moisture >= 35) return 'bg-green-500/20';
    if (moisture >= 25) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const selectedSensor = selectedSensorId 
    ? sensors.find(s => s.id === selectedSensorId) 
    : null;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Mapa da Plantação</h2>
        <p className="text-sm text-gray-500 mt-1">
          Visualização da umidade do solo em diferentes setores
        </p>
      </div>

      <div className="relative">
        <div 
          className="h-[400px] relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://geoinova.com.br/wp-content/uploads/2023/03/Screenshot_33-2.png)',
            opacity:1,
          }}
        >
          {/* Moisture overlay grid */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-0.5">
            {Array.from({ length: 48 }).map((_, index) => {
              const nearestSensor = sensors.reduce((closest, sensor) => {
                const sensorX = sensor.position.x;
                const sensorY = sensor.position.y;
                const cellX = (index % 8) * 12.5 + 6.25;
                const cellY = Math.floor(index / 8) * 16.67 + 8.33;
                
                const distance = Math.sqrt(
                  Math.pow(sensorX - cellX, 2) + Math.pow(sensorY - cellY, 2)
                );
                
                return distance < closest.distance ? { sensor, distance } : closest;
              }, { sensor: sensors[0], distance: Infinity }).sensor;

              return (
                <div
                  key={index}
                  className={`${getMoistureOverlay(nearestSensor.moisture)} transition-colors duration-300`}
                />
              );
            })}
          </div>
          
          {/* Sensor Markers */}
          {sensors.map(sensor => {
            const isSelected = sensor.id === selectedSensorId;
            const isHovered = sensor.id === hoveredSensorId;
            
            return (
              <div 
                key={sensor.id}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-125 z-50' : isHovered ? 'scale-110 z-40' : 'scale-100 z-30'
                }`}
                style={{
                  left: `${sensor.position.x}%`,
                  top: `${sensor.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => onSensorSelect(sensor.id)}
                onMouseEnter={() => setHoveredSensorId(sensor.id)}
                onMouseLeave={() => setHoveredSensorId(null)}
              >
                <div className={`rounded-full p-2 ${getStatusColor(sensor.status)} shadow-lg`}>
                  <Droplets className="h-5 w-5" />
                </div>
                
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white shadow-lg rounded-md px-3 py-2 text-sm whitespace-nowrap z-50">
                    <div className="font-medium">{sensor.name}</div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      <span>{sensor.moisture}% umidade</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Selected Sensor Details */}
        {selectedSensor && (
          <div className="absolute right-4 top-4 w-72 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-gray-800">{selectedSensor.name}</h3>
              <button 
                className="text-gray-400 hover:text-gray-600" 
                onClick={() => onSensorSelect(selectedSensor.id)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className={`h-3 w-3 rounded-full ${
                  selectedSensor.status === 'ideal' ? 'bg-green-500' : 
                  selectedSensor.status === 'attention' ? 'bg-yellow-500' : 
                  'bg-red-500'
                } mr-2`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {selectedSensor.status === 'ideal' ? 'Ideal' : 
                   selectedSensor.status === 'attention' ? 'Atenção' : 
                   'Crítico'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <div className="grid grid-cols-2 gap-1">
                  <div>Umidade Atual:</div>
                  <div className="font-medium text-gray-800">{selectedSensor.moisture}%</div>
                  
                  <div>Atualizado:</div>
                  <div className="font-medium text-gray-800">{selectedSensor.lastUpdated}</div>
                </div>
              </div>
              
              <h4 className="text-xs font-semibold text-gray-500 mb-2">UMIDADE POR PROFUNDIDADE</h4>
              <div className="space-y-3">
                {selectedSensor.depthReadings.map(reading => (
                  <div key={reading.depth}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{reading.depth}</span>
                      <span className="font-medium text-gray-800">{reading.value}%</span>
                    </div>
                    <div className="bg-gray-200 h-1.5 rounded-full w-full">
                      <div 
                        className={`h-1.5 rounded-full ${
                          reading.value > 35 ? 'bg-green-500' : 
                          reading.value > 25 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${reading.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorMap;