import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setFilePreview('');
      return;
    }

    // Проверка, является ли файл изображением или видео
    if (!file.type.match('image.*') && !file.type.match('video.*')) {
      alert('Пожалуйста, выберите изображение или видео');
      return;
    }

    setSelectedFile(file);

    // Если это изображение, создаем превью
    if (file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Для видео используем временное превью
      setFilePreview('Video file selected');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Пожалуйста, выберите файл для загрузки');
      return;
    }

    // Симуляция отправки формы
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Фотография успешно отправлена! Она будет добавлена на сайт после проверки.'
      });

      // Сброс формы
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setSelectedFile(null);
      setFilePreview('');
    }, 1000);
  };

  return (
    <div className="contact-form-container">
      <h2 className="contact-form-title">Отправить новую фотографию</h2>
      <p className="contact-form-description">
        Загрузите свои фотографии или видео для добавления на сайт. После проверки они появятся в галерее.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Ваше имя</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="file" className="form-label">Выберите фото или видео</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            className="form-input file-input"
            accept="image/*,video/*"
            required
          />

          {filePreview && (
            <div className="file-preview">
              {filePreview.startsWith('data:image') ? (
                <img src={filePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="video-preview-placeholder">
                  Видео-файл выбран
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">Описание (опционально)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Расскажите о своем фото или видео"
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          Отправить фотографию
        </button>
      </form>

      {formStatus.submitted && (
        <div className={formStatus.success ? 'success-message' : 'error-message'}>
          {formStatus.message}
        </div>
      )}
    </div>
  );
}

export default ContactForm;