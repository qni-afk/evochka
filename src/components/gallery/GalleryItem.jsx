import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GalleryItem = ({ item, onClick, index, isVisible }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { isAuthenticated } = useAuth();
  const videoRef = useRef(null);
  const itemRef = useRef(null);

  // Предварительно загружаем видео когда элемент становится видимым
  useEffect(() => {
    if (isVisible && item.type === 'video' && videoRef.current) {
      videoRef.current.preload = 'metadata';
      videoRef.current.muted = true;
      videoRef.current.load();
    }
  }, [isVisible, item.type]);

  // Эффект для автоматического воспроизведения видео при наведении
  useEffect(() => {
    if (isHovered && item.type === 'video' && videoRef.current) {
      const playVideo = () => {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.5;
        videoRef.current.play().catch(err => {
          console.error('Error playing video on hover:', err);
        });
      };

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

  const handleError = (e) => {
    console.error(`Failed to load ${item.type}: ${item.url}`);
    setIsError(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 0.5;
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
    if (isHovered && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(err => {
        console.error('Error playing loaded video:', err);
      });
    }
  };

  // Определяем оптимальные классы для элементов галереи
  const galleryItemClasses = `gallery-item ${item.category.toLowerCase()} ${isLoaded ? 'loaded' : 'loading'}`;

  // Базовый стиль с явным отсутствием поворота
  const baseStyle = {
    transform: 'rotate(0deg)',
    display: 'block',
    width: '100%',
    height: '100%',
    aspectRatio: '1 / 1',
    position: 'relative',
  };

  // Стиль для изображений и видео с явным отсутствием поворота
  const mediaStyle = {
    display: 'block',
    borderRadius: '12px',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'rotate(0deg)',
  };

  return (
    <div
      ref={itemRef}
      className={galleryItemClasses}
      onClick={handleItemClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={baseStyle}
    >
      {!isLoaded && !isError && (
        <div className="loading-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2
        }}>
          <div className="loading-spinner" style={{
            border: '3px solid rgba(255, 182, 193, 0.1)',
            borderTop: '3px solid #ff69b4'
          }}></div>
        </div>
      )}

      {isError && (
        <div className="error-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2
        }}>
          <div className="error-message" style={{
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#ff1493'
          }}>Ошибка загрузки</div>
        </div>
      )}

      {item.type === 'image' ? (
        <img
          src={item.url}
          alt={item.title}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            ...mediaStyle,
            position: 'absolute',
            top: 0,
            left: 0
          }}
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
            style={{
              ...mediaStyle,
              display: isLoaded && !isHovered ? 'block' : 'none',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
          {/* Видео для воспроизведения при наведении */}
          <video
            ref={videoRef}
            src={item.url}
            className="gallery-video"
            muted={true}
            playsInline
            loop
            autoPlay={false}
            preload="metadata"
            style={{
              ...mediaStyle,
              display: isHovered ? 'block' : 'none',
              position: 'absolute',
              top: 0,
              left: 0
            }}
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