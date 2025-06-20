import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, MapPin, Calendar, Filter, Download, RefreshCw, Eye, BarChart3, PieChart as PieChartIcon, Activity, AlertTriangle } from 'lucide-react';
import { FilterPanel } from '../filters/FilterPanel';
import { DataService, SectorData, DailySectorMetrics, OverallDailyMetrics } from '../../data/database';


export const Analytics = () => {

  const [filteredData, setFilteredData] = useState<SectorData[]>([]);
  
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Último Ano');
  const [selectedMetric, setSelectedMetric] = useState('Produção');
  const [selectedView, setSelectedView] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [dailyOverallMetrics, setDailyOverallMetrics] = useState<OverallDailyMetrics[]>([]);
  const [dailySectorMetrics, setDailySectorMetrics] = useState<DailySectorMetrics[]>([]);
  const [topSectors, setTopSectors] = useState<SectorData[]>([]);
  const [sectorTrends, setSectorTrends] = useState<DailySectorMetrics[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange, selectedMetric]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const sectors = DataService.getSectors();
     
      
      setFilteredData(sectors);
      

      // Novas chamadas para os dados de Analytics
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

    } catch (error) {
      console.error("Erro ao carregar dados de analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersApplied = (newFilteredData: SectorData[]) => {
    setFilteredData(newFilteredData);
  };

  const exportData = (format: 'csv' | 'excel') => {
    // Implementar exportação de dados
    const dataToExport = filteredData.map(sector => ({
      Setor: sector.name,
      Produção: sector.production,
      Receita: sector.revenue,
      Eficiência: sector.efficiency,
      Sustentabilidade: sector.sustainability,
      Crescimento: sector.growth,
      Área: sector.area,
      Trabalhadores: sector.workers,
      Região: sector.region
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const getMetricColor = (value: number, type: 'efficiency' | 'sustainability' | 'growth') => {
    switch (type) {
      case 'efficiency':
        return value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600';
      case 'sustainability':
        return value >= 70 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600';
      case 'growth':
        return value > 0 ? 'text-green-600' : value === 0 ? 'text-gray-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : value < 0 ? (
      <TrendingDown className="h-4 w-4 text-red-600" />
    ) : (
      <div className="h-4 w-4" />
    );
  };

  const chartColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];

  const pieChartData = filteredData.map((sector, index) => ({
    name: sector.name,
    value: sector.production,
    color: chartColors[index % chartColors.length]
  }));

  const performanceData = filteredData.map(sector => ({
    name: sector.name.length > 10 ? sector.name.substring(0, 10) + '...' : sector.name,
    efficiency: sector.efficiency,
    sustainability: sector.sustainability,
    production: sector.production / 1000, // Convert to thousands
    revenue: sector.revenue / 1000000 // Convert to millions
  }));

  const growthData = filteredData.map(sector => ({
    name: sector.name.length > 8 ? sector.name.substring(0, 8) + '...' : sector.name,
    growth: sector.growth,
    target: 5 // Target growth of 5%
  }));

  const regionData = filteredData.reduce((acc, sector) => {
    const region = sector.region || 'Não especificado';
    if (!acc[region]) {
      acc[region] = { name: region, sectors: 0, production: 0, revenue: 0 };
    }
    acc[region].sectors += 1;
    acc[region].production += sector.production;
    acc[region].revenue += sector.revenue;
    return acc;
  }, {} as Record<string, any>);

  const regionChartData = Object.values(regionData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Avançado</h1>
            <p className="text-gray-600 mt-1">Análise detalhada de performance e tendências dos setores agrícolas</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="Última Semana">Última Semana</option>
              <option value="Último Mês">Último Mês</option>
              <option value="Último Trimestre">Último Trimestre</option>
              <option value="Último Ano">Último Ano</option>
              <option value="Últimos 2 Anos">Últimos 2 Anos</option>
            </select>
            <button
              onClick={() => setShowFilterPanel(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </button>
            <button
              onClick={loadAnalyticsData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Atualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex space-x-2">
          {[
            { id: 'overview', name: 'Visão Geral', icon: Eye },
            { id: 'performance', name: 'Performance', icon: BarChart3 },
            { id: 'distribution', name: 'Distribuição', icon: PieChartIcon },
            { id: 'trends', name: 'Tendências', icon: Activity },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedView === view.id
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <view.icon className="h-4 w-4" />
              <span>{view.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
                         {/* Nova Seção: Métricas Diárias Gerais */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {dailyOverallMetrics.slice(0, 5).map((metric, index) => (

            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Data: {metric.date.toLocaleDateString()}</p>
              <p className="text-md font-medium text-gray-800">Produção Total: {(metric.totalProduction / 1000).toFixed(0)}k ton</p>
              <p className="text-md font-medium text-gray-800">Receita Total: R$ {(metric.totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-md font-medium text-gray-800">Eficiência Média: {metric.avgEfficiency}%</p>
            </div>
          ))}
        </div>
           {dailyOverallMetrics.length > 5 && (

          <p className="text-sm text-gray-500 mt-4">Exibindo as 5 primeiras entradas. Verifique o console para todos os dados.</p>
        )}
      </div>

              <p className="text-green-600 text-sm font-medium">Total de Setores</p>
              <p className="text-2xl font-bold text-green-900">{filteredData.length}</p>
              <p className="text-green-600 text-xs mt-1">
                {filteredData.length === DataService.getSectors().length ? 'Todos os setores' : `${((filteredData.length / DataService.getSectors().length) * 100).toFixed(0)}% dos setores`}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Produção Total</p>
              <p className="text-2xl font-bold text-blue-900">
                {(filteredData.reduce((sum, sector) => sum + sector.production, 0) / 1000).toFixed(0)}k ton
              </p>
              <p className="text-blue-600 text-xs mt-1 flex items-center">
                {getTrendIcon(5.2)}
                <span className="ml-1">+5.2% vs período anterior</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Receita Total</p>
              <p className="text-2xl font-bold text-purple-900">
                R$ {(filteredData.reduce((sum, sector) => sum + sector.revenue, 0) / 1000000).toFixed(1)}M
              </p>
              <p className="text-purple-600 text-xs mt-1 flex items-center">
                {getTrendIcon(8.7)}
                <span className="ml-1">+8.7% vs período anterior</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Eficiência Média</p>
              <p className="text-2xl font-bold text-orange-900">
                {(filteredData.reduce((sum, sector) => sum + sector.efficiency, 0) / filteredData.length).toFixed(1)}%
              </p>
              <p className="text-orange-600 text-xs mt-1 flex items-center">
                {getTrendIcon(2.1)}
                <span className="ml-1">+2.1% vs período anterior</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance por Setor</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Produção">Produção</option>
                <option value="Receita">Receita</option>
                <option value="Eficiência">Eficiência</option>
                <option value="Sustentabilidade">Sustentabilidade</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar 
                  dataKey={selectedMetric === 'Produção' ? 'production' : 
                           selectedMetric === 'Receita' ? 'revenue' :
                           selectedMetric === 'Eficiência' ? 'efficiency' : 'sustainability'} 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Growth Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Tendências de Crescimento</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line type="monotone" dataKey="growth" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedView === 'distribution' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Production Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição de Produção</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${(value / 1000).toFixed(0)}k ton`, 'Produção']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição Regional</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="sectors" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Dados Detalhados</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => exportData('csv')}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => exportData('excel')}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Setor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produção</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receita</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eficiência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sustentabilidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crescimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Região</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((sector, index) => (
                <tr key={sector.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-green-600 text-sm font-medium">
                          {sector.name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{sector.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(sector.production / 1000).toFixed(0)}k ton
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {(sector.revenue / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getMetricColor(sector.efficiency, 'efficiency')}`}>
                      {sector.efficiency}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getMetricColor(sector.sustainability, 'sustainability')}`}>
                      {sector.sustainability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTrendIcon(sector.growth)}
                      <span className={`text-sm font-medium ml-1 ${getMetricColor(sector.growth, 'growth')}`}>
                        {sector.growth > 0 ? '+' : ''}{sector.growth}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sector.region || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onFiltersApplied={handleFiltersApplied}
      />
    </div>
  );
  
};

export default Analytics;