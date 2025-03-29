import React, { useState, useRef, useEffect } from 'react';
import '../styles/MusicPlayer.css';
import { useMediaQuery } from 'react-responsive';

// Реальные ссылки на аудио файлы
const song1 = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1b0292fe04.mp3';
const song2 = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_942594a645.mp3';
const song3 = 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1efd.mp3';
// Ссылка на приватную песню (бесплатный трек с pixabay для демонстрации)
const privateTrack = 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_dc39bafada.mp3?filename=beautiful-piano-115480.mp3';

const MusicPlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [volume, setVolume] = useState(0.5); // Громкость по умолчанию 50%
  const [isMuted, setIsMuted] = useState(false);
  const [privateTrackEnabled, setPrivateTrackEnabled] = useState(false);

  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Проверяем наличие активации приватной песни
  useEffect(() => {
    const savedPrivateTrack = localStorage.getItem('privateTrackEnabled');
    console.log("Проверка приватной песни:", savedPrivateTrack);
    if (savedPrivateTrack === 'true') {
      setPrivateTrackEnabled(true);
      console.log("Приватная песня активирована");
    }
  }, []);

  // Получаем список треков с учетом приватной песни
  const getTracks = () => {
    const regularTracks = [
      { title: 'Sunny Morning', artist: 'SoulProdMusic', file: song1 },
      { title: 'Cinematic Dreams', artist: 'SergeQuadrado', file: song2 },
      { title: 'Deep Relaxation', artist: 'prazkhanal', file: song3 }
    ];

    // Если приватная песня активирована, добавляем ее в список
    if (privateTrackEnabled) {
      console.log("Добавляем приватную песню в список треков");
      return [
        ...regularTracks,
        { title: '💖 Приватная песня', artist: 'Для тебя', file: privateTrack }
      ];
    }

    return regularTracks;
  };

  const tracks = getTracks();

  useEffect(() => {
    if (audioRef.current) {
      // Задаем громкость
      audioRef.current.volume = volume;

      // Добавляем обработчики ошибок
      const handleError = (e) => {
        console.error("Ошибка аудио:", e);
        alert(`Ошибка воспроизведения: ${e.target.error ? e.target.error.message : 'Неизвестная ошибка'}`);
        setIsPlaying(false);
      };

      const handleCanPlay = () => {
        console.log("Аудио готово к воспроизведению:", tracks[currentTrack].title);
      };

      audioRef.current.addEventListener('error', handleError);
      audioRef.current.addEventListener('canplay', handleCanPlay);

      if (isPlaying) {
        console.log("Пытаемся воспроизвести трек:", tracks[currentTrack]);
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
          // Показываем сообщение об ошибке пользователю
          if (tracks[currentTrack].title.includes('Приватная песня')) {
            alert('Не удалось воспроизвести приватную песню. Возможно, проблема с доступом к файлу.');
          } else {
            alert(`Не удалось воспроизвести: ${error.message || 'Проверьте подключение к интернету'}`);
          }
        });
      } else {
        audioRef.current.pause();
      }

      return () => {
        // Очищаем обработчики при размонтировании
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [isPlaying, currentTrack, tracks, volume]);

  // Если приватная песня активирована и в списке, автоматически её выбираем
  useEffect(() => {
    if (privateTrackEnabled && tracks.length > 3) {
      setCurrentTrack(3); // Индекс приватной песни
    }
  }, [privateTrackEnabled, tracks.length]);

  useEffect(() => {
    // Reset player to default position on mobile
    if (isMobile) {
      setPosition({ x: 0, y: 0 });
      lastPositionRef.current = { x: 0, y: 0 };
    }
  }, [isMobile]);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = (e) => {
    e.stopPropagation();
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevTrack = (e) => {
    e.stopPropagation();
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const toggleExpand = (e) => {
    if (!isDragging) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    let clientX, clientY;

    // Handle both mouse and touch events
    if (e.type === 'mousedown') {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.type === 'touchstart') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;

      // For iOS Safari: disable animations during drag
      if (playerRef.current) {
        playerRef.current.style.transition = 'none';
      }
    }

    setIsDragging(true);
    dragStartPosRef.current = {
      x: clientX - lastPositionRef.current.x,
      y: clientY - lastPositionRef.current.y
    };
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;

    let clientX, clientY;

    if (e.type === 'mousemove') {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.type === 'touchmove') {
      e.preventDefault(); // Prevent scrolling when dragging
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const newPosition = {
      x: clientX - dragStartPosRef.current.x,
      y: clientY - dragStartPosRef.current.y
    };

    setPosition(newPosition);
    lastPositionRef.current = newPosition;
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    // Restore transitions for iOS Safari
    if (playerRef.current) {
      playerRef.current.style.transition = 'transform 0.2s, box-shadow 0.3s';
    }

    // If the player was barely moved, consider it a click
    const moveDistance = Math.sqrt(
      Math.pow(position.x - lastPositionRef.current.x, 2) +
      Math.pow(position.y - lastPositionRef.current.y, 2)
    );

    if (moveDistance < 5) {
      toggleExpand();
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  const playerStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    maxWidth: isExpanded ? '300px' : '60px',
  };

  const toggleControls = (e) => {
    // Если мы просто кликаем (не тащим), показываем/скрываем элементы управления
    if (!isDragging) {
      setShowControls(!showControls);
      // Если панель открывается, то сразу переключаем воспроизведение
      if (!showControls) {
        handlePlayPause(e);
      }
    }
  };

  const handleClickOutside = (e) => {
    if (playerRef.current && !playerRef.current.contains(e.target)) {
      setShowControls(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      // Если громкость изменена на 0, считаем что звук выключен
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`music-player-floating ${isExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''}`}
      ref={playerRef}
      style={playerStyle}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={toggleExpand}
    >
      <div className="music-player-button play-pause" onClick={handlePlayPause}>
        {isPlaying ?
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg> :
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>
        }
      </div>
      {isExpanded && (
        <>
          <div className="music-track-info">
            <div className={`track-title ${tracks[currentTrack].title.includes('Приватная') ? 'private-track-title' : ''}`}>
              {tracks[currentTrack].title}
            </div>
            <div className="track-artist">{tracks[currentTrack].artist}</div>
            {isPlaying && <div className="loading-indicator">
              <span></span><span></span><span></span><span></span>
            </div>}
          </div>
          <div className="music-player-controls">
            <div className="music-player-button prev" onClick={handlePrevTrack}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" /></svg>
            </div>
            <div className="music-player-button next" onClick={handleNextTrack}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" /></svg>
            </div>
          </div>
          <div className="volume-control">
            <button className="volume-button" onClick={toggleMute}>
              {isMuted ?
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" /></svg> :
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>
              }
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </>
      )}
      <audio
        ref={audioRef}
        src={tracks[currentTrack].file}
        onEnded={handleNextTrack}
        preload="auto"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default MusicPlayer;