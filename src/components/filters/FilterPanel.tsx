import React, { useState, useEffect } from 'react';
import { X, Bell, AlertTriangle, Info, CheckCircle, AlertCircle, Clock, Filter, Search, Calendar, BarChart3, MapPin, TrendingUp, Sliders, RefreshCw, Download, Save, Trash2 } from 'lucide-react';
import { DataService, Notification, SectorData } from '../../data/database';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersApplied: (filteredData: SectorData[]) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, onFiltersApplied }) => {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('Último Ano');
  const [selectedMetric, setSelectedMetric] = useState<string>('Produção');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas as Regiões');
  const [minEfficiency, setMinEfficiency] = useState<number>(0);
  const [minSustainability, setMinSustainability] = useState<number>(0);
  const [minProduction, setMinProduction] = useState<number>(0);
  const [minRevenue, setMinRevenue] = useState<number>(0);
  const [minGrowth, setMinGrowth] = useState<number>(-100);
  const [maxGrowth, setMaxGrowth] = useState<number>(100);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  const filterData = DataService.getFilterData();
  const allSectors = DataService.getSectors();

  // Valores máximos para os sliders
  const maxProduction = Math.max(...allSectors.map(s => s.production));
  const maxRevenue = Math.max(...allSectors.map(s => s.revenue));

  useEffect(() => {
    if (isOpen) {
      // Carregar filtros salvos
      const saved = localStorage.getItem('savedFilters');
      if (saved) {
        setSavedFilters(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  const handleSectorToggle = (sectorName: string) => {
    setSelectedSectors(prev => 
      prev.includes(sectorName)
        ? prev.filter(s => s !== sectorName)
        : [...prev, sectorName]
    );
  };

  const selectAllSectors = () => {
    setSelectedSectors(filterData.sectors);
  };

  const clearSectorSelection = () => {
    setSelectedSectors([]);
  };

  const applyFilters = () => {
    let filteredSectors = [...allSectors];

    // Filter by search term
    if (searchTerm.trim()) {
      filteredSectors = filteredSectors.filter(sector => 
        sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sector.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected sectors
    if (selectedSectors.length > 0) {
      filteredSectors = filteredSectors.filter(sector => 
        selectedSectors.includes(sector.name)
      );
    }

    // Filter by efficiency
    if (minEfficiency > 0) {
      filteredSectors = filteredSectors.filter(sector => 
        sector.efficiency >= minEfficiency
      );
    }

    // Filter by sustainability
    if (minSustainability > 0) {
      filteredSectors = filteredSectors.filter(sector => 
        sector.sustainability >= minSustainability
      );
    }

    // Filter by production
    if (minProduction > 0) {
      filteredSectors = filteredSectors.filter(sector => 
        sector.production >= minProduction
      );
    }

    // Filter by revenue
    if (minRevenue > 0) {
      filteredSectors = filteredSectors.filter(sector => 
        sector.revenue >= minRevenue
      );
    }

    // Filter by growth range
    filteredSectors = filteredSectors.filter(sector => 
      sector.growth >= minGrowth && sector.growth <= maxGrowth
    );

    // Filter by region
    if (selectedRegion !== 'Todas as Regiões') {
      filteredSectors = filteredSectors.filter(sector => 
        sector.region === selectedRegion
      );
    }

    // Sort by selected metric
    const sortMultiplier = sortOrder === 'desc' ? -1 : 1;
    
    switch (selectedMetric) {
      case 'Produção':
        filteredSectors.sort((a, b) => (b.production - a.production) * sortMultiplier);
        break;
      case 'Receita':
        filteredSectors.sort((a, b) => (b.revenue - a.revenue) * sortMultiplier);
        break;
      case 'Eficiência':
        filteredSectors.sort((a, b) => (b.efficiency - a.efficiency) * sortMultiplier);
        break;
      case 'Sustentabilidade':
        filteredSectors.sort((a, b) => (b.sustainability - a.sustainability) * sortMultiplier);
        break;
      case 'Crescimento':
        filteredSectors.sort((a, b) => (b.growth - a.growth) * sortMultiplier);
        break;
      case 'Área':
        filteredSectors.sort((a, b) => (b.area - a.area) * sortMultiplier);
        break;
      case 'Trabalhadores':
        filteredSectors.sort((a, b) => (b.workers - a.workers) * sortMultiplier);
        break;
      case 'Nome':
        filteredSectors.sort((a, b) => a.name.localeCompare(b.name) * sortMultiplier);
        break;
    }

    onFiltersApplied(filteredSectors);
    onClose();
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSelectedTimeRange('Último Ano');
    setSelectedMetric('Produção');
    setSelectedRegion('Todas as Regiões');
    setMinEfficiency(0);
    setMinSustainability(0);
    setMinProduction(0);
    setMinRevenue(0);
    setMinGrowth(-100);
    setMaxGrowth(100);
    setSearchTerm('');
    setSortOrder('desc');
    onFiltersApplied(allSectors);
  };

  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;

    const newFilter = {
      id: Date.now(),
      name: filterName,
      config: {
        selectedSectors,
        selectedTimeRange,
        selectedMetric,
        selectedRegion,
        minEfficiency,
        minSustainability,
        minProduction,
        minRevenue,
        minGrowth,
        maxGrowth,
        searchTerm,
        sortOrder
      }
    };

    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
    setFilterName('');
    setShowSaveDialog(false);
  };

  const loadSavedFilter = (filter: any) => {
    const config = filter.config;
    setSelectedSectors(config.selectedSectors || []);
    setSelectedTimeRange(config.selectedTimeRange || 'Último Ano');
    setSelectedMetric(config.selectedMetric || 'Produção');
    setSelectedRegion(config.selectedRegion || 'Todas as Regiões');
    setMinEfficiency(config.minEfficiency || 0);
    setMinSustainability(config.minSustainability || 0);
    setMinProduction(config.minProduction || 0);
    setMinRevenue(config.minRevenue || 0);
    setMinGrowth(config.minGrowth || -100);
    setMaxGrowth(config.maxGrowth || 100);
    setSearchTerm(config.searchTerm || '');
    setSortOrder(config.sortOrder || 'desc');
  };

  const deleteSavedFilter = (filterId: number) => {
    const updatedFilters = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedSectors.length > 0) count++;
    if (selectedTimeRange !== 'Último Ano') count++;
    if (selectedMetric !== 'Produção') count++;
    if (selectedRegion !== 'Todas as Regiões') count++;
    if (minEfficiency > 0) count++;
    if (minSustainability > 0) count++;
    if (minProduction > 0) count++;
    if (minRevenue > 0) count++;
    if (minGrowth > -100 || maxGrowth < 100) count++;
    if (searchTerm.trim()) count++;
    if (sortOrder !== 'desc') count++;
    return count;
  };

  const presetFilters = [
    {
      name: 'Alta Performance',
      action: () => {
        setMinEfficiency(85);
        setMinSustainability(75);
        setSelectedMetric('Eficiência');
        setSortOrder('desc');
      }
    },
    {
      name: 'Maiores Produtores',
      action: () => {
        setSelectedMetric('Produção');
        setSortOrder('desc');
        setMinProduction(50000);
      }
    },
    {
      name: 'Sustentáveis',
      action: () => {
        setMinSustainability(70);
        setSelectedMetric('Sustentabilidade');
        setSortOrder('desc');
      }
    },
    {
      name: 'Em Crescimento',
      action: () => {
        setMinGrowth(5);
        setSelectedMetric('Crescimento');
        setSortOrder('desc');
      }
    },
    {
      name: 'Baixa Performance',
      action: () => {
        setMinEfficiency(0);
        setMaxGrowth(0);
        setSelectedMetric('Eficiência');
        setSortOrder('asc');
      }
    },
    {
      name: 'Grandes Operações',
      action: () => {
        setMinRevenue(5000000);
        setSelectedMetric('Receita');
        setSortOrder('desc');
      }
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl mx-4 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Sliders className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Filtros Avançados</h2>
              <p className="text-sm text-gray-600">Configure os filtros para análise personalizada</p>
            </div>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                {getActiveFiltersCount()} filtro(s) ativo(s)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Filtros Rápidos</h3>
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-medium"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Limpar Todos</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {presetFilters.map((preset, index) => (
              <button
                key={index}
                onClick={preset.action}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtros Salvos</h3>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((filter) => (
                <div key={filter.id} className="flex items-center bg-purple-50 border border-purple-200 rounded-lg">
                  <button
                    onClick={() => loadSavedFilter(filter)}
                    className="px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors rounded-l-lg"
                  >
                    {filter.name}
                  </button>
                  <button
                    onClick={() => deleteSavedFilter(filter.id)}
                    className="p-2 text-purple-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-r-lg"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Search and Sectors */}
            <div className="space-y-6">
              {/* Search */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-600" />
                  Buscar
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar setores ou regiões..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Setores */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Setores ({selectedSectors.length}/{filterData.sectors.length})
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={selectAllSectors}
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                      Todos
                    </button>
                    <button
                      onClick={clearSectorSelection}
                      className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                    >
                      Limpar
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {filterData.sectors
                    .filter(sector => !searchTerm || sector.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((sector) => (
                    <label key={sector} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSectors.includes(sector)}
                        onChange={() => handleSectorToggle(sector)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{sector}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Time and Metrics */}
            <div className="space-y-6">
              {/* Período */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Período
                </h3>
                <div className="space-y-2">
                  {filterData.timeRanges.map((range) => (
                    <label key={range} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="timeRange"
                        value={range}
                        checked={selectedTimeRange === range}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Métrica de Ordenação */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  Ordenar por
                </h3>
                <div className="space-y-3">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {[...filterData.metrics, 'Área', 'Trabalhadores', 'Nome'].map((metric) => (
                      <option key={metric} value={metric}>{metric}</option>
                    ))}
                  </select>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        sortOrder === 'desc'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Maior → Menor
                    </button>
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        sortOrder === 'asc'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Menor → Maior
                    </button>
                  </div>
                </div>
              </div>

              {/* Região */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                  Região
                </h3>
                <div className="space-y-2">
                  {filterData.regions.map((region) => (
                    <label key={region} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="region"
                        value={region}
                        checked={selectedRegion === region}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{region}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Filters */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Filtros de Performance</h3>
              
              {/* Eficiência Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eficiência Mínima: {minEfficiency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minEfficiency}
                  onChange={(e) => setMinEfficiency(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${minEfficiency}%, #e5e7eb ${minEfficiency}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Sustentabilidade Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sustentabilidade Mínima: {minSustainability}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minSustainability}
                  onChange={(e) => setMinSustainability(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #059669 0%, #059669 ${minSustainability}%, #e5e7eb ${minSustainability}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* Produção Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Produção Mínima: {(minProduction / 1000).toFixed(0)}k ton
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxProduction}
                  value={minProduction}
                  onChange={(e) => setMinProduction(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(minProduction / maxProduction) * 100}%, #e5e7eb ${(minProduction / maxProduction) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{(maxProduction / 1000).toFixed(0)}k</span>
                </div>
              </div>

              {/* Receita Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receita Mínima: R$ {(minRevenue / 1000000).toFixed(1)}M
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxRevenue}
                  value={minRevenue}
                  onChange={(e) => setMinRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(minRevenue / maxRevenue) * 100}%, #e5e7eb ${(minRevenue / maxRevenue) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>R$ 0</span>
                  <span>R$ {(maxRevenue / 1000000).toFixed(0)}M</span>
                </div>
              </div>
            </div>

            {/* Growth Range */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Faixa de Crescimento</h3>
              
              {/* Crescimento Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crescimento Mínimo: {minGrowth}%
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={minGrowth}
                  onChange={(e) => setMinGrowth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-100%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Crescimento Máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crescimento Máximo: {maxGrowth}%
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={maxGrowth}
                  onChange={(e) => setMaxGrowth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-100%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Export Options */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Resultados</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Exportar CSV</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Exportar Excel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {getActiveFiltersCount() > 0 ? (
                <span className="font-medium text-green-600">
                  {getActiveFiltersCount()} filtro(s) configurado(s)
                </span>
              ) : (
                'Nenhum filtro ativo'
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpar Todos
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Aplicar Filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Filter Dialog */}
        {showSaveDialog && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salvar Filtro</h3>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Nome do filtro..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCurrentFilter}
                  disabled={!filterName.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

