import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, BarChart } from 'lucide-react';
import { Sector } from '../../data/sectors';

interface SectorHeroProps {
  sector: Sector;
}

export const SectorHero: React.FC<SectorHeroProps> = ({ sector }) => {
  return (
    <div
      className="rounded-xl shadow-lg overflow-hidden mb-6 relative"
      style={{
        backgroundImage: `url(${sector.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative p-6 md:p-8 text-white">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <div className="flex items-center mb-2">
          {sector.icon && <sector.icon className="h-8 w-8 mr-3 text-white" />}
          <h1 className="text-3xl md:text-4xl font-bold">
            {sector.name}
          </h1>
        </div>

        <p className="text-white/90 max-w-3xl mb-6 text-lg">
          {sector.description}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/3d-model"
            className="bg-green-700 text-white hover:bg-green-800 transition-colors px-4 py-2 rounded-md flex items-center"
          >
            <Activity className="h-5 w-5 mr-2" />
            View in 3D Model
          </Link>

          <Link
            to="/dashboard"
            className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 transition-colors px-4 py-2 rounded-md flex items-center"
          >
            <BarChart className="h-5 w-5 mr-2" />
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

