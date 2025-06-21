import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertTriangle, Bug, Droplets, Thermometer, Wind } from 'lucide-react';

interface RiskData {
  categoria: string;
  risco: number;
  nivel: 'baixo' | 'medio' | 'alto' | 'critico';
  fatores: string[];
  cor: string;
}

interface PhytosanitaryRisksProps {
  cultura?: string;
}

// Dados simulados baseados na cultura selecionada
const getRiskData = (cultura: string): RiskData[] => {
  const baseRisks = {
    soja: [
      {
        categoria: 'Ferrugem Asiática',
        risco: 75,
        nivel: 'alto' as const,
        fatores: ['Alta umidade', 'Temperatura favorável'],
        cor: '#ef4444'
      },
      {
        categoria: 'Percevejos',
        risco: 45,
        nivel: 'medio' as const,
        fatores: ['Temperatura elevada', 'Baixa umidade'],
        cor: '#f59e0b'
      },
      {
        categoria: 'Mofo Branco',
        risco: 30,
        nivel: 'baixo' as const,
        fatores: ['Umidade moderada'],
        cor: '#10b981'
      },
      {
        categoria: 'Lagarta da Soja',
        risco: 60,
        nivel: 'medio' as const,
        fatores: ['Condições climáticas favoráveis'],
        cor: '#f59e0b'
      }
    ],
    milho: [
      {
        categoria: 'Lagarta do Cartucho',
        risco: 80,
        nivel: 'alto' as const,
        fatores: ['Temperatura alta', 'Baixa precipitação'],
        cor: '#ef4444'
      },
      {
        categoria: 'Cercosporiose',
        risco: 55,
        nivel: 'medio' as const,
        fatores: ['Umidade elevada'],
        cor: '#f59e0b'
      },
      {
        categoria: 'Cigarrinha',
        risco: 35,
        nivel: 'baixo' as const,
        fatores: ['Condições secas'],
        cor: '#10b981'
      },
      {
        categoria: 'Helmintosporiose',
        risco: 40,
        nivel: 'medio' as const,
        fatores: ['Umidade moderada'],
        cor: '#f59e0b'
      }
    ],
    tomate: [
      {
        categoria: 'Requeima',
        risco: 85,
        nivel: 'critico' as const,
        fatores: ['Alta umidade', 'Temperatura moderada'],
        cor: '#dc2626'
      },
      {
        categoria: 'Mosca Branca',
        risco: 70,
        nivel: 'alto' as const,
        fatores: ['Temperatura alta', 'Baixa umidade'],
        cor: '#ef4444'
      },
      {
        categoria: 'Pinta Preta',
        risco: 50,
        nivel: 'medio' as const,
        fatores: ['Umidade elevada'],
        cor: '#f59e0b'
      },
      {
        categoria: 'Ácaro Rajado',
        risco: 65,
        nivel: 'alto' as const,
        fatores: ['Baixa umidade', 'Temperatura alta'],
        cor: '#ef4444'
      }
    ],
    algodao: [
      {
        categoria: 'Bicudo',
        risco: 60,
        nivel: 'medio' as const,
        fatores: ['Umidade moderada'],
        cor: '#f59e0b'
      },
      {
        categoria: 'Lagarta Rosada',
        risco: 45,
        nivel: 'medio' as const,
        fatores: ['Temperatura favorável'],
        cor: '#f59e0b'
      },
      {
        categoria: 'Ramulária',
        risco: 70,
        nivel: 'alto' as const,
        fatores: ['Alta umidade', 'Temperatura moderada'],
        cor: '#ef4444'
      },
      {
        categoria: 'Pulgão',
        risco: 35,
        nivel: 'baixo' as const,
        fatores: ['Condições secas'],
        cor: '#10b981'
      }
    ],
    cana: [
      {
        categoria: 'Broca da Cana',
        risco: 55,
        nivel: 'medio' as const,
        fatores: ['Temperatura elevada'],
        cor: '#f59e0b'
      },
      {
        categoria: 'Ferrugem',
        risco: 40,
        nivel: 'medio' as const,
        fatores: ['Umidade moderada'],
        cor: '#f59e0b'
      },
      {
        categoria: 'Cigarrinha',
        risco: 75,
        nivel: 'alto' as const,
        fatores: ['Baixa umidade', 'Temperatura alta'],
        cor: '#ef4444'
      },
      {
        categoria: 'Podridão Vermelha',
        risco: 30,
        nivel: 'baixo' as const,
        fatores: ['Condições secas'],
        cor: '#10b981'
      }
    ]
  };

  return baseRisks[cultura as keyof typeof baseRisks] || baseRisks.soja;
};

export const PhytosanitaryRisks: React.FC<PhytosanitaryRisksProps> = ({ cultura = 'soja' }) => {
  const riskData = getRiskData(cultura);

  // Dados para o gráfico de pizza
  const pieData = riskData.map(item => ({
    name: item.categoria,
    value: item.risco,
    color: item.cor
  }));

  // Distribuição por nível de risco
  const riskLevels = {
    baixo: riskData.filter(item => item.nivel === 'baixo').length,
    medio: riskData.filter(item => item.nivel === 'medio').length,
    alto: riskData.filter(item => item.nivel === 'alto').length,
    critico: riskData.filter(item => item.nivel === 'critico').length,
  };

  const levelData = [
    { nivel: 'Baixo', quantidade: riskLevels.baixo, cor: '#10b981' },
    { nivel: 'Médio', quantidade: riskLevels.medio, cor: '#f59e0b' },
    { nivel: 'Alto', quantidade: riskLevels.alto, cor: '#ef4444' },
    { nivel: 'Crítico', quantidade: riskLevels.critico, cor: '#dc2626' },
  ];

  const getRiskIcon = (categoria: string) => {
    if (categoria.toLowerCase().includes('lagarta') || categoria.toLowerCase().includes('percevejo') || categoria.toLowerCase().includes('bicudo')) {
      return <Bug className="h-5 w-5" />;
    }
    if (categoria.toLowerCase().includes('ferrugem') || categoria.toLowerCase().includes('mofo') || categoria.toLowerCase().includes('requeima')) {
      return <Droplets className="h-5 w-5" />;
    }
    return <AlertTriangle className="h-5 w-5" />;
  };

  const getRiskLevelColor = (nivel: string) => {
    switch (nivel) {
      case 'baixo':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'medio':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'alto':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'critico':
        return 'bg-red-100 border-red-300 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getFactorIcon = (fator: string) => {
    if (fator.toLowerCase().includes('umidade')) {
      return <Droplets className="h-4 w-4 text-blue-500" />;
    }
    if (fator.toLowerCase().includes('temperatura')) {
      return <Thermometer className="h-4 w-4 text-red-500" />;
    }
    if (fator.toLowerCase().includes('vento')) {
      return <Wind className="h-4 w-4 text-gray-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Riscos Fitossanitários - {cultura.charAt(0).toUpperCase() + cultura.slice(1)}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {levelData.map((level, index) => (
            <div key={index} className="text-center p-4 rounded-lg border" style={{ backgroundColor: level.cor + '20', borderColor: level.cor + '40' }}>
              <div className="text-2xl font-bold" style={{ color: level.cor }}>
                {level.quantidade}
              </div>
              <div className="text-sm" style={{ color: level.cor }}>
                Risco {level.nivel}
              </div>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Distribuição de Riscos</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Níveis de Risco</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="categoria" 
                    stroke="#6b7280"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="risco" 
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Detalhamento dos Riscos */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Detalhamento dos Riscos</h4>
        
        <div className="space-y-4">
          {riskData.map((risk, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getRiskLevelColor(risk.nivel)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getRiskIcon(risk.categoria)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-medium">{risk.categoria}</h5>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                        {risk.nivel.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Fatores contribuintes:</strong>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {risk.fatores.map((fator, fatorIndex) => (
                          <div key={fatorIndex} className="flex items-center space-x-1 text-xs bg-white/50 px-2 py-1 rounded">
                            {getFactorIcon(fator)}
                            <span>{fator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{risk.risco}%</div>
                  <div className="text-xs opacity-75">Probabilidade</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendações de Monitoramento */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Recomendações de Monitoramento</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h5 className="font-medium text-red-800 mb-2">Riscos Altos/Críticos</h5>
            <ul className="text-sm text-red-700 space-y-1">
              {riskData
                .filter(risk => risk.nivel === 'alto' || risk.nivel === 'critico')
                .map((risk, index) => (
                  <li key={index}>• Monitorar {risk.categoria} diariamente</li>
                ))}
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h5 className="font-medium text-yellow-800 mb-2">Riscos Médios</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              {riskData
                .filter(risk => risk.nivel === 'medio')
                .map((risk, index) => (
                  <li key={index}>• Monitorar {risk.categoria} semanalmente</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

