import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../styles/Eva.css';
import { FaHeart, FaStar, FaCamera, FaGift, FaMagic, FaRegSmile } from 'react-icons/fa';
import { GiDiamondRing, GiButterflyFlower, GiPartyPopper } from 'react-icons/gi';

const Eva = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [animation, setAnimation] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [moodRating, setMoodRating] = useState(0);
  const [wishes, setWishes] = useState([
    { id: 1, text: 'Trip to the sea', completed: false },
    { id: 2, text: 'Date at a beautiful restaurant', completed: true },
    { id: 3, text: 'New dress', completed: false },
    { id: 4, text: 'Wedding', completed: false },
  ]);
  const [newWish, setNewWish] = useState('');
  const [confetti, setConfetti] = useState(false);
  const evaRef = useRef(null);
  const containerRef = useRef(null);

  const memories = [
    { id: 1, title: 'First meeting', date: '09.12.2023', image: '/images/photo_2025-02-28_01-09-21.jpg' },
    { id: 2, title: "New Year's Eve", date: '31.12.2023', image: '/images/eva white.jpg' },
    { id: 3, title: "Eva's birthday", date: '05.03.2023', image: '/images/eva blue.jpg' },
    { id: 4, title: 'My birthday', date: '08.08.2024', image: '/images/eva sex.jpg' },
    { id: 5, title: 'One year together', date: '09.12.2024', image: '/images/image_2025-02-28_01-11-28.png' },
    { id: 6, title: 'Two years together', date: '09.12.2025', image: '/images/photo_2024-06-17_22-32-56.jpg' },
  ];

  const compliments = [
    'You are the most beautiful!',
    'Your smile brightens my day',
    'You are my favorite girl',
    'I am the happiest with you',
    'You are infinitely gorgeous',
    'You make me better',
    'Your eyes are like two stars',
    'I love your laughter',
    'You are my inspiration',
    'You are perfect in every way'
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const sendCompliment = () => {
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
    }, 2000);
  };

  const addHearts = (e) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const newHearts = Array(5).fill().map((_, i) => ({
      id: Date.now() + i,
      x: mouseX,
      y: mouseY,
      size: Math.random() * 20 + 10,
      color: `hsl(${Math.random() * 60 + 330}, 100%, 70%)`,
      duration: Math.random() * 2 + 1,
      direction: Math.random() * 360
    }));

    setHearts([...hearts, ...newHearts]);

    setTimeout(() => {
      setHearts(hearts => hearts.filter(heart => !newHearts.includes(heart)));
    }, 3000);
  };

  const toggleWish = (id) => {
    setWishes(wishes.map(wish =>
      wish.id === id ? { ...wish, completed: !wish.completed } : wish
    ));

    if (!wishes.find(wish => wish.id === id).completed) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  };

  const addWish = () => {
    if (newWish.trim() !== '') {
      setWishes([
        ...wishes,
        { id: Date.now(), text: newWish, completed: false }
      ]);
      setNewWish('');
    }
  };

  const randomCompliment = () => {
    return compliments[Math.floor(Math.random() * compliments.length)];
  };

  useEffect(() => {
    // Effect for animation on page load
    const timer = setTimeout(() => {
      if (evaRef.current) {
        evaRef.current.classList.add('loaded');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="eva-page" ref={containerRef} onClick={addHearts}>
      <Navbar />

      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="floating-heart"
          initial={{
            x: heart.x,
            y: heart.y,
            opacity: 1,
            scale: 0
          }}
          animate={{
            x: heart.x + Math.cos(heart.direction) * 100,
            y: heart.y - 100 - Math.random() * 50,
            opacity: 0,
            scale: heart.size / 10
          }}
          transition={{
            duration: heart.duration,
            ease: "easeOut"
          }}
          style={{ color: heart.color }}
        >
          <FaHeart />
        </motion.div>
      ))}

      {confetti && (
        <div className="confetti-container">
          {Array(50).fill().map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
              }}
            />
          ))}
        </div>
      )}

      <header className="eva-header">
        <div className="profile-container" ref={evaRef}>
          <div className="eva-profile">
            <img src="/images/eva white.jpg" alt="Eva" className="profile-pic" />
            <div className="profile-info">
              <h1>Eva <GiButterflyFlower className="name-icon" /></h1>
              <p className="profile-subtitle">My sweet girl</p>
              <div className="mood-meter">
                <p>Mood today:</p>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= moodRating ? 'star active' : 'star'}
                      onClick={() => setMoodRating(star)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="tabs">
        <button
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => handleTabChange('gallery')}
        >
          <FaCamera /> Gallery
        </button>
        <button
          className={activeTab === 'wishes' ? 'active' : ''}
          onClick={() => handleTabChange('wishes')}
        >
          <FaGift /> Wishes
        </button>
        <button
          className={activeTab === 'compliments' ? 'active' : ''}
          onClick={() => handleTabChange('compliments')}
        >
          <FaRegSmile /> Compliments
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'gallery' && (
          <div className="memories-section">
            <h2>Our Memories <FaCamera /></h2>
            <div className="memories-grid">
              {memories.map((memory) => (
                <motion.div
                  key={memory.id}
                  className="memory-card"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(255, 156, 173, 0.4)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="memory-image">
                    <img src={memory.image} alt={memory.title} />
                  </div>
                  <div className="memory-info">
                    <h3>{memory.title}</h3>
                    <p>{memory.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wishes' && (
          <div className="wishes-section">
            <h2>Wish List <FaGift /></h2>
            <div className="wish-input">
              <input
                type="text"
                placeholder="Add a new wish..."
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addWish()}
              />
              <button onClick={addWish}>Add</button>
            </div>
            <ul className="wishes-list">
              {wishes.map((wish) => (
                <motion.li
                  key={wish.id}
                  className={wish.completed ? 'completed' : ''}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleWish(wish.id)}
                >
                  <span className="wish-text">{wish.text}</span>
                  <span className="wish-check">{wish.completed ? '✓' : '○'}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'compliments' && (
          <div className="compliments-section">
            <h2>Compliments <FaRegSmile /></h2>
            <div className="compliment-card">
              <motion.div
                className={`compliment-text ${animation ? 'animate' : ''}`}
                animate={animation ? {
                  scale: [1, 1.2, 1],
                  color: [
                    'hsl(340, 100%, 76%)',
                    'hsl(360, 100%, 70%)',
                    'hsl(340, 100%, 76%)'
                  ]
                } : {}}
                transition={{ duration: 2 }}
              >
                {randomCompliment()}
              </motion.div>
              <button className="compliment-button" onClick={sendCompliment}>
                <FaMagic /> New Compliment
              </button>
            </div>
            <div className="love-note">
              <GiDiamondRing className="love-icon" />
              <p>You are the best thing that has ever happened to me. Every day with you is a little miracle.</p>
            </div>
          </div>
        )}
      </div>

      <div className="eva-footer">
        <p>With love forever ❤️</p>
        <GiPartyPopper className="footer-icon" />
      </div>
    </div>
  );
};

export default Eva;