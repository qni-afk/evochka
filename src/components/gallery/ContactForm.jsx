import { useState, useRef } from 'react';

function ContactForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setPhoto(selectedFile);

      // Создаем URL для предпросмотра
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    if (name.trim().length < 2) {
      alert('Имя должно содержать минимум 2 символа');
      return false;
    }

    if (message.trim().length < 10) {
      alert('Сообщение должно содержать минимум 10 символов');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Здесь должна быть логика отправки формы
    console.log('Отправка сообщения:', { name, message, photo });

    // Очистка формы после отправки
    setName('');
    setMessage('');
    setPhoto(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    alert('Сообщение успешно отправлено!');
  };

  return (
    <div className="contact-form">
      <h2>Отправить сообщение</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            id="message"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="photo" className="file-upload-label">
            <span className="upload-icon">📷</span>
            <span className="upload-text">Прикрепить фото</span>
            <input
              type="file"
              id="photo"
              accept="image/*"
              className="file-input"
              ref={fileInputRef}
              onChange={handlePhotoChange}
            />
          </label>

          {photoPreview && (
            <div id="photo-preview" className="photo-preview">
              <div className="photo-preview-container">
                <img src={photoPreview} alt="Preview" />
                <span className="remove-photo" onClick={removePhoto}>×</span>
              </div>
            </div>
          )}
        </div>
        <button type="submit" className="submit-btn">Send</button>
      </form>
    </div>
  );
}

export default ContactForm;