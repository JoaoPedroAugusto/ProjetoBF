import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, BarChart3, Cloud, Cpu, HelpCircle, Leaf } from 'lucide-react';
import { DataService } from '../../data/database';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const mainNavItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/weather', icon: Cloud, label: 'Meteorologia' },
    { path: '/3d-model', icon: Cpu, label: 'Modelos 3D' },
  ];

  // Obter todos os setores do banco de dados
  const sectors = DataService.getSectors();

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-40 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Header da Sidebar */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 flex-shrink-0">
        <div className={`flex items-center transition-opacity duration-200 ${
          isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
        }`}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <Leaf className="text-green-600 h-5 w-5" />
          </div>
          <h1 className="font-bold text-white text-lg">AgriTech Pro</h1>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:text-green-200 transition-colors p-1 rounded"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navegação Principal */}
      <div className="py-4 flex-shrink-0">
        <div className={`px-4 mb-2 ${isCollapsed ? 'hidden' : 'block'}`}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Principal</h3>
        </div>
        <nav className="px-2">
          <ul className="space-y-1">
            {mainNavItems.map(item => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-green-100 text-green-800 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-green-700'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-green-700' : 'text-gray-500 group-hover:text-green-600'
                    }`} />
                    
                    <span className={`ml-3 font-medium transition-all duration-200 ${
                      isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      {/* Setores Agrícolas - Área Rolável */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className={`px-4 mb-2 flex-shrink-0 ${isCollapsed ? 'hidden' : 'block'}`}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Setores</h3>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="space-y-1 pb-4">
            {sectors.map(sector => {
              const isActive = location.pathname === `/sectors/${sector.id}`;
              const hasAlerts = sector.alerts && sector.alerts.some(alert => !alert.read);
              
              return (
                <li key={sector.id}>
                  <Link
                    to={`/sectors/${sector.id}`}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-green-100 text-green-800 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-green-700'
                    }`}
                  >
                    <div className="w-4 h-4 flex-shrink-0 bg-green-200 rounded-sm flex items-center justify-center mr-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-green-700' : 'bg-green-600 group-hover:bg-green-700'
                      }`}></div>
                    </div>
                    
                    <span className={`text-sm font-medium transition-all duration-200 flex-1 ${
                      isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}>
                      {sector.name}
                    </span>

                    {/* Indicador de alertas */}
                    {hasAlerts && !isCollapsed && (
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 animate-pulse"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      {/* Footer da Sidebar */}
      <div className={`p-4 border-t border-gray-200 flex-shrink-0 ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center mb-2">
            <HelpCircle className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-sm font-semibold text-gray-800">Precisa de ajuda?</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            Acesse nossa documentação completa e tutoriais para aproveitar ao máximo a plataforma.
          </p>
          <button className="w-full text-xs bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-sm">
            Ver Documentação
          </button>
        </div>
      </div>
    </aside>
  );
};

