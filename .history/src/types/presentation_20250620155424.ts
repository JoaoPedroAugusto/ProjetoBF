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
  isFullscreen?: boolean;
}

export interface Media {
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'mixed' | 'fullscreen-background';
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: string;
  backgroundOpacity?: number;
  fullscreenBackground?: boolean;
  hideTitle?: boolean;
  hideContent?: boolean;
  order: number;
  media?: Media;
  mediaElements?: MediaElement[];
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