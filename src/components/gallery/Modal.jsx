import { useEffect } from 'react';

function Modal({ isOpen, videoSrc, onClose }) {
  useEffect(() => {
    // Обработчик закрытия по клавише Escape
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      style={{ display: 'flex' }}
      onClick={(e) => {
        // Закрыть только если клик был на заднем фоне
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <span className="close" onClick={onClose}>&times;</span>
      <video className="modal-content" id="modalVideo" controls autoPlay>
        <source src={videoSrc} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
}

export default Modal;