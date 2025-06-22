import React from 'react';
import { Droplets, HelpCircle, Menu, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const { toggleSimulation } = useAppContext();

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <Droplets className="h-7 w-7 text-blue-600 mr-2" />
        <h1 className="text-xl font-semibold text-gray-800">FlowCot Map</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSimulation}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-sm font-medium transition-colors"
        >
          Toggle Seasons
        </button>
        
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-full hover:bg-gray-100">
            <HelpCircle className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-500" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-100 lg:hidden">
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;