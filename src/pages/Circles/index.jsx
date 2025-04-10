import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import CircleAdmin from '../../components/CircleAdmin';
import './styles/Circles.css';

function Circles() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const videoRefs = useRef({});

  // List of all circle videos
  const circleVideos = [
    { id: 1, title: 'Circle 1', src: '/circle/circle1.mp4' },
    { id: 2, title: 'Circle 2', src: '/circle/circle2.mp4' },
    { id: 3, title: 'Circle 3', src: '/circle/circle3.mp4' },
    { id: 4, title: 'Circle 4', src: '/circle/circle4.mp4' },
    { id: 5, title: 'Circle 5', src: '/circle/circle5.mp4' },
    { id: 6, title: 'Circle 6', src: '/circle/circle6.mp4' },
    { id: 7, title: 'Circle 7', src: '/circle/circle7.mp4' },
    { id: 8, title: 'Circle 8', src: '/circle/circle8.mp4' },
    { id: 9, title: 'Circle 9', src: '/circle/circle9.mp4' },
    { id: 10, title: 'Circle 10', src: '/circle/circle10.mp4' },
    { id: 11, title: 'Circle 11', src: '/circle/circle11.mp4' },
    { id: 12, title: 'Circle 12', src: '/circle/circle12.mp4' },
    { id: 13, title: 'Circle 13', src: '/circle/circle13.mp4' },
    { id: 14, title: 'Circle 14', src: '/circle/circle14.mp4' },
    { id: 15, title: 'Circle 15', src: '/circle/circle15.mp4' },
  ];

  // Handle video hover start
  const handleMouseOver = (video) => {
    setHoveredVideoId(video.id);

    // Get video element
    const videoElement = videoRefs.current[video.id];
    if (videoElement) {
      videoElement.volume = 0.5; // Устанавливаем громкость
      videoElement.muted = false; // Включаем звук
      videoElement.play(); // Запускаем видео
    }
  };

  // Handle video hover end
  const handleMouseOut = (video) => {
    setHoveredVideoId(null);

    // Get video element
    const videoElement = videoRefs.current[video.id];
    if (videoElement) {
      videoElement.pause(); // Останавливаем видео
      videoElement.currentTime = 0; // Сбрасываем время
      videoElement.muted = true; // Отключаем звук
    }
  };

  // Handle video click to show in modal
  const handleVideoClick = (video) => {
    // Останавливаем воспроизведение видео, на которое было наведение
    if (hoveredVideoId) {
      const videoElement = videoRefs.current[hoveredVideoId];
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
        videoElement.muted = true;
      }
    }

    setActiveVideo(video);
  };

  // Close modal
  const closeModal = () => {
    setActiveVideo(null);
  };

  useEffect(() => {
    // Simple loading effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Modal event listeners
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (activeVideo) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [activeVideo]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="circles-container">
      <div className="circles-header">
        <h1>Circle Videos</h1>
        <p>Explore our collection of beautiful circle videos. Hover to hear sound!</p>
        <div className="circles-sound-notice">
          <div className="sound-icon">♪</div>
          <span>Hover over circles to play with sound. Click for fullscreen view.</span>
        </div>
      </div>

      <div className="circles-video-grid">
        {circleVideos.map((video) => (
          <div
            key={video.id}
            className={`circle-video-item ${hoveredVideoId === video.id ? 'with-sound' : ''}`}
            onClick={() => handleVideoClick(video)}
            onMouseOver={() => handleMouseOver(video)}
            onMouseOut={() => handleMouseOut(video)}
          >
            <video
              className="circle-video-thumbnail"
              src={video.src}
              ref={el => (videoRefs.current[video.id] = el)}
              preload="metadata"
              muted // По умолчанию звук отключен
            />
            {hoveredVideoId === video.id && <div className="sound-active-indicator"></div>}
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="video-modal-overlay" onClick={closeModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <h2>{activeVideo.title}</h2>
            <video
              src={activeVideo.src}
              controls
              autoPlay
              className="video-modal-player"
            />
          </div>
        </div>
      )}

      {user && user.username === 'admin' && (
        <div className="admin-section">
          <h2>Admin Controls</h2>
          <CircleAdmin />
        </div>
      )}
    </div>
  );
}

export default Circles;