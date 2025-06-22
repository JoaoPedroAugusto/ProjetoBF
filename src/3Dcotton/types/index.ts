export interface RegionWaterData {
  waterAccessLevel: number;  // 0-100 percentage
  precipitation: number;     // mm
  temperature: number;       // Celsius
  soilMoisture: number;      // percentage
  lastUpdated: Date;
}

export interface RegionShape {
  id: string;
  name: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  dry: RegionWaterData;
  wet: RegionWaterData;
}

export interface RegionData extends RegionShape {
  currentData: RegionWaterData;
}

export type RegionDataset = RegionShape[];