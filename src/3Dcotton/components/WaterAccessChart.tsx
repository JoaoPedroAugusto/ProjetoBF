import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
// Não precisamos importar RegionData ou SeasonType aqui, pois não são usados diretamente para tipagem neste arquivo.

const WaterAccessChart: React.FC = () => {
  const { regions, seasonType } = useAppContext();

  // Prepara os dados para o gráfico
  const data = [
    { name: 'Ótimo', range: '80-100%', count: 0 },
    { name: 'Bom', range: '60-80%', count: 0 },
    { name: 'Moderado', range: '40-60%', count: 0 },
    { name: 'Deficiente', range: '20-40%', count: 0 },
    { name: 'Crítico', range: '0-20%', count: 0 },
  ];

  // Conta as regiões em cada categoria
  regions.forEach(region => {
    // Acessa o nível de acesso à água da região para a estação atual
    const level = region[seasonType].waterAccessLevel;
    if (level >= 80) data[0].count++;
    else if (level >= 60) data[1].count++;
    else if (level >= 40) data[2].count++;
    else if (level >= 20) data[3].count++;
    else data[4].count++;
  });

  return (
    // ResponsiveContainer garante que o gráfico se ajuste ao tamanho do seu contêiner pai
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data}
        // Margens do gráfico para melhor visualização
        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
      >
        {/* Eixo X: Exibe os nomes das categorias (Ótimo, Bom, etc.) */}
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10 }} // Tamanho da fonte dos rótulos do eixo
          axisLine={{ stroke: '#e5e7eb' }} // Cor da linha do eixo
          tickLine={false} // Remove as linhas de marcação
        />
        {/* Eixo Y: Exibe a contagem de regiões */}
        <YAxis
          tick={{ fontSize: 10 }} // Tamanho da fonte dos rótulos do eixo
          axisLine={{ stroke: '#e5e7eb' }} // Cor da linha do eixo
          tickLine={false} // Remove as linhas de marcação
        />
        {/* Tooltip: Exibe informações detalhadas ao passar o mouse sobre as barras */}
        <Tooltip
          // Formata o valor exibido no tooltip (ex: "5 regiões")
          // FIX: Removido 'name' do formatter, pois não estava sendo utilizado.
          formatter={(value) => [`${value} regiões`, 'Quantidade']}
          // Formata o rótulo do tooltip (ex: "Ótimo (80-100%)")
          labelFormatter={(label, items) => {
            const item = items[0]?.payload; // Pega o payload do primeiro item (a barra)
            return `${label} (${item?.range})`; // Retorna o rótulo e o range
          }}
        />
        {/* Bar: Representa as barras do gráfico */}
        <Bar
          dataKey="count" // Usa a propriedade 'count' dos dados
          fill="#3b82f6" // Cor das barras
          radius={[4, 4, 0, 0]} // Arredonda os cantos superiores das barras
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WaterAccessChart;