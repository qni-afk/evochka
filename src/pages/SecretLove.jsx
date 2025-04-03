import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaStar, FaArrowLeft, FaMusic, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import ThemeLanguageSwitcher from '../components/ThemeLanguageSwitcher';
import '../styles/SecretLove.css';

// Компонент падающего сердечка
const FallingHeart = ({ style }) => (
  <FaHeart
    className="heart-fall"
    style={style}
  />
);

const SecretLove = () => {
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const audioRef = useRef(null);

  // Проверяем, есть ли у пользователя доступ к странице
  useEffect(() => {
    const secretAccess = localStorage.getItem('secretMessageVisible');
    if (secretAccess === 'true') {
      setHasAccess(true);
      // Показываем сообщение с небольшой задержкой для анимации
      setTimeout(() => {
        setShowMessage(true);
      }, 1000);
    } else {
      // Если нет доступа, перенаправляем на галерею
      navigate('/gallery');
    }
  }, [navigate]);

  // Управление музыкой
  useEffect(() => {
    if (hasAccess && audioRef.current) {
      // Воспроизведение музыки когда страница загружена
      const playPromise = audioRef.current.play();

      // Предотвращение ошибок, если браузер не готов воспроизводить аудио
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch(error => {
            console.error("Авто-воспроизведение предотвращено:", error);
            setIsMusicPlaying(false);
          });
      }
    }

    // Очистка при размонтировании
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [hasAccess]);

  // Создаем падающие сердечки
  useEffect(() => {
    if (!hasAccess) return;

    // Создаем 30 сердечек с разными параметрами
    const newHearts = Array.from({ length: 30 }, (_, i) => {
      const size = Math.random() * 20 + 10;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;
      const opacity = Math.random() * 0.7 + 0.3;

      return {
        id: i,
        style: {
          left: `${left}%`,
          fontSize: `${size}px`,
          color: `rgba(255, ${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${opacity})`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }
      };
    });

    setHearts(newHearts);
  }, [hasAccess]);

  const goBack = () => {
    navigate('/gallery');
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  if (!hasAccess) {
    return null; // Если нет доступа, ничего не отображаем
  }

  return (
    <div className="secret-page">
      <Navbar />
      <ThemeLanguageSwitcher />

      {/* Фоновая музыка */}
      <audio
        ref={audioRef}
        src="https://mp3ukr.net/dl/7b5d10ae-a13c-4376-9270-20ab39d6feb0"
        loop
      />

      {/* Кнопка управления музыкой */}
      <button className="music-control-button" onClick={toggleMusic}>
        {isMusicPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
      </button>

      {/* Падающие сердечки */}
      <div className="falling-hearts">
        {hearts.map(heart => (
          <FallingHeart key={heart.id} style={heart.style} />
        ))}
      </div>

      <div className="back-button-container">
        <button className="back-button" onClick={goBack}>
          <FaArrowLeft /> <span>Вернуться в галерею</span>
        </button>
      </div>

      <div className="secret-container">
        <h1 className="secret-title">
          Моя любовь к тебе <FaHeart className="title-heart" />
        </h1>

        <div className={`secret-content ${showMessage ? 'visible' : ''}`}>
          <div className="letter-container">
            <p className="letter-paragraph">
              <FaStar className="star-icon" />
              Моя дорогая Евочка
            </p>

            <p className="letter-paragraph">
              <FaStar className="star-icon" />

            </p>

            <p className="letter-paragraph">
              <FaStar className="star-icon" />
              Ева, ты наполнила мою жизнь особым смыслом. Твоя нежность и забота делают каждый день особенным. С тобой я чувствую себя самым счастливым человеком в мире.
            </p>

            <p className="letter-paragraph">
              <FaStar className="star-icon" />
              Твоя улыбка освещает даже самые пасмурные дни, а твой смех - самая прекрасная мелодия, которую я когда-либо слышал. Ева, ты удивительная во всём.
            </p>

            <p className="letter-paragraph">
              <FaStar className="star-icon" />
              Я так благодарен судьбе за встречу с тобой. Каждый момент рядом с тобой бесценен. Ты - моя особенная Евочка, единственная и неповторимая.
            </p>

            <p className="letter-paragraph">
              <FaStar className="star-icon" />
              143 - означает i love you
            </p>

            <p className="letter-paragraph">
              <FaStar className="star-icon" />
              Спасибо тебе, моя Евочка, за то, что ты есть. За твою поддержку и понимание. Я люблю тебя всем сердцем и буду любить всегда.
            </p>

            <div className="letter-signature">
              <p>Всегда твой </p>
              <p>Дима ❤️</p>
            </div>

            <div className="heart-container">
              <div className="heart"></div>
              <p className="love-message">Я тебя люблю!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretLove;