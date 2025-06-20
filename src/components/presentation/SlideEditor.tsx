import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Video, Save, X, Move, Eye, EyeOff, Copy, Layers, RotateCw, Maximize2, Minimize2, Database, Upload, Trash, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw, Palette } from 'lucide-react';
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
      setStorageUsage(Math.min(usageMB, 50)); // Máximo 50MB
    } catch (error) {
      console.error('Erro ao calcular uso de armazenamento:', error);
    }
  };

  const addToMediaLibrary = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataUrl = e.target?.result as string;
          const mediaItem: MediaLibraryItem = {
            id: `media-${Date.now()}`,
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url: dataUrl,
            size: file.size,
            uploadDate: new Date()
          };

          // Verificar se já existe
          const existing = mediaLibrary.find(item => item.name === file.name && item.size === file.size);
          if (existing) {
            resolve(existing.url);
            return;
          }

          const newLibrary = [...mediaLibrary, mediaItem];
          saveMediaLibrary(newLibrary);
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
      alert('Erro ao fazer upload da mídia');
    }
  };

  const addMediaElementFromLibrary = (libraryItem: MediaLibraryItem) => {
    if (!editingSlide) return;
    addMediaElementToSlide(libraryItem.url, libraryItem.type, libraryItem.name);
    setShowMediaLibrary(false);
  };

  const addMediaElementToSlide = (url: string, type: 'image' | 'video', name: string) => {
    if (!editingSlide) return;

    // Posições baseadas nas dimensões fixas do editor
    const newMediaElement: MediaElement = {
      id: `media-${Date.now()}`,
      type,
      url,
      alt: name,
      width: type === 'image' ? 300 : 400,
      height: type === 'image' ? 200 : 225,
      x: 100, // Posição fixa em pixels
      y: 100, // Posição fixa em pixels
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
      x: element.x + 20,
      y: element.y + 20,
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

  // Funções de movimento preciso
  const moveElement = (elementId: string, direction: 'up' | 'down' | 'left' | 'right', amount: number = 10) => {
    const element = editingSlide?.mediaElements?.find(el => el.id === elementId);
    if (!element) return;

    let newX = element.x;
    let newY = element.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, element.y - amount);
        break;
      case 'down':
        newY = Math.min(EDITOR_HEIGHT - element.height, element.y + amount);
        break;
      case 'left':
        newX = Math.max(0, element.x - amount);
        break;
      case 'right':
        newX = Math.min(EDITOR_WIDTH - element.width, element.x + amount);
        break;
    }

    updateMediaElement(elementId, { x: newX, y: newY });
  };

  // Funções de redimensionamento preciso
  const resizeElement = (elementId: string, type: 'width' | 'height', delta: number) => {
    const element = editingSlide?.mediaElements?.find(el => el.id === elementId);
    if (!element) return;

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
    if (!element) return;

    let newX = element.x;
    let newY = element.y;

    switch (alignment) {
      case 'left':
        newX = 0;
        break;
      case 'center':
        newX = (EDITOR_WIDTH - element.width) / 2;
        break;
      case 'right':
        newX = EDITOR_WIDTH - element.width;
        break;
      case 'top':
        newY = 0;
        break;
      case 'middle':
        newY = (EDITOR_HEIGHT - element.height) / 2;
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
  }, [editingSlide]);

  // Resize functionality
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, elementId: string, handle: ResizeState['handle']) => {
    e.preventDefault();
    e.stopPropagation();
    
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
  }, [editingSlide]);

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
        
        const newX = Math.max(0, Math.min(maxX, dragState.startElementX + scaledDeltaX));
        const newY = Math.max(0, Math.min(maxY, dragState.startElementY + scaledDeltaY));

        updateMediaElement(dragState.elementId, { x: Math.round(newX), y: Math.round(newY) });
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
          x: Math.round(newX),
          y: Math.round(newY)
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
  }, [dragState, resizeState, updateMediaElement, editingSlide]);

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
          <span className="text-sm font-medium">{storageUsage.toFixed(1)}MB / 50MB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              storageUsage > 40 ? 'bg-red-500' : storageUsage > 25 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${(storageUsage / 50) * 100}%` }}
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
                              </div>
                              <div className="flex items-center space-x-1">
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
                      </h4>
                      
                      {/* Ações rápidas */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => bringToFront(selectedElement.id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs flex items-center justify-center space-x-1"
                        >
                          <Layers className="h-3 w-3" />
                          <span>Frente</span>
                        </button>
                        <button
                          onClick={() => sendToBack(selectedElement.id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs flex items-center justify-center space-x-1"
                        >
                          <Layers className="h-3 w-3" />
                          <span>Trás</span>
                        </button>
                      </div>

                      {/* Controles de movimento */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Movimento (10px)</label>
                        <div className="grid grid-cols-3 gap-1">
                          <div></div>
                          <button
                            onClick={() => moveElement(selectedElement.id, 'up')}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded flex items-center justify-center"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <div></div>
                          <button
                            onClick={() => moveElement(selectedElement.id, 'left')}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded flex items-center justify-center"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          <div className="flex items-center justify-center text-xs text-gray-500">
                            {Math.round(selectedElement.x)},{Math.round(selectedElement.y)}
                          </div>
                          <button
                            onClick={() => moveElement(selectedElement.id, 'right')}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded flex items-center justify-center"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                          <div></div>
                          <button
                            onClick={() => moveElement(selectedElement.id, 'down')}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded flex items-center justify-center"
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
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            Esq
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'center')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            Centro
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'right')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            Dir
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'top')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            Topo
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'middle')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            Meio
                          </button>
                          <button
                            onClick={() => alignElement(selectedElement.id, 'bottom')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
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
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l"
                            />
                            <button
                              onClick={() => resizeElement(selectedElement.id, 'width', -10)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs"
                            >
                              -
                            </button>
                            <button
                              onClick={() => resizeElement(selectedElement.id, 'width', 10)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs rounded-r"
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
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l"
                            />
                            <button
                              onClick={() => resizeElement(selectedElement.id, 'height', -10)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs"
                            >
                              -
                            </button>
                            <button
                              onClick={() => resizeElement(selectedElement.id, 'height', 10)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs rounded-r"
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
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l"
                            />
                            <button
                              onClick={() => moveElement(selectedElement.id, 'left', 1)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs"
                            >
                              -
                            </button>
                            <button
                              onClick={() => moveElement(selectedElement.id, 'right', 1)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs rounded-r"
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
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-l"
                            />
                            <button
                              onClick={() => moveElement(selectedElement.id, 'up', 1)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs"
                            >
                              -
                            </button>
                            <button
                              onClick={() => moveElement(selectedElement.id, 'down', 1)}
                              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-xs rounded-r"
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
                            className="w-full"
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
                              className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-1 rounded"
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
                              className="flex-1"
                            />
                            <button
                              onClick={() => updateMediaElement(selectedElement.id, {
                                rotation: (selectedElement.rotation || 0) + 15
                              })}
                              className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-1 rounded"
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
                            className="w-full"
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
                            opacity: editingSlide.backgroundOpacity || 0.3
                          }}
                        />
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

                        const displayX = (element.x || 0) * scaleX;
                        const displayY = (element.y || 0) * scaleY;
                        const displayWidth = (element.width || 400) * scaleX;
                        const displayHeight = (element.height || 300) * scaleY;

                        return (
                          <div
                            key={element.id}
                            className={`absolute group transition-all ${
                              selectedMediaElement === element.id
                                ? 'ring-2 ring-blue-500 ring-opacity-75'
                                : 'hover:ring-2 hover:ring-gray-400 hover:ring-opacity-50'
                            } ${dragState.isDragging && dragState.elementId === element.id ? 'z-50' : ''}`}
                            style={{
                              left: `${displayX}px`,
                              top: `${displayY}px`,
                              width: `${displayWidth}px`,
                              height: `${displayHeight}px`,
                              zIndex: element.zIndex || 1,
                              opacity: element.opacity || 1,
                              transform: `rotate(${element.rotation || 0}deg)`,
                              borderRadius: `${(element.borderRadius || 0) * Math.min(scaleX, scaleY)}px`,
                              cursor: dragState.isDragging && dragState.elementId === element.id ? 'grabbing' : 'grab'
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
                                className="w-full h-full object-cover pointer-events-none"
                                style={{ borderRadius: `${(element.borderRadius || 0) * Math.min(scaleX, scaleY)}px` }}
                                draggable={false}
                              />
                            ) : (
                              <video 
                                src={element.url}
                                className="w-full h-full object-cover pointer-events-none"
                                style={{ borderRadius: `${(element.borderRadius || 0) * Math.min(scaleX, scaleY)}px` }}
                                draggable={false}
                              />
                            )}
                            
                            {/* Selection indicators */}
                            {selectedMediaElement === element.id && (
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
                          </div>
                        );
                      })}

                      {/* Grid overlay quando elemento está selecionado */}
                      {selectedMediaElement && (
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                          <svg width="100%" height="100%" className="absolute inset-0">
                            <defs>
                              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                          </svg>
                        </div>
                      )}

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