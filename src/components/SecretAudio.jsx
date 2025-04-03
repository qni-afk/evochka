import React, { useRef, useEffect, useState } from 'react';

// Ссылки на аудио файлы
const tracks = [
  '/audio/i love dima.mp3'
];

const SecretAudio = () => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Обработчик события toggleMusic
  useEffect(() => {
    const handleToggleMusic = (event) => {
      const { play } = event.detail;

      if (play) {
        // Включаем музыку
        if (!isPlaying && audioRef.current) {
          audioRef.current.play().catch(error => {
            console.error("Ошибка воспроизведения:", error);
          });
          setIsPlaying(true);
        }
      } else {
        // Выключаем музыку
        if (isPlaying && audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    // Подписываемся на событие
    window.addEventListener('toggleMusic', handleToggleMusic);

    // Отписываемся при размонтировании
    return () => {
      window.removeEventListener('toggleMusic', handleToggleMusic);
    };
  }, [isPlaying]);

  // Обработчик окончания трека
  const handleTrackEnd = () => {
    // Переключаемся на следующий трек
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  // Обновляем проигрывание при смене трека
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Ошибка воспроизведения после смены трека:", error);
      });
    }
  }, [currentTrack]);

  return (
    <audio
      ref={audioRef}
      src={tracks[currentTrack]}
      onEnded={handleTrackEnd}
      style={{ display: 'none' }} // Скрываем аудио элемент
    />
  );
};

export default SecretAudio;