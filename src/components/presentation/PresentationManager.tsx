import React, { useState, useEffect, useCallback } from 'react';
import { Presentation, Play, Edit, Settings, Eye, ArrowLeft } from 'lucide-react';
import { SlideViewer } from './SlideViewer';
import { SlideEditor } from './SlideEditor';
import { Slide, SlidePresentation, PresentationSettings } from '../../types/presentation';
import { mediaStorage } from '../../utils/mediaStorage';
import { CustomDialog } from "./CustomDiaolg";

interface PresentationManagerProps {
  sectorId: string;
  sectorName: string;
  initialFullscreen?: boolean;
  onClose?: () => void;
}

export const PresentationManager: React.FC<PresentationManagerProps> = ({
  sectorId,
  sectorName,
  initialFullscreen = false,
  onClose
}) => {
  const [currentPresentation, setCurrentPresentation] = useState<SlidePresentation | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [settings, setSettings] = useState<PresentationSettings>({
    autoAdvance: false,
    autoAdvanceDelay: 5,
    showControls: true,
    allowFullscreen: true,
    theme: 'dark'
  });
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'alert' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm'
  });

  // Funções auxiliares para diálogos
  const showAlert = (title: string, message: string) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      type: 'alert'
    });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm
    });
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  // Atalho Shift + P para apresentação
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.shiftKey && (event.key === 'p' || event.key === 'P')) {
      event.preventDefault();
      if (!isViewing && !isEditing) {
        startPresentation();
      }
    }
  }, [isViewing, isEditing]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

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
          updatedAt: new Date(slide.updatedAt),
          mediaElements: slide.mediaElements || []
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
        mediaElements: [],
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
        mediaElements: [],
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
        mediaElements: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  };

  const savePresentation = async (presentation: SlidePresentation) => {
    try {
      // Tentar salvar no localStorage primeiro (para compatibilidade)
      localStorage.setItem(`presentation-${sectorId}`, JSON.stringify(presentation));
      setCurrentPresentation(presentation);
    } catch (error) {
      console.error('Erro ao salvar apresentação:', error);
      
      // Se der erro de quota no localStorage, tentar migrar para IndexedDB
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          // Migrar dados existentes para IndexedDB se necessário
          await mediaStorage.migrateFromLocalStorage();
          
          // Tentar salvar novamente
          localStorage.setItem(`presentation-${sectorId}`, JSON.stringify(presentation));
          setCurrentPresentation(presentation);
          
          showAlert('Dados Migrados', 'Dados migrados para armazenamento otimizado. Apresentação salva com sucesso!');
        } catch (migrationError) {
          console.error('Erro na migração:', migrationError);
          showAlert('Erro de Armazenamento', 'Erro ao salvar apresentação. Tente remover alguns arquivos de mídia para liberar espaço.');
        }
      } else {
        showAlert('Erro de Armazenamento', 'Erro ao salvar apresentação. Verifique o espaço de armazenamento.');
      }
    }
  };

  const handleSlidesChange = async (slides: Slide[]) => {
    if (!currentPresentation) return;
    
    const updatedPresentation = {
      ...currentPresentation,
      slides,
      updatedAt: new Date()
    };
    await savePresentation(updatedPresentation);
  };

  const startPresentation = () => {
    setSelectedSlideIndex(0);
    setIsViewing(true);
    // Solicitar tela cheia ao iniciar a apresentação
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if ((document.documentElement as any).mozRequestFullScreen) { /* Firefox */
      (document.documentElement as any).mozRequestFullScreen();
    } else if ((document.documentElement as any).webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      (document.documentElement as any).webkitRequestFullscreen();
    } else if ((document.documentElement as any).msRequestFullscreen) { /* IE/Edge */
      (document.documentElement as any).msRequestFullscreen();
    }
  };

  const stopPresentation = () => {
    setIsViewing(false);
  };

  const toggleEditor = () => {
    setIsEditing(!isEditing);
  };

  const handleSlideClick = (index: number) => {
    setSelectedSlideIndex(index);
    setIsViewing(true);
  };

  if (!currentPresentation) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Presentation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando apresentação...</p>
        </div>
      </div>
    );
  }

  if (isViewing) {
    return (
      <SlideViewer
        slides={currentPresentation.slides}
        initialSlideIndex={selectedSlideIndex}
        isFullscreen={true}
        onClose={stopPresentation}
        settings={settings}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            {/* Botão de voltar */}
            {onClose && (
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar</span>
              </button>
            )}
            
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {currentPresentation.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {currentPresentation.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{currentPresentation.slides.length} slides</span>
                <span>•</span>
                <span>Última atualização: {currentPresentation.updatedAt.toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  Pressione Shift + P para apresentar
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setSelectedSlideIndex(0);
                setIsViewing(true);
              }}
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
      
      {/* Editor */}
      {isEditing && (
        <SlideEditor
          slides={currentPresentation.slides}
          onSlidesChange={handleSlidesChange}
          sectorId={sectorId}
        />
      )}

      {/* Configurações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
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

      {/* Custom Dialog */}
      <CustomDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={dialogState.onConfirm}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
      />
    </div>
  );
};