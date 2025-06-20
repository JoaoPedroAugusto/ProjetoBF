import React, { useState, useEffect } from 'react';
import { Presentation, Play, Edit, Settings, Eye } from 'lucide-react';
import { SlideViewer } from './SlideViewer';
import { SlideEditor } from './SlideEditor';
import { Slide, SlidePresentation, PresentationSettings } from '../../types/presentation';

interface PresentationManagerProps {
  sectorId: string;
  sectorName: string;
}

export const PresentationManager: React.FC<PresentationManagerProps> = ({
  sectorId,
  sectorName
}) => {
  const [currentPresentation, setCurrentPresentation] = useState<SlidePresentation | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<PresentationSettings>({
    autoAdvance: false,
    autoAdvanceDelay: 5,
    showControls: true,
    allowFullscreen: true,
    theme: 'dark'
  });

  // Carregar apresentação do localStorage
  useEffect(() => {
    const savedPresentation = localStorage.getItem(`presentation-${sectorId}`);
    if (savedPresentation) {
      try {
        const presentation = JSON.parse(savedPresentation);
        // Converter strings de data de volta para objetos Date
        presentation.slides = presentation.slides.map((slide: any) => ({
          ...slide,
          createdAt: new Date(slide.createdAt),
          updatedAt: new Date(slide.updatedAt)
        }));
        presentation.createdAt = new Date(presentation.createdAt);
        presentation.updatedAt = new Date(presentation.updatedAt);
        setCurrentPresentation(presentation);
      } catch (error) {
        console.error('Erro ao carregar apresentação:', error);
      }
    } else {
      // Criar apresentação padrão
      const defaultPresentation: SlidePresentation = {
        id: `presentation-${sectorId}`,
        sectorId,
        title: `Apresentação - ${sectorName}`,
        description: `Apresentação do setor ${sectorName}`,
        slides: createDefaultSlides(sectorName),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCurrentPresentation(defaultPresentation);
      savePresentation(defaultPresentation);
    }
  }, [sectorId, sectorName]);

  const createDefaultSlides = (sectorName: string): Slide[] => {
    return [
      {
        id: 'slide-1',
        title: `${sectorName}`,
        content: `Bem-vindos à apresentação sobre o setor de ${sectorName}.\n\nEsta apresentação abordará os principais aspectos, desafios e oportunidades do setor.`,
        type: 'text',
        backgroundColor: '#1e40af',
        textColor: '#ffffff',
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'slide-2',
        title: 'Visão Geral',
        content: `O setor de ${sectorName} é fundamental para a economia.\n\nVamos explorar suas características principais e importância no mercado atual.`,
        type: 'text',
        backgroundColor: '#059669',
        textColor: '#ffffff',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'slide-3',
        title: 'Obrigado!',
        content: 'Obrigado pela atenção!\n\nPara mais informações, consulte nossa plataforma.',
        type: 'text',
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  };

  const savePresentation = (presentation: SlidePresentation) => {
    localStorage.setItem(`presentation-${sectorId}`, JSON.stringify(presentation));
    setCurrentPresentation(presentation);
  };

  const handleSlidesChange = (slides: Slide[]) => {
    if (!currentPresentation) return;
    
    const updatedPresentation = {
      ...currentPresentation,
      slides,
      updatedAt: new Date()
    };
    savePresentation(updatedPresentation);
  };

  const startPresentation = () => {
    setIsViewing(true);
  };

  const stopPresentation = () => {
    setIsViewing(false);
  };

  const toggleEditor = () => {
    setIsEditing(!isEditing);
  };

  if (!currentPresentation) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Presentation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Carregando apresentação...</p>
        </div>
      </div>
    );
  }

  if (isViewing) {
    return (
      <SlideViewer
        slides={currentPresentation.slides}
        isFullscreen={true}
        onClose={stopPresentation}
        settings={settings}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {currentPresentation.title}
            </h1>
            <p className="text-gray-600 mb-4">
              {currentPresentation.description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{currentPresentation.slides.length} slides</span>
              <span>•</span>
              <span>Última atualização: {currentPresentation.updatedAt.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsViewing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Eye className="h-5 w-5" />
              <span>Visualizar</span>
            </button>
            
            <button
              onClick={startPresentation}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Play className="h-5 w-5" />
              <span>Apresentar</span>
            </button>
            
            <button
              onClick={toggleEditor}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
                isEditing 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <Edit className="h-5 w-5" />
              <span>{isEditing ? 'Fechar Editor' : 'Editar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview dos Slides */}
      {!isEditing && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Preview dos Slides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentPresentation.slides.map((slide, index) => (
              <div 
                key={slide.id}
                className="relative aspect-video rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                style={{
                  backgroundColor: slide.backgroundColor || '#1a1a1a',
                  color: slide.textColor || '#ffffff'
                }}
                onClick={() => setIsViewing(true)}
              >
                {slide.backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url(${slide.backgroundImage})` }}
                  />
                )}
                
                <div className="relative p-3 h-full flex flex-col justify-center">
                  <div className="text-xs font-bold mb-1 truncate">
                    {slide.title}
                  </div>
                  <div className="text-xs opacity-75 line-clamp-3">
                    {slide.content}
                  </div>
                </div>
                
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      {isEditing && (
        <SlideEditor
          slides={currentPresentation.slides}
          onSlidesChange={handleSlidesChange}
          sectorId={sectorId}
        />
      )}

      {/* Configurações */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Configurações da Apresentação
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Avanço Automático
              </label>
              <input
                type="checkbox"
                checked={settings.autoAdvance}
                onChange={(e) => setSettings({
                  ...settings,
                  autoAdvance: e.target.checked
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            {settings.autoAdvance && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo por Slide (segundos)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.autoAdvanceDelay}
                  onChange={(e) => setSettings({
                    ...settings,
                    autoAdvanceDelay: parseInt(e.target.value) || 5
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Mostrar Controles
              </label>
              <input
                type="checkbox"
                checked={settings.showControls}
                onChange={(e) => setSettings({
                  ...settings,
                  showControls: e.target.checked
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Permitir Tela Cheia
              </label>
              <input
                type="checkbox"
                checked={settings.allowFullscreen}
                onChange={(e) => setSettings({
                  ...settings,
                  allowFullscreen: e.target.checked
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

