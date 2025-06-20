import * as THREE from 'three';
import { ModelProps } from './types';
import { setupBasicScene } from './CommonElements';
import { createSugarcaneField } from './SugarcaneModel';
import { createCottonField } from './CottonModel';
import { createCocoaPlantation } from './CocoaModel';
import { createCattleFarm } from './CattleModel';
import { createTomatoGreenhouse } from './TomatoModel';
import { createFishFarm } from './FishFarmModel';
import { createBananaPlantation } from './BananaModel';
import { createSoyField } from './SoyModel';
import { createSheepFarm } from './SheepModel';
import { createDefaultFarm } from './DefaultFarmModel';

// Exporta a função principal que seleciona o modelo correto com base no ID do setor
export const createSectorModel = (scene: THREE.Scene, sectorId: string) => {
  if (!scene) return;
  
  // Configura a cena básica (luzes, plano de fundo, etc.)
  setupBasicScene(scene);
  
  // Seleciona o modelo correto com base no ID do setor
  switch(sectorId) {
    case 'sugarcane':
      createSugarcaneField({ scene });
      break;
    case 'cotton':
      createCottonField({ scene });
      break;
    case 'cocoa':
      createCocoaPlantation({ scene });
      break;
    case 'meat':
      createCattleFarm({ scene });
      break;
    case 'tomato':
      createTomatoGreenhouse({ scene });
      break;
    case 'aquaculture':
      createFishFarm({ scene });
      break;
    case 'banana':
      createBananaPlantation({ scene });
      break;
    case 'soy':
      createSoyField({ scene });
      break;
    case 'sheep':
      createSheepFarm({ scene });
      break;
    default:
      createDefaultFarm({ scene });
  }
};
