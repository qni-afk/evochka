import React, { useEffect, useRef } from 'react';
import { useEva } from '../../contexts/EvaContext';
import { gsap } from 'gsap';
import './styles/Gallery.css';

// Импорт изображений (эти пути нужно будет заменить на актуальные)
const image1 = new URL('../../assets/gallery/image1.jpg', import.meta.url).href;
const image2 = new URL('../../assets/gallery/image2.jpg', import.meta.url).href;
const image3 = new URL('../../assets/gallery/image3.jpg', import.meta.url).href;
const image4 = new URL('../../assets/gallery/image4.jpg', import.meta.url).href;
const image5 = new URL('../../assets/gallery/image5.jpg', import.meta.url).href;
const image6 = new URL('../../assets/gallery/image6.jpg', import.meta.url).href;

const Gallery = () => {
  const { currentLanguage } = useEva();
  const galleryRef = useRef(null);
  const imagesRef = useRef([]);

  // Массив изображений
  const images = [
    { src: image1, alt: 'Gallery Image 1' },
    { src: image2, alt: 'Gallery Image 2' },
    { src: image3, alt: 'Gallery Image 3' },
    { src: image4, alt: 'Gallery Image 4' },
    { src: image5, alt: 'Gallery Image 5' },
    { src: image6, alt: 'Gallery Image 6' },
  ];

  // Тексты в зависимости от языка
  const texts = {
    en: {
      title: 'Our Gallery',
      description: 'Beautiful moments we shared together',
    },
    ru: {
      title: 'Наша Галерея',
      description: 'Прекрасные моменты, которые мы разделили вместе',
    },
  };

  // Анимация при появлении галереи
  useEffect(() => {
    const gallery = galleryRef.current;
    const images = imagesRef.current;

    if (!gallery || !images.length) return;

    // Анимация заголовка и описания
    gsap.fromTo(
      gallery.querySelector('.gallery-header'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: {
        trigger: gallery,
        start: 'top 80%',
      }}
    );

    // Анимация изображений
    gsap.fromTo(
      images,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gallery,
          start: 'top 70%',
        }
      }
    );
  }, []);

  return (
    <div className="gallery-container" ref={galleryRef}>
      <div className="gallery-header">
        <h2>{texts[currentLanguage].title}</h2>
        <p>{texts[currentLanguage].description}</p>
      </div>

      <div className="gallery-grid">
        {images.map((image, index) => (
          <div
            className="gallery-item"
            key={index}
            ref={el => (imagesRef.current[index] = el)}
            style={{
              transform: 'rotate(0deg)',
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1'
            }}
          >
            <div className="gallery-image-wrapper"
              style={{
                transform: 'rotate(0deg)',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  transform: 'rotate(0deg)',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div className="gallery-overlay">
                <span className="gallery-icon">❤️</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;