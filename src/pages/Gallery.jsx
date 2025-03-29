import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import ThemeLanguageSwitcher from '../components/ThemeLanguageSwitcher';
import FilterButtons from '../components/gallery/FilterButtons';
import GalleryItem from '../components/gallery/GalleryItem';
import ContactForm from '../components/gallery/ContactForm';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Gallery.css';
import { IoMdCloudUpload } from 'react-icons/io';

function Gallery() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleItems, setVisibleItems] = useState({});
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('images');
  const [showContactForm, setShowContactForm] = useState(false);
  const preloadedVideos = useRef({});
  const totalAssets = useRef({ images: 0, videos: 0 });
  const loadedAssets = useRef({ images: 0, videos: 0 });
  const errorItems = useRef(new Set());
  const galleryRef = useRef(null);
  const itemRefs = useRef([]);
  const observerRef = useRef({});

  // Convert original gallery items to new format
  const galleryItems = [
    { id: 1, title: 'Funny Moment 1', url: '/video/gif/1.mp4', type: 'video', category: 'Funny', previewUrl: '/video/preview gif/1.png' },
    { id: 2, title: 'Funny Moment 2', url: '/video/gif/2.mp4', type: 'video', category: 'Funny', previewUrl: '/video/preview gif/2.png' },
    { id: 3, title: 'Funny Moment 3', url: '/video/gif/3.mp4', type: 'video', category: 'Funny', previewUrl: '/video/preview gif/3.png' },
    { id: 4, title: 'Cool Moment 1', url: '/video/gif/4.mp4', type: 'video', category: 'Cool', previewUrl: '/video/preview gif/4.png' },
    { id: 5, title: 'Cool Moment 2', url: '/video/gif/5.mp4', type: 'video', category: 'Cool', previewUrl: '/video/preview gif/5.png' },
    { id: 6, title: 'Cute Moment 1', url: '/video/gif/6.mp4', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/6.png' },
    { id: 7, title: 'Cute Moment 2', url: '/video/gif/7.MOV', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/7.png' },
    { id: 8, title: 'Cute Moment 3', url: '/video/gif/8.mp4', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/8.png' },
    { id: 9, title: 'Cute Moment 4', url: '/video/gif/9.MOV', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/9.png' },
    { id: 10, title: 'Cute Moment 5', url: '/video/gif/10.MOV', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/10.jpg' },
    { id: 11, title: 'Cute Moment 6', url: '/video/gif/11.MOV', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/11.jpg' },
    { id: 12, title: 'Cute Moment 7', url: '/video/gif/12.MP4', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/12.jpg' },
    { id: 13, title: 'Cute Moment 8', url: '/video/gif/13.MOV', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/13.jpg' },
    { id: 14, title: 'Cute Moment 9', url: '/video/gif/14.mp4', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/14.png' },
    { id: 15, title: 'Cute Moment 10', url: '/video/gif/15.mp4', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/15.png' },
  ];

  // Determine total asset count
  useEffect(() => {
    totalAssets.current = {
      images: galleryItems.length,
      videos: galleryItems.length
    };
  }, []);

  // Setup intersection observer for each gallery item
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
  }, [activeFilter]);

  // Function to update loading progress
  const updateLoadingProgress = () => {
    const { images: loadedImages, videos: loadedVideos } = loadedAssets.current;
    const { images: totalImages, videos: totalVideos } = totalAssets.current;
    let progress;

    if (loadingStage === 'images') {
      progress = Math.floor((loadedImages / totalImages) * 50);
    } else {
      progress = 50 + Math.floor((loadedVideos / totalVideos) * 50);
    }

    setLoadingProgress(progress);

    // If everything is loaded, mark loading as complete
    if (progress >= 100 || (loadedImages >= totalImages && loadedVideos >= totalVideos)) {
      setTimeout(() => {
        setAssetsLoaded(true);
      }, 500);
    }
  };

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      setLoadingStage('images');

      const imagePromises = galleryItems.map((item) => {
        return new Promise(resolve => {
          const img = new Image();
          img.src = item.previewUrl;

          img.onload = () => {
            loadedAssets.current.images++;
            updateLoadingProgress();
            resolve(true);
          };

          img.onerror = () => {
            console.error(`Failed to load image: ${item.previewUrl}`);
            errorItems.current.add(item.id);
            loadedAssets.current.images++;
            updateLoadingProgress();
            resolve(false);
          };
        });
      });

      // Wait for all images to load
      await Promise.all(imagePromises);

      // After loading images, move on to loading videos
      setLoadingStage('videos');
      await preloadAllVideos();

      // Final check - if too many errors, show gallery anyway
      if (loadingProgress < 100 && assetsLoaded === false) {
        setAssetsLoaded(true);
      }
    };

    loadImages();
  }, []);

  // Function to preload all videos
  const preloadAllVideos = async () => {
    const videoPromises = galleryItems.map(item => {
      // Skip preloading videos for items with image errors
      if (errorItems.current.has(item.id)) {
        loadedAssets.current.videos++;
        updateLoadingProgress();
        return Promise.resolve(false);
      }
      return preloadVideo(item);
    });

    try {
      await Promise.all(videoPromises);
    } catch (error) {
      console.error("Error preloading videos:", error);
    } finally {
      // Set loading flag to true even if there were errors
      setTimeout(() => {
        setAssetsLoaded(true);
      }, 500);
    }
  };

  // Function to preload an individual video
  const preloadVideo = (item) => {
    const { id, url } = item;

    if (preloadedVideos.current[url]) {
      return Promise.resolve(true); // Video already loaded
    }

    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata'; // First load only metadata

      // Determine if it's a MOV file (which may need special handling)
      const isMovFile = url.toLowerCase().endsWith('.mov');

      // For MOV files, mark them as preloaded and move on
      if (isMovFile) {
        preloadedVideos.current[url] = true;
        loadedAssets.current.videos++;
        updateLoadingProgress();
        return resolve(true);
      }

      const timeoutId = setTimeout(() => {
        // If loading takes too long, mark as loaded
        // to avoid blocking the user interface
        errorItems.current.add(id);
        loadedAssets.current.videos++;
        updateLoadingProgress();
        resolve(false);
      }, 10000); // 10 second timeout

      // Listen for 'loadedmetadata' event, which signals metadata loading
      video.addEventListener('loadedmetadata', () => {
        clearTimeout(timeoutId);
        preloadedVideos.current[url] = true;
        loadedAssets.current.videos++;
        updateLoadingProgress();
        resolve(true);
      }, { once: true });

      // Also handle loading errors
      video.addEventListener('error', () => {
        clearTimeout(timeoutId);
        console.error(`Error loading video: ${url}`);
        errorItems.current.add(id);
        loadedAssets.current.videos++;
        updateLoadingProgress();
        resolve(false);
      }, { once: true });

      // Start loading
      video.src = url;
      video.load();
    });
  };

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
  };

  const getFilteredItems = () => {
    if (activeFilter === 'All') {
      return galleryItems;
    }
    return galleryItems.filter(item => item.category === activeFilter);
  };

  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'ru' ? 'en' : 'ru');
  };

  return (
    <div className="gallery-page">
      <Navbar />
      <ThemeLanguageSwitcher />

      <div className="gallery-container">
        <h1 className="gallery-title">{t('gallery', 'galleryTitle')}</h1>

        {!assetsLoaded ? (
          <div className="loading-container">
            <div className="loading-progress">
              <div className="progress-bar" style={{ width: `${loadingProgress}%` }}>
                <span className="progress-text">{loadingProgress}%</span>
              </div>
            </div>
            <p className="loading-text">
              {loadingStage === 'images'
                ? t('gallery', 'loadingPhotos')
                : t('gallery', 'loadingVideos')}
            </p>
          </div>
        ) : (
          <>
            <div className="gallery-controls">
              <div className="filters">
                <FilterButtons
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  filters={[
                    { name: 'All', label: t('gallery', 'filterAll') },
                    { name: 'Funny', label: t('gallery', 'filterFunny') },
                    { name: 'Cute', label: t('gallery', 'filterCute') },
                    { name: 'Cool', label: t('gallery', 'filterCool') }
                  ]}
                />
              </div>
            </div>

            <div
              ref={galleryRef}
              className={`gallery-grid`}
            >
              {getFilteredItems().map((item, index) => (
                <div
                  key={item.id}
                  ref={el => itemRefs.current[index] = el}
                  className="gallery-item-container"
                >
                  <GalleryItem
                    item={{
                      ...item,
                      thumbnail: item.previewUrl
                    }}
                    index={index}
                    isVisible={visibleItems[item.id] || false}
                  />
                </div>
              ))}
            </div>

            <div className="gallery-footer">
              <button className="contact-button" onClick={toggleContactForm}>
                {showContactForm ? (
                  <>
                    <IoMdCloudUpload className="upload-icon" />
                    <span>Скрыть форму</span>
                  </>
                ) : (
                  'Загрузить свои фото'
                )}
              </button>

              {showContactForm && <ContactForm />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Gallery;