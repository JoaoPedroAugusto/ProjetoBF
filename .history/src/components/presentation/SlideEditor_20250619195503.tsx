// SlideEditor Enhanced: with multiple media, drag-resize, full-screen, background-only mode

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Image, Video, Save, X, Maximize2, Minimize2, Layers } from 'lucide-react';
import { Rnd } from 'react-rnd';
import { Slide, MediaItem } from '../../types/presentation';

interface SlideEditorProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
  sectorId: string;
}

const defaultMediaItem = (file: File, type: 'image' | 'video', url: string): MediaItem => ({
  id: `media-${Date.now()}`,
  type,
  url,
  alt: file.name,
  width: 200,
  height: 150,
  x: 10,
  y: 10
});

export const SlideEditor: React.FC<SlideEditorProps> = ({ slides, onSlidesChange, sectorId }) => {
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [fullscreenMedia, setFullscreenMedia] = useState<string | null>(null);

  const createNewSlide = (): Slide => ({
    id: `slide-${Date.now()}`,
    title: 'Novo Slide',
    content: 'Conteúdo do slide...',
    type: 'text',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    backgroundImage: '',
    mediaItems: [],
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

    const updatedSlides = isCreating
      ? [...slides, updatedSlide]
      : slides.map(slide => (slide.id === updatedSlide.id ? updatedSlide : slide));

    onSlidesChange(updatedSlides);
    setEditingSlide(null);
    setIsCreating(false);
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm('Deseja excluir este slide?')) {
      onSlidesChange(slides.filter(s => s.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file || !editingSlide) return;

    const url = URL.createObjectURL(file);
    const newItem = defaultMediaItem(file, type, url);

    setEditingSlide({
      ...editingSlide,
      mediaItems: [...(editingSlide.mediaItems || []), newItem],
      type: 'media'
    });
  };

  const updateMediaItem = (id: string, props: Partial<MediaItem>) => {
    if (!editingSlide) return;
    setEditingSlide({
      ...editingSlide,
      mediaItems: editingSlide.mediaItems.map(item =>
        item.id === id ? { ...item, ...props } : item
      )
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Editor de Slides</h2>
        <button onClick={handleAddSlide} className="bg-blue-600 text-white px-4 py-2 rounded">
          <Plus /> Novo Slide
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {slides.map((slide, idx) => (
          <div key={slide.id} className="bg-gray-100 p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <span>Slide {idx + 1}</span>
              <div className="space-x-2">
                <button onClick={() => handleEditSlide(slide)} className="text-blue-600">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteSlide(slide.id)} className="text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h4 className="font-semibold mt-2 truncate">{slide.title}</h4>
          </div>
        ))}
      </div>

      {editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded p-6 relative">
            <button onClick={() => { setEditingSlide(null); setIsCreating(false); }}
              className="absolute top-2 right-2 text-gray-600">
              <X size={24} />
            </button>

            <div className="space-y-4">
              <input
                type="text"
                value={editingSlide.title}
                onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value })}
                placeholder="Título"
                className="w-full border p-2 rounded"
              />

              {editingSlide.type !== 'background-only' && (
                <textarea
                  value={editingSlide.content}
                  onChange={e => setEditingSlide({ ...editingSlide, content: e.target.value })}
                  className="w-full border p-2 rounded"
                  rows={3}
                  placeholder="Conteúdo"
                />
              )}

              <div className="flex gap-2">
                <input
                  type="color"
                  value={editingSlide.backgroundColor}
                  onChange={e => setEditingSlide({ ...editingSlide, backgroundColor: e.target.value })}
                />
                <input
                  type="color"
                  value={editingSlide.textColor}
                  onChange={e => setEditingSlide({ ...editingSlide, textColor: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Imagem de Fundo</label>
                <input
                  type="url"
                  value={editingSlide.backgroundImage || ''}
                  onChange={e => setEditingSlide({ ...editingSlide, backgroundImage: e.target.value })}
                  className="w-full border p-2 rounded"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-4">
                <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded">
                  <Image size={16} /> Adicionar Imagem
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'image')} className="hidden" />
                </label>
                <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded">
                  <Video size={16} /> Adicionar Vídeo
                  <input type="file" accept="video/*" onChange={e => handleFileUpload(e, 'video')} className="hidden" />
                </label>
              </div>

              <div className="relative w-full h-[300px] border rounded bg-gray-50">
                {editingSlide.mediaItems.map(media => (
                  <Rnd
                    key={media.id}
                    default={{ x: media.x, y: media.y, width: media.width, height: media.height }}
                    bounds="parent"
                    onDragStop={(e, d) => updateMediaItem(media.id, { x: d.x, y: d.y })}
                    onResizeStop={(e, dir, ref, delta, pos) => {
                      updateMediaItem(media.id, {
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                        x: pos.x,
                        y: pos.y
                      });
                    }}
                  >
                    <div className="relative h-full w-full">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.alt}
                          onClick={() => setFullscreenMedia(media.url)}
                          className="w-full h-full object-contain rounded border shadow"
                        />
                      ) : (
                        <video
                          src={media.url}
                          controls
                          className="w-full h-full object-contain rounded border"
                        />
                      )}
                      <button
                        onClick={() => updateMediaItem(media.id, { width: media.width + 20, height: media.height + 20 })}
                        className="absolute bottom-1 right-1 bg-white p-1 rounded text-xs border"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </Rnd>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button onClick={handleSaveSlide} className="bg-blue-600 text-white px-4 py-2 rounded">
                  <Save /> Salvar
                </button>
              </div>
            </div>
          </div>

          {fullscreenMedia && (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
              <img src={fullscreenMedia} className="max-h-full max-w-full object-contain" />
              <button onClick={() => setFullscreenMedia(null)} className="absolute top-4 right-4 text-white">
                <X size={32} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
