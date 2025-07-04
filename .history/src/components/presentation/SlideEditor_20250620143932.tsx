import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Video, Save, X, Move, Eye, EyeOff, Copy, Layers, RotateCw, Maximize2, Minimize2, Database, Upload, Trash, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw, Palette, Play, Pause, Volume2, VolumeX, Grid, Lock, Unlock, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Sliders } from 'lucide-react';
import { Slide, MediaElement } from '../types/presentation';

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
}

// Constantes para dimensões consistentes
const EDITOR_WIDTH = 1200;
const EDITOR_HEIGHT = 675; // 16:9 aspect ratio

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

  // Carregar biblioteca de mídia
  useEffect(() => {
    loadMediaLibrary();
    calculateStorageUsage();
  }, []);

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
      localStorage.setItem('media-library', JSON.stringify(library));
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
      const img = new Image();
      
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
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const addToMediaLibrary = async (file: File): Promise<string> => {
    try {
      let dataUrl: string;
      
      if (file.type.startsWith('image/')) {
        // Comprimir imagem mantendo qualidade
        dataUrl = await compressImage(file, 1920, 0.9);
      } else {
        // Para vídeos, usar como está (limitado a 100MB)
        if (file.size > 100 * 1024 * 1024) {
          throw new Error('Arquivo de vídeo muito grande. Máximo 100MB.');
        }
        
        dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const mediaItem: MediaLibraryItem = {
        id: `media-${Date.now()}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: dataUrl,
        size: dataUrl.length,
        uploadDate: new Date()
      };

      // Verificar se já existe
      const existing = mediaLibrary.find(item => item.name === file.name && Math.abs(item.size - mediaItem.size) < 1000);
      if (existing) {
        return existing.url;
      }

      const newLibrary = [...mediaLibrary, mediaItem];
      saveMediaLibrary(newLibrary);
      return dataUrl;
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      throw error;
    }
  };

  const removeFromMediaLibrary = (id: string) => {
    const newLibrary = mediaLibrary.filter(item => item.id !== id);
    saveMediaLibrary(newLibrary);
  };

  const createNewSlide = (): Slide => ({
    id: `slide-${Date.now()}`,
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
      id: `media-${Date.now()}`,
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

    setEditingSlide({
      ...editingSlide,
      mediaElements: [...(editingSlide.mediaElements || []), newMediaElement],
      type: 'mixed'
    });

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
      id: `media-${Date.now()}`,
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

      {/* Storage Usage */}
      <div className="mb-4 bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Uso do Armazenamento</span>
          <span className="text-sm font-medium">{storageUsage.toFixed(1)}MB / 1024MB (1GB)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              storageUsage > 800 ? 'bg-red-500' : storageUsage > 500 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${(storageUsage / 1024) * 100}%` }}
          />
        </div>
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
            
            <h3 className="font-semibold text-gray-800 mb-2 truncate">{slide.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{slide.content}</p>
            
            {/* Preview das mídias */}
            {slide.mediaElements && slide.mediaElements.length > 0 && (
              <div className="mb-3 grid grid-cols-2 gap-1">
                {slide.mediaElements.slice(0, 4).map((media) => (
                  <div key={media.id} className="relative">
                    {media.type === 'image' ? (
                      <img 
                        src={media.url} 
                        alt={media.alt}
                        className="w-full h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Video className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
                {slide.mediaElements.length > 4 && (
                  <div className="w-full h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                    +{slide.mediaElements.length - 4}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => handleEditSlide(slide)}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDeleteSlide(slide.id)}
                className="text-red-600 hover:text-red-800 flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Biblioteca de Mídia</h3>
                <button
                  onClick={() => setShowMediaLibrary(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {mediaLibrary.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma mídia salva ainda</p>
                  <p className="text-sm text-gray-500">Faça upload de imagens ou vídeos para começar</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaLibrary.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 hover:border-blue-400 transition-colors">
                      <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
                        {item.type === 'image' ? (
                          <img 
                            src={item.url} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate mb-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {(item.size / 1024 / 1024).toFixed(1)}MB • {item.uploadDate.toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addMediaElementFromLibrary(item)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                        >
                          Usar
                        </button>
                        <button
                          onClick={() => removeFromMediaLibrary(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {isCreating ? 'Criar Novo Slide' : 'Editar Slide'}
                </h3>
                <button
                  onClick={() => {
                    setEditingSlide(null);
                    setIsCreating(false);
                    setSelectedMediaElement(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Painel de Configurações */}
                <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Controles de Grid e Zoom */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Controles do Editor</h4>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`px-3 py-2 rounded text-sm flex items-center justify-center space-x-1 ${
                          showGrid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                        <span>Grid</span>
                      </button>
                      <button
                        onClick={() => setSnapToGrid(!snapToGrid)}
                        className={`px-3 py-2 rounded text-sm flex items-center justify-center space-x-1 ${
                          snapToGrid ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        <Move className="h-4 w-4" />
                        <span>Snap</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-xs text-gray-600">Grid:</label>
                      <select
                        value={gridSize}
                        onChange={(e) => setGridSize(parseInt(e.target.value))}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        <option value={10}>10px</option>
                        <option value={20}>20px</option>
                        <option value={25}>25px</option>
                        <option value={50}>50px</option>
                      </select>
                    </div>
                  </div>

                  {/* Tipo de Slide */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Slide
                    </label>
                    <select
                      value={editingSlide.type}
                      onChange={(e) => setEditingSlide({
                        ...editingSlide,
                        type: e.target.value as Slide['type']
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Texto</option>
                      <option value="mixed">Misto (Texto + Mídia)</option>
                      <option value="fullscreen-background">Fundo Tela Cheia</option>
                    </select>
                  </div>

                  {/* Título */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Título
                      </label>
                      <button
                        onClick={() => setEditingSlide({
                          ...editingSlide,
                          hideTitle: !editingSlide.hideTitle
                        })}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        {editingSlide.hideTitle ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{editingSlide.hideTitle ? 'Mostrar' : 'Ocultar'}</span>
                      </button>
                    </div>
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

                  {/* Conteúdo */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Conteúdo
                      </label>
                      <button
                        onClick={() => setEditingSlide({
                          ...editingSlide,
                          hideContent: !editingSlide.hideContent
                        })}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        {editingSlide.hideContent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{editingSlide.hideContent ? 'Mostrar' : 'Ocultar'}</span>
                      </button>
                    </div>
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

                  {/* Cores */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor de Fundo
                      </label>
                      <input
                        type="color"
                        value={editingSlide.backgroundColor || '#1a1a1a'}
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

                  {/* Imagem de Fundo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagem de Fundo (URL)
                    </label>
                    <input
                      type="url"
                      value={editingSlide.backgroundImage || ''}
                      onChange={(e) => setEditingSlide({
                        ...editingSlide,
                        backgroundImage: e.target.value
                      })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Opacidade do Fundo */}
                  {editingSlide.backgroundImage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opacidade do Fundo: {Math.round((editingSlide.backgroundOpacity || 0.3) * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={editingSlide.backgroundOpacity || 0.3}
                        onChange={(e) => setEditingSlide({
                          ...editingSlide,
                          backgroundOpacity: parseFloat(e.target.value)
                        })}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Upload de Mídia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adicionar Mídia
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                        <Image className="h-4 w-4" />
                        <span className="text-sm">Imagem</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'image')}
                          className="hidden"
                        />
                      </label>
                      <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                        <Video className="h-4 w-4" />
                        <span className="text-sm">Vídeo</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, 'video')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Lista de Elementos de Mídia */}
                  {editingSlide.mediaElements && editingSlide.mediaElements.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Elementos de Mídia ({editingSlide.mediaElements.length})
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {editingSlide.mediaElements
                          .sort((a, b) => (b.zIndex || 1) - (a.zIndex || 1))
                          .map((element) => (
                          <div
                            key={element.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              selectedMediaElement === element.id
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedMediaElement(element.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {element.type === 'image' ? (
                                  <Image className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Video className="h-4 w-4 text-purple-600" />
                                )}
                                <span className="text-sm font-medium truncate">
                                  {element.alt || `${element.type} ${element.id.slice(-4)}`}
                                </span>
                                <span className="text-xs text-gray-500">z:{element.zIndex}</span>
                                {lockedElements.has(element.id) && (
                                  <Lock className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                {element.type === 'video' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleVideoPreview(element.id);
                                    }}
                                    className={`p-1 rounded ${
                                      videoPreviewStates.get(element.id) 
                                        ? 'text-green-600 hover:text-green-800' 
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                    title="Play/Pause Preview"
                                  >
                                    {videoPreviewStates.get(element.id) ? (
                                      <Pause className="h-3 w-3" />
                                    ) : (
                                      <Play className="h-3 w-3" />
                                    )}
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleElementLock(element.id);
                                  }}
                                  className={`p-1 ${
                                    lockedElements.has(element.id)
                                      ? 'text-red-600 hover:text-red-800'
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                  title="Bloquear/Desbloquear"
                                >
                                  {lockedElements.has(element.id) ? (
                                    <Lock className="h-3 w-3" />
                                  ) : (
                                    <Unlock className="h-3 w-3" />
                                  )}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateMediaElement(element.id);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="Duplicar"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeMediaElement(element.id);
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Remover"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Controles do Elemento Selecionado */}
                  {selectedElement && (
                    <div className="border-t pt-4 space-y-4">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <Move className="h-4 w-4 mr-2" />
                        Elemento Selecionado
                        {lockedElements.has(selectedElement.id) && (
                          <Lock className="h-4 w-4 ml-2 text-red-500" />
                        )}
                      </h4>
                      
                      {/* Ações rápidas */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => bringToFront(selectedElement.id)}
                          disabled={lockedElements.has(selectedElement.id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs flex items-center justify-center space-x-1 disabled:opacity-50"
                        >
                          <Layers className="h-3 w-3" />
                          <span>Frente</span>
                        </button>
                        <button
                          onClick={() => sendToBack(selectedElement.id)}
                          disabled={lockedElements.has(selectedElement.id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs flex items-center justify-center space-x-1 disabled:opacity-50"
                        >
                          <Layers className="h-3 w-3" />
                          <span>Trás</span>
                        </button>
                      </div>

                      {/* Controles de movimento */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Movimento ({gridSize}px)</label>
                        <div className="grid grid-cols-3 gap-1">
                          <div></div>
                          <button
                            onClick={() => moveElement(selectedElement.id, 'up')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded flex items-center justify-center disabled:opacity-50"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <div></div>
                          <button
                            onClick={() => moveElement(selectedElement.id, 'left')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded flex items-center justify-center disabled:opacity-50"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          <div className="flex items-center justify-center text-xs text-gray-500">
                            {Math.round(selectedElement.x)},{Math.round(selectedElement.y)}
                          </div>
                          <button
                            onClick={() => moveElement(selectedElement.id, 'right')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded flex items-center justify-center disabled:opacity-50"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                          <div></div>
                          <button
                            onClick={() => moveElement(selectedElement.id, 'down')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded flex items-center justify-center disabled:opacity-50"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <div></div>
                        </div>
                      </div>

                      {/* Controles de alinhamento */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Alinhamento</label>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => alignElement(selectedElement.id, 'left')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            <AlignLeft className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'center')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            <AlignCenter className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'right')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            <AlignRight className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'top')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            Topo
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'middle')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            Meio
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'bottom')}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs disabled:opacity-50"
                          >
                            Base
                          </button>
                        </div>
                      </div>

                      {/* Controles de posição e tamanho precisos */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Largura</label>
                          <div className="flex">
                            <input
                              type="number"
                              value={selectedElement.width || 400}
                              onChange={(e) => updateMediaElement(selectedElement.id, {
                                width: parseInt(e.target.value) || 400
                              })}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l disabled:opacity-50"
                            />
                            <button
                              onClick={() => resizeElement(selectedElement.id, 'width', -10)}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs disabled:opacity-50"
                            >
                              -
                            </button>
                            <button
                              onClick={() => resizeElement(selectedElement.id, 'width', 10)}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs rounded-r disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Altura</label>
                          <div className="flex">
                            <input
                              type="number"
                              value={selectedElement.height || 300}
                              onChange={(e) => updateMediaElement(selectedElement.id, {
                                height: parseInt(e.target.value) || 300
                              })}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l disabled:opacity-50"
                            />
                            <button
                              onClick={() => resizeElement(selectedElement.id, 'height', -10)}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs disabled:opacity-50"
                            >
                              -
                            </button>
                            <button
                              onClick={() => resizeElement(selectedElement.id, 'height', 10)}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs rounded-r disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Posição X</label>
                          <div className="flex">
                            <input
                              type="number"
                              value={Math.round(selectedElement.x || 0)}
                              onChange={(e) => updateMediaElement(selectedElement.id, {
                                x: parseInt(e.target.value) || 0
                              })}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l disabled:opacity-50"
                            />
                            <button
                              onClick={() => moveElement(selectedElement.id, 'left', 1)}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs disabled:opacity-50"
                            >
                              -
                            </button>
                            <button
                              onClick={() => moveElement(selectedElement.id, 'right', 1)}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs rounded-r disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Posição Y</label>
                          <div className="flex">
                            <input
                              type="number"
                              value={Math.round(selectedElement.y || 0)}
                              onChange={(e) => updateMediaElement(selectedElement.id, {
                                y: parseInt(e.target.value) || 0
                              })}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l disabled:opacity-50"
                            />
                            <button
                              onClick={() => moveElement(selectedElement.id, 'up', 1)}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs disabled:opacity-50"
                            >
                              -
                            </button>
                            <button
                              onClick={() => moveElement(selectedElement.id, 'down', 1)}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs rounded-r disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Controles de estilo */}
                      <div className="space-y-3">
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
                            onChange={(e) => updateMediaElement(selectedElement.id, {
                              opacity: parseFloat(e.target.value)
                            })}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="w-full disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Rotação: {selectedElement.rotation || 0}°
                          </label>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateMediaElement(selectedElement.id, {
                                rotation: (selectedElement.rotation || 0) - 15
                              })}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-1 rounded disabled:opacity-50"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </button>
                            <input
                              type="range"
                              min="-180"
                              max="180"
                              value={selectedElement.rotation || 0}
                              onChange={(e) => updateMediaElement(selectedElement.id, {
                                rotation: parseInt(e.target.value)
                              })}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="flex-1 disabled:opacity-50"
                            />
                            <button
                              onClick={() => updateMediaElement(selectedElement.id, {
                                rotation: (selectedElement.rotation || 0) + 15
                              })}
                              disabled={lockedElements.has(selectedElement.id)}
                              className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-1 rounded disabled:opacity-50"
                            >
                              <RotateCw className="h-3 w-3" />
                            </button>
                          </div>
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
                            onChange={(e) => updateMediaElement(selectedElement.id, {
                              borderRadius: parseInt(e.target.value)
                            })}
                            disabled={lockedElements.has(selectedElement.id)}
                            className="w-full disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview do Slide */}
                <div className="lg:col-span-2">
                  <div className="sticky top-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview do Slide
                      <span className="text-xs text-gray-500 ml-2">
                        (Clique e arraste elementos • Cantos/bordas para redimensionar)
                      </span>
                    </label>
                    <div 
                      ref={previewRef}
                      className="relative w-full aspect-video border-2 border-gray-300 rounded-lg overflow-hidden select-none bg-gray-50"
                      style={{
                        backgroundColor: editingSlide.backgroundColor || '#1a1a1a',
                        color: editingSlide.textColor || '#ffffff',
                        width: '100%',
                        height: 'auto'
                      }}
                      onClick={() => setSelectedMediaElement(null)}
                    >
                      {/* Background Image */}
                      {editingSlide.backgroundImage && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{ 
                            backgroundImage: `url(${editingSlide.backgroundImage})`,
                            opacity: editingSlide.backgroundOpacity || 0.3,
                            imageRendering: 'high-quality'
                          }}
                        />
                      )}

                      {/* Grid Overlay */}
                      {showGrid && (
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                          <svg width="100%" height="100%" className="absolute inset-0">
                            <defs>
                              <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                                <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                          </svg>
                        </div>
                      )}

                      {/* Content */}
                      {editingSlide.type !== 'fullscreen-background' && (
                        <div className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                          {!editingSlide.hideTitle && (
                            <h1 className="text-lg font-bold mb-2 truncate max-w-full">
                              {editingSlide.title}
                            </h1>
                          )}
                          {!editingSlide.hideContent && (
                            <div className="text-sm opacity-90 line-clamp-3">
                              {editingSlide.content.split('\n').map((line, index) => (
                                <p key={index} className="mb-1">{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Media Elements */}
                      {editingSlide.mediaElements?.map((element) => {
                        // Calcular posições proporcionais para o preview
                        const previewRect = previewRef.current?.getBoundingClientRect();
                        if (!previewRect) return null;

                        const scaleX = previewRect.width / EDITOR_WIDTH;
                        const scaleY = previewRect.height / EDITOR_HEIGHT;

                        const displayX = Math.round((element.x || 0) * scaleX * 100) / 100;
                        const displayY = Math.round((element.y || 0) * scaleY * 100) / 100;
                        const displayWidth = Math.round((element.width || 400) * scaleX * 100) / 100;
                        const displayHeight = Math.round((element.height || 300) * scaleY * 100) / 100;

                        const isLocked = lockedElements.has(element.id);

                        return (
                          <div
                            key={element.id}
                            className={`absolute group transition-all ${
                              selectedMediaElement === element.id
                                ? 'ring-2 ring-blue-500 ring-opacity-75'
                                : 'hover:ring-2 hover:ring-gray-400 hover:ring-opacity-50'
                            } ${dragState.isDragging && dragState.elementId === element.id ? 'z-50' : ''} ${
                              isLocked ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                            }`}
                            style={{
                              left: `${displayX}px`,
                              top: `${displayY}px`,
                              width: `${displayWidth}px`,
                              height: `${displayHeight}px`,
                              zIndex: element.zIndex || 1,
                              opacity: element.opacity || 1,
                              transform: `rotate(${element.rotation || 0}deg)`,
                              borderRadius: `${Math.round((element.borderRadius || 0) * Math.min(scaleX, scaleY) * 100) / 100}px`,
                              cursor: isLocked ? 'not-allowed' : (dragState.isDragging && dragState.elementId === element.id ? 'grabbing' : 'grab'),
                              willChange: 'transform',
                              backfaceVisibility: 'hidden'
                            }}
                            onMouseDown={(e) => !isLocked && handleMouseDown(e, element.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMediaElement(element.id);
                            }}
                          >
                            {element.type === 'image' ? (
                              <img 
                                src={element.url}
                                alt={element.alt}
                                className="w-full h-full object-cover pointer-events-none"
                                style={{ 
                                  borderRadius: `${Math.round((element.borderRadius || 0) * Math.min(scaleX, scaleY) * 100) / 100}px`,
                                  imageRendering: 'high-quality'
                                }}
                                draggable={false}
                              />
                            ) : (
                              <div className="relative w-full h-full">
                                <video 
                                  src={element.url}
                                  className="w-full h-full object-cover pointer-events-none"
                                  style={{ 
                                    borderRadius: `${Math.round((element.borderRadius || 0) * Math.min(scaleX, scaleY) * 100) / 100}px`,
                                    imageRendering: 'high-quality'
                                  }}
                                  draggable={false}
                                  autoPlay={videoPreviewStates.get(element.id)}
                                  muted
                                  loop
                                  playsInline
                                />
                                
                                {/* Video Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="bg-black bg-opacity-50 rounded-full p-2">
                                    {videoPreviewStates.get(element.id) ? (
                                      <Pause className="h-4 w-4 text-white" />
                                    ) : (
                                      <Play className="h-4 w-4 text-white" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Selection indicators */}
                            {selectedMediaElement === element.id && !isLocked && (
                              <>
                                {/* Corner resize handles */}
                                <div 
                                  className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize z-10"
                                  onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'nw')}
                                />
                                <div 
                                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize z-10"
                                  onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'ne')}
                                />
                                <div 
                                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize z-10"
                                  onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'sw')}
                                />
                                <div 
                                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize z-10"
                                  onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'se')}
                                />
                                
                                {/* Edge resize handles */}
                                <div 
                                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white rounded cursor-n-resize z-10"
                                  onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'n')}
                                />
                                <div 
                                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white rounded cursor-s-resize z-10"
                                  onMouseDown={(e) => handleResizeMouseDown(e, element.id, 's')}
                                />
                                <div 
                                  className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white rounded cursor-w-resize z-10"
                                  onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'w')}
                                />
                                <div 
                                  className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white rounded cursor-e-resize z-10"
                                  onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'e')}
                                />
                                
                                {/* Info label */}
                                <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1 whitespace-nowrap z-10">
                                  <Move className="h-3 w-3" />
                                  <span>{Math.round(element.x || 0)}, {Math.round(element.y || 0)}</span>
                                  <span>•</span>
                                  <span>{element.width}×{element.height}</span>
                                </div>
                              </>
                            )}

                            {/* Lock indicator */}
                            {isLocked && (
                              <div className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded z-10">
                                <Lock className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Empty state */}
                      {(!editingSlide.mediaElements || editingSlide.mediaElements.length === 0) && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center text-gray-400 opacity-50">
                            <Image className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm">Adicione mídias para começar</p>
                            <p className="text-xs mt-1">Arraste e solte elementos para posicionar</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setEditingSlide(null);
                    setIsCreating(false);
                    setSelectedMediaElement(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveSlide}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="h-5 w-5" />
                  <span>Salvar Slide</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};