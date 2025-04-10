import React from 'react';
import { FaCameraRetro } from 'react-icons/fa';

const MemoriesCard = ({ memories, limit, onOpenGallery }) => {
  // Если указан limit, показываем только ограниченное число, иначе все
  const memoriesToShow = limit ? memories.slice(0, limit) : memories;

  return (
    <div className="profile-card memories-card">
      <div className="card-header">
        <h2 className="card-title">
          <FaCameraRetro className="card-icon" />
          {limit ? 'Latest Memories' : 'Photo Gallery'}
        </h2>
      </div>
      <div className="card-content">
        <div className="memories-grid">
          {memoriesToShow.map((memory, index) => (
            <div
              key={memory.id}
              className="memory-item"
              onClick={() => onOpenGallery(index)}
            >
              <img
                src={memory.image}
                alt={memory.title}
                className="memory-image"
              />
              <div className="memory-overlay">
                <h3 className="memory-title">{memory.title}</h3>
                <p className="memory-date">{memory.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoriesCard;