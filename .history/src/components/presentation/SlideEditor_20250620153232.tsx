import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, Video, Save, X, Move, Eye, EyeOff, Copy, Layers, RotateCw, Maximize2, Minimize2, Database, Upload, Trash, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw, Palette, Play, Pause, Volume2, VolumeX, Grid, Lock, Unlock, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Sliders } from 'lucide-react';
import { Slide, MediaElement } from './types/presentation';

interface SlideEditorProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
  sectorId: string;
}

interface DragState {
  isDragging: boolean;
  elementId: string | null;
  startX: number;
  startY: number;
  startElementX: number;
  startElementY: number;
  previewRect: DOMRect | null;
}

interface ResizeState {
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

interface MediaLibraryItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: number;
  uploadDate: Date;
  isObjectURL?: boolean; // Flag para identificar Object URLs
}

// Constantes para dimensões consistentes
const EDITOR_WIDTH = 1200;
const EDITOR_HEIGHT = 675; // 16:9 aspect ratio

// Gerenciador de Object URLs para limpeza de memória
class MediaURLManager {
  private static instance: MediaURLManager;
  private objectURLs: Map<string, string> = new Map();
  private urlToId: Map<string, string> = new Map();

  static getInstance(): MediaURLManager {
    if (!MediaURLManager.instance) {
      MediaURLManager.instance = new MediaURLManager();
    }
    return MediaURLManager.instance;
  }

  createObjectURL(file: File, id: string): string {
    // Revogar URL anterior se existir
    this.revokeObjectURL(id);
    
    const url = URL.createObjectURL(file);
    this.objectURLs.set(id, url);
    this.urlToId.set(url, id);
    return url;
  }

  revokeObjectURL(id: string): void {
    const url = this.objectURLs.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      this.objectURLs.delete(id);
      this.urlToId.delete(url);
    }
  }

  revokeAllObjectURLs(): void {
    this.objectURLs.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.objectURLs.clear();
    this.urlToId.clear();
  }

  isObjectURL(url: string): boolean {
    return this.urlToId.has(url);
  }

  getIdFromURL(url: string): string | undefined {
    return this.urlToId.get(url);
  }
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slides,
  onSlidesChange,
  sectorId
}) => {
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMediaElement, setSelectedMediaElement] = useState<string | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<MediaLibraryItem[]>([]);
  const [storageUsage, setStorageUsage] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [videoPreviewStates, setVideoPreviewStates] = useState<Map<string, boolean>>(new Map());
  const [lockedElements, setLockedElements] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    startElementX: 0,
    startElementY: 0,
    previewRect: null
  });
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    elementId: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startElementX: 0,
    startElementY: 0,
    handle: null
  });
  
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaURLManager = MediaURLManager.getInstance();

  // Carregar biblioteca de mídia
  useEffect(() => {
    loadMediaLibrary();
    calculateStorageUsage();
  }, []);

  // Limpeza de Object URLs quando o componente é desmontado
  useEffect(() => {
    return () => {
      mediaURLManager.revokeAllObjectURLs();
    };
  }, []);

  // Atalhos de teclado estilo Canva
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Só processar se não estiver em um input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Shift + P para apresentação (será implementado no PresentationManager)
      if (event.shiftKey && (event.key === 'p' || event.key === 'P')) {
        event.preventDefault();
        console.log('Atalho Shift+P detectado - implementar no PresentationManager');
        return;
      }

      // Outros atalhos
      switch (event.key) {
        case 'Delete':
        case 'Backspace':
          if (selectedMediaElement) {
            event.preventDefault();
            removeMediaElement(selectedMediaElement);
          }
          break;
        case 'c':
        case 'C':
          if (event.ctrlKey && selectedMediaElement) {
            event.preventDefault();
            duplicateMediaElement(selectedMediaElement);
          }
          break;
        case 'g':
        case 'G':
          if (event.ctrlKey) {
            event.preventDefault();
            setShowGrid(!showGrid);
          }
          break;
        case 'l':
        case 'L':
          if (event.ctrlKey && selectedMediaElement) {
            event.preventDefault();
            toggleElementLock(selectedMediaElement);
          }
          break;
      }

      // Movimento com setas
      if (selectedMediaElement && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        const moveAmount = event.shiftKey ? 1 : gridSize; // Shift para movimento fino
        
        switch (event.key) {
          case 'ArrowUp':
            moveElement(selectedMediaElement, 'up', moveAmount);
            break;
          case 'ArrowDown':
            moveElement(selectedMediaElement, 'down', moveAmount);
            break;
          case 'ArrowLeft':
            moveElement(selectedMediaElement, 'left', moveAmount);
            break;
          case 'ArrowRight':
            moveElement(selectedMediaElement, 'right', moveAmount);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedMediaElement, showGrid, gridSize]);

  const loadMediaLibrary = () => {
    try {
      const saved = localStorage.getItem('media-library');
      if (saved) {
        const library = JSON.parse(saved);
        setMediaLibrary(library.map((item: any) => ({
          ...item,
          uploadDate: new Date(item.uploadDate)
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar biblioteca de mídia:', error);
    }
  };

  const saveMediaLibrary = (library: MediaLibraryItem[]) => {
    try {
      // Filtrar apenas itens que não são Object URLs para salvar no localStorage
      const libraryToSave = library.filter(item => !item.isObjectURL);
      localStorage.setItem('media-library', JSON.stringify(libraryToSave));
      setMediaLibrary(library);
      calculateStorageUsage();
    } catch (error) {
      console.error('Erro ao salvar biblioteca de mídia:', error);
      alert('Erro ao salvar mídia. Espaço de armazenamento pode estar cheio.');
    }
  };

  const calculateStorageUsage = () => {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length;
        }
      }
      // Converter para MB (aproximado)
      const usageMB = totalSize / (1024 * 1024);
      setStorageUsage(Math.min(usageMB, 1024)); // Máximo 1GB
    } catch (error) {
      console.error('Erro ao calcular uso de armazenamento:', error);
    }
  };

  const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.9): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image(); // Usar window.Image explicitamente
      
      img.onload = () => {
        // Calcular dimensões mantendo proporção
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem com alta qualidade
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Converter para base64 com qualidade especificada
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } else {
          reject(new Error('Não foi possível obter contexto do canvas'));
        }
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  };

  const addToMediaLibrary = async (file: File): Promise<string> => {
    try {
      let url: string;
      let isObjectURL = false;
      
      if (file.type.startsWith('image/')) {
        // Para imagens, comprimir e salvar como base64
        url = await compressImage(file, 1920, 0.9);
      } else if (file.type.startsWith('video/')) {
        // Para vídeos, usar Object URL para evitar problemas de armazenamento
        if (file.size > 50 * 1024 * 1024) { // 50MB limit for videos
          throw new Error('Arquivo de vídeo muito grande. Máximo 50MB.');
        }
        
        const mediaId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        url = mediaURLManager.createObjectURL(file, mediaId);
        isObjectURL = true;
      } else {
        throw new Error('Tipo de arquivo não suportado. Use apenas imagens ou vídeos.');
      }

      const mediaItem: MediaLibraryItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url,
        size: isObjectURL ? file.size : url.length,
        uploadDate: new Date(),
        isObjectURL
      };

      // Verificar se já existe (apenas para imagens base64)
      if (!isObjectURL) {
        const existing = mediaLibrary.find(item => 
          item.name === file.name && 
          Math.abs(item.size - mediaItem.size) < 1000 &&
          !item.isObjectURL
        );
        if (existing) {
          return existing.url;
        }
      }

      const newLibrary = [...mediaLibrary, mediaItem];
      saveMediaLibrary(newLibrary);
      return url;
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      throw error;
    }
  };

  const removeFromMediaLibrary = (id: string) => {
    const item = mediaLibrary.find(item => item.id === id);
    if (item && item.isObjectURL) {
      mediaURLManager.revokeObjectURL(id);
    }
    
    const newLibrary = mediaLibrary.filter(item => item.id !== id);
    saveMediaLibrary(newLibrary);
  };

  const createNewSlide = (): Slide => ({
    id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Novo Slide',
    content: 'Conteúdo do slide...',
    type: 'text',
    backgroundColor: '#1e40af',
    textColor: '#ffffff',
    order: slides.length,
    mediaElements: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const handleAddSlide = () => {
    const newSlide = createNewSlide();
    setEditingSlide(newSlide);
    setIsCreating(true);
  };

  const handleEditSlide = (slide: Slide) => {
    setEditingSlide({ ...slide });
    setIsCreating(false);
    setSelectedMediaElement(null);
  };

  const handleSaveSlide = () => {
    if (!editingSlide) return;

    const updatedSlide = {
      ...editingSlide,
      updatedAt: new Date()
    };

    if (isCreating) {
      onSlidesChange([...slides, updatedSlide]);
    } else {
      const updatedSlides = slides.map(slide => 
        slide.id === editingSlide.id ? updatedSlide : slide
      );
      onSlidesChange(updatedSlides);
    }

    setEditingSlide(null);
    setIsCreating(false);
    setSelectedMediaElement(null);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (confirm('Tem certeza que deseja excluir este slide?')) {
      const updatedSlides = slides.filter(slide => slide.id !== slideId);
      onSlidesChange(updatedSlides);
    }
  };

  const handleMoveSlide = (slideId: string, direction: 'up' | 'down') => {
    const slideIndex = slides.findIndex(slide => slide.id === slideId);
    if (slideIndex === -1) return;

    const newIndex = direction === 'up' ? slideIndex - 1 : slideIndex + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const updatedSlides = [...slides];
    [updatedSlides[slideIndex], updatedSlides[newIndex]] = [updatedSlides[newIndex], updatedSlides[slideIndex]];
    
    updatedSlides.forEach((slide, index) => {
      slide.order = index;
    });

    onSlidesChange(updatedSlides);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file || !editingSlide) return;

    try {
      const url = await addToMediaLibrary(file);
      addMediaElementToSlide(url, type, file.name);
      
      // Limpar o input para permitir upload do mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da mídia: ' + (error as Error).message);
    }
  };

  const addMediaElementFromLibrary = (libraryItem: MediaLibraryItem) => {
    if (!editingSlide) return;
    addMediaElementToSlide(libraryItem.url, libraryItem.type, libraryItem.name);
    setShowMediaLibrary(false);
  };

  const snapToGridValue = (value: number): number => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const addMediaElementToSlide = (url: string, type: 'image' | 'video', name: string) => {
    if (!editingSlide) return;

    // Posições baseadas nas dimensões fixas do editor com snap to grid
    const baseX = snapToGridValue(100);
    const baseY = snapToGridValue(100);

    const newMediaElement: MediaElement = {
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      url,
      alt: name,
      width: type === 'image' ? 300 : 400,
      height: type === 'image' ? 200 : 225,
      x: baseX,
      y: baseY,
      zIndex: (editingSlide.mediaElements?.length || 0) + 1,
      opacity: 1,
      borderRadius: 8,
      rotation: 0
    };

    const updatedSlide = {
      ...editingSlide,
      mediaElements: [...(editingSlide.mediaElements || []), newMediaElement],
      type: 'mixed' as const
    };

    setEditingSlide(updatedSlide);
    setSelectedMediaElement(newMediaElement.id);
  };

  const updateMediaElement = (elementId: string, updates: Partial<MediaElement>) => {
    if (!editingSlide) return;

    // Aplicar snap to grid nas posições
    if (updates.x !== undefined) {
      updates.x = snapToGridValue(updates.x);
    }
    if (updates.y !== undefined) {
      updates.y = snapToGridValue(updates.y);
    }

    const updatedElements = editingSlide.mediaElements?.map(element =>
      element.id === elementId ? { ...element, ...updates } : element
    ) || [];

    setEditingSlide({
      ...editingSlide,
      mediaElements: updatedElements
    });
  };

  const removeMediaElement = (elementId: string) => {
    if (!editingSlide) return;

    const updatedElements = editingSlide.mediaElements?.filter(element => element.id !== elementId) || [];
    
    setEditingSlide({
      ...editingSlide,
      mediaElements: updatedElements,
      type: updatedElements.length === 0 ? 'text' : editingSlide.type
    });
    
    if (selectedMediaElement === elementId) {
      setSelectedMediaElement(null);
    }
  };

  const duplicateMediaElement = (elementId: string) => {
    if (!editingSlide) return;

    const element = editingSlide.mediaElements?.find(el => el.id === elementId);
    if (!element) return;

    const newElement: MediaElement = {
      ...element,
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: snapToGridValue(element.x + 20),
      y: snapToGridValue(element.y + 20),
      zIndex: (editingSlide.mediaElements?.length || 0) + 1
    };

    setEditingSlide({
      ...editingSlide,
      mediaElements: [...(editingSlide.mediaElements || []), newElement]
    });

    setSelectedMediaElement(newElement.id);
  };

  const bringToFront = (elementId: string) => {
    if (!editingSlide?.mediaElements) return;

    const maxZ = Math.max(...editingSlide.mediaElements.map(el => el.zIndex || 1));
    updateMediaElement(elementId, { zIndex: maxZ + 1 });
  };

  const sendToBack = (elementId: string) => {
    if (!editingSlide?.mediaElements) return;

    const minZ = Math.min(...editingSlide.mediaElements.map(el => el.zIndex || 1));
    updateMediaElement(elementId, { zIndex: Math.max(1, minZ - 1) });
  };

  const toggleElementLock = (elementId: string) => {
    const newLockedElements = new Set(lockedElements);
    if (newLockedElements.has(elementId)) {
      newLockedElements.delete(elementId);
    } else {
      newLockedElements.add(elementId);
    }
    setLockedElements(newLockedElements);
  };

  const toggleVideoPreview = (elementId: string) => {
    const newStates = new Map(videoPreviewStates);
    newStates.set(elementId, !newStates.get(elementId));
    setVideoPreviewStates(newStates);
  };

  // Funções de movimento preciso
  const moveElement = (elementId: string, direction: 'up' | 'down' | 'left' | 'right', amount: number = gridSize) => {
    const element = editingSlide?.mediaElements?.find(el => el.id === elementId);
    if (!element || lockedElements.has(elementId)) return;

    let newX = element.x;
    let newY = element.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, snapToGridValue(element.y - amount));
        break;
      case 'down':
        newY = Math.min(EDITOR_HEIGHT - element.height, snapToGridValue(element.y + amount));
        break;
      case 'left':
        newX = Math.max(0, snapToGridValue(element.x - amount));
        break;
      case 'right':
        newX = Math.min(EDITOR_WIDTH - element.width, snapToGridValue(element.x + amount));
        break;
    }

    updateMediaElement(elementId, { x: newX, y: newY });
  };

  // Funções de redimensionamento preciso
  const resizeElement = (elementId: string, type: 'width' | 'height', delta: number) => {
    const element = editingSlide?.mediaElements?.find(el => el.id === elementId);
    if (!element || lockedElements.has(elementId)) return;

    const updates: Partial<MediaElement> = {};

    if (type === 'width') {
      const newWidth = Math.max(50, Math.min(EDITOR_WIDTH - element.x, element.width + delta));
      updates.width = newWidth;
    } else {
      const newHeight = Math.max(50, Math.min(EDITOR_HEIGHT - element.y, element.height + delta));
      updates.height = newHeight;
    }

    updateMediaElement(elementId, updates);
  };

  // Funções de alinhamento
  const alignElement = (elementId: string, alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const element = editingSlide?.mediaElements?.find(el => el.id === elementId);
    if (!element || lockedElements.has(elementId)) return;

    let newX = element.x;
    let newY = element.y;

    switch (alignment) {
      case 'left':
        newX = 0;
        break;
      case 'center':
        newX = snapToGridValue((EDITOR_WIDTH - element.width) / 2);
        break;
      case 'right':
        newX = EDITOR_WIDTH - element.width;
        break;
      case 'top':
        newY = 0;
        break;
      case 'middle':
        newY = snapToGridValue((EDITOR_HEIGHT - element.height) / 2);
        break;
      case 'bottom':
        newY = EDITOR_HEIGHT - element.height;
        break;
    }

    updateMediaElement(elementId, { x: newX, y: newY });
  };

  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (lockedElements.has(elementId)) return;
    
    const element = editingSlide?.mediaElements?.find(el => el.id === elementId);
    if (!element || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    
    setSelectedMediaElement(elementId);
    setDragState({
      isDragging: true,
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      startElementX: element.x || 0,
      startElementY: element.y || 0,
      previewRect: rect
    });
  }, [editingSlide, lockedElements]);

  // Resize functionality
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, elementId: string, handle: ResizeState['handle']) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (lockedElements.has(elementId)) return;
    
    const element = editingSlide?.mediaElements?.find(el => el.id === elementId);
    if (!element) return;

    setResizeState({
      isResizing: true,
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.width || 400,
      startHeight: element.height || 300,
      startElementX: element.x || 0,
      startElementY: element.y || 0,
      handle
    });
  }, [editingSlide, lockedElements]);

  // Global mouse move and up handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Handle dragging
      if (dragState.isDragging && dragState.elementId && dragState.previewRect) {
        const deltaX = e.clientX - dragState.startX;
        const deltaY = e.clientY - dragState.startY;
        
        const element = editingSlide?.mediaElements?.find(el => el.id === dragState.elementId);
        if (!element) return;

        // Calcular nova posição baseada nas dimensões fixas do preview
        const scaleX = EDITOR_WIDTH / dragState.previewRect.width;
        const scaleY = EDITOR_HEIGHT / dragState.previewRect.height;
        
        const scaledDeltaX = deltaX * scaleX;
        const scaledDeltaY = deltaY * scaleY;
        
        const maxX = EDITOR_WIDTH - (element.width || 100);
        const maxY = EDITOR_HEIGHT - (element.height || 100);
        
        let newX = Math.max(0, Math.min(maxX, dragState.startElementX + scaledDeltaX));
        let newY = Math.max(0, Math.min(maxY, dragState.startElementY + scaledDeltaY));

        // Aplicar snap to grid
        newX = snapToGridValue(newX);
        newY = snapToGridValue(newY);

        updateMediaElement(dragState.elementId, { x: newX, y: newY });
      }

      // Handle resizing
      if (resizeState.isResizing && resizeState.elementId && resizeState.handle) {
        const deltaX = e.clientX - resizeState.startX;
        const deltaY = e.clientY - resizeState.startY;
        
        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;
        let newX = resizeState.startElementX;
        let newY = resizeState.startElementY;

        const minSize = 50;
        const maxWidth = EDITOR_WIDTH - newX;
        const maxHeight = EDITOR_HEIGHT - newY;

        switch (resizeState.handle) {
          case 'se':
            newWidth = Math.max(minSize, Math.min(maxWidth, resizeState.startWidth + deltaX));
            newHeight = Math.max(minSize, Math.min(maxHeight, resizeState.startHeight + deltaY));
            break;
          case 'sw':
            newWidth = Math.max(minSize, resizeState.startWidth - deltaX);
            newHeight = Math.max(minSize, Math.min(maxHeight, resizeState.startHeight + deltaY));
            newX = Math.max(0, resizeState.startElementX + (resizeState.startWidth - newWidth));
            break;
          case 'ne':
            newWidth = Math.max(minSize, Math.min(maxWidth, resizeState.startWidth + deltaX));
            newHeight = Math.max(minSize, resizeState.startHeight - deltaY);
            newY = Math.max(0, resizeState.startElementY + (resizeState.startHeight - newHeight));
            break;
          case 'nw':
            newWidth = Math.max(minSize, resizeState.startWidth - deltaX);
            newHeight = Math.max(minSize, resizeState.startHeight - deltaY);
            newX = Math.max(0, resizeState.startElementX + (resizeState.startWidth - newWidth));
            newY = Math.max(0, resizeState.startElementY + (resizeState.startHeight - newHeight));
            break;
          case 'n':
            newHeight = Math.max(minSize, resizeState.startHeight - deltaY);
            newY = Math.max(0, resizeState.startElementY + (resizeState.startHeight - newHeight));
            break;
          case 's':
            newHeight = Math.max(minSize, Math.min(maxHeight, resizeState.startHeight + deltaY));
            break;
          case 'e':
            newWidth = Math.max(minSize, Math.min(maxWidth, resizeState.startWidth + deltaX));
            break;
          case 'w':
            newWidth = Math.max(minSize, resizeState.startWidth - deltaX);
            newX = Math.max(0, resizeState.startElementX + (resizeState.startWidth - newWidth));
            break;
        }

        updateMediaElement(resizeState.elementId, { 
          width: Math.round(newWidth), 
          height: Math.round(newHeight),
          x: snapToGridValue(newX),
          y: snapToGridValue(newY)
        });
      }
    };

    const handleGlobalMouseUp = () => {
      setDragState({
        isDragging: false,
        elementId: null,
        startX: 0,
        startY: 0,
        startElementX: 0,
        startElementY: 0,
        previewRect: null
      });
      setResizeState({
        isResizing: false,
        elementId: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startElementX: 0,
        startElementY: 0,
        handle: null
      });
    };

    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [dragState, resizeState, updateMediaElement, editingSlide, snapToGrid, gridSize]);

  const selectedElement = editingSlide?.mediaElements?.find(el => el.id === selectedMediaElement);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Editor de Slides</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowMediaLibrary(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Database className="h-5 w-5" />
            <span>Biblioteca</span>
          </button>
          <button
            onClick={handleAddSlide}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Adicionar Slide</span>
          </button>
        </div>
      </div>

      {/* Atalhos de Teclado */}
      <div className="mb-4 bg-blue-50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Atalhos de Teclado:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
          <div><kbd className="bg-blue-200 px-1 rounded">Shift+P</kbd> Apresentar</div>
          <div><kbd className="bg-blue-200 px-1 rounded">Ctrl+C</kbd> Duplicar</div>
          <div><kbd className="bg-blue-200 px-1 rounded">Ctrl+G</kbd> Grid</div>
          <div><kbd className="bg-blue-200 px-1 rounded">Ctrl+L</kbd> Bloquear</div>
          <div><kbd className="bg-blue-200 px-1 rounded">Del</kbd> Excluir</div>
          <div><kbd className="bg-blue-200 px-1 rounded">Setas</kbd> Mover</div>
          <div><kbd className="bg-blue-200 px-1 rounded">Shift+Setas</kbd> Mover 1px</div>
          <div><kbd className="bg-blue-200 px-1 rounded">1-9</kbd> Ir para slide</div>
        </div>
      </div>

      {/* Storage Usage - Melhorado com alertas */}
      <div className="mb-4 bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Uso do Armazenamento</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{storageUsage.toFixed(1)}MB / 1024MB (1GB)</span>
            {storageUsage > 800 && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                Espaço baixo!
              </span>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              storageUsage > 800 ? 'bg-red-500' : storageUsage > 500 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min((storageUsage / 1024) * 100, 100)}%` }}
          />
        </div>
        {storageUsage > 800 && (
          <p className="text-xs text-red-600 mt-1">
            Recomendamos limpar a biblioteca de mídia ou usar vídeos menores.
          </p>
        )}
      </div>

      {/* Lista de Slides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500 font-medium">Slide {index + 1}</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleMoveSlide(slide.id, 'up')}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                  title="Mover para cima"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveSlide(slide.id, 'down')}
                  disabled={index === slides.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
                  title="Mover para baixo"
                >
                  ↓
                </button>
              </div>
            </div>
            
            <h3 className="font-medium text-gray-800 mb-1 truncate">{slide.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{slide.content}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {slide.mediaElements?.length || 0} mídia(s)
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditSlide(slide)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor de Slide */}
      {editingSlide && (
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {isCreating ? 'Criar Novo Slide' : 'Editar Slide'}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveSlide}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Salvar</span>
              </button>
              <button
                onClick={() => {
                  setEditingSlide(null);
                  setIsCreating(false);
                  setSelectedMediaElement(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Propriedades do Slide */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({
                    ...editingSlide,
                    title: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo
                </label>
                <textarea
                  value={editingSlide.content}
                  onChange={(e) => setEditingSlide({
                    ...editingSlide,
                    content: e.target.value
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor de Fundo
                  </label>
                  <input
                    type="color"
                    value={editingSlide.backgroundColor || '#1e40af'}
                    onChange={(e) => setEditingSlide({
                      ...editingSlide,
                      backgroundColor: e.target.value
                    })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Texto
                  </label>
                  <input
                    type="color"
                    value={editingSlide.textColor || '#ffffff'}
                    onChange={(e) => setEditingSlide({
                      ...editingSlide,
                      textColor: e.target.value
                    })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Controles de Mídia */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Adicionar Mídia</h4>
                <div className="grid grid-cols-2 gap-2">
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                    <ImageIcon className="h-4 w-4" />
                    <span>Imagem</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                    />
                  </label>
                  
                  <label className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                    <Video className="h-4 w-4" />
                    <span>Vídeo</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Controles de Grid */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Configurações do Editor</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600">Mostrar Grid</label>
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`p-2 rounded ${showGrid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600">Snap to Grid</label>
                    <button
                      onClick={() => setSnapToGrid(!snapToGrid)}
                      className={`p-2 rounded ${snapToGrid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      <Move className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Tamanho do Grid: {gridSize}px
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={gridSize}
                      onChange={(e) => setGridSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Propriedades do Elemento Selecionado */}
              {selectedElement && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Sliders className="h-4 w-4 mr-2" />
                    Elemento Selecionado
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">X</label>
                        <input
                          type="number"
                          value={selectedElement.x}
                          onChange={(e) => updateMediaElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Y</label>
                        <input
                          type="number"
                          value={selectedElement.y}
                          onChange={(e) => updateMediaElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Largura</label>
                        <input
                          type="number"
                          value={selectedElement.width}
                          onChange={(e) => updateMediaElement(selectedElement.id, { width: parseInt(e.target.value) || 100 })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Altura</label>
                        <input
                          type="number"
                          value={selectedElement.height}
                          onChange={(e) => updateMediaElement(selectedElement.id, { height: parseInt(e.target.value) || 100 })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Opacidade: {Math.round((selectedElement.opacity || 1) * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedElement.opacity || 1}
                        onChange={(e) => updateMediaElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Rotação: {selectedElement.rotation || 0}°
                      </label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={selectedElement.rotation || 0}
                        onChange={(e) => updateMediaElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Borda: {selectedElement.borderRadius || 0}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={selectedElement.borderRadius || 0}
                        onChange={(e) => updateMediaElement(selectedElement.id, { borderRadius: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    {/* Controles de Alinhamento */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">Alinhamento</label>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => alignElement(selectedElement.id, 'left')}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                          title="Alinhar à esquerda"
                        >
                          <AlignLeft className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => alignElement(selectedElement.id, 'center')}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                          title="Centralizar horizontalmente"
                        >
                          <AlignCenter className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => alignElement(selectedElement.id, 'right')}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                          title="Alinhar à direita"
                        >
                          <AlignRight className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => alignElement(selectedElement.id, 'top')}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                          title="Alinhar ao topo"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => alignElement(selectedElement.id, 'middle')}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                          title="Centralizar verticalmente"
                        >
                          ↕
                        </button>
                        <button
                          onClick={() => alignElement(selectedElement.id, 'bottom')}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                          title="Alinhar à base"
                        >
                          ↓
                        </button>
                      </div>
                    </div>

                    {/* Ações do Elemento */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => duplicateMediaElement(selectedElement.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center space-x-1"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Duplicar</span>
                      </button>
                      <button
                        onClick={() => toggleElementLock(selectedElement.id)}
                        className={`flex-1 px-2 py-1 rounded text-xs flex items-center justify-center space-x-1 ${
                          lockedElements.has(selectedElement.id)
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                        }`}
                      >
                        {lockedElements.has(selectedElement.id) ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        <span>{lockedElements.has(selectedElement.id) ? 'Bloqueado' : 'Bloquear'}</span>
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => bringToFront(selectedElement.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center space-x-1"
                      >
                        <Layers className="h-3 w-3" />
                        <span>Frente</span>
                      </button>
                      <button
                        onClick={() => sendToBack(selectedElement.id)}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center space-x-1"
                      >
                        <Layers className="h-3 w-3" />
                        <span>Fundo</span>
                      </button>
                      <button
                        onClick={() => removeMediaElement(selectedElement.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview do Slide */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div
                  ref={previewRef}
                  className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg"
                  style={{
                    aspectRatio: '16/9',
                    backgroundColor: editingSlide.backgroundColor || '#1e40af'
                  }}
                  onClick={(e) => {
                    // Deselecionar elemento se clicar no fundo
                    if (e.target === e.currentTarget) {
                      setSelectedMediaElement(null);
                    }
                  }}
                >
                  {/* Grid */}
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none">
                      <svg width="100%" height="100%" className="opacity-30">
                        <defs>
                          <pattern
                            id="grid"
                            width={`${(gridSize / EDITOR_WIDTH) * 100}%`}
                            height={`${(gridSize / EDITOR_HEIGHT) * 100}%`}
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d={`M ${(gridSize / EDITOR_WIDTH) * 100} 0 L 0 0 0 ${(gridSize / EDITOR_HEIGHT) * 100}`}
                              fill="none"
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth="1"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>
                  )}

                  {/* Background Image */}
                  {editingSlide.backgroundImage && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${editingSlide.backgroundImage})`,
                        opacity: editingSlide.backgroundOpacity || 0.3
                      }}
                    />
                  )}

                  {/* Conteúdo do Slide */}
                  {editingSlide.type !== 'fullscreen-background' && (
                    <div 
                      className="absolute inset-0 p-8 flex flex-col justify-center"
                      style={{ color: editingSlide.textColor || '#ffffff' }}
                    >
                      {!editingSlide.hideTitle && (
                        <h1 className="text-4xl font-bold mb-4 text-center">
                          {editingSlide.title}
                        </h1>
                      )}
                      {!editingSlide.hideContent && (
                        <div className="text-xl text-center whitespace-pre-wrap">
                          {editingSlide.content}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Media Elements */}
                  {editingSlide.mediaElements?.map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-move ${
                        selectedMediaElement === element.id ? 'ring-2 ring-blue-500' : ''
                      } ${lockedElements.has(element.id) ? 'cursor-not-allowed' : ''}`}
                      style={{
                        left: `${(element.x / EDITOR_WIDTH) * 100}%`,
                        top: `${(element.y / EDITOR_HEIGHT) * 100}%`,
                        width: `${(element.width / EDITOR_WIDTH) * 100}%`,
                        height: `${(element.height / EDITOR_HEIGHT) * 100}%`,
                        zIndex: element.zIndex || 1,
                        opacity: element.opacity || 1,
                        transform: `rotate(${element.rotation || 0}deg)`,
                        borderRadius: `${element.borderRadius || 0}px`
                      }}
                      onMouseDown={(e) => handleMouseDown(e, element.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMediaElement(element.id);
                      }}
                    >
                      {element.type === 'image' ? (
                        <img 
                          src={element.url}
                          alt={element.alt}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: `${element.borderRadius || 0}px` }}
                          draggable={false}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={element.url}
                            className="w-full h-full object-cover"
                            style={{ borderRadius: `${element.borderRadius || 0}px` }}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onLoadedData={() => console.log(`Vídeo ${element.id} carregado no editor`)}
                            onError={(e) => console.error(`Erro no vídeo ${element.id}:`, e)}
                          />
                          
                          {/* Controles de Vídeo */}
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black bg-opacity-50 rounded px-2 py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVideoPreview(element.id);
                              }}
                              className="text-white hover:text-blue-300"
                            >
                              {videoPreviewStates.get(element.id) ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </button>
                            <span className="text-white text-xs">Vídeo</span>
                          </div>
                        </div>
                      )}

                      {/* Resize Handles */}
                      {selectedMediaElement === element.id && !lockedElements.has(element.id) && (
                        <>
                          {/* Corner handles */}
                          <div
                            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize"
                            onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'nw')}
                          />
                          <div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize"
                            onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'ne')}
                          />
                          <div
                            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize"
                            onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'sw')}
                          />
                          <div
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize"
                            onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'se')}
                          />
                          
                          {/* Edge handles */}
                          <div
                            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize"
                            onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'n')}
                          />
                          <div
                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize"
                            onMouseDown={(e) => handleResizeMouseDown(e, element.id, 's')}
                          />
                          <div
                            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize"
                            onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'w')}
                          />
                          <div
                            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize"
                            onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'e')}
                          />
                        </>
                      )}

                      {/* Lock indicator */}
                      {lockedElements.has(element.id) && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Zoom Controls */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="bg-black bg-opacity-50 text-white px-2 py-2 rounded text-sm">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                      className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Informações do Preview */}
                <div className="mt-2 text-sm text-gray-600 text-center">
                  Dimensões: {EDITOR_WIDTH} × {EDITOR_HEIGHT} px (16:9)
                  {selectedMediaElement && (
                    <span className="ml-4">
                      Elemento selecionado: {selectedElement?.type} 
                      ({selectedElement?.width} × {selectedElement?.height})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Biblioteca de Mídia Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Biblioteca de Mídia</h3>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Storage Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span>Armazenamento usado: {storageUsage.toFixed(1)}MB / 1024MB</span>
                <span className="text-gray-500">{mediaLibrary.length} itens</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    storageUsage > 800 ? 'bg-red-500' : storageUsage > 500 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((storageUsage / 1024) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaLibrary.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="aspect-video bg-gray-200 rounded mb-2 overflow-hidden">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-100">
                        <Video className="h-8 w-8 text-purple-600" />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-800 truncate mb-1">
                    {item.name}
                  </h4>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    <div>{item.type === 'image' ? 'Imagem' : 'Vídeo'}</div>
                    <div>{(item.size / 1024 / 1024).toFixed(1)}MB</div>
                    <div>{item.uploadDate.toLocaleDateString('pt-BR')}</div>
                    {item.isObjectURL && (
                      <div className="text-orange-600 font-medium">Temporário</div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addMediaElementFromLibrary(item)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                    >
                      Usar
                    </button>
                    <button
                      onClick={() => removeFromMediaLibrary(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                    >
                      <Trash className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {mediaLibrary.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma mídia na biblioteca</p>
                <p className="text-sm">Faça upload de imagens ou vídeos para começar</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

