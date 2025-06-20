import React, { useState, useEffect } from 'react';
import { Filter, Bell, Download, TrendingUp, TrendingDown, BarChart3, Users, DollarSign, Leaf, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { DataService, SectorData } from '../../data/database';
import { FilterPanel } from '../filters/FilterPanel';
import { NotificationCenter } from '../notifications/NotificationCenter';

export const Dashboard = () => {
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [filteredSectors, setFilteredSectors] = useState<SectorData[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('year');

  useEffect(() => {
    loadData();
    // Verificar problemas automaticamente
    DataService.checkForProblems();
  }, []);

  const loadData = () => {
    const allSectors = DataService.getSectors();
    setSectors(allSectors);
    setFilteredSectors(allSectors);
  };

  const stats = DataService.getOverallStats();
  const unreadNotifications = DataService.getUnreadNotifications();

  const handleFiltersApplied = (filtered: SectorData[]) => {
    setFilteredSectors(filtered);
  };

  const exportData = () => {
    const csvContent = filteredSectors.map(sector => 
      `${sector.name},${sector.production},${sector.revenue},${sector.efficiency},${sector.sustainability},${sector.growth}`
    ).join('\n');
    
    const blob = new Blob([`Setor,Produção,Receita,Eficiência,Sustentabilidade,Crescimento\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSustainabilityColor = (sustainability: number) => {
    if (sustainability >= 75) return 'text-green-600';
    if (sustainability >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Visão geral da performance dos setores agrícolas</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNotificationCenter(true)}
              className="relative flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowFilterPanel(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </button>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex space-x-2">
          {['month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeRange === range
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'month' ? 'Mês' : range === 'quarter' ? 'Trimestre' : 'Ano'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-700 text-sm font-medium mb-1">Receita Total</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-green-900">R$ {(stats.totalRevenue / 1000000).toFixed(0)}M</span>
                <span className="text-green-600 text-sm font-medium ml-2">+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-700 text-sm font-medium mb-1">Produção Total</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-blue-900">{(stats.totalProduction / 1000).toFixed(0)}k ton</span>
                <span className="text-blue-600 text-sm font-medium ml-2">+8.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-700 text-sm font-medium mb-1">Eficiência Média</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-purple-900">{stats.avgEfficiency}%</span>
                <span className="text-purple-600 text-sm font-medium ml-2">+3.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-amber-700 text-sm font-medium mb-1">Sustentabilidade</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-amber-900">{stats.avgSustainability}</span>
                <span className="text-amber-600 text-sm font-medium ml-2">+6.2%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {unreadNotifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Alertas Recentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unreadNotifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === 'critical' ? 'bg-red-50 border-red-400' :
                  notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${
                      notification.type === 'critical' ? 'text-red-800' :
                      notification.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {notification.title}
                    </h4>
                    <p className={`text-xs mt-1 ${
                      notification.type === 'critical' ? 'text-red-700' :
                      notification.type === 'warning' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    notification.priority === 'alta' ? 'bg-red-100 text-red-800' :
                    notification.priority === 'média' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {notification.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sectors Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance dos Setores</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSectors.map((sector) => (
            <div key={sector.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">{sector.name}</h4>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(sector.growth)}
                  <span className={`text-sm font-medium ${getGrowthColor(sector.growth)}`}>
                    {sector.growth > 0 ? '+' : ''}{sector.growth}%
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Produção</span>
                  <span className="font-medium">{(sector.production / 1000).toFixed(1)}k ton</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Receita</span>
                  <span className="font-medium">R$ {(sector.revenue / 1000000).toFixed(1)}M</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Eficiência</span>
                  <span className={`font-medium ${getEfficiencyColor(sector.efficiency)}`}>
                    {sector.efficiency}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sustentabilidade</span>
                  <span className={`font-medium ${getSustainabilityColor(sector.sustainability)}`}>
                    {sector.sustainability}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Área</span>
                  <span className="font-medium">{sector.area} ha</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trabalhadores</span>
                  <span className="font-medium">{sector.workers}</span>
                </div>
              </div>

              {/* Alerts for this sector */}
              {sector.alerts && sector.alerts.filter(a => !a.read).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {sector.alerts.filter(a => !a.read).length} alerta(s) ativo(s)
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onFiltersApplied={handleFiltersApplied}
      />

      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />
    </div>
  );
};

