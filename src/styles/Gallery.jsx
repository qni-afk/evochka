import React, { useState, useEffect, useRef } from 'react';
import GalleryItem from '../components/gallery/GalleryItem';
import FilterButtons from '../components/gallery/FilterButtons';
import ContactForm from '../components/gallery/ContactForm';

// Sample gallery items - replace with your actual data
const galleryItems = [
  {
    id: 1,
    title: 'Sunset at the Beach',
    url: '/gallery/beach-sunset.jpg',
    type: 'image',
    category: 'Cute'
  },
  {
    id: 2,
    title: 'Mountain Adventure',
    url: '/gallery/mountain.mp4',
    type: 'video',
    category: 'Cool'
  },
  {
    id: 3,
    title: 'Funny Cat',
    url: '/gallery/cat.mp4',
    type: 'video',
    category: 'Funny'
  },
  {
    id: 4,
    title: 'Forest Path',
    url: '/gallery/forest.jpg',
    type: 'image',
    category: 'Cool'
  },
  {
    id: 5,
    title: 'City Lights',
    url: '/gallery/city.jpg',
    type: 'image',
    category: 'Cool'
  },
  {
    id: 6,
    title: 'Puppy Play',
    url: '/gallery/puppy.mp4',
    type: 'video',
    category: 'Cute'
  },
  {
    id: 7,
    title: 'Ocean Waves',
    url: '/gallery/ocean.jpg',
    type: 'image',
    category: 'Cool'
  },
  {
    id: 8,
    title: 'Dancing Fail',
    url: '/gallery/dance.mp4',
    type: 'video',
    category: 'Funny'
  }
];

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [visibleItems, setVisibleItems] = useState({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef({});
  const itemRefs = useRef([]);

  useEffect(() => {
    // Simulate loading gallery items
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Setup intersection observer for each gallery item
    itemRefs.current = itemRefs.current.slice(0, getFilteredItems().length);

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = parseInt(entry.target.getAttribute('data-id'));
        setVisibleItems(prev => ({
          ...prev,
          [id]: entry.isIntersecting
        }));
      });
    }, observerOptions);

    // Observe all gallery items
    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.setAttribute('data-id', getFilteredItems()[index].id);
        observer.observe(ref);
      }
    });

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getFilteredItems = () => {
    if (filter === 'All') {
      return galleryItems;
    }
    return galleryItems.filter(item => item.category === filter);
  };

  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
  };

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1 className="gallery-title">Gallery</h1>
        <p className="gallery-description">
          Explore our collection of beautiful moments captured in photos and videos
        </p>
      </div>

      <FilterButtons activeFilter={filter} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="gallery-loading">
          <div className="spinner-large"></div>
          <p>Loading gallery...</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {getFilteredItems().map((item, index) => (
            <div
              key={item.id}
              ref={el => itemRefs.current[index] = el}
              className="gallery-item-container"
            >
              <GalleryItem
                item={item}
                index={index}
                isVisible={visibleItems[item.id] || false}
              />
            </div>
          ))}
        </div>
      )}

      <div className="gallery-center">
        <button className="view-more-button">
          Посмотреть больше фотографий
        </button>
      </div>

      <div className="gallery-footer">
        <button className="contact-button" onClick={toggleContactForm}>
          {showContactForm ? 'Hide Contact Form' : 'Contact Us'}
        </button>

        {showContactForm && (
          <div className="contact-form-container">
            <ContactForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;