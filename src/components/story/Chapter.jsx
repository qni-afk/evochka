import React, { useRef, useEffect } from 'react';

function Chapter({ id, number, title, date, text, imageUrl, imageAlt, largeText, noImage }) {
  const photoRef = useRef(null);

  // Обработка 3D Tilt эффекта для фотографий
  useEffect(() => {
    if (!photoRef.current || noImage) return;

    const photo = photoRef.current;

    const handleTilt = (e) => {
      const rect = photo.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const maxRotate = 15;
      const maxTranslate = 15;

      const transform = `
        perspective(800px)
        scale3d(1.05, 1.05, 1.05)
        rotateX(${-percentY * maxRotate}deg)
        rotateY(${percentX * maxRotate}deg)
        translateX(${percentX * maxTranslate}px)
        translateY(${percentY * maxTranslate}px)
      `;

      photo.style.transform = transform;

      // Работа с бликом
      const glare = photo.querySelector('.photo-glare') || createGlareElement(photo);
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      const glareOpacity = Math.sqrt(Math.pow(percentX, 2) + Math.pow(percentY, 2));

      glare.style.background = `
        radial-gradient(
          circle at ${glareX}% ${glareY}%,
          rgba(255,255,255,${0.5 + glareOpacity * 0.3}) 0%,
          rgba(255,255,255,0.1) 30%,
          rgba(255,255,255,0) 80%
        )
      `;
      glare.style.opacity = '1';
    };

    const initTilt = () => {
      photo.style.transition = 'none';
    };

    const resetTilt = () => {
      photo.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      photo.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1) translateX(0) translateY(0)';

      // Плавное исчезновение блика
      const glare = photo.querySelector('.photo-glare');
      if (glare) {
        glare.style.opacity = '0';
      }
    };

    const createGlareElement = (photoElement) => {
      const glare = document.createElement('div');
      glare.className = 'photo-glare';
      photoElement.appendChild(glare);
      return glare;
    };

    // Открытие модального окна при клике на фото
    const openModal = () => {
      const modal = document.getElementById('modal');
      const modalImg = document.getElementById('modal-img');
      if (modal && modalImg) {
        const imgSrc = photo.querySelector('img').src;
        modalImg.src = imgSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    };

    photo.addEventListener('mousemove', handleTilt);
    photo.addEventListener('mouseleave', resetTilt);
    photo.addEventListener('mouseenter', initTilt);
    photo.addEventListener('click', openModal);

    return () => {
      photo.removeEventListener('mousemove', handleTilt);
      photo.removeEventListener('mouseleave', resetTilt);
      photo.removeEventListener('mouseenter', initTilt);
      photo.removeEventListener('click', openModal);
    };
  }, [noImage]);

  useEffect(() => {
    // Добавление обработчика для модального окна
    const modal = document.getElementById('modal');

    const closeModal = (e) => {
      if (e.target === modal || e.target.tagName === 'IMG') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    };

    const closeModalEsc = (e) => {
      if (e.key === 'Escape') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    };

    if (modal) {
      modal.addEventListener('click', closeModal);
      document.addEventListener('keydown', closeModalEsc);
    }

    return () => {
      if (modal) {
        modal.removeEventListener('click', closeModal);
        document.removeEventListener('keydown', closeModalEsc);
      }
    };
  }, []);

  return (
    <section id={id} className="memory-section chapter">
      <div className="chapter-number">Chapter {number}</div>
      <div className="chapter-title">{title}</div>

      {!noImage && (
        <div className="photo" ref={photoRef}>
          <img src={imageUrl} alt={imageAlt} />
        </div>
      )}

      <div className={`text-block ${largeText ? 'large-text' : ''}`}>
        <p className="date">{date}</p>
        <p>{text}</p>
      </div>
    </section>
  );
}

export default Chapter;