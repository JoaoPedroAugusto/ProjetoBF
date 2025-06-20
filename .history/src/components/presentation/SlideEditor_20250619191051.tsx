import React, { useState } from 'react';
import { Plus, Edit, Trash2, Image, Video, Type, Save, X } from 'lucide-react';
import { Slide } from '../../types/presentation';

interface SlideEditorProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
  sectorId: string;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slides,
  onSlidesChange,
  sectorId
}) => {
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createNewSlide = (): Slide => ({
    id: `slide-${Date.now()}`,
    title: 'Novo Slide',
    content: 'Conteúdo do slide...',
    type: 'text',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    order: slides.length,
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
    
    // Atualizar ordem
    updatedSlides.forEach((slide, index) => {
      slide.order = index;
    });

    onSlidesChange(updatedSlides);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file || !editingSlide) return;

    // Em um ambiente real, você faria upload do arquivo para um servidor
    // Por agora, vamos usar URL.createObjectURL para demonstração
    const url = URL.createObjectURL(file);
    
    setEditingSlide({
      ...editingSlide,
      media: {
        type,
        url,
        alt: file.name
      },
      type: type === 'image' ? 'image' : 'video'
    });
  };

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
            
            {slide.media && (
              <div className="mb-3">
                {slide.media.type === 'image' ? (
                  <img 
                    src={slide.media.url} 
                    alt={slide.media.alt}
                    className="w-full h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {isCreating ? 'Criar Novo Slide' : 'Editar Slide'}
                </h3>
                <button
                  onClick={() => {
                    setEditingSlide(null);
                    setIsCreating(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

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

                {/* Conteúdo */}
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

                {/* Preview da Mídia */}
                {editingSlide.media && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview da Mídia
                    </label>
                    {editingSlide.media.type === 'image' ? (
                      <img 
                        src={editingSlide.media.url}
                        alt={editingSlide.media.alt}
                        className="w-full max-h-40 object-contain rounded border"
                      />
                    ) : (
                      <video 
                        src={editingSlide.media.url}
                        controls
                        className="w-full max-h-40 rounded border"
                      />
                    )}
                    <button
                      onClick={() => setEditingSlide({
                        ...editingSlide,
                        media: undefined,
                        type: 'text'
                      })}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remover mídia
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setEditingSlide(null);
                    setIsCreating(false);
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

