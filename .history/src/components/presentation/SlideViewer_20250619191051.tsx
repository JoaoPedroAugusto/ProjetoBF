import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Play, Pause } from 'lucide-react';
import { Slide, PresentationSettings } from '../../types/presentation';

interface SlideViewerProps {
  slides: Slide[];
  initialSlideIndex?: number;
  isFullscreen?: boolean;
  onClose?: () => void;
  settings?: PresentationSettings;
}

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

  const currentSlide = slides[currentSlideIndex];

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
        if (onClose) onClose();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
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
    if (isFullscreen) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, currentSlideIndex]);

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (isPlaying) {
      setCurrentSlideIndex(0); // Loop quando em reprodução automática
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
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

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 bg-black"
    : "relative w-full h-screen bg-gray-900";

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
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background Image */}
        {currentSlide.backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: `url(${currentSlide.backgroundImage})` }}
          />
        )}

        {/* Main Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 md:p-16">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-center mb-8 max-w-6xl">
            {currentSlide.title}
          </h1>

          {/* Content */}
          <div className="text-xl md:text-2xl lg:text-3xl text-center max-w-4xl mb-8">
            {currentSlide.content.split('\n').map((line, index) => (
              <p key={index} className="mb-4">{line}</p>
            ))}
          </div>

          {/* Media Content */}
          {currentSlide.media && (
            <div className="max-w-4xl w-full">
              {currentSlide.media.type === 'image' ? (
                <img 
                  src={currentSlide.media.url}
                  alt={currentSlide.media.alt || currentSlide.title}
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
                />
              ) : currentSlide.media.type === 'video' ? (
                <video 
                  src={currentSlide.media.url}
                  controls
                  className="w-full h-auto max-h-96 rounded-lg shadow-lg"
                  autoPlay={isPlaying}
                >
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {settings.showControls && showControls && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={goToNextSlide}
            disabled={currentSlideIndex === slides.length - 1 && !isPlaying}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
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
                  {document.fullscreenElement ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
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
          <div className="absolute bottom-4 left-4 right-4">
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

