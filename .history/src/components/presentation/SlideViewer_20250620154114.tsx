import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2 } from 'lucide-react';
import { Slide, PresentationSettings } from '../types/presentation';

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
          });
          
          video.addEventListener('error', (e) => {
            console.error(`Erro no vídeo ${element.id}:`, e);
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
    
    videoRefs.current = currentVideos;
    
    // Cleanup
    return () => {
      videoRefs.current.forEach((video) => {
        video.pause();
      });
    };
  }, [currentSlideIndex, isMuted]);

  // Controlar reprodução de vídeos
  useEffect(() => {
    const playVideos = async () => {
      if (isVideoPlaying) {
        for (const [id, video] of videoRefs.current) {
          try {
            video.currentTime = 0;
            await video.play();
            console.log(`Vídeo ${id} iniciado`);
          } catch (error) {
            console.error(`Erro ao reproduzir vídeo ${id}:`, error);
          }
        }
      } else {
        videoRefs.current.forEach((video) => {
          video.pause();
        });
      }
    };

    playVideos();
  }, [isVideoPlaying, currentSlideIndex]);

  // Navegação por teclado com atalhos do Canva
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Prevenir ações padrão para teclas específicas
    if (['ArrowLeft', 'ArrowRight', ' ', 'p', 'P'].includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowLeft':
        goToPreviousSlide();
        break;
      case 'ArrowRight':
      case ' ':
        goToNextSlide();
        break;
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (onClose) {
          onClose();
        }
        break;
      case 'f':
      case 'F':
        if (!document.fullscreenElement) {
          toggleFullscreen();
        }
        break;
      case 'p':
      case 'P':
        // Atalho do Canva: Shift + P para apresentação
        if (event.shiftKey) {
          togglePlayPause();
        } else {
          toggleVideoPlayback();
        }
        break;
      case 'm':
      case 'M':
        toggleMute();
        break;
      case 'r':
      case 'R':
        restartVideos();
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        const slideIndex = parseInt(event.key) - 1;
        if (slideIndex < slides.length) {
          goToSlide(slideIndex);
        }
        break;
    }
  }, [currentSlideIndex, slides.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Auto-advance
  useEffect(() => {
    if (isPlaying && settings.autoAdvance) {
      const timer = setTimeout(() => {
        goToNextSlide();
      }, settings.autoAdvanceDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [currentSlideIndex, isPlaying, settings]);

  // Ocultar controles automaticamente
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    if (isActuallyFullscreen || isFullscreen) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    }
  }, [isActuallyFullscreen, isFullscreen, controlsTimeout]);

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (isPlaying) {
      setCurrentSlideIndex(0);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(Math.max(0, Math.min(index, slides.length - 1)));
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Erro ao alternar tela cheia:', error);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleVideoPlayback = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    videoRefs.current.forEach((video) => {
      video.muted = newMutedState;
    });
  };

  const restartVideos = () => {
    videoRefs.current.forEach((video) => {
      video.currentTime = 0;
      if (isVideoPlaying) {
        video.play().catch(console.error);
      }
    });
  };

  const toggleElementFullscreen = (elementId: string) => {
    const element = currentSlide?.mediaElements?.find(el => el.id === elementId);
    if (!element) return;

    // Atualizar o estado do elemento para tela cheia
    const updatedElements = currentSlide.mediaElements?.map(el => 
      el.id === elementId ? { ...el, isFullscreen: !el.isFullscreen } : { ...el, isFullscreen: false }
    );

    // Aqui você precisaria atualizar o slide, mas como estamos no viewer, 
    // vamos apenas simular o comportamento visual
    console.log(`Toggle fullscreen para elemento ${elementId}`);
  };

  if (!currentSlide) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Nenhum slide encontrado</p>
      </div>
    );
  }

  const containerClasses = isFullscreen || isActuallyFullscreen
    ? "fixed inset-0 z-50"
    : "relative w-full h-screen";

  const hasVideos = currentSlide.mediaElements?.some(el => el.type === 'video') || 
                   currentSlide.media?.type === 'video';

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: currentSlide.backgroundColor || '#1a1a1a',
        color: currentSlide.textColor || '#ffffff'
      }}
    >
      {/* Slide Content */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {currentSlide.backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${currentSlide.backgroundImage})`,
              opacity: currentSlide.fullscreenBackground ? 1 : (currentSlide.backgroundOpacity || 0.3),
              imageRendering: 'high-quality'
            }}
          />
        )}

        {/* Text Content */}
        {currentSlide.type !== 'fullscreen-background' && (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 md:p-16">
            {/* Title */}
            {!currentSlide.hideTitle && currentSlide.title && (
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-center mb-8 max-w-6xl">
                {currentSlide.title}
              </h1>
            )}

            {/* Content */}
            {!currentSlide.hideContent && currentSlide.content && (
              <div className="text-xl md:text-2xl lg:text-3xl text-center max-w-4xl mb-8">
                {currentSlide.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-4">{line}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Media Elements - POSICIONAMENTO ULTRA PRECISO */}
        {currentSlide.mediaElements?.map((element) => {
          // Obter dimensões da tela atual
          const containerWidth = window.innerWidth;
          const containerHeight = window.innerHeight;
          
          // Se o elemento está em tela cheia, ocupar toda a tela
          if (element.isFullscreen) {
            return (
              <div
                key={element.id}
                className="absolute inset-0 z-50 bg-black flex items-center justify-center"
                onClick={() => toggleElementFullscreen(element.id)}
              >
                {element.type === 'image' ? (
                  <img 
                    src={element.url}
                    alt={element.alt || currentSlide.title}
                    className="max-w-full max-h-full object-contain"
                    style={{ imageRendering: 'high-quality' }}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video 
                      key={`fullscreen-${element.id}-${currentSlideIndex}`}
                      ref={(el) => {
                        if (el) videoRefs.current.set(element.id, el);
                      }}
                      src={element.url}
                      className="max-w-full max-h-full object-contain"
                      autoPlay={isVideoPlaying}
                      muted={isMuted}
                      loop
                      playsInline
                      controls={false}
                      style={{ imageRendering: 'high-quality' }}
                      onError={(e) => {
                        console.error(`Erro ao carregar vídeo em tela cheia ${element.id}:`, e);
                        // Mostrar placeholder em caso de erro
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.parentElement?.querySelector('.video-placeholder-fullscreen');
                        if (placeholder) {
                          (placeholder as HTMLElement).style.display = 'flex';
                        }
                      }}
                      onLoadedData={() => {
                        console.log(`Vídeo em tela cheia ${element.id} carregado com sucesso`);
                      }}
                    />
                    
                    {/* Placeholder para vídeos com erro em tela cheia */}
                    <div 
                      className="video-placeholder-fullscreen absolute inset-0 bg-gray-800 flex items-center justify-center text-white"
                      style={{ display: 'none' }}
                    >
                      <div className="text-center">
                        <div className="text-8xl mb-4">📹</div>
                        <div className="text-2xl">Vídeo indisponível</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Botão para sair da tela cheia */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleElementFullscreen(element.id);
                  }}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                >
                  <Minimize2 className="h-6 w-6" />
                </button>
              </div>
            );
          }
          
          // Calcular escala mantendo proporção exata
          const scaleX = containerWidth / EDITOR_WIDTH;
          const scaleY = containerHeight / EDITOR_HEIGHT;
          const scale = Math.min(scaleX, scaleY);
          
          // Calcular posições escaladas com precisão sub-pixel
          const scaledX = Math.round(element.x * scale * 100) / 100;
          const scaledY = Math.round(element.y * scale * 100) / 100;
          const scaledWidth = Math.round(element.width * scale * 100) / 100;
          const scaledHeight = Math.round(element.height * scale * 100) / 100;
          
          // Centralizar o conteúdo com precisão - CORREÇÃO PARA BORDAS
          const offsetX = Math.round((containerWidth - EDITOR_WIDTH * scale) / 2 * 100) / 100;
          const offsetY = Math.round((containerHeight - EDITOR_HEIGHT * scale) / 2 * 100) / 100;

          // Garantir que elementos não saiam das bordas
          const finalX = Math.max(0, Math.min(containerWidth - scaledWidth, scaledX + offsetX));
          const finalY = Math.max(0, Math.min(containerHeight - scaledHeight, scaledY + offsetY));

          return (
            <div
              key={element.id}
              className="absolute group cursor-pointer"
              style={{
                left: `${finalX}px`,
                top: `${finalY}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                zIndex: element.zIndex || 1,
                opacity: element.opacity || 1,
                transform: `rotate(${element.rotation || 0}deg)`,
                borderRadius: `${Math.round((element.borderRadius || 0) * scale * 100) / 100}px`,
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
              onClick={() => toggleElementFullscreen(element.id)}
            >
              {element.type === 'image' ? (
                <img 
                  src={element.url}
                  alt={element.alt || currentSlide.title}
                  className="w-full h-full object-cover"
                  style={{ 
                    borderRadius: `${Math.round((element.borderRadius || 0) * scale * 100) / 100}px`,
                    imageRendering: 'high-quality',
                    imageRendering: '-webkit-optimize-contrast'
                  }}
                  loading="eager"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video 
                    key={`${element.id}-${currentSlideIndex}`}
                    ref={(el) => {
                      if (el) {
                        videoRefs.current.set(element.id, el);
                        el.muted = isMuted;
                        if (isVideoPlaying) {
                          el.play().catch(console.error);
                        }
                      }
                    }}
                    src={element.url}
                    className="w-full h-full object-cover"
                    style={{ 
                      borderRadius: `${Math.round((element.borderRadius || 0) * scale * 100) / 100}px`,
                      imageRendering: 'high-quality'
                    }}
                    muted={isMuted}
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    onError={(e) => {
                      console.error(`Erro ao carregar vídeo ${element.id}:`, e);
                      // Mostrar placeholder em caso de erro
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.parentElement?.querySelector('.video-placeholder');
                      if (placeholder) {
                        (placeholder as HTMLElement).style.display = 'flex';
                      }
                    }}
                    onLoadedData={() => {
                      console.log(`Vídeo ${element.id} carregado com sucesso`);
                    }}
                  />
                  
                  {/* Placeholder para vídeos com erro */}
                  <div 
                    className="video-placeholder absolute inset-0 bg-gray-800 flex items-center justify-center text-white"
                    style={{ 
                      display: 'none',
                      borderRadius: `${Math.round((element.borderRadius || 0) * scale * 100) / 100}px`
                    }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">📹</div>
                      <div className="text-sm">Vídeo indisponível</div>
                    </div>
                  </div>
                  
                  {/* Botão de tela cheia no hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full transition-all duration-200">
                      <Maximize2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Video Progress Bar */}
                  {isVideoPlaying && showControls && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black bg-opacity-50 rounded-full h-1">
                        <div 
                          className="bg-white rounded-full h-1 transition-all duration-300"
                          style={{ width: `${videoProgress.get(element.id) || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Legacy Media Support */}
        {currentSlide.media && !currentSlide.mediaElements?.length && (
          <div className="relative z-10 max-w-4xl w-full">
            {currentSlide.media.type === 'image' ? (
              <img 
                src={currentSlide.media.url}
                alt={currentSlide.media.alt || currentSlide.title}
                className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
                style={{ imageRendering: 'high-quality' }}
              />
            ) : (
              <video 
                src={currentSlide.media.url}
                controls={showControls}
                className="w-full h-auto max-h-96 rounded-lg shadow-lg"
                autoPlay={isVideoPlaying}
                muted={isMuted}
                loop
                playsInline
                preload="auto"
                style={{ imageRendering: 'high-quality' }}
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      {settings.showControls && showControls && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed z-50"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={goToNextSlide}
            disabled={currentSlideIndex === slides.length - 1 && !isPlaying}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed z-50"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
            <div className="flex items-center space-x-4">
              {/* Slide Counter */}
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentSlideIndex + 1} / {slides.length}
              </div>

              {/* Presentation Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                title="Play/Pause Apresentação (Shift+P)"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>

              {/* Video Controls */}
              {hasVideos && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleVideoPlayback}
                    className="bg-purple-600 bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200"
                    title="Play/Pause Vídeos (P)"
                  >
                    {isVideoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className="bg-purple-600 bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200"
                    title="Mute/Unmute (M)"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={restartVideos}
                    className="bg-purple-600 bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200"
                    title="Reiniciar Vídeos (R)"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Fullscreen Toggle */}
              {settings.allowFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                  title="Tela Cheia (F)"
                >
                  {isActuallyFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
              )}

              {/* Close Button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                  title="Fechar (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-50">
            <div className="bg-black bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
              />
            </div>
            
            {/* Slide Thumbnails */}
            <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-16 h-10 bg-black bg-opacity-50 rounded border-2 transition-all duration-200 ${
                    index === currentSlideIndex ? 'border-white' : 'border-transparent hover:border-gray-400'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center text-xs text-white">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};