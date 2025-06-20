
import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Package, Users, CloudRain } from 'lucide-react';
import { Sector } from '../../data/sectors';

interface SectorSidebarProps {
  sector: Sector;
}

export const SectorSidebar: React.FC<SectorSidebarProps> = ({ sector }) => {
  return (
    <div className="space-y-6">
      {/* Environmental Impact */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Scale className="h-6 w-6 text-green-700 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            Sustainability Practices
          </h2>
        </div>

        <ul className="space-y-2">
          {sector.sustainability.map((practice, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 rounded bg-green-100 text-green-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                ✓
              </div>
              <span className="text-gray-700 text-sm">{practice}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Regulations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Scale className="h-6 w-6 text-blue-700 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            Regulations & Policies
          </h2>
        </div>

        <ul className="space-y-2">
          {sector.regulations.map((regulation, index) => (
            <li key={index} className="text-gray-700 text-sm pl-4 border-l-2 border-blue-200 py-1">
              {regulation}
            </li>
          ))}
        </ul>
      </div>

      {/* NOVA SEÇÃO: Product Applications */}
      {sector.productApplications && sector.productApplications.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-indigo-700 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">
              Product Applications
            </h2>
          </div>
          <ul className="space-y-2">
            {sector.productApplications.map((application, index) => (
              <li key={index} className="text-gray-700 text-sm pl-4 border-l-2 border-indigo-200 py-1">
                {application}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* NOVA SEÇÃO: Key Stakeholders */}
      {sector.keyStakeholders && sector.keyStakeholders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-teal-700 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">
              Key Stakeholders
            </h2>
          </div>
          <div className="space-y-3">
            {sector.keyStakeholders.map((stakeholder, index) => (
              <div key={index} className="flex items-baseline">
                <span className="font-medium text-gray-800 mr-2">{stakeholder.name}:</span>
                <span className="text-gray-600 text-sm">{stakeholder.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Impact */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CloudRain className="h-6 w-6 text-blue-700 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">
              Weather Sensitivity
            </h2>
          </div>

          <Link
            to="/weather"
            className="text-blue-700 text-sm hover:text-blue-800 transition-colors"
          >
            View Weather
          </Link>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Temperature Sensitivity</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${sector.id === 'sugarcane' || sector.id === 'banana' || sector.id === 'cocoa' ? '80%' : '60%'}` }}
              ></div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Water Requirement</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${sector.id === 'aquaculture' || sector.id === 'rice' ? '90%' : sector.id === 'cotton' ? '50%' : '70%'}` }}
              ></div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Wind Resistance</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${sector.id === 'banana' ? '30%' : sector.id === 'cotton' ? '40%' : '65%'}` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

