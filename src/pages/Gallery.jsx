import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import ThemeLanguageSwitcher from '../components/ThemeLanguageSwitcher';
import GalleryItem from '../components/gallery/GalleryItem';
import ContactForm from '../components/gallery/ContactForm';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Gallery.css';
import { IoMdCloudUpload } from 'react-icons/io';
import { gsap } from 'gsap';
import FallingHearts from '../components/FallingHearts';

function Gallery() {
  const { t, language } = useLanguage();
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
  const cursorDotRef = useRef(null);

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
    // Удаляю отсутствующие файлы (13-15), которых нет на сервере
  ];

  // Custom cursor movement effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    itemRefs.current = itemRefs.current.slice(0, galleryItems.length);

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
        ref.setAttribute('data-id', galleryItems[index].id);
        observer.observe(ref);
      }
    });

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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

  // Animate title when component loads and gallery is displayed
  useEffect(() => {
    if (assetsLoaded) {
      gsap.to(".animate__title", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
      });
    }
  }, [assetsLoaded]);

  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
  };

  return (
    <div className="gallery-page">
      <Navbar />
      <ThemeLanguageSwitcher />
      <div className="cursor-dot" ref={cursorDotRef}></div>

      {/* Падающие сердечки */}
      <FallingHearts count={20} />

      <div className="gallery-container">
        <h1 className="gallery-title animate__title">{t('gallery', 'galleryTitle')}</h1>

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
            <div
              ref={galleryRef}
              className={`gallery-grid`}
            >
              {galleryItems.map((item, index) => (
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