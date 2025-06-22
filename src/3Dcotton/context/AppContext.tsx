import React, { createContext, useContext, useState, useEffect } from 'react';
import { RegionDataset } from '../types';
import { generateMockData } from '../utils/mockData';

interface AppContextType {
  regions: RegionDataset;
  isLoading: boolean;
  seasonType: 'dry' | 'wet';
  setSeasonType: (season: 'dry' | 'wet') => void;
  toggleSimulation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [regions, setRegions] = useState<RegionDataset>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seasonType, setSeasonType] = useState<'dry' | 'wet'>('dry');
  
  useEffect(() => {
    // Simulate API loading
    setIsLoading(true);
    
    // Generate mock data
    setTimeout(() => {
      const mockData = generateMockData();
      setRegions(mockData);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // When season changes, simulate loading
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [seasonType]);
  
  const toggleSimulation = () => {
    setSeasonType(prev => prev === 'dry' ? 'wet' : 'dry');
  };
  
  return (
    <AppContext.Provider value={{
      regions,
      isLoading,
      seasonType,
      setSeasonType,
      toggleSimulation
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};