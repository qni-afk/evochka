import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
import GalleryImage from '../components/GalleryImage';

// Использовать относительные URL для изображений с помощью new URL() в Vite
const image1 = new URL('/images/image_2025-02-28_01-11-28.png', import.meta.url).href;
const image2 = new URL('/images/photo_2025-02-28_01-09-21.jpg', import.meta.url).href;
const image3 = new URL('/images/photo_2024-06-17_22-32-56.jpg', import.meta.url).href;
const image4 = new URL('/images/eva%20white.jpg', import.meta.url).href;
const image5 = new URL('/images/eva%20blue.jpg', import.meta.url).href;
const image6 = new URL('/images/eva%20sex.jpg', import.meta.url).href;

function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const contentRef = useRef(null);
  const sectionsRef = useRef([]);

  const videos = [
    '/video/IMG_0886.MOV',
    '/video/IMG_4999.MOV',
    '/video/IMG_6404.MOV',
    '/video/IMG_6710.MP4'
  ];

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

    // Наблюдаем за секциями
    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    // Таймер отношений
    const startDate = new Date('12.09.2023');
    function updateTimer() {
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
          Мы вместе уже:<br>
          ${years} год ${days} дней<br>
          ${hours} часов ${minutes} минут ${seconds} секунд
        `;
      }
    }
    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();

    // Смена видео
    const videoInterval = setInterval(() => {
      setCurrentVideo(prev => (prev + 1) % videos.length);
    }, 10000);

    // Создаем парящие сердечки
    function createHeart() {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.innerHTML = 'love you';

      // Случайная позиция по всему экрану
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.top = Math.random() * 100 + 'vh';

      // Случайные параметры движения
      const randomX = (Math.random() - 0.5) * 2; // от -1 до 1
      const randomY = Math.random() * 0.5 + 0.5; // от 0.5 до 1

      heart.style.setProperty('--random-x', randomX);
      heart.style.setProperty('--random-y', randomY);

      // Случайные параметры внешнего вида
      heart.style.fontSize = Math.random() * 10 + 10 + 'px';
      // heart.style.filter = `hue-rotate(${Math.random() * 360}deg)`; // Закомментировал строку, делающую сердечки разноцветными
      heart.style.opacity = Math.random() * 0.6 + 0.4;

      const heartsContainer = document.querySelector('.hearts');
      if (heartsContainer) {
        heartsContainer.appendChild(heart);

        // Автоудаление через 5 секунд
        setTimeout(() => heart.remove(), 5000);
      }
    }

    const heartsInterval = setInterval(createHeart, 300);

    // Очистка при размонтировании компонента
    return () => {
      clearInterval(timerInterval);
      clearInterval(videoInterval);
      clearInterval(heartsInterval);
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

  return (
    <div className="wrapper">
      {/* Темный оверлей */}
      <div className="dark-overlay"></div>

      {/* Фиксированные элементы */}
      <div className="fixed-elements">
        {/* Навигация */}
        <Navbar />

        {/* Контролы для музыки */}
        <div className="music-controls">
          <button id="music-btn" className={`music-btn ${isPlaying ? 'playing' : ''}`} onClick={toggleMusic}>
            <div className="loader" style={{ opacity: isPlaying ? 1 : 0.5 }}></div>
          </button>
          <div className="volume-slider-container">
            <input type="range" id="volume-slider" min="0" max="100" defaultValue="50" />
          </div>
        </div>

        {/* Таймер отношений */}
        <div id="love-timer"></div>
      </div>

      {/* Основной контент */}
      <div className="content" ref={contentRef}>
        {/* Аудио */}
        <audio id="background-music" loop>
          <source src="/music/i love you so by the walters.mp3" type="audio/mpeg" />
        </audio>

        {/* Фоновое видео */}
        <div className="video-background">
          {videos.map((src, index) => (
            <video
              key={index}
              autoPlay
              muted
              loop
              className={index === currentVideo ? 'active' : ''}
            >
              <source src={src} type="video/mp4" />
            </video>
          ))}
        </div>

        {/* Основной контент */}
        <div className="container">
          <h1 className="title animate__title">about you</h1>
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

          <div className="hearts"></div>
        </div>

        {/* Секции с текстом */}
        <div className="sections">
          {[
            { title: 'My happiness', text: "I'm very lucky that you chose me." },
            { title: 'My dream', text: 'with you at ease.' },
            { title: 'My comfort', text: 'i forget all my problems with you.' },
            { title: 'You mean so much to me', text: "when I'm with you, i feel good." },
            { title: "You're sweet", text: "you're very sexy." }
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
          <Link to="/gallery" className="navigate-btn">Посмотреть больше фотографий</Link>
        </div>
      </div>
    </div>
  )
}

export default Home