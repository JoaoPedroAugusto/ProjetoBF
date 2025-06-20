import React, { useState, useRef, useCallback } from 'react';
import { Plus, Edit, Trash2, Image, Video, Type, Save, X, Move, RotateCw, Eye, EyeOff } from 'lucide-react';
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
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slides,
  onSlidesChange,
  sectorId
}) => {
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMediaElement, setSelectedMediaElement] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    startElementX: 0,
    startElementY: 0
  });
  
  const previewRef = useRef<HTMLDivElement>(null);

  const createNewSlide = (): Slide => ({
    id: `slide-${Date.now()}`,
    title: 'Novo Slide',
    content: 'Conteúdo do slide...',
    type: 'text',
    backgroundColor: '#1a1a1a',
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file || !editingSlide) return;

    const url = URL.createObjectURL(file);
    
    const newMediaElement: MediaElement = {
      id: `media-${Date.now()}`,
      type,
      url,
      alt: file.name,
      width: 400,
      height: 300,
      x: 50,
      y: 50,
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

  // Funções de arrastar e soltar
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = editingSlide?.mediaElements?.find(el => el.id === elementId);
    if (!element) return;

    setSelectedMediaElement(elementId);
    setDragState({
      isDragging: true,
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      startElementX: element.x || 0,
      startElementY: element.y || 0
    });
  }, [editingSlide]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.elementId || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;
    
    const newX = Math.max(0, Math.min(rect.width - 50, dragState.startElementX + deltaX));
    const newY = Math.max(0, Math.min(rect.height - 50, dragState.startElementY + deltaY));

    updateMediaElement(dragState.elementId, {
      x: newX,
      y: newY
    });
  }, [dragState, updateMediaElement]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      elementId: null,
      startX: 0,
      startY: 0,
      startElementX: 0,
      startElementY: 0
    });
  }, []);

  // Event listeners globais para arrastar
  React.useEffect(() => {
    if (dragState.isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!dragState.isDragging || !dragState.elementId || !previewRef.current) return;

        const rect = previewRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragState.startX;
        const deltaY = e.clientY - dragState.startY;
        
        const newX = Math.max(0, Math.min(rect.width - 50, dragState.startElementX + deltaX));
        const newY = Math.max(0, Math.min(rect.height - 50, dragState.startElementY + deltaY));

        updateMediaElement(dragState.elementId, {
          x: newX,
          y: newY
        });
      };

      const handleGlobalMouseUp = () => {
        setDragState({
          isDragging: false,
          elementId: null,
          startX: 0,
          startY: 0,
          startElementX: 0,
          startElementY: 0
        });
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [dragState, updateMediaElement]);

  const selectedElement = editingSlide?.mediaElements?.find(el => el.id === selectedMediaElement);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Editor de Slides</h2>
        <button
          onClick={handleAddSlide}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar Slide</span>
        </button>
      </div>

      {/* Lista de Slides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">Slide {index + 1}</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleMoveSlide(slide.id, 'up')}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveSlide(slide.id, 'down')}
                  disabled={index === slides.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
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
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDeleteSlide(slide.id)}
                className="text-red-600 hover:text-red-800 flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
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
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Painel de Configurações */}
                <div className="space-y-4">
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
                    <div className="flex space-x-4">
                      <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                        <Image className="h-5 w-5" />
                        <span>Imagem</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'image')}
                          className="hidden"
                        />
                      </label>
                      <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                        <Video className="h-5 w-5" />
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

                  {/* Lista de Elementos de Mídia */}
                  {editingSlide.mediaElements && editingSlide.mediaElements.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Elementos de Mídia
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {editingSlide.mediaElements.map((element) => (
                          <div
                            key={element.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedMediaElement === element.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
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
                                <Move className="h-4 w-4 text-gray-400" />
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMediaElement(element.id);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Controles do Elemento Selecionado */}
                  {selectedElement && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Move className="h-4 w-4 mr-2" />
                        Configurações do Elemento Selecionado
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Largura</label>
                          <input
                            type="number"
                            value={selectedElement.width || 400}
                            onChange={(e) => updateMediaElement(selectedElement.id, {
                              width: parseInt(e.target.value) || 400
                            })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Altura</label>
                          <input
                            type="number"
                            value={selectedElement.height || 300}
                            onChange={(e) => updateMediaElement(selectedElement.id, {
                              height: parseInt(e.target.value) || 300
                            })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Posição X</label>
                          <input
                            type="number"
                            value={selectedElement.x || 50}
                            onChange={(e) => updateMediaElement(selectedElement.id, {
                              x: parseInt(e.target.value) || 50
                            })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Posição Y</label>
                          <input
                            type="number"
                            value={selectedElement.y || 50}
                            onChange={(e) => updateMediaElement(selectedElement.id, {
                              y: parseInt(e.target.value) || 50
                            })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
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
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={selectedElement.rotation || 0}
                            onChange={(e) => updateMediaElement(selectedElement.id, {
                              rotation: parseInt(e.target.value)
                            })}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview do Slide */}
                <div className="lg:sticky lg:top-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview do Slide
                    <span className="text-xs text-gray-500 ml-2">
                      (Arraste os elementos para reposicionar)
                    </span>
                  </label>
                  <div 
                    ref={previewRef}
                    className="relative w-full aspect-video border-2 border-gray-300 rounded-lg overflow-hidden select-none"
                    style={{
                      backgroundColor: editingSlide.backgroundColor || '#1a1a1a',
                      color: editingSlide.textColor || '#ffffff'
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
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
                    {editingSlide.mediaElements?.map((element) => (
                      <div
                        key={element.id}
                        className={`absolute border-2 transition-all cursor-move ${
                          selectedMediaElement === element.id
                            ? 'border-blue-500 shadow-lg'
                            : 'border-transparent hover:border-gray-400'
                        } ${dragState.isDragging && dragState.elementId === element.id ? 'z-50' : ''}`}
                        style={{
                          left: `${element.x}px`,
                          top: `${element.y}px`,
                          width: `${element.width}px`,
                          height: `${element.height}px`,
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
                            className="w-full h-full object-cover pointer-events-none"
                            style={{ borderRadius: `${element.borderRadius || 0}px` }}
                            draggable={false}
                          />
                        ) : (
                          <video 
                            src={element.url}
                            className="w-full h-full object-cover pointer-events-none"
                            style={{ borderRadius: `${element.borderRadius || 0}px` }}
                            draggable={false}
                          />
                        )}
                        
                        {/* Indicador de seleção */}
                        {selectedMediaElement === element.id && (
                          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                            <Move className="h-3 w-3" />
                            <span>Arrastar</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Instruções quando não há elementos */}
                    {(!editingSlide.mediaElements || editingSlide.mediaElements.length === 0) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-gray-400 opacity-50">
                          <Image className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Adicione mídias para começar</p>
                        </div>
                      </div>
                    )}
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
                  <span>Salvar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};