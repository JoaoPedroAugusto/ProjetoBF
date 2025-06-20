// Banco de dados simulado em JavaScript para filtros e notificações
export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  sector?: string;
  timestamp: Date;
  read: boolean;
  priority: 'alta' | 'média' | 'baixa';
}

export interface FilterData {
  sectors: string[];
  timeRanges: string[];
  metrics: string[];
  regions: string[];
}

export interface SectorData {
  id: string;
  name: string;
  production: number;
  revenue: number;
  efficiency: number;
  sustainability: number;
  growth: number;
  area: number;
  workers: number;
  lastUpdate: Date;
  alerts: Notification[];
}

// Dados simulados das notificações
export const notificationsDB: Notification[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Alerta de Pragas: Cana-de-Açúcar',
    message: 'Alto risco de infestação de broca detectado nos campos nordestinos. Ação imediata recomendada.',
    sector: 'cana-de-acucar',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: false,
    priority: 'alta'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Alerta Climático: Algodão',
    message: 'Chuvas intensas previstas nas próximas 48 horas. Considere ajustar cronogramas de irrigação.',
    sector: 'algodao',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
    read: false,
    priority: 'alta'
  },
  {
    id: '3',
    type: 'info',
    title: 'Alerta de Mercado: Preços da Carne',
    message: 'Preços da carne devem subir 5% no próximo mês devido ao aumento da demanda de exportação.',
    sector: 'carne',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    read: true,
    priority: 'média'
  },
  {
    id: '4',
    type: 'success',
    title: 'Meta Atingida: Produção de Soja',
    message: 'Setor de soja superou a meta de produção mensal em 12%. Parabéns à equipe!',
    sector: 'soja',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    read: true,
    priority: 'baixa'
  },
  {
    id: '5',
    type: 'warning',
    title: 'Manutenção Programada: Sistema de Irrigação',
    message: 'Manutenção preventiva do sistema de irrigação agendada para este fim de semana.',
    sector: 'tomate',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    read: false,
    priority: 'média'
  },
  {
    id: '6',
    type: 'critical',
    title: 'Problema na Ração: Piscicultura',
    message: 'Qualidade da ração abaixo do padrão detectada. Substituição imediata necessária.',
    sector: 'piscicultura',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
    read: false,
    priority: 'alta'
  },
  {
    id: '7',
    type: 'info',
    title: 'Nova Tecnologia: Drones para Monitoramento',
    message: 'Implementação de drones para monitoramento de pragas iniciada no setor de cacau.',
    sector: 'cacau',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
    read: true,
    priority: 'baixa'
  },
  {
    id: '8',
    type: 'warning',
    title: 'Baixa Umidade do Solo: Banana',
    message: 'Níveis de umidade do solo abaixo do ideal. Aumento da irrigação recomendado.',
    sector: 'banana',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    read: false,
    priority: 'média'
  }
];

// Dados dos setores
export const sectorsDB: SectorData[] = [
  {
    id: 'cana-de-acucar',
    name: 'Cana-de-Açúcar',
    production: 142350,
    revenue: 28470000,
    efficiency: 87,
    sustainability: 72,
    growth: 12.5,
    area: 2847,
    workers: 2,
    lastUpdate: new Date(),
    alerts: notificationsDB.filter(n => n.sector === 'cana-de-acucar')
  },
  {
    id: 'algodao',
    name: 'Algodão',
    production: 95200,
    revenue: 19040000,
    efficiency: 89,
    sustainability: 71,
    growth: 18.2,
    area: 1850,
    workers: 2,
    lastUpdate: new Date(),
    alerts: notificationsDB.filter(n => n.sector === 'algodao')
  },
  {
    id: 'soja',
    name: 'Soja',
    production: 89000,
    revenue: 15680000,
    efficiency: 89,
    sustainability: 78,
    growth: 8.7,
    area: 1680,
    workers: 2,
    lastUpdate: new Date(),
    alerts: notificationsDB.filter(n => n.sector === 'soja')
  },
  {
    id: 'carne',
    name: 'Carne',
    production: 18000,
    revenue: 8940000,
    efficiency: 78,
    sustainability: 69,
    growth: 6.2,
    area: 3200,
    workers: 2,
    lastUpdate: new Date(),
    alerts: notificationsDB.filter(n => n.sector === 'carne')
  },
  {
    id: 'tomate',
    name: 'Tomate',
    production: 9500,
    revenue: 2850000,
    efficiency: 92,
    sustainability: 76,
    growth: 18.9,
    area: 95,
    workers: 2,
    lastUpdate: new Date(),
    alerts: notificationsDB.filter(n => n.sector === 'tomate')
  },
  {
    id: 'cacau',
    name: 'Cacau',
    production: 3200,
    revenue: 1920000,
    efficiency: 83,
    sustainability: 74,
    growth: 9.4,
    area: 280,
    workers: 2,
    lastUpdate: new Date(),
    alerts: notificationsDB.filter(n => n.sector === 'cacau')
  },
  {
    id: 'piscicultura',
    name: 'Piscicultura',
    production: 2800,
    revenue: 1680000,
    efficiency: 85,
    sustainability: 80,
    growth: 15.3,
    area: 45,
    workers: 2,
    lastUpdate: new Date(),
    alerts: notificationsDB.filter(n => n.sector === 'piscicultura')
  },
  {
    id: 'banana',
    name: 'Banana',
    production: 5600,
    revenue: 1120000,
    efficiency: 88,
    sustainability: 75,
    growth: 11.2,
    area: 120,
    workers: 2,
    lastUpdate: new Date(),
    alerts: notificationsDB.filter(n => n.sector === 'banana')
  },
  {
    id: 'ovinocultura',
    name: 'Ovinocultura',
    production: 1200,
    revenue: 960000,
    efficiency: 79,
    sustainability: 73,
    growth: 7.8,
    area: 850,
    workers: 11,
    lastUpdate: new Date(),
    alerts: notificationsDB.filter(n => n.sector === 'ovinocultura')
  }
];

// Dados para filtros
export const filterData: FilterData = {
  sectors: sectorsDB.map(s => s.name),
  timeRanges: ['Última Semana', 'Último Mês', 'Último Trimestre', 'Último Ano', 'Todo Período'],
  metrics: ['Produção', 'Receita', 'Eficiência', 'Sustentabilidade', 'Crescimento'],
  regions: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul', 'Todas as Regiões']
};

// Funções para manipular os dados
export class DataService {
  // Notificações
  static getNotifications(): Notification[] {
    return [...notificationsDB].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static getUnreadNotifications(): Notification[] {
    return notificationsDB.filter(n => !n.read);
  }

  static markNotificationAsRead(id: string): void {
    const notification = notificationsDB.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  static markAllNotificationsAsRead(): void {
    notificationsDB.forEach(n => n.read = true);
  }

  static addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    notificationsDB.unshift(newNotification);
  }

  // Setores
  static getSectors(): SectorData[] {
    return [...sectorsDB];
  }

  static getSectorById(id: string): SectorData | undefined {
    return sectorsDB.find(s => s.id === id);
  }

  static getSectorsByFilter(filters: {
    sectors?: string[];
    timeRange?: string;
    metric?: string;
    region?: string;
  }): SectorData[] {
    let filteredSectors = [...sectorsDB];

    if (filters.sectors && filters.sectors.length > 0) {
      filteredSectors = filteredSectors.filter(s => 
        filters.sectors!.includes(s.name)
      );
    }

    // Aqui você pode adicionar mais lógica de filtro baseada em timeRange, metric, region
    
    return filteredSectors;
  }

  // Filtros
  static getFilterData(): FilterData {
    return filterData;
  }

  // Estatísticas gerais
  static getOverallStats() {
    const totalProduction = sectorsDB.reduce((sum, s) => sum + s.production, 0);
    const totalRevenue = sectorsDB.reduce((sum, s) => sum + s.revenue, 0);
    const avgEfficiency = sectorsDB.reduce((sum, s) => sum + s.efficiency, 0) / sectorsDB.length;
    const avgSustainability = sectorsDB.reduce((sum, s) => sum + s.sustainability, 0) / sectorsDB.length;
    const totalArea = sectorsDB.reduce((sum, s) => sum + s.area, 0);
    const totalWorkers = sectorsDB.reduce((sum, s) => sum + s.workers, 0);

    return {
      totalProduction,
      totalRevenue,
      avgEfficiency: Math.round(avgEfficiency * 10) / 10,
      avgSustainability: Math.round(avgSustainability * 10) / 10,
      totalArea,
      totalWorkers,
      sectorsCount: sectorsDB.length
    };
  }

  // Simular problemas e gerar notificações automáticas
  static checkForProblems(): void {
    const now = new Date();
    
    // Verificar eficiência baixa
    sectorsDB.forEach(sector => {
      if (sector.efficiency < 80 && !notificationsDB.some(n => 
        n.sector === sector.id && 
        n.type === 'warning' && 
        n.title.includes('Eficiência') &&
        (now.getTime() - n.timestamp.getTime()) < 24 * 60 * 60 * 1000 // últimas 24h
      )) {
        this.addNotification({
          type: 'warning',
          title: `Eficiência Baixa: ${sector.name}`,
          message: `Eficiência do setor ${sector.name} está em ${sector.efficiency}%, abaixo da meta de 85%.`,
          sector: sector.id,
          read: false,
          priority: 'média'
        });
      }

      // Verificar sustentabilidade baixa
      if (sector.sustainability < 70 && !notificationsDB.some(n => 
        n.sector === sector.id && 
        n.type === 'info' && 
        n.title.includes('Sustentabilidade') &&
        (now.getTime() - n.timestamp.getTime()) < 24 * 60 * 60 * 1000
      )) {
        this.addNotification({
          type: 'info',
          title: `Oportunidade de Melhoria: ${sector.name}`,
          message: `Score de sustentabilidade do setor ${sector.name} pode ser melhorado (atual: ${sector.sustainability}).`,
          sector: sector.id,
          read: false,
          priority: 'baixa'
        });
      }
    });
  }
}

