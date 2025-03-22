import { useState, useEffect } from 'react';

function GalleryImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Создаем новый экземпляр Image для предзагрузки
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setLoaded(true);
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      setError(true);
    };
  }, [src]);

  if (error) {
    return <div className="gallery-image error">Ошибка загрузки изображения</div>;
  }

  if (!loaded) {
    return <div className="gallery-image loading">Загрузка...</div>;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className="gallery-image"
      style={{ display: 'block', width: '100%', height: '250px', objectFit: 'cover' }}
    />
  );
}

export default GalleryImage;