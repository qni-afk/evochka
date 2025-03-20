import { useState } from 'react';
import Navbar from '../components/Navbar';
import FilterButtons from '../components/gallery/FilterButtons';
import GalleryItem from '../components/gallery/GalleryItem';
import Modal from '../components/gallery/Modal';
import ContactForm from '../components/gallery/ContactForm';

function Gallery() {
  const [is3DMode, setIs3DMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  // Данные о галерее (видео и превью)
  const galleryItems = [
    { id: 1, previewSrc: '/video/preview gif/1.png', videoSrc: '/video/gif/1.mp4', category: 'funny' },
    { id: 2, previewSrc: '/video/preview gif/2.png', videoSrc: '/video/gif/2.mp4', category: 'funny' },
    { id: 3, previewSrc: '/video/preview gif/3.png', videoSrc: '/video/gif/3.mp4', category: 'funny' },
    { id: 4, previewSrc: '/video/preview gif/4.png', videoSrc: '/video/gif/4.mp4', category: 'cool' },
    { id: 5, previewSrc: '/video/preview gif/5.png', videoSrc: '/video/gif/5.mp4', category: 'cool' },
    { id: 6, previewSrc: '/video/preview gif/6.png', videoSrc: '/video/gif/6.mp4', category: 'cute' },
    { id: 7, previewSrc: '/video/preview gif/7.png', videoSrc: '/video/gif/7.MOV', category: 'cute' },
    { id: 8, previewSrc: '/video/preview gif/8.png', videoSrc: '/video/gif/8.mp4', category: 'cute' },
    { id: 9, previewSrc: '/video/preview gif/9.png', videoSrc: '/video/gif/9.MOV', category: 'cute' },
    { id: 10, previewSrc: '/video/preview gif/10.jpg', videoSrc: '/video/gif/10.MOV', category: 'cute' },
    { id: 11, previewSrc: '/video/preview gif/11.jpg', videoSrc: '/video/gif/11.MOV', category: 'cute' },
    { id: 12, previewSrc: '/video/preview gif/12.jpg', videoSrc: '/video/gif/12.MP4', category: 'cute' },
    { id: 13, previewSrc: '/video/preview gif/13.jpg', videoSrc: '/video/gif/13.MOV', category: 'cute' },
    { id: 14, previewSrc: '/video/preview gif/14.png', videoSrc: '/video/gif/14.mp4', category: 'cute' },
    { id: 15, previewSrc: '/video/preview gif/15.png', videoSrc: '/video/gif/15.mp4', category: 'cute' },

  ];

  const openModal = (videoSrc) => {
    setCurrentVideo(videoSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentVideo('');
  };

  const toggleMode = () => {
    setIs3DMode(prev => !prev);
  };

  // Фильтрация элементов
  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="gallery-page">
      <Navbar />

      <div className="container">
        <h1>My sexy wife</h1>

        <FilterButtons setActiveFilter={setActiveFilter} />

        <button
          className={`mode-btn ${is3DMode ? 'active' : ''}`}
          id="3d-mode"
          onClick={toggleMode}
        >
          3D Mode
        </button>

        <div className="gallery">
          {filteredItems.map((item) => (
            <GalleryItem
              key={item.id}
              previewSrc={item.previewSrc}
              videoSrc={item.videoSrc}
              category={item.category}
              is3DMode={is3DMode}
              openModal={openModal}
            />
          ))}
        </div>

        <ContactForm />
      </div>

      <Modal
        isOpen={modalOpen}
        videoSrc={currentVideo}
        onClose={closeModal}
      />
    </div>
  );
}

export default Gallery;