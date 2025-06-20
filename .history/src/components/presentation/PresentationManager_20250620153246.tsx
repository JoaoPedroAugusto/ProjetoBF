import React, { useState, useEffect, useCallback } from 'react';
import { Presentation, Play, Edit, Settings, Eye, AlertTriangle, HardDrive } from 'lucide-react';
import { SlideViewer } from './SlideViewer';
import { SlideEditor } from './SlideEditor';
import { Slide, SlidePresentation, PresentationSettings } from './types/presentation';

interface PresentationManagerProps {
  sectorId: string;
  sectorName: string;
}

// Função para calcular uso do localStorage
const calculateStorageUsage = (): { used: number; available: number; percentage: number } => {
  try {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    
    // Estimar limite do localStorage (varia por navegador, geralmente 5-10MB)
    const estimatedLimit = 10 * 1024 * 1024; // 10MB
    const usedMB = totalSize / (1024 * 1024);
    const availableMB = (estimatedLimit - totalSize) / (1024 * 1024);
    const percentage = (totalSize / estimatedLimit) * 100;
    
    return {
      used: usedMB,
      available: Math.max(0, availableMB),
      percentage: Math.min(percentage, 100)
    };
  } catch (error) {
    console.error('Erro ao calcular uso de armazenamento:', error);
    return { used: 0, available: 10, percentage: 0 };
  }
};

// Função para limpar dados antigos do localStorage
const cleanupOldData = (): void => {
  try {
    const keysToCheck = [];
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        keysToCheck.push(key);
      }
    }
    
    // Remover dados muito antigos (mais de 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    keysToCheck.forEach(key => {
      try {
        if (key.startsWith('presentation-') || key === 'media-library') {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.updatedAt) {
            const updatedDate = new Date(data.updatedAt);
            if (updatedDate < thirtyDaysAgo) {
              localStorage.removeItem(key);
              console.log(`Removido dado antigo: ${key}`);
            }
          }
        }
      } catch (error) {
        // Se não conseguir parsear, pode ser um dado corrompido
        console.warn(`Dado possivelmente corrompido removido: ${key}`);
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Erro durante limpeza de dados:', error);
  }
};

export const PresentationManager: React.FC<PresentationManagerProps> = ({
  sectorId,
  sectorName
}) => {
  const [currentPresentation, setCurrentPresentation] = useState<SlidePresentation | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [storageInfo, setStorageInfo] = useState(calculateStorageUsage());
  const [showStorageWarning, setShowStorageWarning] = useState(false);
  const [settings, setSettings] = useState<PresentationSettings>({
    autoAdvance: false,
    autoAdvanceDelay: 5,
    showControls: true,
    allowFullscreen: true,
    theme: 'dark'
  });

  // Atualizar informações de armazenamento periodicamente
  useEffect(() => {
    const updateStorageInfo = () => {
      const info = calculateStorageUsage();
      setStorageInfo(info);
      setShowStorageWarning(info.percentage > 80);
    };

    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

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
    const loadPresentation = async () => {
      try {
        // Primeiro, tentar limpar dados antigos se o armazenamento estiver cheio
        if (storageInfo.percentage > 90) {
          cleanupOldData();
          setStorageInfo(calculateStorageUsage());
        }

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
          } catch (parseError) {
            console.error('Erro ao parsear apresentação salva:', parseError);
            // Se houver erro de parsing, criar apresentação padrão
            createDefaultPresentation();
          }
        } else {
          // Criar apresentação padrão
          createDefaultPresentation();
        }
      } catch (error) {
        console.error('Erro ao carregar apresentação:', error);
        createDefaultPresentation();
      }
    };

    const createDefaultPresentation = () => {
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
    };

    loadPresentation();
  }, [sectorId, sectorName, storageInfo.percentage]);

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

  const savePresentation = (presentation: SlidePresentation) => {
    try {
      // Verificar espaço disponível antes de salvar
      const currentStorage = calculateStorageUsage();
      const presentationData = JSON.stringify(presentation);
      const presentationSize = presentationData.length;
      
      // Estimar se há espaço suficiente (deixar pelo menos 1MB livre)
      const requiredSpace = presentationSize + (1024 * 1024); // +1MB de margem
      const availableSpace = currentStorage.available * 1024 * 1024;
      
      if (requiredSpace > availableSpace) {
        // Tentar limpar dados antigos primeiro
        cleanupOldData();
        const newStorage = calculateStorageUsage();
        const newAvailableSpace = newStorage.available * 1024 * 1024;
        
        if (requiredSpace > newAvailableSpace) {
          throw new Error('Espaço de armazenamento insuficiente. Considere remover mídias antigas ou usar arquivos menores.');
        }
      }

      localStorage.setItem(`presentation-${sectorId}`, presentationData);
      setCurrentPresentation(presentation);
      
      // Atualizar informações de armazenamento
      setStorageInfo(calculateStorageUsage());
      
      console.log('Apresentação salva com sucesso');
    } catch (error) {
      console.error('Erro ao salvar apresentação:', error);
      
      let errorMessage = 'Erro ao salvar apresentação.';
      
      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('storage') || error.name === 'QuotaExceededError') {
          errorMessage = 'Espaço de armazenamento esgotado. Tente:\n\n' +
                        '• Remover vídeos grandes da biblioteca de mídia\n' +
                        '• Usar imagens menores ou comprimidas\n' +
                        '• Limpar dados antigos do navegador\n' +
                        '• Usar vídeos de até 50MB';
        } else if (error.message.includes('insuficiente')) {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
      
      // Tentar salvar uma versão simplificada sem mídias grandes
      try {
        const simplifiedPresentation = {
          ...presentation,
          slides: presentation.slides.map(slide => ({
            ...slide,
            mediaElements: slide.mediaElements?.filter(element => 
              element.type === 'image' || 
              (element.type === 'video' && !element.url.startsWith('blob:'))
            ) || []
          }))
        };
        
        localStorage.setItem(`presentation-${sectorId}-backup`, JSON.stringify(simplifiedPresentation));
        console.log('Backup simplificado salvo');
      } catch (backupError) {
        console.error('Erro ao salvar backup:', backupError);
      }
    }
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
    setSelectedSlideIndex(0);
    setIsViewing(true);
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

  const handleCleanupStorage = () => {
    if (confirm('Isso removerá dados antigos e pode liberar espaço. Continuar?')) {
      cleanupOldData();
      setStorageInfo(calculateStorageUsage());
      alert('Limpeza concluída!');
    }
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
        initialSlideIndex={selectedSlideIndex}
        isFullscreen={true}
        onClose={stopPresentation}
        settings={settings}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Aviso de Armazenamento */}
      {showStorageWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Armazenamento quase cheio ({storageInfo.percentage.toFixed(1)}%)
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Espaço usado: {storageInfo.used.toFixed(1)}MB | Disponível: {storageInfo.available.toFixed(1)}MB
              </p>
              <div className="mt-2">
                <button
                  onClick={handleCleanupStorage}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                >
                  Limpar dados antigos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <span>•</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                Pressione Shift + P para apresentar
              </span>
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

        {/* Informações de Armazenamento */}
        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Armazenamento Local</span>
            </div>
            <span className="text-sm font-medium">
              {storageInfo.used.toFixed(1)}MB usado ({storageInfo.percentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                storageInfo.percentage > 90 ? 'bg-red-500' : 
                storageInfo.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
            />
          </div>
          {storageInfo.percentage > 80 && (
            <p className="text-xs text-gray-600 mt-1">
              Dica: Use vídeos menores (máx. 50MB) ou remova mídias antigas para liberar espaço.
            </p>
          )}
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
                onClick={() => handleSlideClick(index)}
              >
                {/* Background Image */}
                {slide.backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${slide.backgroundImage})`,
                      opacity: slide.backgroundOpacity || 0.3
                    }}
                  />
                )}
                
                {/* Content */}
                {slide.type !== 'fullscreen-background' && (
                  <div className="relative p-3 h-full flex flex-col justify-center">
                    {!slide.hideTitle && (
                      <div className="text-xs font-bold mb-1 truncate">
                        {slide.title}
                      </div>
                    )}
                    {!slide.hideContent && (
                      <div className="text-xs opacity-75 line-clamp-3">
                        {slide.content}
                      </div>
                    )}
                  </div>
                )}

                {/* Media Elements Preview */}
                {slide.mediaElements && slide.mediaElements.length > 0 && (
                  <div className="absolute inset-0">
                    {slide.mediaElements.slice(0, 2).map((element, idx) => (
                      <div
                        key={element.id}
                        className="absolute"
                        style={{
                          left: `${(element.x || 0) * 0.2}px`,
                          top: `${(element.y || 0) * 0.2}px`,
                          width: `${(element.width || 100) * 0.2}px`,
                          height: `${(element.height || 100) * 0.2}px`,
                          opacity: (element.opacity || 1) * 0.8,
                          zIndex: element.zIndex || 1
                        }}
                      >
                        {element.type === 'image' ? (
                          <img 
                            src={element.url}
                            alt={element.alt}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-purple-500 rounded flex items-center justify-center">
                            <span className="text-xs text-white">📹</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {slide.mediaElements.length > 2 && (
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        +{slide.mediaElements.length - 2}
                      </div>
                    )}
                  </div>
                )}
                
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

