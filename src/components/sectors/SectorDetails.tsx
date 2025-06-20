
import React from 'react';
import { GanttChart, Activity, Lightbulb, AlertTriangle } from 'lucide-react';
import { Sector } from '../../data/sectors';

interface SectorDetailsProps {
  sector: Sector;
}

export const SectorDetails: React.FC<SectorDetailsProps> = ({ sector }) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Cultivation Techniques */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <GanttChart className="h-6 w-6 text-green-700 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            Cultivation/Rearing Techniques
          </h2>
        </div>
        <ul className="space-y-3">
          {sector.techniques.map((technique, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-medium mr-3">
                {index + 1}
              </span>
              <span className="text-gray-700">{technique}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Seção para 'ana' - Análise Adicional */}
      {sector.ana && sector.ana.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-purple-700 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">
              Análise Adicional
            </h2>
          </div>
          <ul className="space-y-3">
            {sector.ana.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* NOVA SEÇÃO: Challenges & Innovations */}
      {sector.challengesAndInnovations && sector.challengesAndInnovations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-6 w-6 text-yellow-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">
              Challenges & Innovations
            </h2>
          </div>
          <div className="space-y-4">
            {sector.challengesAndInnovations.map((item, index) => (
              <div key={index} className="border-l-4 border-yellow-500 pl-4 py-1">
                <h3 className="font-medium text-gray-800 mb-1">Challenge: {item.challenge}</h3>
                <p className="text-gray-600 text-sm">Innovation: {item.innovation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Issues */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            Common Issues & Management
          </h2>
        </div>

        <div className="space-y-4">
          {sector.commonIssues.map((issue, index) => (
            <div key={index} className="border-l-4 border-amber-500 pl-4 py-1">
              <h3 className="font-medium text-gray-800 mb-1">{issue.name}</h3>
              <p className="text-gray-600 text-sm">{issue.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

