import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Alert } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  // Helper function to get the appropriate color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Alertas</h2>
          {alerts.length > 0 && (
            <div className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {alerts.length}
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-green-100 text-green-800 p-2 rounded-full inline-flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="text-gray-500">Nenhum alerta no momento</p>
            <p className="text-sm text-gray-400 mt-1">
              Todos os sensores estão operando normalmente
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-start">
                  <div className={`p-1 rounded-full mr-3 ${
                    alert.severity === 'high' ? 'bg-red-200' : 
                    alert.severity === 'medium' ? 'bg-yellow-200' : 'bg-blue-200'
                  }`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{alert.title}</h3>
                    <p className="text-xs mt-1">{alert.message}</p>
                    
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{alert.timestamp}</span>
                      
                      <span className="mx-2">•</span>
                      
                      <span className="font-medium">
                        {alert.sensorName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;