import React, { useState, useRef, useEffect } from 'react';

const GalleryItem = ({ item, onClick, index, isVisible }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const itemRef = useRef(null);

  // Предварительно загружаем видео, когда элемент становится видимым
  useEffect(() => {
    if (isVisible && item.type === 'video' && videoRef.current) {
      videoRef.current.preload = 'auto'; // Полностью загружаем видео
      videoRef.current.load();
    }
  }, [isVisible, item.type]);

  // Эффект для автоматического воспроизведения видео при наведении
  useEffect(() => {
    if (isHovered && item.type === 'video' && videoRef.current) {
      const playVideo = () => {
        videoRef.current.play().catch(err => {
          console.error('Error playing video on hover:', err);
        });
      };

      // Пытаемся воспроизвести видео сразу и с небольшой задержкой для надежности
      playVideo();
      const timer = setTimeout(playVideo, 100);

      return () => clearTimeout(timer);
    }
  }, [isHovered, item.type]);

  const handleItemClick = () => {
    if (onClick) onClick(index);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    console.error(`Failed to load ${item.type}: ${item.url}`);
    setIsError(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (item.type === 'video' && videoRef.current) {
      // Установить звук на минимум, но не полностью выключать
      videoRef.current.volume = 0.1;
      videoRef.current.play().catch(err => {
        console.error('Error playing video on hover:', err);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    setIsLoaded(true);
    // Если уже наведен, начинаем воспроизведение
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Error playing loaded video:', err);
      });
    }
  };

  // Определяем оптимальные классы для элементов галереи
  const galleryItemClasses = `gallery-item ${item.category.toLowerCase()} ${isLoaded ? 'loaded' : 'loading'}`;

  return (
    <div
      ref={itemRef}
      className={galleryItemClasses}
      onClick={handleItemClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isLoaded && !isError && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {isError && (
        <div className="error-overlay">
          <div className="error-message">Failed to load</div>
        </div>
      )}

      {item.type === 'image' ? (
        <img
          src={item.url}
          alt={item.title}
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
      ) : (
        <>
          {/* Превью изображение для видео */}
          <img
            src={item.thumbnail || item.previewUrl}
            alt={item.title}
            className="gallery-preview"
            onLoad={handleLoad}
            onError={handleError}
            style={{ display: isLoaded && !isHovered ? 'block' : 'none' }}
          />
          {/* Видео для воспроизведения при наведении */}
          <video
            ref={videoRef}
            src={item.url}
            className="gallery-video"
            muted={false}
            volume={0.1}
            playsInline
            loop
            autoPlay={isHovered}
            preload="auto"
            style={{ display: isHovered ? 'block' : 'none' }}
            onCanPlay={handleVideoLoaded}
            onLoadedData={handleVideoLoaded}
            onError={handleError}
          />
        </>
      )}
    </div>
  );
};

export default GalleryItem;