import { 
  OverviewData, 
  WeatherData, 
  IrrigationData, 
  Alert, 
  Sensor, 
  TrendData 
} from '../types';

// Mock overview data
const overview: OverviewData = {
  averageMoisture: 32,
  status: 'attention',
  depthDistribution: [
    { depth: '0-20 cm', value: 28 },
    { depth: '20-40 cm', value: 32 },
    { depth: '40-60 cm', value: 38 }
  ]
};

// Mock weather data
const weather: WeatherData = {
  precipitation: 2.5,
  evapotranspiration: 4.8,
  forecast: [
    { day: 'Hoje', condition: 'partlyCloudy', temperature: 28, precipitation: 0 },
    { day: 'Qua', condition: 'sunny', temperature: 30, precipitation: 0 },
    { day: 'Qui', condition: 'sunny', temperature: 31, precipitation: 0 },
    { day: 'Sex', condition: 'partlyCloudy', temperature: 29, precipitation: 10 },
    { day: 'Sáb', condition: 'rain', temperature: 25, precipitation: 25 }
  ]
};

// Mock irrigation data
const irrigation: IrrigationData = {
  idealMoistureRange: { min: 35, max: 45 },
  currentDeficit: 12.5,
  recommendation: {
    needed: true,
    amount: 15
  }
};

// Mock alerts
const alerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Umidade Crítica',
    message: 'Sensor 03 reportando níveis críticos de umidade (18%) abaixo do limiar mínimo.',
    severity: 'high',
    timestamp: 'Hoje, 10:45',
    type: 'moisture',
    sensorId: 'sensor-3',
    sensorName: 'Sensor 03 - Setor Leste'
  },
  {
    id: 'alert-2',
    title: 'Queda Rápida de Umidade',
    message: 'Diminuição acelerada da umidade no Sensor 05 nas últimas 3 horas.',
    severity: 'medium',
    timestamp: 'Hoje, 08:30',
    type: 'trend',
    sensorId: 'sensor-5',
    sensorName: 'Sensor 05 - Setor Norte'
  },
  {
    id: 'alert-3',
    title: 'Bateria Baixa',
    message: 'Sensor 02 com bateria abaixo de 15%. Substituição recomendada.',
    severity: 'low',
    timestamp: 'Ontem, 16:20',
    type: 'system',
    sensorId: 'sensor-2',
    sensorName: 'Sensor 02 - Setor Central'
  }
];

// Mock sensors
const sensors: Sensor[] = [
  {
    id: 'sensor-1',
    name: 'Sensor 01 - Entrada',
    moisture: 38,
    status: 'ideal',
    position: { x: 20, y: 20 },
    lastUpdated: 'Hoje, 11:30',
    depthReadings: [
      { depth: '0-20 cm', value: 35 },
      { depth: '20-40 cm', value: 38 },
      { depth: '40-60 cm', value: 42 }
    ]
  },
  {
    id: 'sensor-2',
    name: 'Sensor 02 - Central',
    moisture: 33,
    status: 'attention',
    position: { x: 50, y: 40 },
    lastUpdated: 'Hoje, 11:25',
    depthReadings: [
      { depth: '0-20 cm', value: 30 },
      { depth: '20-40 cm', value: 33 },
      { depth: '40-60 cm', value: 36 }
    ]
  },
  {
    id: 'sensor-3',
    name: 'Sensor 03 - Leste',
    moisture: 18,
    status: 'critical',
    position: { x: 75, y: 35 },
    lastUpdated: 'Hoje, 11:40',
    depthReadings: [
      { depth: '0-20 cm', value: 15 },
      { depth: '20-40 cm', value: 18 },
      { depth: '40-60 cm', value: 22 }
    ]
  },
  {
    id: 'sensor-4',
    name: 'Sensor 04 - Sul',
    moisture: 42,
    status: 'ideal',
    position: { x: 60, y: 65 },
    lastUpdated: 'Hoje, 11:35',
    depthReadings: [
      { depth: '0-20 cm', value: 40 },
      { depth: '20-40 cm', value: 42 },
      { depth: '40-60 cm', value: 45 }
    ]
  },
  {
    id: 'sensor-5',
    name: 'Sensor 05 - Norte',
    moisture: 28,
    status: 'attention',
    position: { x: 40, y: 15 },
    lastUpdated: 'Hoje, 11:20',
    depthReadings: [
      { depth: '0-20 cm', value: 25 },
      { depth: '20-40 cm', value: 28 },
      { depth: '40-60 cm', value: 30 }
    ]
  }
];

// Mock trend data
const trends: TrendData = {
  moisture: {
    '24h': [35, 34, 33, 32, 31, 30, 29, 28],
    '7d': [39, 38, 36, 35, 33, 31, 28],
    '30d': [42, 40, 36, 30]
  },
  temperature: {
    '24h': [24, 22, 20, 22, 25, 28, 26, 24],
    '7d': [23, 24, 25, 26, 25, 24, 23],
    '30d': [20, 22, 24, 25]
  }
};

// Export all mock data
export const mockData = {
  overview,
  weather,
  irrigation,
  alerts,
  sensors,
  trends
};