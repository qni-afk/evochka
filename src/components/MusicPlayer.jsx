import React, { useState, useRef, useEffect } from 'react';
import '../styles/MusicPlayer.css';
import { useMediaQuery } from 'react-responsive';

// Пустые заглушки для аудио файлов
const song1 = '';
const song2 = '';
const song3 = '';

const MusicPlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [volume, setVolume] = useState(0.5); // Громкость по умолчанию 50%
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const tracks = [
    { title: 'Трек 1', artist: 'Артист 1', file: song1 },
    { title: 'Трек 2', artist: 'Артист 2', file: song2 },
    { title: 'Трек 3', artist: 'Артист 3', file: song3 }
  ];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

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
            <div className="track-title">{tracks[currentTrack].title}</div>
            <div className="track-artist">{tracks[currentTrack].artist}</div>
          </div>
          <div className="music-player-controls">
            <div className="music-player-button prev" onClick={handlePrevTrack}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" /></svg>
            </div>
            <div className="music-player-button next" onClick={handleNextTrack}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" /></svg>
            </div>
          </div>
        </>
      )}
      <audio
        ref={audioRef}
        src={tracks[currentTrack].file}
        onEnded={handleNextTrack}
      />
    </div>
  );
};

export default MusicPlayer;