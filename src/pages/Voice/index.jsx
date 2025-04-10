import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import './styles/Voice.css';
import axios from "axios";

function Voice() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeAudio, setActiveAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [hoverState, setHoverState] = useState({});
  const audioRefs = useRef({});
  const animationRef = useRef(null);
  const [shootingStars, setShootingStars] = useState([]);
  const [comets, setComets] = useState([]);
  const particlesContainerRef = useRef(null);
  const [audioMessages, setAudioMessages] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  // Создание падающих звезд
  useEffect(() => {
    if (!loading) {
      const createShootingStar = () => {
        const newStar = {
          id: Date.now(),
          left: Math.random() * 100,
          top: Math.random() * 100,
          duration: 2 + Math.random() * 4,
          size: 1 + Math.random() * 2
        };

        setShootingStars(prev => [...prev, newStar]);

        // Удаление звезды после анимации
        setTimeout(() => {
          setShootingStars(prev => prev.filter(star => star.id !== newStar.id));
        }, newStar.duration * 1000);
      };

      // Начальные звезды
      createShootingStar();

      // Интервал для создания новых звезд
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% шанс появления новой звезды
          createShootingStar();
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  // Создаем комету
  const createComet = (event) => {
    const comet = document.createElement('div');
    comet.classList.add('comet');
    comet.style.left = `${event.clientX}px`;
    comet.style.top = `${event.clientY}px`;
    document.body.appendChild(comet);

    setTimeout(() => {
      document.body.removeChild(comet);
    }, 1000);

    // Create particles
    if (particlesContainerRef.current) {
      const numParticles = 20; // Increased number of particles

      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Position near the comet
        particle.style.left = `${event.clientX}px`;
        particle.style.top = `${event.clientY}px`;

        // Random speed and direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        // Random duration between 600ms and 1200ms
        const duration = Math.random() * 600 + 600;

        // Add to DOM
        particlesContainerRef.current.appendChild(particle);

        // Animation start time
        const startTime = performance.now();

        // Animate particle
        const animateParticle = (timestamp) => {
          const elapsed = timestamp - startTime;
          const progress = elapsed / duration;

          if (progress < 1 && particlesContainerRef.current && particlesContainerRef.current.contains(particle)) {
            // Position
            const tx = event.clientX + vx * progress;
            const ty = event.clientY + vy * progress;

            // Apply easing
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

            // Move and fade
            particle.style.transform = `translate(${vx * easeProgress}px, ${vy * easeProgress}px)`;
            particle.style.opacity = 1 - easeProgress;

            // Continue animation
            requestAnimationFrame(animateParticle);
          } else if (particlesContainerRef.current && particlesContainerRef.current.contains(particle)) {
            // Remove particle when animation is done
            particlesContainerRef.current.removeChild(particle);
          }
        };

        // Start animation
        requestAnimationFrame(animateParticle);
      }
    }
  };

  // Функция для обновления прогресс-бара
  const updateProgress = () => {
    if (isPlaying && audioRefs.current[isPlaying]) {
      const audio = audioRefs.current[isPlaying];
      const currentProgress = (audio.currentTime / audio.duration) * 100 || 0;

      setProgress(prev => ({
        ...prev,
        [isPlaying]: currentProgress
      }));

      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  // Обработка наведения на элемент
  const handleMouseEnter = (audioId) => {
    setHoverState(prev => ({ ...prev, [audioId]: true }));
  };

  // Обработка ухода курсора с элемента
  const handleMouseLeave = (audioId) => {
    setHoverState(prev => ({ ...prev, [audioId]: false }));
  };

  // Обработка клика по аудио для воспроизведения
  const handleAudioClick = (audioId, e) => {
    e.stopPropagation(); // Предотвращаем создание кометы при клике на аудио
    const audio = audioRefs.current[audioId];

    // Создадим падающую звезду при клике
    const newStar = {
      id: Date.now(),
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 4,
      size: 1 + Math.random() * 2
    };

    setShootingStars(prev => [...prev, newStar]);

    // Удаление звезды после анимации
    setTimeout(() => {
      setShootingStars(prev => prev.filter(star => star.id !== newStar.id));
    }, newStar.duration * 1000);

    // Остановка текущего воспроизводимого аудио, если есть
    if (isPlaying && isPlaying !== audioId) {
      audioRefs.current[isPlaying].pause();
      audioRefs.current[isPlaying].currentTime = 0;
      cancelAnimationFrame(animationRef.current);
    }

    // Воспроизведение/пауза выбранного аудио
    if (isPlaying === audioId) {
      audio.pause();
      setIsPlaying(null);
      cancelAnimationFrame(animationRef.current);
    } else {
      audio.play().catch(error => {
        console.error("Ошибка воспроизведения:", error);
      });
      setIsPlaying(audioId);
      setActiveAudio(audioId);

      // Запускаем обновление прогресса
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  // Обработка события окончания воспроизведения
  const handleAudioEnded = (audioId) => {
    setIsPlaying(null);
    setProgress(prev => ({
      ...prev,
      [audioId]: 0
    }));
    cancelAnimationFrame(animationRef.current);
  };

  // Форматирование времени аудио (секунды -> мм:сс)
  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Эффект загрузки
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Увеличиваем время загрузки для лучшего эффекта

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Добавление обработчиков событий для аудио
  useEffect(() => {
    // Очистка предыдущей анимации
    cancelAnimationFrame(animationRef.current);

    Object.keys(audioRefs.current).forEach(id => {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.addEventListener('ended', () => handleAudioEnded(parseInt(id)));
      }
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
      Object.keys(audioRefs.current).forEach(id => {
        const audio = audioRefs.current[id];
        if (audio) {
          audio.removeEventListener('ended', () => handleAudioEnded(parseInt(id)));
        }
      });
    };
  }, [audioRefs.current]);

  useEffect(() => {
    const handleClick = (e) => {
      createComet(e);
    };

    document.body.addEventListener('click', handleClick);

    return () => {
      document.body.removeEventListener('click', handleClick);
      // Clean up particles container on unmount
      if (particlesContainerRef.current) {
        particlesContainerRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Simulate loading audio messages
    setTimeout(() => {
      setAudioMessages([
        {
          id: 1,
          title: 'Космическое послание',
          src: '/music/music[music+vocals].mp3',
          description: 'Голосовое сообщение из глубин галактики',
          duration: '01:30'
        },
        {
          id: 2,
          title: 'Звёздная пыль',
          src: '/music/music2[music+vocals].mp3',
          description: 'Сообщение с туманности Андромеды',
          duration: '00:55'
        },
        {
          id: 3,
          title: 'Пульсар',
          src: '/music/вич.ogg',
          description: 'Короткий импульс из космоса',
          duration: '00:10'
        },
        {
          id: 4,
          title: 'Галактический ритм',
          src: '/audio/i love dima.mp3',
          description: 'Послание из центра Млечного Пути',
          duration: '01:05'
        },
        {
          id: 5,
          title: 'Нейтронная звезда',
          src: '/audio/music3.ogg',
          description: 'Сигнал с нейтронной звезды',
          duration: '02:15'
        },
        {
          id: 6,
          title: 'Квазар',
          src: '/audio/i love you so by the walters.mp3',
          description: 'Загадочный сигнал от далекого квазара',
          duration: '01:47'
        },
        {
          id: 7,
          title: 'Чёрная дыра',
          src: '/audio/song1.mp3',
          description: 'Шепот с границы горизонта событий',
          duration: '02:30'
        },
        {
          id: 8,
          title: 'Сверхновая',
          src: '/audio/song2.mp3',
          description: 'Последнее сообщение умирающей звезды',
          duration: '01:20'
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Подключение к космическому эфиру...</div>
      </div>
    );
  }

  return (
    <>
      {/* Фиксированный космический фон */}
      <div className="cosmic-background"></div>

      {/* Падающие звезды */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${80 + star.size * 10}px`,
            animationDuration: `${star.duration}s`
          }}
        ></div>
      ))}

      {/* Кометы при клике */}
      {comets.map(comet => (
        <div
          key={comet.id}
          className="comet"
          style={{
            '--comet-start-x': `${comet.startX}px`,
            '--comet-start-y': `${comet.startY}px`,
            '--comet-end-x': `${comet.endX}px`,
            '--comet-end-y': `${comet.endY}px`,
            '--comet-angle': `${comet.angle}deg`,
            animationDuration: `${comet.duration}s`,
            animation: `comet-animation ${comet.duration}s forwards`
          }}
        ></div>
      ))}

      <div className="voice-container" onClick={createComet}>
        <div className="voice-content">
          <div className="voice-header">
            <h1>Космические Послания</h1>
            <p>Слушайте голосовые сообщения из далеких галактик. Нажмите, чтобы воспроизвести.</p>
          </div>

          <div className="voice-messages-grid">
            {audioMessages.map((audio) => (
              <div
                key={audio.id}
                className={`voice-message-item ${isPlaying === audio.id ? 'playing' : ''} ${hoverState[audio.id] ? 'hovered' : ''}`}
                onClick={(e) => handleAudioClick(audio.id, e)}
                onMouseEnter={() => handleMouseEnter(audio.id)}
                onMouseLeave={() => handleMouseLeave(audio.id)}
              >
                <div className="cosmic-dust"></div>
                <div className="voice-message-content">
                  <div className="voice-message-icon">
                    {isPlaying === audio.id ? (
                      <i className="fas fa-pause"></i>
                    ) : (
                      <i className="fas fa-play"></i>
                    )}
                  </div>
                  <div className="voice-message-info">
                    <h3>{audio.title}</h3>
                    <p>{audio.description}</p>
                    <div className="voice-message-stats">
                      <div className="voice-message-duration">
                        {isPlaying === audio.id && audioRefs.current[audio.id]
                          ? formatTime(audioRefs.current[audio.id].currentTime)
                          : '00:00'} / {audio.duration}
                      </div>
                    </div>
                  </div>
                </div>
                <audio
                  ref={el => (audioRefs.current[audio.id] = el)}
                  src={audio.src}
                  preload="metadata"
                  className="voice-audio"
                  onTimeUpdate={() => {
                    if (isPlaying === audio.id) {
                      const audio = audioRefs.current[audio.id];
                      setProgress(prev => ({
                        ...prev,
                        [audio.id]: (audio.currentTime / audio.duration) * 100 || 0
                      }));
                    }
                  }}
                />

                {/* Аудио прогресс-бар */}
                <div className="voice-progress-container">
                  <div
                    className="voice-progress-bar"
                    style={{
                      width: `${progress[audio.id] || 0}%`
                    }}
                  ></div>
                </div>

                {/* Визуальные эффекты для воспроизведения */}
                {isPlaying === audio.id && (
                  <div className="waveform">
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Voice;