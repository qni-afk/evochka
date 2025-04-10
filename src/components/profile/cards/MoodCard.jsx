import React from 'react';
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';

const MoodCard = ({ mood, setMood }) => {
  const getMoodEmoji = () => {
    if (mood >= 80) return <FaSmile />;
    if (mood >= 50) return <FaMeh />;
    return <FaFrown />;
  };

  return (
    <div className="profile-card mood-card">
      <div className="card-header">
        <h2 className="card-title">
          <FaSmile className="card-icon" /> Current Mood
        </h2>
      </div>
      <div className="card-content">
        <div className="mood-slider">
          <div className="mood-emoji">
            {getMoodEmoji()}
          </div>
          <div className="mood-value">{mood}%</div>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodCard;