import React from 'react';
import { FaAngleLeft, FaAngleRight, FaTimes } from 'react-icons/fa';

const Gallery = ({ isOpen, memories, currentIndex, onClose, onPrev, onNext }) => {
  if (!isOpen) return null;

  return (
    <div className="fullscreen-gallery" onClick={onClose}>
      <button className="gallery-close" onClick={onClose}>
        <FaTimes />
      </button>
      <button className="gallery-nav prev" onClick={(e) => {
        e.stopPropagation();
        onPrev();
      }}>
        <FaAngleLeft />
      </button>
      <img
        src={memories[currentIndex].image}
        alt={memories[currentIndex].title}
        className="gallery-image"
        onClick={(e) => e.stopPropagation()}
      />
      <button className="gallery-nav next" onClick={(e) => {
        e.stopPropagation();
        onNext();
      }}>
        <FaAngleRight />
      </button>
    </div>
  );
};

export default Gallery;