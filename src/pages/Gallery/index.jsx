import { useState, useEffect, useRef } from 'react';
import GalleryItem from '../../components/gallery/GalleryItem';
import ContactForm from '../../components/gallery/ContactForm';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import './styles/Gallery.css';
import { IoMdCloudUpload } from 'react-icons/io';
import { gsap } from 'gsap';
import FallingHearts from '../../components/FallingHearts';
import { useNavigate } from 'react-router-dom';

function Gallery() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
  const singleVideoRef = useRef(null);

  // Обновленные элементы галереи с изображениями
  const galleryItems = [
    { id: 1, title: 'Eva Banner', url: '/images/gallery/banner.jpg', type: 'image', category: 'Photos' },
    { id: 2, title: 'Eva Bitch', url: '/images/gallery/eva bitch.jpg', type: 'image', category: 'Photos' },
    { id: 3, title: 'Eva Blue', url: '/images/gallery/eva blue.jpg', type: 'image', category: 'Photos' },
    { id: 4, title: 'Eva Sex 3', url: '/images/gallery/eva sex 3.jpg', type: 'image', category: 'Photos' },
    { id: 5, title: 'Eva Sex 4', url: '/images/gallery/eva sex 4.jpg', type: 'image', category: 'Photos' },
    { id: 6, title: 'Eva Sex 5', url: '/images/gallery/eva sex 5.jpg', type: 'image', category: 'Photos' },
    { id: 7, title: 'Eva Sex', url: '/images/gallery/eva sex.jpg', type: 'image', category: 'Photos' },
    { id: 8, title: 'Eva White', url: '/images/gallery/eva white.jpg', type: 'image', category: 'Photos' },
    // Возвращаем все оригинальные видео-элементы
    { id: 9, title: 'Funny Moment 1', url: '/video/gif/1.mp4', type: 'video', category: 'Funny', previewUrl: '/video/preview gif/1.png' },
    { id: 10, title: 'Funny Moment 2', url: '/video/gif/2.mp4', type: 'video', category: 'Funny', previewUrl: '/video/preview gif/2.png' },
    { id: 11, title: 'Funny Moment 3', url: '/video/gif/3.mp4', type: 'video', category: 'Funny', previewUrl: '/video/preview gif/3.png' },
    { id: 12, title: 'Cool Moment 1', url: '/video/gif/4.mp4', type: 'video', category: 'Cool', previewUrl: '/video/preview gif/4.png' },
    { id: 13, title: 'Cool Moment 2', url: '/video/gif/5.mp4', type: 'video', category: 'Cool', previewUrl: '/video/preview gif/5.png' },
    { id: 14, title: 'Cute Moment 1', url: '/video/gif/6.mp4', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/6.png' },
    { id: 15, title: 'Cute Moment 2', url: '/video/gif/7.MOV', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/7.png' },
    { id: 16, title: 'Cute Moment 3', url: '/video/gif/8.mp4', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/8.png' },
    { id: 17, title: 'Cute Moment 4', url: '/video/gif/9.MOV', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/9.png' },
    { id: 18, title: 'Cute Moment 5', url: '/video/gif/10.MOV', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/10.jpg' },
    { id: 19, title: 'Cute Moment 6', url: '/video/gif/11.MOV', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/11.jpg' },
    { id: 20, title: 'Cute Moment 7', url: '/video/gif/12.MP4', type: 'video', category: 'Cute', previewUrl: '/video/preview gif/12.jpg' },
  ];

  // Для неавторизованных пользователей показываем те же элементы
  const visibleGalleryItems = isAuthenticated
    ? galleryItems
    : galleryItems;

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
      images: visibleGalleryItems.length,
      videos: visibleGalleryItems.length
    };
  }, [isAuthenticated]);

  // Setup intersection observer for each gallery item
  useEffect(() => {
    // Setup intersection observer for each gallery item
    itemRefs.current = itemRefs.current.slice(0, visibleGalleryItems.length);

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
        ref.setAttribute('data-id', visibleGalleryItems[index].id);
        observer.observe(ref);
      }
    });

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isAuthenticated]);

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

      const imagePromises = visibleGalleryItems.map((item) => {
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
  }, [isAuthenticated]);

  // Function to preload all videos
  const preloadAllVideos = async () => {
    const videoPromises = visibleGalleryItems.map(item => {
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

  // Function to preload a video
  const preloadVideo = (item) => {
    return new Promise((resolve, reject) => {
      // Skip videos that already had error loading images
      if (errorItems.current.has(item.id)) {
        loadedAssets.current.videos++;
        updateLoadingProgress();
        return resolve(false);
      }

      const video = document.createElement('video');
      video.style.display = 'none';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.src = item.url;

      // Set timeout to handle cases where video loading never completes
      const timeoutId = setTimeout(() => {
        console.warn(`Video load timeout for: ${item.url}`);
        document.body.removeChild(video);
        errorItems.current.add(item.id);
        loadedAssets.current.videos++;
        updateLoadingProgress();
        resolve(false);
      }, 10000); // 10 second timeout

      video.onloadeddata = () => {
        clearTimeout(timeoutId);
        document.body.removeChild(video);
        preloadedVideos.current[item.id] = true;
        loadedAssets.current.videos++;
        updateLoadingProgress();
        resolve(true);
      };

      video.onerror = (e) => {
        clearTimeout(timeoutId);
        document.body.removeChild(video);
        console.error(`Failed to load video: ${item.url}`, e);
        errorItems.current.add(item.id);
        loadedAssets.current.videos++;
        updateLoadingProgress();
        resolve(false);
      };

      document.body.appendChild(video);
    });
  };

  // GSAP animations on mount
  useEffect(() => {
    if (assetsLoaded && galleryRef.current) {
      // Animate main gallery heading
      gsap.from('.gallery-heading', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      // Animate gallery items with stagger
      gsap.from('.gallery-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3
      });
    }
  }, [assetsLoaded]);

  // Toggle contact form
  const toggleContactForm = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!showContactForm) {
      gsap.to(window, { duration: 0.5, scrollTo: { y: 0, offsetY: 50 } });
    }

    setShowContactForm(!showContactForm);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const getLoginPromptText = () => {
    switch(language) {
      case 'ru':
        return 'Чтобы увидеть приватную галерею, пожалуйста, войдите в аккаунт';
      default:
        return 'To see the private gallery, please log in';
    }
  };

  const getLoginButtonText = () => {
    switch(language) {
      case 'ru':
        return 'Войти';
      default:
        return 'Log In';
    }
  };

  const getRegisterButtonText = () => {
    switch(language) {
      case 'ru':
        return 'Зарегистрироваться';
      default:
        return 'Register';
    }
  };

  const getContactButtonText = () => {
    switch(language) {
      case 'ru':
        return showContactForm ? 'Закрыть форму' : 'Связаться со мной';
      default:
        return showContactForm ? 'Close form' : 'Contact me';
    }
  };

  return (
    <div className="gallery-page" ref={galleryRef}>
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <FallingHearts />

      <h1 className="gallery-heading">
        {t('gallery', 'title')}
      </h1>

      {!assetsLoaded ? (
        <div className="gallery-loader">
          <div className="loader-heart">❤️</div>
          <div className="loader-text">{loadingStage === 'images' ? t('gallery', 'loadingImages') : t('gallery', 'loadingVideos')}</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${loadingProgress}%` }}></div>
          </div>
          <div className="loading-percentage">{loadingProgress}%</div>
        </div>
      ) : (
        <>
          {/* Contact form toggle button */}
          <div className="contact-button-container">
            <button
              className={`contact-button ${showContactForm ? 'active' : ''}`}
              onClick={toggleContactForm}
            >
              {isAuthenticated ? (
                <>
                  <IoMdCloudUpload className="button-icon" />
                  {getContactButtonText()}
                </>
              ) : (
                <>
                  {getLoginButtonText()}
                </>
              )}
            </button>

            {!isAuthenticated && (
              <button className="register-button" onClick={() => navigate('/register')}>
                {getRegisterButtonText()}
              </button>
            )}
          </div>

          {/* Contact form */}
          {showContactForm && isAuthenticated && (
            <ContactForm onClose={toggleContactForm} />
          )}

          {/* Gallery items */}
          <div className="gallery-container">
            {visibleGalleryItems.map((item, index) => (
              <div
                className="gallery-item-container"
                key={item.id}
                ref={el => itemRefs.current[index] = el}
                style={{
                  transform: 'rotate(0deg)',
                  aspectRatio: '1 / 1',
                  width: '100%',
                  height: 'auto',
                  position: 'relative'
                }}
              >
                <GalleryItem
                  item={item}
                  isVisible={visibleItems[item.id]}
                  error={errorItems.current.has(item.id)}
                />
              </div>
            ))}
          </div>

          {/* Authentication prompt for non-logged in users */}
          {!isAuthenticated && (
            <div className="login-prompt">
              <p>{getLoginPromptText()}</p>
              <button className="login-button" onClick={handleLoginClick}>
                {getLoginButtonText()}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Gallery;