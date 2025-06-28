import React from 'react';
import { Droplets } from 'lucide-react';
import { IrrigationData } from '../types';

interface IrrigationAdviceProps {
  idealMoistureRange: { min: number; max: number };
  currentDeficit: number;
  recommendation: { needed: boolean; amount: number };
}

const IrrigationAdvice: React.FC<IrrigationAdviceProps> = ({
  idealMoistureRange,
  currentDeficit,
  recommendation
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recomendação de Irrigação</h2>
        <p className="text-sm text-gray-500 mt-1">Cultura: Soja</p>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">FAIXA DE UMIDADE IDEAL</h3>
          <div className="bg-gray-200 h-6 rounded-full relative">
            <div 
              className="absolute inset-y-0 bg-green-100 border border-green-300"
              style={{ 
                left: `${idealMoistureRange.min}%`, 
                right: `${100 - idealMoistureRange.max}%`
              }}
            ></div>
            
            <div className="absolute inset-0 flex justify-between items-center px-3 text-xs font-medium">
              <span>{idealMoistureRange.min}%</span>
              <span>{idealMoistureRange.max}%</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">DÉFICIT HÍDRICO ACUMULADO</h3>
          <div className="flex items-end">
            <span className="text-2xl font-bold text-gray-800">{currentDeficit}</span>
            <span className="text-gray-600 ml-1 mb-0.5">mm</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {currentDeficit < 5 
              ? 'Déficit baixo, sem necessidade imediata de irrigação' 
              : currentDeficit < 15 
                ? 'Déficit moderado, monitorar próximos dias' 
                : 'Déficit alto, irrigação recomendada'}
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          recommendation.needed ? 'bg-blue-50 border border-blue-100' : 'bg-green-50 border border-green-100'
        }`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${
              recommendation.needed ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <Droplets className={`h-5 w-5 ${
                recommendation.needed ? 'text-blue-600' : 'text-green-600'
              }`} />
            </div>
            <h3 className={`font-medium ${
              recommendation.needed ? 'text-blue-800' : 'text-green-800'
            }`}>
              {recommendation.needed ? 'Irrigação Recomendada' : 'Irrigação Não Necessária'}
            </h3>
          </div>
          
          {recommendation.needed && (
            <div className="mt-3 pl-10">
              <div className="text-blue-800 font-medium text-lg">{recommendation.amount} mm</div>
              <p className="text-sm text-blue-700 mt-1">
                Aplicar nas próximas 24 horas para evitar estresse hídrico
              </p>
            </div>
          )}
          
          {!recommendation.needed && (
            <p className="text-sm text-green-700 mt-3 pl-10">
              Umidade do solo adequada. Monitorar condições climáticas para os próximos dias.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IrrigationAdvice;