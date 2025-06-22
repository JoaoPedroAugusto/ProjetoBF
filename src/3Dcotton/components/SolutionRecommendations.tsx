import React from 'react';
import { LightbulbIcon, Check, ChevronRight } from 'lucide-react';

interface SolutionRecommendationsProps {
  waterAccessLevel: number;
}

const SolutionRecommendations: React.FC<SolutionRecommendationsProps> = ({ waterAccessLevel }) => {
  // Recommendations based on water access level
  const getRecommendations = (): Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }> => {
    if (waterAccessLevel < 20) {
      // Critical level
      return [
        {
          title: 'Sistema de Irrigação por Gotejamento',
          description: 'Implementação de sistema de irrigação por gotejamento para maximizar a eficiência do uso da água.',
          impact: 'high'
        },
        {
          title: 'Captação de Água da Chuva',
          description: 'Criação de reservatórios para captação e armazenamento de água da chuva para uso durante períodos de seca.',
          impact: 'high'
        },
        {
          title: 'Barreiras Contra Vento',
          description: 'Instalação de barreiras físicas para reduzir a evaporação causada por ventos fortes.',
          impact: 'medium'
        },
        {
          title: 'Variedades de Algodão Resistentes à Seca',
          description: 'Utilização de variedades de algodão geneticamente adaptadas para resistir a condições de baixa disponibilidade de água.',
          impact: 'high'
        }
      ];
    } else if (waterAccessLevel < 40) {
      // Deficit level
      return [
        {
          title: 'Irrigação Eficiente',
          description: 'Implementação de sistema de irrigação por aspersão com controle de fluxo para reduzir o consumo de água.',
          impact: 'high'
        },
        {
          title: 'Cobertura do Solo',
          description: 'Uso de cobertura vegetal ou mulch para reduzir a evaporação e manter a umidade do solo.',
          impact: 'medium'
        },
        {
          title: 'Monitoramento de Umidade do Solo',
          description: 'Instalação de sensores de umidade para monitoramento em tempo real e otimização da irrigação.',
          impact: 'medium'
        },
        {
          title: 'Plantio em Curvas de Nível',
          description: 'Técnica de plantio seguindo as curvas de nível do terreno para melhor retenção de água no solo.',
          impact: 'medium'
        }
      ];
    } else {
      // Moderate level
      return [
        {
          title: 'Otimização de Horários de Irrigação',
          description: 'Ajuste dos horários de irrigação para períodos de menor evaporação (início da manhã ou final da tarde).',
          impact: 'medium'
        },
        {
          title: 'Manejo Integrado de Pragas',
          description: 'Implementação de estratégias de controle biológico para reduzir o estresse das plantas e melhorar o uso da água.',
          impact: 'low'
        },
        {
          title: 'Rotação de Culturas',
          description: 'Inclusão de culturas que melhoram a estrutura do solo e sua capacidade de retenção de água.',
          impact: 'medium'
        }
      ];
    }
  };
  
  const recommendations = getRecommendations();
  
  return (
    <div>
      <div className="flex items-center mb-3">
        <LightbulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
        <h3 className="text-md font-medium text-gray-700">Recomendações para Melhorar o Acesso Hídrico</h3>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 
                  ${rec.impact === 'high' ? 'bg-green-100 text-green-600' : 
                    rec.impact === 'medium' ? 'bg-blue-100 text-blue-600' : 
                    'bg-gray-100 text-gray-600'}`}>
                  <Check className="h-4 w-4" />
                </div>
                <h4 className="font-medium text-gray-800">{rec.title}</h4>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="px-4 pb-3 text-sm text-gray-600">
              <p>{rec.description}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium mr-1">Impacto:</span>
                <span className={`text-xs font-bold ${
                  rec.impact === 'high' ? 'text-green-600' : 
                  rec.impact === 'medium' ? 'text-blue-600' : 
                  'text-gray-600'
                }`}>
                  {rec.impact === 'high' ? 'Alto' : rec.impact === 'medium' ? 'Médio' : 'Baixo'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionRecommendations;