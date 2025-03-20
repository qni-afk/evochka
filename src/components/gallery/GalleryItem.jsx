import { useRef, useEffect } from 'react';

function GalleryItem({ previewSrc, videoSrc, category, is3DMode, openModal }) {
  const itemRef = useRef(null);
  const videoRef = useRef(null);
  const previewRef = useRef(null);

  // Обработка 3D эффекта
  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handle3D = (e) => {
      if (!is3DMode) return;

      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      const rotateX = ((yPercent - 50) / 50) * -25;
      const rotateY = ((xPercent - 50) / 50) * 25;

      item.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.1, 1.1, 1.1)
        translateZ(50px)
      `;
    };

    const resetTransform = () => {
      item.style.transform = '';
    };

    if (is3DMode) {
      item.addEventListener('mousemove', handle3D);
      item.addEventListener('mouseleave', resetTransform);
    } else {
      resetTransform();
    }

    return () => {
      item.removeEventListener('mousemove', handle3D);
      item.removeEventListener('mouseleave', resetTransform);
    };
  }, [is3DMode]);

  // Обработка наведения для видео
  useEffect(() => {
    const item = itemRef.current;
    const video = videoRef.current;
    const preview = previewRef.current;

    const handleMouseEnter = () => {
      if (video && preview) {
        video.play();
        preview.style.opacity = '0';
        video.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (video && preview) {
        video.pause();
        video.currentTime = 0;
        preview.style.opacity = '1';
        video.style.opacity = '0';
      }
    };

    if (item && video && preview) {
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (item && video && preview) {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      className="gallery-item"
      data-category={category}
      ref={itemRef}
      onClick={() => openModal(videoSrc)}
    >
      <img
        src={previewSrc}
        alt="Preview"
        className="preview-img"
        ref={previewRef}
      />
      <video className="gallery-video" loop muted ref={videoRef}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="overlay" style={{ display: 'none' }}>
        <h3>Видео</h3>
        <p>Наведите для воспроизведения</p>
      </div>
    </div>
  );
}

export default GalleryItem;