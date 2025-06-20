export interface MediaElement {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt?: string;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex?: number;
  opacity?: number;
  borderRadius?: number;
  rotation?: number;
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'mixed' | 'fullscreen-background';
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: string;
  backgroundOpacity?: number;
  fullscreenBackground?: boolean;
  hideTitle?: boolean;
  hideContent?: boolean;
  order: number;
  mediaElements?: MediaElement[];
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SlidePresentation {
  id: string;
  sectorId: string;
  title: string;
  description: string;
  slides: Slide[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PresentationSettings {
  autoAdvance: boolean;
  autoAdvanceDelay: number;
  showControls: boolean;
  allowFullscreen: boolean;
  theme: 'light' | 'dark';
}

// Interfaces adicionais para melhor gestão de mídia
export interface MediaLibraryItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: number;
  uploadDate: Date;
  isObjectURL?: boolean; // Flag para identificar Object URLs que precisam ser limpos
}

export interface StorageInfo {
  used: number; // MB usado
  available: number; // MB disponível
  percentage: number; // Porcentagem usada
}

// Tipos para gestão de estado do editor
export interface DragState {
  isDragging: boolean;
  elementId: string | null;
  startX: number;
  startY: number;
  startElementX: number;
  startElementY: number;
  previewRect: DOMRect | null;
}

export interface ResizeState {
  isResizing: boolean;
  elementId: string | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startElementX: number;
  startElementY: number;
  handle: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;
}

