import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chapter from '../components/story/Chapter';
import TimelinePoint from '../components/story/TimelinePoint';
import Navbar from '../components/Navbar';
import '../styles/Story.css';

function Story() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef(null);
  const loveMessageRef = useRef(null);
  const heartsContainerRef = useRef(null);

  // Создание падающих сердечек
  const createHeart = () => {
    if (heartsContainerRef.current) {
      const heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.innerHTML = '❤️';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDuration = Math.random() * 3 + 2 + 's';

      heartsContainerRef.current.appendChild(heart);

      // Удаляем сердечко после анимации
      setTimeout(() => {
        heart.remove();
      }, 5000);
    }
  };

  // Создаем душ из сердечек при клике на "да"
  const createHeartShower = () => {
    for(let i = 0; i < 50; i++) {
      setTimeout(() => {
        createHeart();
      }, i * 100);
    }
  };

  const togglePlayMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleYesClick = () => {
    if (loveMessageRef.current) {
      loveMessageRef.current.innerHTML = '<p class="love-text">I know it! ❤️❤️❤️</p>';
      loveMessageRef.current.style.transform = 'translateX(-50%) scale(1.2)';

      setTimeout(() => {
        if (loveMessageRef.current) {
          loveMessageRef.current.style.transform = 'translateX(-50%) scale(1)';
          createHeartShower();
        }
      }, 300);

      setTimeout(() => {
        if (loveMessageRef.current) {
          loveMessageRef.current.remove();
        }
      }, 3000);
    }
  };

  const handleNoMouseOver = (e) => {
    const noBtn = e.target;
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
  };

  // Используем IntersectionObserver для анимации элементов при скролле
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Анимируем фото и текст внутри секции с задержкой
          const photo = entry.target.querySelector('.photo');
          const textBlock = entry.target.querySelector('.text-block');

          if (photo) {
            setTimeout(() => {
              photo.classList.add('visible');
            }, 400);
          }

          if (textBlock) {
            setTimeout(() => {
              textBlock.classList.add('visible');
            }, 800);
          }
        }
      });
    }, {
      threshold: 0.2
    });

    // Наблюдаем за всеми главами
    document.querySelectorAll('.chapter').forEach(chapter =>
      observer.observe(chapter));

    // Наблюдаем за падающими сердечками
    document.addEventListener('scroll', createHeart);

    // Очистка наблюдателя при размонтировании
    return () => {
      observer.disconnect();
      document.removeEventListener('scroll', createHeart);
    };
  }, []);

  return (
    <>
      {/* Контейнер для падающих сердечек */}
      <div className="falling-hearts" ref={heartsContainerRef}></div>

      <Navbar />

      {/* Контролы для управления музыкой */}
      <div className="music-controls">
        {/* Кнопка воспроизведения/паузы с анимированным индикатором */}
        <button id="music-btn"
          className={`music-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlayMusic}>
          <div className="loader"></div>
        </button>
        {/* Контейнер для ползунка громкости */}
        <div className="volume-slider-container">
          <input
            type="range"
            id="volume-slider"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      {/* Аудио элемент */}
      <audio id="background-music" ref={audioRef} loop>
        <source src="/music/gde-fantom-ya-tebya-lyublyu-mp3.mp3" type="audio/mpeg" />
      </audio>

      <header id="home" className="header">
        <h1>Our Love Story <span className="heart">❤️</span></h1>
        <p>A tale of two hearts becoming one</p>
      </header>

      <div className="content">
        <Chapter
          number="1"
          title="The First Time I Saw You"
          date="September 15, 2023"
          text="the first time I heard you, I immediately liked your voice ❤️"
          imageUrl="/images/scale_1200-1.png"
          imageAlt="Our First Meeting"
          id="first-meet"
        />

        <Chapter
          number="2"
          title="Our First Date"
          date="October 1, 2023"
          text="We laughed, watched movies and every day I fell in love with you more and more ✨"
          imageUrl="/images/banner.jpg"
          imageAlt="Our First Date"
          id="first-date"
        />

        <Chapter
          number="3"
          title="The Perfect Moment"
          date="September 15, 2024"
          text="We started calling each other via video, you were cutely embarrassed at first💫"
          id="first-kiss"
          largeText={true}
          noImage={true}
        />

        <Chapter
          number="4"
          title="Together Forever"
          date="Present Day"
          text="Every day with you is a new chapter in our beautiful story 💕"
          id="together"
          largeText={true}
          noImage={true}
        />
      </div>

      <div className="timeline">
        <div className="timeline-line"></div>
        <TimelinePoint chapter="1" target="first-meet" />
        <TimelinePoint chapter="2" target="first-date" />
        <TimelinePoint chapter="3" target="first-kiss" />
        <TimelinePoint chapter="4" target="together" />
      </div>

      <div className="secret-message">
        Ты делаешь каждый мой день особенным...
      </div>

      <div className="modal" id="modal">
        <img id="modal-img" src="" alt="Увеличенное фото" />
      </div>

      {/* Интерактивное сообщение о любви */}
      <div className="love-message" ref={loveMessageRef}>
        <p className="love-text">to continue answer do you love me?? ❤️</p>
        <div className="response-buttons">
          <button className="yes-btn" onClick={handleYesClick}>Yes, of course</button>
          <button className="no-btn" onMouseOver={handleNoMouseOver}>No</button>
        </div>
      </div>
    </>
  );
}

export default Story;