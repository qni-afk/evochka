import React from 'react';

const ProfileHeader = ({ avatar, name, bio, stats }) => {
  return (
    <header className="profile-header">
      <div className="avatar-container">
        <img src={avatar} alt={name} className="avatar" />
      </div>
      <div className="profile-info">
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{bio}</p>
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-value">{stats.totalFeatures}</div>
            <div className="stat-label">Features</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.completedWishes}</div>
            <div className="stat-label">Wishes Fulfilled</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.totalMemories}</div>
            <div className="stat-label">Memories</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;