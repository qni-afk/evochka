import React from 'react';
import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
import ThemeLanguageSwitcher from '../components/ThemeLanguageSwitcher';
import GalleryImage from '../components/gallery/GalleryImage';
import { useLanguage } from '../context/LanguageContext';

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
  const contentRef = useRef(null);
  const sectionsRef = useRef([]);
  const videoRefs = useRef([]);

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

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
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
    gsap.to(".animate__title", {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power4.out",
      delay: 0.5
    });

    gsap.to(".animate__text", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 1,
      ease: "sine.out"
    });

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
      observer.disconnect();
    };
  }, [videos]);

  // Функция для переключения музыки
  const toggleMusic = () => {
    const audio = document.getElementById('background-music');
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Определяем тип MIME для видео
  const getVideoType = (src) => {
    const extension = src.split('.').pop().toLowerCase();
    switch (extension) {
      case 'mov':
        return 'video/quicktime';
      case 'mp4':
        return 'video/mp4';
      default:
        return 'video/mp4';
    }
  };

  // Проверяем, является ли файл MOV
  const isMOVFile = (src) => {
    return src.toLowerCase().endsWith('.mov');
  };

  return (
    <div className="home-container">
      <Navbar />
      <ThemeLanguageSwitcher />

      <div className="hero-section">
        <div className="hero-content">
          {/* Темный оверлей */}
          <div className="dark-overlay"></div>

          {/* Фиксированные элементы */}
          <div className="fixed-elements">
            {/* Таймер отношений */}
            <div id="love-timer"></div>
          </div>

          {/* Основной контент */}
          <div className="content" ref={contentRef}>
            {/* Аудио */}
            <audio id="background-music" loop preload="auto">
              <source src="/music/i love you so by the walters.mp3" type="audio/mpeg" />
            </audio>

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

              <div className="love-message" style={{ display: 'none' }}>
                <p className="love-text">Я тебя люблю ❤️</p>
                <div className="response-buttons">
                  <button className="yes-btn">я тебя тоже люблю!</button>
                  <button className="no-btn">нет...</button>
                </div>
              </div>
            </div>

            {/* Секции с текстом */}
            <div className="sections">
              {[
                { title: t('home', 'happiness'), text: t('home', 'happinessText') },
                { title: t('home', 'dream'), text: t('home', 'dreamText') },
                { title: t('home', 'comfort'), text: t('home', 'comfortText') },
                { title: t('home', 'meaning'), text: t('home', 'meaningText') },
                { title: t('home', 'sweet'), text: t('home', 'sweetText') }
              ].map((section, index) => (
              <section
                key={index}
                className="section"
                ref={el => sectionsRef.current[index] = el}
              >
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </section>
            ))}
            </div>

            {/* Галерея */}
            <div className="gallery">
              <GalleryImage src="/images/image_2025-02-28_01-11-28.png" alt="Gallery Image 1" />
              <GalleryImage src="/images/photo_2025-02-28_01-09-21.jpg" alt="Gallery Image 2" />
              <GalleryImage src="/images/photo_2024-06-17_22-32-56.jpg" alt="Gallery Image 3" />
            </div>

            {/* Кнопка навигации */}
            <div className="button-container">
              <Link to="/gallery" className="navigate-btn">{t('common', 'viewMore')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home