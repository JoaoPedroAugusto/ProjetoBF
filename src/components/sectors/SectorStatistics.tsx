
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Sector } from '../../data/sectors';

interface SectorStatisticsProps {
  sector: Sector;
}

export const SectorStatistics: React.FC<SectorStatisticsProps> = ({ sector }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Global Output</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">
            {sector.statistics.globalOutput}
          </span>
        </div>
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Annual Growth</h4>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
              <div
                className="h-1.5 rounded-full bg-green-600"
                style={{ width: `${parseFloat(sector.statistics.annualGrowth || '0')}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-green-600">
              {sector.statistics.annualGrowth}
            </span>
          </div>
        </div>
        {sector.statistics.imagem && (
          <div className="mt-4">
            <img
              src={sector.statistics.imagem}
              alt={`Dados Estatísticos de ${sector.name}`}
              className="w-full h-auto rounded-md object-cover"
              style={{ maxHeight: '150px' }}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Main Producing Regions</h3>
        <ul className="space-y-2">
          {sector.statistics.mainRegions.map((region, index) => (
            <li key={index} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  index === 0 ? 'bg-green-600' :
                  index === 1 ? 'bg-blue-600' :
                  index === 2 ? 'bg-amber-500' :
                  index === 3 ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}
              ></div>
              <span className="text-gray-700">{region}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Market Information</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-2xl font-bold text-gray-900">
            {sector.marketInfo.currentPrice}
          </span>
        </div>
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          sector.marketInfo.trend === 'up'
            ? 'bg-green-100 text-green-800'
            : sector.marketInfo.trend === 'down'
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
        }`}>
          {sector.marketInfo.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
          {sector.marketInfo.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
          {sector.marketInfo.trend === 'stable' && <Minus className="h-3 w-3 mr-1" />}
          {sector.marketInfo.trend === 'up' ? 'Rising' : sector.marketInfo.trend === 'down' ? 'Falling' : 'Stable'} trend
        </div>
        <p className="text-gray-600 text-xs mt-3">
          {sector.marketInfo.forecast}
        </p>
      </div>
    </div>
  );
};

