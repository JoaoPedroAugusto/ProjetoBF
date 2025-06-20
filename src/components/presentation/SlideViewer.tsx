import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Play, Pause } from 'lucide-react';
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

  const currentSlide = slides[currentSlideIndex];

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsActuallyFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
              opacity: currentSlide.fullscreenBackground ? 1 : (currentSlide.backgroundOpacity || 0.3)
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

        {/* Media Elements - POSICIONAMENTO CORRIGIDO */}
        {currentSlide.mediaElements?.map((element) => {
          // Obter dimensões da tela atual
          const containerWidth = window.innerWidth;
          const containerHeight = window.innerHeight;
          
          // Calcular escala baseada nas dimensões do editor vs tela atual
          const scaleX = containerWidth / EDITOR_WIDTH;
          const scaleY = containerHeight / EDITOR_HEIGHT;
          
          // Usar a menor escala para manter proporção
          const scale = Math.min(scaleX, scaleY);
          
          // Calcular posições escaladas com precisão
          const scaledX = element.x * scale;
          const scaledY = element.y * scale;
          const scaledWidth = element.width * scale;
          const scaledHeight = element.height * scale;
          
          // Centralizar o conteúdo se a escala for diferente
          const offsetX = (containerWidth - EDITOR_WIDTH * scale) / 2;
          const offsetY = (containerHeight - EDITOR_HEIGHT * scale) / 2;

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
                borderRadius: `${(element.borderRadius || 0) * scale}px`
              }}
            >
              {element.type === 'image' ? (
                <img 
                  src={element.url}
                  alt={element.alt || currentSlide.title}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: `${(element.borderRadius || 0) * scale}px` }}
                />
              ) : element.type === 'video' ? (
                <video 
                  src={element.url}
                  controls={showControls}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: `${(element.borderRadius || 0) * scale}px` }}
                  autoPlay={isPlaying}
                  muted
                  loop
                >
                  Seu navegador não suporta o elemento de vídeo.
                </video>
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
              />
            ) : currentSlide.media.type === 'video' ? (
              <video 
                src={currentSlide.media.url}
                controls={showControls}
                className="w-full h-auto max-h-96 rounded-lg shadow-lg"
                autoPlay={isPlaying}
                muted
                loop
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

              {/* Play/Pause Button */}
              {settings.autoAdvance && (
                <button
                  onClick={togglePlayPause}
                  className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Fullscreen Toggle */}
              {settings.allowFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                >
                  {isActuallyFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
              )}

              {/* Close Button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
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