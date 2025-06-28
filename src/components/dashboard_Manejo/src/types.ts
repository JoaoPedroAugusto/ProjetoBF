export type Status = 'ideal' | 'attention' | 'critical';
export type TimeRange = '24h' | '7d' | '30d';

export interface Sensor {
  id: string;
  name: string;
  moisture: number;
  status: Status;
  position: {
    x: number;
    y: number;
  };
  lastUpdated: string;
  depthReadings: {
    depth: string;
    value: number;
  }[];
}

export interface DepthReading {
  depth: string;
  value: number;
}

export interface ForecastDay {
  day: string;
  condition: string;
  temperature: number;
  precipitation: number;
}

export interface WeatherData {
  precipitation: number;
  evapotranspiration: number;
  forecast: ForecastDay[];
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  type: string;
  sensorId: string;
  sensorName: string;
}

export interface IrrigationData {
  idealMoistureRange: {
    min: number;
    max: number;
  };
  currentDeficit: number;
  recommendation: {
    needed: boolean;
    amount: number;
  };
}

export interface OverviewData {
  averageMoisture: number;
  status: Status;
  depthDistribution: DepthReading[];
}

export interface TrendData {
  moisture: {
    '24h': number[];
    '7d': number[];
    '30d': number[];
  };
  temperature: {
    '24h': number[];
    '7d': number[];
    '30d': number[];
  };
}