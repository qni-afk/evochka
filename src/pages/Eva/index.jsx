import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import './styles/Eva.css';

// Import components
import ProfileHeader from '../../components/profile/cards/ProfileHeader';
import LoveCard from '../../components/profile/cards/LoveCard';
import MemoriesCard from '../../components/profile/cards/MemoriesCard';
import MoodCard from '../../components/profile/cards/MoodCard';
import WishesCard from '../../components/profile/cards/WishesCard';
import FeaturesCard from '../../components/profile/cards/FeaturesCard';
import AchievementsCard from '../../components/profile/cards/AchievementsCard';
import Gallery from '../../components/profile/Gallery';
import Notification from '../../components/profile/Notification';

const Eva = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { saveUserData, loadUserData, achievements } = useApi();

  // State variables
  const [features, setFeatures] = useState([
    { id: 1, text: 'Красивая', stars: 5 },
    { id: 2, text: 'Умная', stars: 5 },
    { id: 3, text: 'Заботливая', stars: 5 },
    { id: 4, text: 'Нежная', stars: 5 },
    { id: 5, text: 'Веселая', stars: 5 }
  ]);

  const [wishes, setWishes] = useState([
    { id: 1, text: 'Провести день на природе', completed: false },
    { id: 2, text: 'Посетить новый ресторан', completed: false },
    { id: 3, text: 'Сходить в кино на премьеру', completed: true },
    { id: 4, text: 'Романтический ужин', completed: false }
  ]);

  const [memories, setMemories] = useState([
    { id: 1, title: 'First meeting', date: '09.12.2023', image: '/images/photo_2025-02-28_01-09-21.jpg' },
    { id: 2, title: "New Year's Eve", date: '31.12.2023', image: '/images/eva white.jpg' },
    { id: 3, title: "Eva's birthday", date: '05.03.2023', image: '/images/eva blue.jpg' },
    { id: 4, title: 'Our special day', date: '08.08.2024', image: '/images/eva sex.jpg' },
    { id: 5, title: 'Summer vacation', date: '15.07.2024', image: '/images/photo_2025-02-28_01-09-21.jpg' },
    { id: 6, title: 'Valentine\'s Day', date: '14.02.2024', image: '/images/eva white.jpg' }
  ]);

  const [mood, setMood] = useState(85);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [newFeature, setNewFeature] = useState('');
  const [newWish, setNewWish] = useState('');
  const [notification, setNotification] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Love messages
  const loveMessages = [
    'You are the most beautiful!',
    'Your smile brightens my day',
    'You are my favorite person',
    'I am the happiest with you',
    'You are infinitely gorgeous',
    'You make me better',
    'Your eyes are like two stars',
    'I love your laughter',
    'You are my inspiration',
    'You are perfect in every way'
  ];

  // Load data on component mount
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Rotate love messages
    const interval = setInterval(() => {
      setActiveMessageIndex(prev => (prev + 1) % loveMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Get statistics
  const getStatistics = () => {
    const totalWishes = wishes.length;
    const completedWishes = wishes.filter(wish => wish.completed).length;
    const totalFeatures = features.length;
    const totalMemories = memories.length;

    return { totalWishes, completedWishes, totalFeatures, totalMemories };
  };

  // Notification handler
  const showNotification = (message) => {
    setNotification(message);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  // Feature handlers
  const handleStarClick = (featureId, starValue) => {
    const updatedFeatures = features.map(feature =>
      feature.id === featureId
        ? { ...feature, stars: starValue }
        : feature
    );
    setFeatures(updatedFeatures);
    showNotification('Rating updated!');
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;

    const newFeatureItem = {
      id: Date.now(),
      text: newFeature,
      stars: 5
    };

    setFeatures([...features, newFeatureItem]);
    setNewFeature('');
    showNotification('New feature added!');
  };

  // Wish handlers
  const handleWishToggle = (wishId) => {
    const updatedWishes = wishes.map(wish =>
      wish.id === wishId
        ? { ...wish, completed: !wish.completed }
        : wish
    );
    setWishes(updatedWishes);

    const toggledWish = updatedWishes.find(w => w.id === wishId);
    showNotification(toggledWish.completed
      ? 'Wish completed!'
      : 'Wish marked as pending');
  };

  const handleAddWish = () => {
    if (!newWish.trim()) return;

    const newWishItem = {
      id: Date.now(),
      text: newWish,
      completed: false
    };

    setWishes([...wishes, newWishItem]);
    setNewWish('');
    showNotification('New wish added!');
  };

  // Gallery handlers
  const openGallery = (index) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    setGalleryIndex((prev) => (prev + 1) % memories.length);
  };

  const prevImage = () => {
    setGalleryIndex((prev) => (prev === 0 ? memories.length - 1 : prev - 1));
  };

  const stats = getStatistics();

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <ProfileHeader
        avatar="/images/eva white.jpg"
        name="Eva"
        bio="The most beautiful and wonderful girl"
        stats={stats}
      />

      {/* Profile Dashboard */}
      <div className="profile-dashboard">
        {/* Love Messages Card */}
        <LoveCard
          messages={loveMessages}
          activeIndex={activeMessageIndex}
        />

        {/* Memories Card (Latest) */}
        <MemoriesCard
          memories={memories}
          limit={3}
          onOpenGallery={openGallery}
        />

        {/* Mood Card */}
        <MoodCard
          moodValue={mood}
          onMoodChange={(value) => {
            setMood(value);
            showNotification('Mood updated!');
          }}
        />

        {/* Features Card */}
        <FeaturesCard
          features={features}
          onStarClick={handleStarClick}
          onAddFeature={handleAddFeature}
          newFeature={newFeature}
          onNewFeatureChange={(e) => setNewFeature(e.target.value)}
        />

        {/* Wishes Card */}
        <WishesCard
          wishes={wishes}
          onWishToggle={handleWishToggle}
          onAddWish={handleAddWish}
          newWish={newWish}
          onNewWishChange={(e) => setNewWish(e.target.value)}
        />

        {/* Achievements Card */}
        <AchievementsCard
          achievements={achievements?.filter(a => a.isUnlocked) || []}
        />
      </div>

      {/* Full Gallery */}
      {galleryOpen && (
        <Gallery
          images={memories.map(m => m.image)}
          currentIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

      {/* Notification Component */}
      {notification && (
        <Notification
          message={notification}
          onDismiss={dismissNotification}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loader-container">
          <div className="loader">
            <div className="loader-heart"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eva;