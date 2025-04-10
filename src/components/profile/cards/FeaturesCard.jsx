import React from 'react';
import { FaHeart, FaStar, FaPlus } from 'react-icons/fa';

const FeaturesCard = ({ features, newFeature, setNewFeature, onAddFeature, onStarClick }) => {
  return (
    <div className="profile-card features-card">
      <div className="card-header">
        <h2 className="card-title">
          <FaHeart className="card-icon" /> Beautiful Features
        </h2>
      </div>
      <div className="card-content">
        <div className="features-list">
          {features.map(feature => (
            <div key={feature.id} className="feature-item">
              <div className="feature-text">{feature.text}</div>
              <div className="feature-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar
                    key={star}
                    className={`star ${star <= feature.stars ? 'active' : ''}`}
                    onClick={() => onStarClick(feature.id, star)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <input
          type="text"
          className="input-field"
          placeholder="Add a new feature..."
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddFeature()}
        />
        <button
          className="add-button"
          onClick={onAddFeature}
        >
          <FaPlus /> Add Feature
        </button>
      </div>
    </div>
  );
};

export default FeaturesCard;