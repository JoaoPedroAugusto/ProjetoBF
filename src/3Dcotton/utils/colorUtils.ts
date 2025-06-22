export const getRegionColor = (waterAccessLevel: number): string => {
  if (waterAccessLevel >= 80) return '#22c55e'; // Green
  if (waterAccessLevel >= 60) return '#3b82f6'; // Blue
  if (waterAccessLevel >= 40) return '#eab308'; // Yellow
  if (waterAccessLevel >= 20) return '#f97316'; // Orange
  return '#ef4444'; // Red
};