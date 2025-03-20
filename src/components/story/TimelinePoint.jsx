import React, { useEffect, useState } from 'react';

function TimelinePoint({ chapter, target }) {
  const [isActive, setIsActive] = useState(false);

  const scrollToChapter = () => {
    const chapterElement = document.getElementById(target);
    if (chapterElement) {
      chapterElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Обновление активной точки при скролле
  useEffect(() => {
    const updateTimeline = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const chapterElement = document.getElementById(target);

      if (chapterElement) {
        const chapterTop = chapterElement.offsetTop;
        const chapterBottom = chapterTop + chapterElement.offsetHeight;

        setIsActive(scrollPosition >= chapterTop && scrollPosition < chapterBottom);
      }
    };

    window.addEventListener('scroll', updateTimeline);

    // Вызываем один раз при монтировании
    updateTimeline();

    return () => {
      window.removeEventListener('scroll', updateTimeline);
    };
  }, [target]);

  return (
    <div
      className={`timeline-point ${isActive ? 'active' : ''}`}
      data-chapter={chapter}
      onClick={scrollToChapter}
    />
  );
}

export default TimelinePoint;