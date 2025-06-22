import { RegionDataset } from '../types';

export const generateMockData = (): RegionDataset => {
  const regions: RegionDataset = [];
  const gridSize = 8;
  const spacing = 2.5;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = (i - gridSize / 2) * spacing;
      const z = (j - gridSize / 2) * spacing;

      // Calculate water access based on distance from river (centered at x=0)
      const distanceFromRiver = Math.abs(x);
      // FIX: 'riverInfluence' foi removido pois era declarado mas nunca usado.
      // const riverInfluence = Math.max(0, 1 - distanceFromRiver / 4); // Increased river influence

      // Add some natural variation
      const variation = Math.random() * 10;

      // Base water access levels - higher near river, lower at edges
      const baseWaterAccessDry = Math.min(95, Math.max(20,
        distanceFromRiver < 2 ?
          85 + variation : // Near river (Ótimo/Bom)
          distanceFromRiver < 4 ?
            60 + variation : // Medium distance (Moderado)
            30 + variation   // Far from river (Deficiente/Crítico)
      ));

      const baseWaterAccessWet = Math.min(100, baseWaterAccessDry + 15 + Math.random() * 5);

      regions.push({
        id: `region-${i}-${j}`,
        name: `Field ${String.fromCharCode(65 + i)}${j + 1}`,
        x,
        z,
        width: 2,
        depth: 2,
        dry: {
          waterAccessLevel: Math.round(baseWaterAccessDry),
          precipitation: Math.round(100 + Math.random() * 150),
          temperature: Math.round(28 + Math.random() * 5),
          soilMoisture: Math.round(baseWaterAccessDry * 0.8),
          lastUpdated: new Date()
        },
        wet: {
          waterAccessLevel: Math.round(baseWaterAccessWet),
          precipitation: Math.round(300 + Math.random() * 200),
          temperature: Math.round(24 + Math.random() * 3),
          soilMoisture: Math.round(baseWaterAccessWet * 0.9),
          lastUpdated: new Date()
        }
      });
    }
  }

  return regions;
};
