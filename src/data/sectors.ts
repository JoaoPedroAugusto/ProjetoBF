import { 
  Wheat, Leaf, Coffee, Beef, Cherry, Fish, Banana as BananaIcon, 
  Flower, Scissors 
} from 'lucide-react';
import { IconType } from 'react-router-dom';
import cotton from '../public/img/Algodão.webp'

export interface Sector {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  coverImage?: string;
  statistics: {
    globalOutput: string;
    mainRegions: string[];
    annualGrowth: string;
    imagem?: string;
  };
  techniques: string[];
  ana?: string[];
  commonIssues: {
    name: string;
    description: string;
  }[];
  marketInfo: {
    currentPrice: string;
    trend: 'up' | 'down' | 'stable';
    forecast: string;
  };
  sustainability: string[];
  regulations: string[];
  // NOVAS PROPRIEDADES
  challengesAndInnovations? :{ // Desafios e Inovações
    challenge: string;
    innovation: string;
  }[];
  productApplications?: string[]; // Aplicações do Produto
  keyStakeholders?: { // Principais Intervenientes
    name: string;
    role: string;
  }[];
}

export const sectors: Sector[] = [
  {
    id: 'sugarcane',
    name: 'Cana-de-Açúcar',
    description: 'A cana-de-açúcar é uma grama perene alta do gênero Saccharum, nativa de regiões de clima temperado quente a tropical do Sul da Ásia e da Melanésia. É cultivada principalmente por seu suco, do qual são derivados açúcar, etanol e outros produtos.',
    icon: Wheat,
    coverImage: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg',
    statistics: {
      globalOutput: '1.9 billion tons annually',
      mainRegions: ['Brazil', 'India', 'China', 'Thailand', 'Pakistan'],
      annualGrowth: '3.5%',
    },
    techniques: [
      'Plant spacing of 1.5m between rows',
      'Irrigation management with drip systems',
      'Mechanized harvesting methods',
      'Precision fertilization techniques',
      'Plant spacing of 1.5m between rows',
      'Irrigation management with drip systems',
      'Mechanized harvesting methods',
      'Precision fertilization techniques',
      'Irrigation management with drip systems',
      'Mechanized harvesting methods',
      'Precision fertilization techniques',
      'Irrigation management with drip systems',
      'Mechanized harvesting methods',
      'Precision fertilization techniques'
    ],
    ana:[
      'hasdasdasd'
    ],
    commonIssues: [
      {
        name: 'Red rot disease',
        description: 'Fungal disease that causes internal reddening and drying of the stalk.',
      },
      {
        name: 'Sugarcane borers',
        description: 'Insect pests that tunnel through stalks, reducing sugar content and yield.'
      }
    ],
    marketInfo: {
      currentPrice: '$0.15 per pound',
      trend: 'up',
      forecast: 'Increasing demand for ethanol is expected to drive prices up in the coming year.'
    },
    sustainability: [
      'Crop rotation with legumes to improve soil health',
      'Reduction of water usage through precision irrigation',
      'Use of bagasse for bioenergy production',
      'Minimizing chemical fertilizer through organic alternatives'
    ],
    regulations: [
      'Environmental licensing requirements for processing plants',
      'Water usage restrictions in drought-prone regions',
      'Emissions standards for sugar mills and ethanol plants'
    ],
    
  },







  
  {
    id: 'cotton',
    name: 'Algodão',
    description: 'Cotton is a soft, fluffy staple fiber that grows in a boll around the seeds of cotton plants. The fiber is most often spun into yarn or thread and used to make a soft, breathable textile.',
    icon: Scissors,
    coverImage: '{cotton}',
    statistics: {
      globalOutput: '25 million tons annually',
      mainRegions: ['China', 'India', 'United States', 'Brazil', 'Pakistan'],
      annualGrowth: '2.1%'
    },
    techniques: [
      'Precision planting with GPS guidance',
      'Integrated pest management approaches',
      'Regulated deficit irrigation',
      'Mechanical harvesting with cotton pickers'
      
    ],
    
    commonIssues: [
      {
        name: 'Boll weevil',
        description: 'Insect that feeds on cotton buds and flowers, causing significant crop damage.'
      },
      {
        name: 'Cotton leaf curl virus',
        description: 'Viral disease transmitted by whiteflies that causes leaf curling and stunted growth.'
      
      }
    ],
    marketInfo: {
      currentPrice: '$0.75 per pound',
      trend: 'stable',
      forecast: 'Prices expected to remain stable with increasing competition from synthetic fibers.'
    },
    sustainability: [
      'Organic cotton farming practices',
      'Water conservation through drought-resistant varieties',
      'Reduced pesticide use with GMO cotton varieties',
      'Cover cropping to prevent soil erosion'
    ],
    regulations: [
      'Restrictions on certain pesticides in major producing countries',
      'Labeling requirements for organic and sustainable cotton',
      'Import/export regulations and tariffs'
    ]
  },










  {
    id: 'cocoa',
    name: 'Cacau',
    description: 'Cocoa is the dried and fully fermented seed of Theobroma cacao, from which cocoa solids and cocoa butter are extracted. These are the basis of chocolate, as well as many other products.',
    icon: Coffee,
    coverImage: 'https://images.pexels.com/photos/2679937/pexels-photo-2679937.jpeg',
    statistics: {
      globalOutput: '4.8 million tons annually',
      mainRegions: ['Ivory Coast', 'Ghana', 'Ecuador', 'Cameroon', 'Nigeria'],
      annualGrowth: '2.8%'
    },
    techniques: [
      'Shade-grown cultivation under forest canopy',
      'Fermentation techniques for flavor development',
      'Pruning methods for disease management',
      'Post-harvest processing for quality control'
    ],
    commonIssues: [
      {
        name: 'Black pod disease',
        description: 'Fungal disease causing pods to turn black and rot.'
      },
      {
        name: 'Cocoa swollen shoot virus',
        description: 'Viral disease causing swollen shoots, leaf reddening, and eventually tree death.'
      }
    ],
    marketInfo: {
      currentPrice: '$2.50 per kilogram',
      trend: 'up',
      forecast: 'Growing global chocolate demand driving prices upward despite production increases.'
    },
    sustainability: [
      'Agroforestry systems that preserve biodiversity',
      'Fair trade certification for better farmer livelihoods',
      'Water conservation practices in processing',
      'Organic cultivation methods reducing chemical inputs'
    ],
    regulations: [
      'Child labor restrictions in cocoa production',
      'Certification standards for sustainable cocoa',
      'Quality standards for export markets'
    ]
  },













  {
    id: 'meat',
    name: 'Carne',
    description: 'Meat production encompasses the rearing and processing of livestock animals for human consumption, including cattle, poultry, pigs, and other species. This sector is vital for global protein supply.',
    icon: Beef,
    coverImage: 'https://images.pexels.com/photos/753/food-dinner-lunch-chicken.jpg',
    statistics: {
      globalOutput: '340 million tons annually',
      mainRegions: ['United States', 'China', 'Brazil', 'European Union', 'India'],
      annualGrowth: '1.7%'
    },
    techniques: [
      'Rotational grazing systems for cattle',
      'Climate-controlled housing for poultry',
      'Precision feeding technologies',
      'Genetic selection for improved productivity'
    ],
    commonIssues: [
      {
        name: 'Foot and mouth disease',
        description: 'Highly contagious viral disease affecting cloven-hoofed animals.'
      },
      {
        name: 'Avian influenza',
        description: 'Viral infection that can cause high mortality in poultry flocks.'
      }
    ],
    marketInfo: {
      currentPrice: 'Beef: $4.50/kg, Poultry: $2.20/kg',
      trend: 'stable',
      forecast: 'Increasing demand in developing countries balanced by plant-based alternatives in developed markets.'
    },
    sustainability: [
      'Methane reduction through feed additives',
      'Manure management for reduced environmental impact',
      'Pasture-based systems for improved animal welfare',
      'Reduced antibiotic use through improved management'
    ],
    regulations: [
      'Animal welfare standards for housing and transportation',
      'Slaughter regulations for humane practices',
      'Antibiotic use restrictions in major markets',
      'Environmental regulations for waste management'
    ]
  },















  {
    id: 'tomato',
    name: 'Tomate',
    description: 'Tomatoes are the edible berry of the plant Solanum lycopersicum, cultivated worldwide for their nutritional value and culinary versatility. They are a key ingredient in many cuisines and are processed into various products.',
    icon: Cherry,
    coverImage: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    statistics: {
      globalOutput: '180 million tons annually',
      mainRegions: ['China', 'India', 'United States', 'Turkey', 'Egypt'],
      annualGrowth: '3.0%'
    },
    techniques: [
      'Greenhouse cultivation with hydroponics',
      'Drip irrigation and fertigation systems',
      'Trellising methods for improved air circulation',
      'Integrated pest management for disease control'
    ],
    commonIssues: [
      {
        name: 'Early blight',
        description: 'Fungal disease causing dark spots on lower leaves and stems.'
      },
      {
        name: 'Tomato hornworm',
        description: 'Large caterpillar pest that defoliates plants rapidly.'
      }
    ],
    marketInfo: {
      currentPrice: '$1.20 per kilogram',
      trend: 'up',
      forecast: 'Growing demand for fresh and processed tomato products driving steady price increases.'
    },
    sustainability: [
      'Water recycling in greenhouse systems',
      'Biological pest control reducing chemical usage',
      'Energy-efficient greenhouse technologies',
      'Reduced food miles through local production'
    ],
    regulations: [
      'Pesticide residue limits for fresh market',
      'Quality standards for processing tomatoes',
      'Greenhouse emissions regulations in some regions'
    ]
  },












  {
    id: 'aquaculture',
    name: 'Piscicultura',
    description: 'Aquaculture involves the breeding, rearing, and harvesting of fish, shellfish, and aquatic plants in controlled environments. It has become increasingly important for global seafood supply as wild fisheries face pressure.',
    icon: Fish,
    coverImage: 'https://images.pexels.com/photos/2156311/pexels-photo-2156311.jpeg',
    statistics: {
      globalOutput: '82 million tons annually',
      mainRegions: ['China', 'Indonesia', 'India', 'Vietnam', 'Bangladesh'],
      annualGrowth: '5.3%'
    },
    techniques: [
      'Recirculating aquaculture systems (RAS)',
      'Integrated multi-trophic aquaculture',
      'Pond culture with aeration systems',
      'Cage culture in open waters'
    ],
    commonIssues: [
      {
        name: 'White spot syndrome',
        description: 'Viral disease affecting shrimp with high mortality rates.'
      },
      {
        name: 'Sea lice infestation',
        description: 'Parasitic crustaceans affecting farmed salmon health and marketability.'
      }
    ],
    marketInfo: {
      currentPrice: 'Tilapia: $2.30/kg, Shrimp: $8.50/kg',
      trend: 'up',
      forecast: 'Strong growth expected as seafood demand increases and wild-caught supply limitations continue.'
    },
    sustainability: [
      'Alternative feed ingredients reducing wild fish dependency',
      'Water quality monitoring and management',
      'Disease prevention through biosecurity measures',
      'Reduced environmental impact through closed systems'
    ],
    regulations: [
      'Environmental impact assessment requirements',
      'Antibiotic use restrictions',
      'Water discharge quality standards',
      'Location permits for cage culture operations'
    ]
  },











  {
    id: 'banana',
    name: 'Banana',
    description: 'Bananas are one of the world\'s most important fruit crops, grown throughout tropical and subtropical regions. They are consumed both as a fresh fruit and in processed forms, and are a vital source of nutrition.',
    icon: BananaIcon,
    coverImage: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg',
    statistics: {
      globalOutput: '114 million tons annually',
      mainRegions: ['India', 'China', 'Philippines', 'Ecuador', 'Brazil'],
      annualGrowth: '3.3%'
    },
    techniques: [
      'High-density planting systems',
      'Sucker selection for propagation',
      'Bunch bagging for quality improvement',
      'Drip irrigation with fertigation'
    ],
    commonIssues: [
      {
        name: 'Panama disease (Fusarium wilt)',
        description: 'Soil-borne fungal disease causing plant wilting and death.'
      },
      {
        name: 'Black Sigatoka',
        description: 'Fungal leaf spot disease reducing photosynthetic area and yield.'
      }
    ],
    marketInfo: {
      currentPrice: '$0.95 per kilogram',
      trend: 'stable',
      forecast: 'Stable pricing with potential disruptions from disease pressures on major varieties.'
    },
    sustainability: [
      'Organic banana production systems',
      'Disease-resistant variety development',
      'Reduced pesticide use through integrated pest management',
      'Agroforestry systems in smallholder production'
    ],
    regulations: [
      'Phytosanitary certificates for international trade',
      'Maximum residue limits for pesticides',
      'Fair trade certification standards',
      'Organic production guidelines'
    ]
  },
















  {

    id: 'soy',
    name: 'Soja',
    description: 'Soybeans are legumes native to East Asia, now grown globally as one of the most important oilseed crops. They are processed for oil, protein, and numerous food products, and are a major livestock feed ingredient.',
    icon: Leaf,
    coverImage: 'https://images.pexels.com/photos/7958277/pexels-photo-7958277.jpeg',
    statistics: {
      globalOutput: '350 million tons annually',
      mainRegions: ['United States', 'Brazil', 'Argentina', 'China', 'India'],
      annualGrowth: '4.1%'
    },
    techniques: [
      'No-till or reduced tillage systems',
      'Precision planting with variable rate technology',
      'Inoculation with nitrogen-fixing bacteria',
      'Crop rotation with corn or wheat'
    ],
    commonIssues: [
      {
        name: 'Soybean rust',
        description: 'Fungal disease causing premature defoliation and yield loss.'
      },
      {
        name: 'Soybean cyst nematode',
        description: 'Microscopic roundworm that damages roots and reduces yields.'
      }
    ],
    marketInfo: {
      currentPrice: '$14.30 per bushel',
      trend: 'up',
      forecast: 'Strong demand for protein feed and vegetable oil expected to support prices.'
    },
    sustainability: [
      'Cover cropping to reduce soil erosion',
      'Precision agriculture reducing input use',
      'Certification programs for deforestation-free production',
      'Water conservation through drought-resistant varieties'
    ],
    regulations: [
      'Land use restrictions in sensitive ecosystems',
      'GMO labeling requirements in certain markets',
      'Maximum residue limits for herbicides',
      'International trade policies and tariffs'
    ]
  },















  
  {
    id: 'sheep',
    name: 'Ovinocultura',
    description: 'Sheep farming involves raising sheep for wool, meat (lamb and mutton), and milk production. Sheep are adaptable to various climates and can utilize marginal lands unsuitable for crop production.',
    icon: Flower,
    coverImage: 'https://images.pexels.com/photos/288621/pexels-photo-288621.jpeg',
    statistics: {
      globalOutput: '9.3 million tons of meat annually',
      mainRegions: ['China', 'Australia', 'New Zealand', 'United Kingdom', 'Turkey'],
      annualGrowth: '1.8%'
    },
    techniques: [
      'Rotational grazing management',
      'Strategic breeding and lambing seasons',
      'Flock health monitoring systems',
      'Shearing techniques for wool quality'
    ],
    commonIssues: [
      {
        name: 'Footrot',
        description: 'Bacterial infection causing lameness and reduced productivity.'
      },
      {
        name: 'Internal parasites',
        description: 'Worm infestations requiring regular monitoring and treatment programs.'
      }
    ],
    marketInfo: {
      currentPrice: 'Lamb: $6.80/kg, Wool: $5.20/kg',
      trend: 'stable',
      forecast: 'Stable meat prices with premium for grass-fed, wool prices fluctuating with textile demand.'
    },
    sustainability: [
      'Carbon sequestration through managed grazing',
      'Landscape conservation through appropriate stocking rates',
      'Genetic selection for parasite resistance',
      'By-product utilization (lanolin, pelts)'
    ],
    regulations: [
      'Animal identification and traceability requirements',
      'Welfare standards for transportation and housing',
      'Medication use restrictions and withdrawal periods',
      'Export certification requirements'
    ]
  }
];