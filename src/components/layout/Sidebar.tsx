import { useSidebar } from '../../contexts/SidebarContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, BarChart3, Cloud, Cpu, HelpCircle, Leaf, Moon, Sun } from 'lucide-react';
import { DataService } from '../../data/database';

export const Sidebar = () => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { isDarkMode, toggleDarkMode } = useTheme();
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
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-40 ${isCollapsed ? 'w-16' : 'w-72'}`}
    >
      {/* Header da Sidebar */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 flex-shrink-0">
        <div className={`flex items-center transition-opacity duration-200 ${
          isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
        }`}>
          <div className="w-8 h-8 bg-white dark:bg-gray-100 rounded-lg flex items-center justify-center mr-3">
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
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Principal</h3>
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
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-green-400'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400'
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
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Startups</h3>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
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
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-green-400'
                    }`}
                  >
                    <div className="w-4 h-4 flex-shrink-0 bg-green-200 dark:bg-green-800 rounded-sm flex items-center justify-center mr-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-green-700 dark:bg-green-300' : 'bg-green-600 dark:bg-green-400 group-hover:bg-green-700 dark:group-hover:bg-green-300'
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
      
      {/* Footer da Sidebar - Botão de Modo Escuro */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button
          onClick={toggleDarkMode}
          className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Moon className="h-5 w-5 flex-shrink-0" />
          )}
          
          <span className={`ml-3 font-medium transition-all duration-200 ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}>
            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </span>
        </button>
      </div>
    </aside>
  );
};

