import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface Cultura {
  id: string;
  nome: string;
  icone: string;
}

export const culturas: Cultura[] = [
  { id: 'soja', nome: 'Soja', icone: '🌱' },
  { id: 'milho', nome: 'Milho', icone: '🌽' },
  { id: 'tomate', nome: 'Tomate', icone: '🍅' },
  { id: 'algodao', nome: 'Algodão', icone: '🌿' },
  { id: 'cana', nome: 'Cana-de-açúcar', icone: '🎋' },
];

interface CultureSelectorProps {
  selectedCulture: string;
  onCultureChange: (culturaId: string) => void;
  className?: string;
}

export const CultureSelector: React.FC<CultureSelectorProps> = ({
  selectedCulture,
  onCultureChange,
  className = ''
}) => {
  const culturaSelecionada = culturas.find(c => c.id === selectedCulture);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cultura Selecionada
      </label>
      <div className="relative">
        <select
          value={selectedCulture}
          onChange={(e) => onCultureChange(e.target.value)}
          className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {culturas.map((cultura) => (
            <option key={cultura.id} value={cultura.id}>
              {cultura.icone} {cultura.nome}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Display selected culture info */}
      {culturaSelecionada && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{culturaSelecionada.icone}</span>
            <div>
              <p className="text-sm font-medium text-green-800">
                Cultura Ativa: {culturaSelecionada.nome}
              </p>
              <p className="text-xs text-green-600">
                Dados e recomendações específicas para esta cultura
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

