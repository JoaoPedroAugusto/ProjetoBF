import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TemperatureData {
  date: string;
  atual: number;
  ideal: number;
  solo: number;
}

interface TemperatureTrendsProps {
  data?: TemperatureData[];
}

// Dados simulados para demonstração
const defaultData: TemperatureData[] = [
  { date: '01/06', atual: 25, ideal: 24, solo: 22 },
  { date: '02/06', atual: 27, ideal: 24, solo: 23 },
  { date: '03/06', atual: 29, ideal: 25, solo: 25 },
  { date: '04/06', atual: 31, ideal: 25, solo: 27 },
  { date: '05/06', atual: 28, ideal: 24, solo: 24 },
  { date: '06/06', atual: 26, ideal: 24, solo: 23 },
  { date: '07/06', atual: 28, ideal: 25, solo: 24 },
  { date: '08/06', atual: 30, ideal: 25, solo: 26 },
  { date: '09/06', atual: 32, ideal: 26, solo: 28 },
  { date: '10/06', atual: 29, ideal: 25, solo: 25 },
  { date: '11/06', atual: 27, ideal: 24, solo: 23 },
  { date: '12/06', atual: 25, ideal: 24, solo: 22 },
  { date: '13/06', atual: 26, ideal: 24, solo: 23 },
  { date: '14/06', atual: 28, ideal: 25, solo: 24 },
];

export const TemperatureTrends: React.FC<TemperatureTrendsProps> = ({ data = defaultData }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências de Temperatura (°C)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="atual" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Temperatura Atual"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="ideal" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Temperatura Ideal"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="solo" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Temperatura do Solo"
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Análise resumida */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="text-sm font-medium text-red-800">Temperatura Média Atual</div>
          <div className="text-lg font-bold text-red-900">
            {(data.reduce((acc, item) => acc + item.atual, 0) / data.length).toFixed(1)}°C
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-sm font-medium text-green-800">Temperatura Ideal Média</div>
          <div className="text-lg font-bold text-green-900">
            {(data.reduce((acc, item) => acc + item.ideal, 0) / data.length).toFixed(1)}°C
          </div>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <div className="text-sm font-medium text-amber-800">Desvio da Ideal</div>
          <div className="text-lg font-bold text-amber-900">
            +{(data.reduce((acc, item) => acc + (item.atual - item.ideal), 0) / data.length).toFixed(1)}°C
          </div>
        </div>
      </div>
    </div>
  );
};

