import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Circles.css';
import FallingHearts from '../components/FallingHearts';

const Circles = () => {
  const { language } = useLanguage();
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const videoRefs = useRef({});
  const navigate = useNavigate();
  const codeInputRef = useRef(null);

  // Массив с путями к кружочкам
  const circles = [
    { id: 1, path: '/circle/circle1.mp4' },
    { id: 2, path: '/circle/circle2.mp4' },
    { id: 3, path: '/circle/circle3.mp4' },
    { id: 4, path: '/circle/circle4.mp4' },
    { id: 5, path: '/circle/circle5.mp4' },
    { id: 6, path: '/circle/circle6.mp4' },
    { id: 7, path: '/circle/circle7.mp4' },
    { id: 8, path: '/circle/circle8.mp4' },
    { id: 9, path: '/circle/circle9.mp4' },
    { id: 11, path: '/circle/circle11.mp4' },
    { id: 19, path: '/circle/circle19.mp4' }
  ];

  // Обработчик клика по кружочку
  const handleCircleClick = (id) => {
    if (activeVideo === id) {
      // Если кликнули по активному видео, переключаем состояние воспроизведения
      if (isPlaying) {
        videoRefs.current[id].pause();
      } else {
        videoRefs.current[id].play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // Если кликнули по другому видео, останавливаем предыдущее и запускаем новое
      if (activeVideo !== null && videoRefs.current[activeVideo]) {
        videoRefs.current[activeVideo].pause();
        videoRefs.current[activeVideo].currentTime = 0;
      }
      setActiveVideo(id);
      setIsPlaying(true);
      videoRefs.current[id].play();
    }
  };

  // Обработчик окончания видео
  const handleVideoEnd = () => {
    setActiveVideo(null);
    setIsPlaying(false);
  };

  // Обработчик клавиш для секретного кода
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Если нажата клавиша '3', добавляем её к текущему коду
      if (e.key === '3') {
        setSecretCode(prevCode => {
          const newCode = prevCode + '3';
          // Если код равен "333", показываем секретное поле ввода
          if (newCode === '333') {
            setShowCodeInput(true);
            setTimeout(() => {
              if (codeInputRef.current) {
                codeInputRef.current.focus();
              }
            }, 100);
            return '';
          }
          // Если код длиннее 3 символов, начинаем заново
          if (newCode.length > 3) {
            return '3';
          }
          return newCode;
        });
      } else {
        // Если нажата другая клавиша, сбрасываем код
        setSecretCode('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Обработчик секретного кода
  const handleSecretSubmit = (e) => {
    e.preventDefault();
    // Если введён правильный код, перенаправляем на секретную страницу
    if (e.target.secretInput.value === 'музыка для кода 333') {
      navigate('/secret-love');
    } else {
      // Если код неверный, скрываем поле ввода
      setShowCodeInput(false);
    }
  };

  // Закрытие секретного поля ввода
  const handleCloseSecretInput = () => {
    setShowCodeInput(false);
  };

  // Эффект для инициализации видео
  useEffect(() => {
    return () => {
      // Останавливаем все видео при размонтировании компонента
      Object.values(videoRefs.current).forEach(video => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    };
  }, []);

  return (
    <div className="circles-container">
      <h1 className="circles-title">
        {language === 'ru' ? 'Кружочки' : 'Circles'}
      </h1>

      {/* Падающие сердечки */}
      <FallingHearts
        count={15}
        containerClass="circles-falling-hearts"
        heartClass="circles-heart"
        color="rgba(170, 135, 255, 0.7)"
      />

      {showCodeInput && (
        <div className="secret-code-overlay">
          <div className="secret-code-container">
            <button className="close-secret-btn" onClick={handleCloseSecretInput}>×</button>
            <h3>{language === 'ru' ? 'Введите секретный код' : 'Enter secret code'}</h3>
            <form onSubmit={handleSecretSubmit}>
              <input
                type="text"
                name="secretInput"
                ref={codeInputRef}
                className="secret-code-input"
                placeholder={language === 'ru' ? 'Секретный код...' : 'Secret code...'}
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      <div className="circles-grid">
        {circles.map((circle) => (
          <div
            key={circle.id}
            className={`circle-item ${activeVideo === circle.id ? 'active' : ''}`}
            onClick={() => handleCircleClick(circle.id)}
          >
            <video
              ref={el => videoRefs.current[circle.id] = el}
              src={circle.path}
              className="circle-video"
              loop={false}
              muted={false}
              playsInline
              onEnded={handleVideoEnd}
            />
            {activeVideo !== circle.id && (
              <div className="circle-overlay">
                <span className="circle-play-icon">▶</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Circles;