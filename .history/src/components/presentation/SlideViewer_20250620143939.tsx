import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
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
  const [videoElements, setVideoElements] = useState<Map<string, HTMLVideoElement>>(new Map());
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState<Map<string, number>>(new Map());

  const currentSlide = slides[currentSlideIndex];

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsActuallyFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Preload and manage video elements
  useEffect(() => {
    const newVideoElements = new Map<string, HTMLVideoElement>();
    
    currentSlide?.mediaElements?.forEach((element) => {
      if (element.type === 'video') {
        const video = document.createElement('video');
        video.src = element.url;
        video.preload = 'metadata';
        video.muted = isMuted;
        video.loop = true;
        video.playsInline = true;
        
        // Improve video quality
        video.style.imageRendering = 'high-quality';
        video.style.imageRendering = '-webkit-optimize-contrast';
        
        // Add event listeners for progress tracking
        video.addEventListener('timeupdate', () => {
          const progress = (video.currentTime / video.duration) * 100;
          setVideoProgress(prev => new Map(prev.set(element.id, progress)));
        });
        
        newVideoElements.set(element.id, video);
      }
    });
    
    setVideoElements(newVideoElements);
    
    // Cleanup old video elements
    return () => {
      videoElements.forEach((video) => {
        video.pause();
        video.src = '';
      });
    };
  }, [currentSlideIndex, isMuted]);

  // Auto-play videos when slide changes or video play state changes
  useEffect(() => {
    if (isVideoPlaying) {
      videoElements.forEach((video) => {
        video.play().catch(console.error);
      });
    } else {
      videoElements.forEach((video) => {
        video.pause();
      });
    }
  }, [isVideoPlaying, videoElements]);

  // Navegação por teclado
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        goToPreviousSlide();
        break;
      case 'ArrowRight':
      case ' ':
        event.preventDefault();
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
        event.preventDefault();
        toggleVideoPlayback();
        break;
      case 'm':
      case 'M':
        event.preventDefault();
        toggleMute();
        break;
      case 'r':
      case 'R':
        event.preventDefault();
        restartVideos();
        break;
    }
  }, [currentSlideIndex]);

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
  useEffect(() => {
    if (isActuallyFullscreen || isFullscreen) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActuallyFullscreen, isFullscreen, currentSlideIndex]);

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
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
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
    setIsMuted(!isMuted);
    videoElements.forEach((video) => {
      video.muted = !isMuted;
    });
  };

  const restartVideos = () => {
    videoElements.forEach((video) => {
      video.currentTime = 0;
      if (isVideoPlaying) {
        video.play().catch(console.error);
      }
    });
  };

  const handleMouseMove = () => {
    setShowControls(true);
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
          
          // Calcular escala mantendo proporção exata
          const scaleX = containerWidth / EDITOR_WIDTH;
          const scaleY = containerHeight / EDITOR_HEIGHT;
          const scale = Math.min(scaleX, scaleY);
          
          // Calcular posições escaladas com precisão sub-pixel
          const scaledX = Math.round(element.x * scale * 100) / 100;
          const scaledY = Math.round(element.y * scale * 100) / 100;
          const scaledWidth = Math.round(element.width * scale * 100) / 100;
          const scaledHeight = Math.round(element.height * scale * 100) / 100;
          
          // Centralizar o conteúdo com precisão
          const offsetX = Math.round((containerWidth - EDITOR_WIDTH * scale) / 2 * 100) / 100;
          const offsetY = Math.round((containerHeight - EDITOR_HEIGHT * scale) / 2 * 100) / 100;

          return (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${scaledX + offsetX}px`,
                top: `${scaledY + offsetY}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                zIndex: element.zIndex || 1,
                opacity: element.opacity || 1,
                transform: `rotate(${element.rotation || 0}deg)`,
                borderRadius: `${Math.round((element.borderRadius || 0) * scale * 100) / 100}px`,
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
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
              ) : element.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video 
                    key={`${element.id}-${currentSlideIndex}`}
                    src={element.url}
                    className="w-full h-full object-cover"
                    style={{ 
                      borderRadius: `${Math.round((element.borderRadius || 0) * scale * 100) / 100}px`,
                      imageRendering: 'high-quality'
                    }}
                    autoPlay={isVideoPlaying}
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedData={(e) => {
                      const video = e.target as HTMLVideoElement;
                      if (isVideoPlaying) {
                        video.play().catch(console.error);
                      }
                    }}
                  >
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                  
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
              ) : null}
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
            ) : currentSlide.media.type === 'video' ? (
              <video 
                src={currentSlide.media.url}
                controls={showControls}
                className="w-full h-auto max-h-96 rounded-lg shadow-lg"
                autoPlay={isVideoPlaying}
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                style={{ imageRendering: 'high-quality' }}
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
            ) : null}
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
                title="Play/Pause Apresentação (Espaço)"
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

          {/* Keyboard Shortcuts Help */}
          {showControls && (
            <div className="absolute bottom-20 right-4 bg-black bg-opacity-70 text-white text-xs p-3 rounded-lg max-w-xs">
              <div className="font-semibold mb-2">Atalhos do Teclado:</div>
              <div className="space-y-1">
                <div>← → : Navegar slides</div>
                <div>Espaço: Play/Pause apresentação</div>
                <div>P: Play/Pause vídeos</div>
                <div>M: Mute/Unmute</div>
                <div>R: Reiniciar vídeos</div>
                <div>F: Tela cheia</div>
                <div>Esc: Sair</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};