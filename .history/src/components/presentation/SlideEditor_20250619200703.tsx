import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Image, Video, Type, Save, X, Play, Maximize, Move, RotateCcw } from 'lucide-react';
import { Slide, MediaItem, Presentation } from '../types/presentation';
import { SlidePreview } from './SlidePreview';
import { PresentationViewer } from './PresentationViewer';

interface SlideEditorProps {
  presentation: Presentation;
  onPresentationChange: (presentation: Presentation) => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  presentation,
  onPresentationChange
}) => {
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [draggedMedia, setDraggedMedia] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const slides = presentation.slides;

  const createNewSlide = (): Slide => ({
    id: `slide-${Date.now()}`,
    title: 'Novo Slide',
    content: 'Conteúdo do slide...',
    type: 'text',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    order: slides.length,
    createdAt: new Date(),
    updatedAt: new Date(),
    media: [],
    showText: true,
    backgroundSize: 'cover',
    textPosition: {
      x: 10,
      y: 10,
      width: 80,
      height: 80
    }
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

    let updatedSlides;
    if (isCreating) {
      updatedSlides = [...slides, updatedSlide];
    } else {
      updatedSlides = slides.map(slide => 
        slide.id === editingSlide.id ? updatedSlide : slide
      );
    }

    onPresentationChange({
      ...presentation,
      slides: updatedSlides,
      updatedAt: new Date()
    });

    setEditingSlide(null);
    setIsCreating(false);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (confirm('Tem certeza que deseja excluir este slide?')) {
      const updatedSlides = slides.filter(slide => slide.id !== slideId);
      onPresentationChange({
        ...presentation,
        slides: updatedSlides,
        updatedAt: new Date()
      });
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

    onPresentationChange({
      ...presentation,
      slides: updatedSlides,
      updatedAt: new Date()
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file || !editingSlide) return;

    const url = URL.createObjectURL(file);
    
    const newMediaItem: MediaItem = {
      id: `media-${Date.now()}`,
      type,
      url,
      alt: file.name,
      position: {
        x: 10,
        y: 10,
        width: type === 'image' ? 40 : 60,
        height: type === 'image' ? 30 : 40,
        zIndex: (editingSlide.media?.length || 0) + 1
      },
      opacity: 1
    };

    setEditingSlide({
      ...editingSlide,
      media: [...(editingSlide.media || []), newMediaItem],
      type: editingSlide.media?.length ? 'mixed' : type
    });

    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleMediaUpdate = (mediaItem: MediaItem) => {
    if (!editingSlide) return;

    setEditingSlide({
      ...editingSlide,
      media: editingSlide.media?.map(item => 
        item.id === mediaItem.id ? mediaItem : item
      ) || []
    });
  };

  const handleDeleteMedia = (mediaId: string) => {
    if (!editingSlide) return;

    const updatedMedia = editingSlide.media?.filter(item => item.id !== mediaId) || [];
    setEditingSlide({
      ...editingSlide,
      media: updatedMedia,
      type: updatedMedia.length === 0 ? 'text' : 
            updatedMedia.length === 1 ? updatedMedia[0].type : 'mixed'
    });
  };

  const handleStartPresentation = () => {
    setIsPresenting(true);
  };

  const createBackgroundOnlySlide = () => {
    const newSlide: Slide = {
      ...createNewSlide(),
      title: 'Slide de Fundo',
      content: '',
      type: 'background',
      showText: false,
      backgroundColor: '#000000'
    };
    setEditingSlide(newSlide);
    setIsCreating(true);
  };

  if (isPresenting) {
    return (
      <PresentationViewer
        slides={slides}
        onClose={() => setIsPresenting(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{presentation.title}</h2>
          <p className="text-gray-600">{slides.length} slides</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={createBackgroundOnlySlide}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Image className="h-5 w-5" />
            <span>Fundo</span>
          </button>
          <button
            onClick={handleAddSlide}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Slide</span>
          </button>
          <button
            onClick={handleStartPresentation}
            disabled={slides.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Play className="h-5 w-5" />
            <span>Apresentar</span>
          </button>
        </div>
      </div>

      {/* Lista de Slides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {slides.map((slide, index) => (
          <SlidePreview
            key={slide.id}
            slide={slide}
            index={index}
            onEdit={() => handleEditSlide(slide)}
            onDelete={() => handleDeleteSlide(slide.id)}
            onMoveUp={() => handleMoveSlide(slide.id, 'up')}
            onMoveDown={() => handleMoveSlide(slide.id, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < slides.length - 1}
          />
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
                    setSelectedMediaId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configurações à esquerda */}
                <div className="space-y-4">
                  {/* Título */}
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

                  {/* Mostrar Texto */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingSlide.showText}
                        onChange={(e) => setEditingSlide({
                          ...editingSlide,
                          showText: e.target.checked
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Mostrar texto</span>
                    </label>
                  </div>

                  {/* Conteúdo */}
                  {editingSlide.showText && (
                    <>
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

                      {/* Tamanho da Fonte */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tamanho da Fonte: {editingSlide.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="72"
                          value={editingSlide.fontSize || 24}
                          onChange={(e) => setEditingSlide({
                            ...editingSlide,
                            fontSize: parseInt(e.target.value)
                          })}
                          className="w-full"
                        />
                      </div>

                      {/* Alinhamento do Texto */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alinhamento
                        </label>
                        <select
                          value={editingSlide.textAlign || 'center'}
                          onChange={(e) => setEditingSlide({
                            ...editingSlide,
                            textAlign: e.target.value as 'left' | 'center' | 'right'
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="left">Esquerda</option>
                          <option value="center">Centro</option>
                          <option value="right">Direita</option>
                        </select>
                      </div>
                    </>
                  )}

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
                    {editingSlide.showText && (
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
                    )}
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

                  {/* Tamanho da Imagem de Fundo */}
                  {editingSlide.backgroundImage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ajuste da Imagem de Fundo
                      </label>
                      <select
                        value={editingSlide.backgroundSize || 'cover'}
                        onChange={(e) => setEditingSlide({
                          ...editingSlide,
                          backgroundSize: e.target.value as 'cover' | 'contain' | 'auto'
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="cover">Cobrir (Cover)</option>
                        <option value="contain">Conter (Contain)</option>
                        <option value="auto">Automático</option>
                      </select>
                    </div>
                  )}

                  {/* Upload de Mídia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adicionar Mídia
                    </label>
                    <div className="flex space-x-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image')}
                        className="hidden"
                      />
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'video')}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Image className="h-5 w-5" />
                        <span>Imagem</span>
                      </button>
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Video className="h-5 w-5" />
                        <span>Vídeo</span>
                      </button>
                    </div>
                  </div>

                  {/* Lista de Mídias */}
                  {editingSlide.media && editingSlide.media.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mídias ({editingSlide.media.length})
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {editingSlide.media.map((media) => (
                          <div
                            key={media.id}
                            className={`p-2 border rounded cursor-pointer ${
                              selectedMediaId === media.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                            onClick={() => setSelectedMediaId(media.id)}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm truncate">{media.alt || `${media.type} ${media.id.slice(-4)}`}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMedia(media.id);
                                }}
                                className="text-red-600 hover:text-red-800 ml-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Controles de Mídia Selecionada */}
                  {selectedMediaId && editingSlide.media && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Controles da Mídia</h4>
                      {(() => {
                        const selectedMedia = editingSlide.media.find(m => m.id === selectedMediaId);
                        if (!selectedMedia) return null;

                        return (
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label>Largura: {selectedMedia.position.width}%</label>
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  value={selectedMedia.position.width}
                                  onChange={(e) => {
                                    const updatedMedia = {
                                      ...selectedMedia,
                                      position: {
                                        ...selectedMedia.position,
                                        width: parseInt(e.target.value)
                                      }
                                    };
                                    handleMediaUpdate(updatedMedia);
                                  }}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label>Altura: {selectedMedia.position.height}%</label>
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  value={selectedMedia.position.height}
                                  onChange={(e) => {
                                    const updatedMedia = {
                                      ...selectedMedia,
                                      position: {
                                        ...selectedMedia.position,
                                        height: parseInt(e.target.value)
                                      }
                                    };
                                    handleMediaUpdate(updatedMedia);
                                  }}
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div>
                              <label>Opacidade: {Math.round((selectedMedia.opacity || 1) * 100)}%</label>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={selectedMedia.opacity || 1}
                                onChange={(e) => {
                                  const updatedMedia = {
                                    ...selectedMedia,
                                    opacity: parseFloat(e.target.value)
                                  };
                                  handleMediaUpdate(updatedMedia);
                                }}
                                className="w-full"
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Preview à direita */}
                <div className="lg:sticky lg:top-0">
                  <h4 className="font-medium text-gray-700 mb-2">Preview</h4>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                    <SlidePreview
                      slide={editingSlide}
                      index={0}
                      isEditing={true}
                      selectedMediaId={selectedMediaId}
                      onMediaMove={(mediaId, position) => {
                        const media = editingSlide.media?.find(m => m.id === mediaId);
                        if (media) {
                          handleMediaUpdate({
                            ...media,
                            position: { ...media.position, ...position }
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setEditingSlide(null);
                    setIsCreating(false);
                    setSelectedMediaId(null);
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