import React from 'react';
import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar';
import ThemeLanguageSwitcher from '../../components/ThemeLanguageSwitcher';
import GalleryImage from '../../components/gallery/GalleryImage';
import { useLanguage } from '../../context/LanguageContext';
import './styles/Home.css';

// Использовать относительные URL для изображений с помощью new URL() в Vite
const image1 = new URL('/images/image_2025-02-28_01-11-28.png', import.meta.url).href;
const image2 = new URL('/images/photo_2025-02-28_01-09-21.jpg', import.meta.url).href;
const image3 = new URL('/images/photo_2024-06-17_22-32-56.jpg', import.meta.url).href;
const image4 = new URL('/images/eva%20white.jpg', import.meta.url).href;
const image5 = new URL('/images/eva%20blue.jpg', import.meta.url).href;
const image6 = new URL('/images/eva%20sex.jpg', import.meta.url).href;

function Home() {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState([false, false, false, false]);
  const [videoError, setVideoError] = useState([false, false, false, false]);
  const [showFloatingMessage, setShowFloatingMessage] = useState(false);
  const [particles, setParticles] = useState([]);
  const [hoverSection, setHoverSection] = useState(null);
  const contentRef = useRef(null);
  const sectionsRef = useRef([]);
  const videoRefs = useRef([]);
  const particlesRef = useRef(null);

  const videos = [
    '/video/IMG_0886.MOV',
    '/video/IMG_4999.MOV',
    '/video/IMG_6404.MOV',
    '/video/IMG_6710.MP4'
  ];

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'ru' ? 'en' : 'ru');
  };

  // Инициализация компонента
  useEffect(() => {
    // Принудительное воспроизведение первого видео при монтировании
    const playFirstVideo = () => {
      if (videoRefs.current[0]) {
        videoRefs.current[0].play()
          .then(() => console.log('First video started successfully'))
          .catch(e => console.error('Error playing first video on mount:', e));
      }
    };

    // Пробуем воспроизвести несколько раз с задержкой
    playFirstVideo();
    setTimeout(playFirstVideo, 500);
    setTimeout(playFirstVideo, 1500);

    // Предотвращаем блокировку автовоспроизведения через пользовательское взаимодействие
    const handleUserInteraction = () => {
      playFirstVideo();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    // Создаем начальные частицы - с защитой от ошибок
    try {
      createInitialParticles();
    } catch (err) {
      console.error('Error creating particles:', err);
    }

    // Показать плавающее сообщение через некоторое время
    setTimeout(() => {
      setShowFloatingMessage(true);
    }, 5000);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Создание начальных частиц
  const createInitialParticles = () => {
    const newParticles = [];
    const count = 15; // Уменьшили количество для производительности

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 3, // Меньший размер
        opacity: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2, // Медленнее движение
        speedY: (Math.random() - 0.5) * 0.2,
        color: getRandomColor()
      });
    }

    setParticles(newParticles);
  };

  // Получение случайного цвета для частиц
  const getRandomColor = () => {
    const colors = [
      'rgba(255, 105, 180, 0.6)', // Розовый
      'rgba(138, 43, 226, 0.6)',  // Фиолетовый
      'rgba(30, 144, 255, 0.6)',  // Голубой
      'rgba(255, 182, 193, 0.6)'  // Светло-розовый
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Обновление позиций частиц - оптимизированная версия с задержкой
  useEffect(() => {
    const updateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.speedX,
          y: particle.y + particle.speedY,
          // Проверка границ для создания эффекта бесконечности
          ...(particle.x > 100 && { x: 0 }),
          ...(particle.x < 0 && { x: 100 }),
          ...(particle.y > 100 && { y: 0 }),
          ...(particle.y < 0 && { y: 100 })
        }))
      );
    };

    // Обновляем с меньшей частотой для экономии ресурсов
    const interval = setInterval(updateParticles, 100);
    return () => clearInterval(interval);
  }, []);

  // Обработка воспроизведения и ошибок видео
  useEffect(() => {
    // Предзагрузка всех видео при монтировании компонента
    videos.forEach((videoSrc, idx) => {
      const videoPreload = document.createElement('video');
      videoPreload.src = videoSrc;
      videoPreload.preload = 'auto';
      videoPreload.muted = true;
      videoPreload.style.display = 'none';
      document.body.appendChild(videoPreload);

      // Удаляем элемент после загрузки
      videoPreload.addEventListener('loadeddata', () => {
        document.body.removeChild(videoPreload);
      });

      // Для первого видео, начинаем воспроизведение сразу после загрузки
      if (idx === 0) {
        videoPreload.addEventListener('loadeddata', () => {
          if (videoRefs.current[0]) {
            videoRefs.current[0].play().catch(e => {
              console.error('Ошибка воспроизведения первого видео:', e);
            });
          }
        });
      }
    });

    // Force play current video
    const playCurrentVideo = () => {
      if (videoRefs.current[currentVideo]) {
        videoRefs.current[currentVideo].play().catch(e => {
          console.error('Ошибка воспроизведения текущего видео:', e);
        });
      }
    };

    // Try multiple times to play the video
    const playInterval = setInterval(playCurrentVideo, 1000);
    playCurrentVideo();

    // After 5 seconds, clear the interval
    setTimeout(() => {
      clearInterval(playInterval);
    }, 5000);

    videoRefs.current.forEach((videoEl, index) => {
      if (!videoEl) return;

      // Явно устанавливаем атрибуты для всех устройств
      videoEl.muted = true;
      videoEl.setAttribute('muted', '');
      videoEl.setAttribute('playsinline', '');
      videoEl.setAttribute('webkit-playsinline', 'true');
      videoEl.setAttribute('preload', 'auto');

      const handleCanPlay = () => {
        const newLoaded = [...videoLoaded];
        newLoaded[index] = true;
        setVideoLoaded(newLoaded);

        // Если это текущее видео, пробуем воспроизвести его
        if (index === currentVideo) {
          const playPromise = videoEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              console.error('Ошибка воспроизведения:', e);
              const newErrors = [...videoError];
              newErrors[index] = true;
              setVideoError(newErrors);
            });
          }
        }
      };

      const handleError = (e) => {
        console.error(`Ошибка загрузки видео ${index}:`, e);
        const newErrors = [...videoError];
        newErrors[index] = true;
        setVideoError(newErrors);
      };

      videoEl.addEventListener('canplay', handleCanPlay);
      videoEl.addEventListener('error', handleError);

      return () => {
        videoEl.removeEventListener('canplay', handleCanPlay);
        videoEl.removeEventListener('error', handleError);
      };
    });
  }, [currentVideo, videoRefs.current.length]);

  // Смена активного видео
  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (!videoEl) return;

      if (index === currentVideo) {
        if (videoLoaded[index] && !videoError[index]) {
          videoEl.play().catch(e => console.error('Ошибка воспроизведения:', e));
        }
      } else {
        videoEl.pause();
      }
    });
  }, [currentVideo, videoLoaded]);

  // Инициализация GSAP анимаций
  useEffect(() => {
    // Анимации заголовка
    const title = document.querySelector(".animate__title");
    const text = document.querySelector(".animate__text");
    const floatingMsg = document.querySelector(".floating-message");

    if (title) {
      gsap.to(title, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
      });
    }

    if (text) {
      gsap.to(text, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 1,
        ease: "sine.out"
      });
    }

    // Анимация плавающего сообщения
    if (floatingMsg) {
      gsap.to(floatingMsg, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out",
        delay: 5,
      });
    }

    // Наблюдатель за элементами (замена ScrollTrigger)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
          });
        }
      });
    }, { threshold: 0.1 });

    sectionsRef.current.forEach(section => {
      if (section) {
        observer.observe(section);
        gsap.set(section, { opacity: 0, y: 50 });
      }
    });

    // Таймер отношений
    function updateTimer() {
      const startDate = new Date("2023-12-09T00:00:00Z");
      const now = new Date();
      const diff = now - startDate;

      const years = Math.floor(diff / 31536000000);
      const days = Math.floor((diff % 31536000000) / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const timerElement = document.getElementById('love-timer');
      if (timerElement) {
        timerElement.innerHTML = `
          ${t('home', 'togetherFor')}<br>
          ${years} ${t('home', 'years')} ${days} ${t('home', 'days')}<br>
          ${hours} ${t('home', 'hours')} ${minutes} ${t('home', 'minutes')} ${seconds} ${t('home', 'seconds')}
        `;
      }
    }
    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();

    // Смена видео
    const videoInterval = setInterval(() => {
      setCurrentVideo(prev => (prev + 1) % videos.length);
    }, 10000);

    // Очистка при размонтировании компонента
    return () => {
      clearInterval(timerInterval);
      clearInterval(videoInterval);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [t, language]);

  // Обработчик для сообщения "Я тебя люблю"
  const handleLoveResponse = (response) => {
    if (response === 'yes') {
      // Создаем много сердечек
      createHeartRain();

      // Показываем специальное сообщение
      const messageElement = document.querySelector('.love-response');
      if (messageElement) {
        messageElement.innerText = 'Я так рада! ❤️';
        messageElement.style.display = 'block';

        // Анимируем появление сообщения
        gsap.from(messageElement, {
          scale: 0.5,
          opacity: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)"
        });
      }
    } else {
      // Если ответ "нет", делаем кнопку "да" больше и заметнее
      const yesButton = document.querySelector('.yes-btn');
      if (yesButton) {
        gsap.to(yesButton, {
          scale: 1.5,
          duration: 0.3,
          ease: "back.out",
          backgroundColor: "#ff1493",
          boxShadow: "0 0 20px rgba(255, 20, 147, 0.7)",
          repeat: 1,
          yoyo: true
        });
      }
    }
  };

  // Создание анимации сердечек
  const createHeartRain = () => {
    const container = document.querySelector('.heart-rain');
    if (!container) return;

    container.innerHTML = '';

    // Уменьшили количество сердец для лучшей производительности
    for (let i = 0; i < 30; i++) {
      const heart = document.createElement('div');
      heart.classList.add('heart');
      heart.innerHTML = '❤️';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${Math.random() * 5 + 3}s`;
      heart.style.animationDelay = `${Math.random() * 3}s`;
      heart.style.fontSize = `${Math.random() * 20 + 10}px`;
      container.appendChild(heart);
    }
  };

  // Функция для воспроизведения музыки
  const toggleMusic = () => {
    const audioElement = document.getElementById('background-music');
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Получения типа видео на основе расширения файла
  const getVideoType = (src) => {
    if (src.toLowerCase().endsWith('.mp4')) {
      return 'video/mp4';
    } else if (src.toLowerCase().endsWith('.webm')) {
      return 'video/webm';
    } else if (src.toLowerCase().endsWith('.mov')) {
      return 'video/quicktime';
    }
    return 'video/mp4'; // По умолчанию
  };

  // Проверка на .mov файл
  const isMOVFile = (src) => {
    return src.toLowerCase().endsWith('.mov');
  };

  return (
    <div className="home-page">
      <div className="wrapper">
        <div className="home-content">
          <div className="content-wrapper" ref={contentRef}>
            {/* Плавающие частицы */}
            <div className="particles-container" ref={particlesRef}>
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="particle"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    opacity: particle.opacity,
                    backgroundColor: particle.color
                  }}
                />
              ))}
            </div>

            {/* Фоновое видео */}
            <div className="video-background">
              {videos.map((src, index) => (
                <video
                  key={index}
                  ref={el => videoRefs.current[index] = el}
                  autoPlay
                  muted
                  loop
                  playsInline
                  webkit-playsinline="true"
                  className={index === currentVideo ? 'active' : ''}
                  preload="auto"
                  style={{opacity: index === currentVideo ? 1 : 0}}
                  onLoadedData={(e) => {
                    if (index === currentVideo) {
                      e.target.play().catch(err => console.error('Video play error:', err));
                    }
                    const newLoaded = [...videoLoaded];
                    newLoaded[index] = true;
                    setVideoLoaded(newLoaded);
                  }}
                >
                  <source src={src} type={getVideoType(src)} />
                  {isMOVFile(src) && (
                    <source src={src.replace(/\.mov$/i, '.mp4')} type="video/mp4" />
                  )}
                  Ваш браузер не поддерживает видео.
                </video>
              ))}
            </div>

            {/* Основной контент */}
            <div className="container">
              <h1 className="title animate__title">{t('home', 'aboutYou')}</h1>
              <div className="content-text animate__text">
                <p></p>
              </div>

              {/* Контейнер для сердечек */}
              <div className="heart-rain"></div>

              {/* Плавающее сообщение */}
              {showFloatingMessage && (
                <div className="floating-message">
                  <div className="message-content">
                    <p>Я скучаю по тебе, когда тебя нет рядом ❤️</p>
                    <div className="message-tail"></div>
                  </div>
                </div>
              )}

              {/* Сообщение о любви */}
              <div className="love-message">
                <p className="love-text">Я тебя люблю ❤️</p>
                <div className="response-buttons">
                  <button className="yes-btn" onClick={() => handleLoveResponse('yes')}>я тебя тоже люблю!</button>
                  <button className="no-btn" onClick={() => handleLoveResponse('no')}>нет...</button>
                </div>
                <p className="love-response" style={{ display: 'none' }}></p>
              </div>

              {/* Таймер отношений */}
              <div className="love-timer" id="love-timer"></div>
            </div>

            {/* Секции с текстом */}
            <div className="sections">
              {[
                { title: t('home', 'happiness'), text: t('home', 'happinessText'), icon: '✨' },
                { title: t('home', 'dream'), text: t('home', 'dreamText'), icon: '💫' },
                { title: t('home', 'comfort'), text: t('home', 'comfortText'), icon: '🌙' },
                { title: t('home', 'meaning'), text: t('home', 'meaningText'), icon: '💖' },
                { title: t('home', 'sweet'), text: t('home', 'sweetText'), icon: '🌈' }
              ].map((section, index) => (
              <section
                key={index}
                className={`section ${hoverSection === index ? 'section-hovered' : ''}`}
                ref={el => sectionsRef.current[index] = el}
                onMouseEnter={() => setHoverSection(index)}
                onMouseLeave={() => setHoverSection(null)}
              >
                <div className="section-icon">{section.icon}</div>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
                <div className="section-glow"></div>
              </section>
            ))}
            </div>

            {/* Галерея */}
            <div className="gallery">
              <GalleryImage src="/images/image_2025-02-28_01-11-28.png" alt="Gallery Image 1" />
              <GalleryImage src="/images/photo_2025-02-28_01-09-21.jpg" alt="Gallery Image 2" />
              <GalleryImage src="/images/photo_2024-06-17_22-32-56.jpg" alt="Gallery Image 3" />
            </div>

            {/* Кнопка музыки */}
            <button
              className={`music-toggle ${isPlaying ? 'playing' : ''}`}
              onClick={toggleMusic}
              aria-label={isPlaying ? "Остановить музыку" : "Включить музыку"}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-music'}`}></i>
            </button>
            <audio id="background-music" loop src="/music/music[music+vocals].mp3"></audio>

            {/* Кнопка навигации */}
            <div className="button-container">
              <Link to="/gallery" className="navigate-btn">
                {t('common', 'viewMore')}
                <span className="btn-shine"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home