import React from 'react';
import { FaGift, FaCheck, FaPlus } from 'react-icons/fa';

const WishesCard = ({ wishes, newWish, setNewWish, onAddWish, onToggleWish }) => {
  return (
    <div className="profile-card wishes-card">
      <div className="card-header">
        <h2 className="card-title">
          <FaGift className="card-icon" /> Wishes
        </h2>
      </div>
      <div className="card-content">
        <div className="wishes-list">
          {wishes.map(wish => (
            <div key={wish.id} className="wish-item">
              <div
                className={`wish-checkbox ${wish.completed ? 'completed' : ''}`}
                onClick={() => onToggleWish(wish.id)}
              >
                {wish.completed && <FaCheck size={12} />}
              </div>
              <div className={`wish-text ${wish.completed ? 'completed' : ''}`}>
                {wish.text}
              </div>
            </div>
          ))}
        </div>
        <input
          type="text"
          className="input-field"
          placeholder="Add a new wish..."
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddWish()}
        />
        <button
          className="add-button"
          onClick={onAddWish}
        >
          <FaPlus /> Add Wish
        </button>
      </div>
    </div>
  );
};

export default WishesCard;