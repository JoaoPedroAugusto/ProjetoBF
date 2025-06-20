import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sectors } from '../data/sectors';
import { SectorHero } from '../components/sectors/SectorHero';
import { SectorStatistics } from '../components/sectors/SectorStatistics';
import { SectorDetails } from '../components/sectors/SectorDetails';
import { SectorSidebar } from '../components/sectors/SectorSidebar';

interface SectorPageProps {
  sectorId: string;
}

export const SectorPage: React.FC<SectorPageProps> = ({ sectorId }) => {
  const sector = sectors.find(s => s.id === sectorId);
  const navigate = useNavigate();

  if (!sector) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sector not found</h2>
        <p className="text-gray-600 mb-6">
          The sector you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <SectorHero sector={sector} />
      <SectorStatistics sector={sector} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectorDetails sector={sector} />
        <SectorSidebar sector={sector} />
      </div>

      {/* Related Sectors */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Related Sectors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors
            .filter(s => s.id !== sector.id)
            .slice(0, 3) // Display up to 3 related sectors
            .map(relatedSector => (
              <Link
                key={relatedSector.id}
                to={`/sectors/${relatedSector.id}`}
                className="flex items-center bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                {relatedSector.icon && <relatedSector.icon className="h-6 w-6 text-green-700 mr-3" />}
                <span className="font-medium text-gray-800">{relatedSector.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};


