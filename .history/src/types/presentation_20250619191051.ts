// Tipos para o sistema de apresentação de slides
export interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'mixed';
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SlidePresentation {
  id: string;
  sectorId: string;
  title: string;
  description?: string;
  slides: Slide[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PresentationSettings {
  autoAdvance: boolean;
  autoAdvanceDelay: number; // em segundos
  showControls: boolean;
  allowFullscreen: boolean;
  theme: 'light' | 'dark' | 'custom';
}

export interface PresentationState {
  currentSlideIndex: number;
  isFullscreen: boolean;
  isPlaying: boolean;
  presentations: SlidePresentation[];
  currentPresentation: SlidePresentation | null;
}

