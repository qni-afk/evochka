import React from 'react';
import { FaHeart } from 'react-icons/fa';

const LoveCard = ({ messages, activeIndex }) => {
  return (
    <div className="profile-card love-card">
      <div className="card-header">
        <h2 className="card-title">
          <FaHeart className="card-icon" /> Love Notes
        </h2>
      </div>
      <div className="card-content">
        <div className="love-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`love-message ${index === activeIndex ? 'active' : ''}`}
            >
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoveCard;