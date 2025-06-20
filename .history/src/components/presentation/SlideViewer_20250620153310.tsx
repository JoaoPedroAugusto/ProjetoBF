import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2 } from 'lucide-react';
import { Slide, PresentationSettings } from './types/presentation';

interface SlideViewerProps {
  slides: Slide[];
  initialSlideIndex?: number;
  isFullscreen?: boolean;
  onClose?: () => void;
  settings?: PresentationSettings;
}

// Constantes para dimensões consistentes (mesmas do editor)
const EDITOR_WIDTH = 1200;
const EDITOR_HEIGHT = 675;

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slides,
  initialSlideIndex = 0,
  isFullscreen = false,
  onClose,
  settings = {
    autoAdvance: false,
    autoAdvanceDelay: 5,
    showControls: true,
    allowFullscreen: true,
    theme: 'dark'
  }
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isActuallyFullscreen, setIsActuallyFullscreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState<Map<string, number>>(new Map());
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[currentSlideIndex];

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsActuallyFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Gerenciar vídeos de forma mais robusta
  useEffect(() => {
    const currentVideos = new Map<string, HTMLVideoElement>();
    
    // Pausar todos os vídeos primeiro
    videoRefs.current.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
    
    // Configurar vídeos do slide atual
    currentSlide?.mediaElements?.forEach((element) => {
      if (element.type === 'video') {
        const existingVideo = videoRefs.current.get(element.id);
        if (existingVideo && existingVideo.src === element.url) {
          // Reutilizar vídeo existente
          currentVideos.set(element.id, existingVideo);
          existingVideo.muted = isMuted;
          existingVideo.currentTime = 0;
        } else {
          // Criar novo elemento de vídeo
          const video = document.createElement('video');
          video.src = element.url;
          video.preload = 'auto';
          video.muted = isMuted;
          video.loop = true;
          video.playsInline = true;
          video.crossOrigin = 'anonymous';
          
          // Configurações para melhor qualidade
          video.style.objectFit = 'cover';
          video.style.width = '100%';
          video.style.height = '100%';
          
          // Event listeners
          video.addEventListener('loadeddata', () => {
            console.log(`Vídeo ${element.id} carregado`);
            setVideoErrors(prev => {
              const newErrors = new Set(prev);
              newErrors.delete(element.id);
              return newErrors;
            });
          });
          
          video.addEventListener('error', (e) => {
            console.error(`Erro no vídeo ${element.id}:`, e);
            setVideoErrors(prev => new Set(prev.add(element.id)));
          });
          
          video.addEventListener('timeupdate', () => {
            if (video.duration > 0) {
              const progress = (video.currentTime / video.duration) * 100;
              setVideoProgress(prev => new Map(prev.set(element.id, progress)));
            }
          });
          
          currentVideos.set(element.id, video);
        }
      }
    });
    
    // Atualizar referências
    videoRefs.current = currentVideos;
    
    // Cleanup de vídeos não utilizados
    return () => {
      videoRefs.current.forEach((video, id) => {
        if (!currentVideos.has(id)) {
          video.pause();
          video.src = '';
          video.load();
        }
      });
    };
  }, [currentSlideIndex, isMuted]);

  // Auto advance
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && settings.autoAdvance) {
      interval = setInterval(() => {
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlideIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, settings.autoAdvanceDelay * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSlideIndex, slides.length, settings.autoAdvance, settings.autoAdvanceDelay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          event.preventDefault();
          if (isActuallyFullscreen) {
            exitFullscreen();
          } else if (onClose) {
            onClose();
          }
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          setIsMuted(!isMuted);
          break;
      }
      
      // Números para ir para slides específicos
      const num = parseInt(event.key);
      if (num >= 1 && num <= slides.length) {
        event.preventDefault();
        setCurrentSlideIndex(num - 1);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isActuallyFullscreen, isPlaying, isMuted, slides.length]);

  // Mouse movement for controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimeout(timeout);
    };

    if (isActuallyFullscreen) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (controlsTimeout) {
          clearTimeout(controlsTimeout);
        }
      };
    }
  }, [isActuallyFullscreen, controlsTimeout]);

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const toggleFullscreen = async () => {
    if (!settings.allowFullscreen) return;
    
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Erro ao alternar fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Erro ao sair do fullscreen:', error);
    }
  };

  const toggleVideoPlayback = (elementId: string) => {
    const video = videoRefs.current.get(elementId);
    if (video) {
      if (video.paused) {
        video.play().catch(error => {
          console.error(`Erro ao reproduzir vídeo ${elementId}:`, error);
          setVideoErrors(prev => new Set(prev.add(elementId)));
        });
      } else {
        video.pause();
      }
    }
  };

  const restartVideo = (elementId: string) => {
    const video = videoRefs.current.get(elementId);
    if (video) {
      video.currentTime = 0;
      video.play().catch(error => {
        console.error(`Erro ao reiniciar vídeo ${elementId}:`, error);
        setVideoErrors(prev => new Set(prev.add(elementId)));
      });
    }
  };

  if (!currentSlide) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Slide não encontrado</p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen bg-black overflow-hidden ${
        settings.theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}
      style={{
        backgroundColor: currentSlide.backgroundColor || '#000000'
      }}
    >
      {/* Background Image */}
      {currentSlide.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${currentSlide.backgroundImage})`,
            opacity: currentSlide.backgroundOpacity || 0.3
          }}
        />
      )}

      {/* Main Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            maxWidth: isActuallyFullscreen ? '100%' : '90%',
            maxHeight: isActuallyFullscreen ? '100%' : '90%'
          }}
        >
          {/* Slide Content */}
          {currentSlide.type !== 'fullscreen-background' && (
            <div 
              className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center z-10"
              style={{ color: currentSlide.textColor || '#ffffff' }}
            >
              {!currentSlide.hideTitle && (
                <h1 className={`font-bold mb-8 ${
                  isActuallyFullscreen ? 'text-6xl md:text-8xl' : 'text-4xl md:text-6xl'
                }`}>
                  {currentSlide.title}
                </h1>
              )}
              {!currentSlide.hideContent && (
                <div className={`whitespace-pre-wrap leading-relaxed ${
                  isActuallyFullscreen ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'
                }`}>
                  {currentSlide.content}
                </div>
              )}
            </div>
          )}

          {/* Media Elements */}
          {currentSlide.mediaElements?.map((element) => (
            <div
              key={element.id}
              className="absolute"
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
            >
              {element.type === 'image' ? (
                <img 
                  src={element.url}
                  alt={element.alt}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: `${element.borderRadius || 0}px` }}
                  onError={(e) => {
                    console.error(`Erro ao carregar imagem ${element.id}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="relative w-full h-full">
                  {videoErrors.has(element.id) ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                      <div className="text-center">
                        <p className="mb-2">Erro ao carregar vídeo</p>
                        <button
                          onClick={() => {
                            setVideoErrors(prev => {
                              const newErrors = new Set(prev);
                              newErrors.delete(element.id);
                              return newErrors;
                            });
                            // Tentar recarregar o vídeo
                            const video = videoRefs.current.get(element.id);
                            if (video) {
                              video.load();
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={(el) => {
                          if (el) {
                            videoRefs.current.set(element.id, el);
                          }
                        }}
                        src={element.url}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: `${element.borderRadius || 0}px` }}
                        muted={isMuted}
                        loop
                        playsInline
                        preload="auto"
                        onLoadedData={() => {
                          console.log(`Vídeo ${element.id} carregado no viewer`);
                          setVideoErrors(prev => {
                            const newErrors = new Set(prev);
                            newErrors.delete(element.id);
                            return newErrors;
                          });
                        }}
                        onError={(e) => {
                          console.error(`Erro no vídeo ${element.id}:`, e);
                          setVideoErrors(prev => new Set(prev.add(element.id)));
                        }}
                        onTimeUpdate={(e) => {
                          const video = e.currentTarget;
                          if (video.duration > 0) {
                            const progress = (video.currentTime / video.duration) * 100;
                            setVideoProgress(prev => new Map(prev.set(element.id, progress)));
                          }
                        }}
                      />
                      
                      {/* Video Controls */}
                      {showControls && (
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black bg-opacity-50 rounded px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleVideoPlayback(element.id)}
                              className="text-white hover:text-blue-300"
                            >
                              {videoRefs.current.get(element.id)?.paused ? (
                                <Play className="h-5 w-5" />
                              ) : (
                                <Pause className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => restartVideo(element.id)}
                              className="text-white hover:text-blue-300"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="flex-1 mx-3">
                            <div className="w-full bg-gray-600 rounded-full h-1">
                              <div 
                                className="bg-blue-500 h-1 rounded-full transition-all"
                                style={{ width: `${videoProgress.get(element.id) || 0}%` }}
                              />
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-white hover:text-blue-300"
                          >
                            {isMuted ? (
                              <VolumeX className="h-5 w-5" />
                            ) : (
                              <Volume2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {settings.showControls && (showControls || !isActuallyFullscreen) && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Navigation */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="ml-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="mr-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm pointer-events-auto">
                {currentSlideIndex + 1} / {slides.length}
              </span>
              {isPlaying && (
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs pointer-events-auto">
                  Auto
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {settings.allowFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 pointer-events-auto"
                >
                  {isActuallyFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </button>
              )}
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 pointer-events-auto"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 pointer-events-auto"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Progress */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
            <div className="w-full bg-black bg-opacity-30 h-1">
              <div 
                className="bg-blue-500 h-1 transition-all duration-300"
                style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          {!isActuallyFullscreen && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded text-xs pointer-events-auto">
              <div className="grid grid-cols-2 gap-2">
                <div><kbd className="bg-gray-700 px-1 rounded">←→</kbd> Navegar</div>
                <div><kbd className="bg-gray-700 px-1 rounded">F</kbd> Tela cheia</div>
                <div><kbd className="bg-gray-700 px-1 rounded">P</kbd> Play/Pause</div>
                <div><kbd className="bg-gray-700 px-1 rounded">M</kbd> Mudo</div>
                <div><kbd className="bg-gray-700 px-1 rounded">1-9</kbd> Ir para slide</div>
                <div><kbd className="bg-gray-700 px-1 rounded">Esc</kbd> Sair</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

