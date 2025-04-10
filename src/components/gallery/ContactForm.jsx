import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaPaperPlane, FaImage } from 'react-icons/fa';
import '../../styles/ContactForm.css';

const ContactForm = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    file: null
  });
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError(getErrorText('fileTypeError'));
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(getErrorText('fileSizeError'));
        return;
      }

      setFormData({
        ...formData,
        file
      });
      setFileName(file.name);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Here would be the actual API call to submit the form
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: '',
        file: null
      });
      setFileName('');
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      setError(getErrorText('submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for translated text
  const getNamePlaceholder = () => {
    if (language === 'ru') return 'Ваше имя';
    if (language === 'vi') return 'Tên của bạn';
    return 'Your name';
  };

  const getEmailPlaceholder = () => {
    if (language === 'ru') return 'Ваш email';
    if (language === 'vi') return 'Email của bạn';
    return 'Your email';
  };

  const getMessagePlaceholder = () => {
    if (language === 'ru') return 'Сообщение...';
    if (language === 'vi') return 'Tin nhắn...';
    return 'Message...';
  };

  const getUploadText = () => {
    if (language === 'ru') return 'Прикрепить фото';
    if (language === 'vi') return 'Đính kèm ảnh';
    return 'Attach photo';
  };

  const getSubmitText = () => {
    if (isSubmitting) {
      if (language === 'ru') return 'Отправка...';
      if (language === 'vi') return 'Đang gửi...';
      return 'Sending...';
    }
    if (language === 'ru') return 'Отправить';
    if (language === 'vi') return 'Gửi';
    return 'Send';
  };

  const getSuccessText = () => {
    if (language === 'ru') return 'Сообщение успешно отправлено!';
    if (language === 'vi') return 'Tin nhắn đã được gửi thành công!';
    return 'Message sent successfully!';
  };

  const getErrorText = (errorType) => {
    if (errorType === 'fileTypeError') {
      if (language === 'ru') return 'Пожалуйста, загрузите изображение';
      if (language === 'vi') return 'Vui lòng tải lên hình ảnh';
      return 'Please upload an image file';
    }
    if (errorType === 'fileSizeError') {
      if (language === 'ru') return 'Размер файла не должен превышать 5 МБ';
      if (language === 'vi') return 'Kích thước tập tin không được vượt quá 5 MB';
      return 'File size should not exceed 5 MB';
    }
    if (errorType === 'submitError') {
      if (language === 'ru') return 'Произошла ошибка при отправке. Пожалуйста, попробуйте снова.';
      if (language === 'vi') return 'Đã xảy ra lỗi khi gửi. Vui lòng thử lại.';
      return 'There was an error submitting the form. Please try again.';
    }
    return '';
  };

  const getTitleText = () => {
    if (language === 'ru') return 'Поделитесь своими фото с Евой';
    if (language === 'vi') return 'Chia sẻ ảnh của bạn với Eva';
    return 'Share your photos with Eva';
  };

  return (
    <div className="contact-form-container">
      <h3 className="contact-form-title">{getTitleText()}</h3>

      {isSubmitted ? (
        <div className="success-message">
          <FaPaperPlane className="success-icon" />
          <p>{getSuccessText()}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={getNamePlaceholder()}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={getEmailPlaceholder()}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={getMessagePlaceholder()}
              required
              className="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group file-input-group">
            <label htmlFor="file-upload" className="file-upload-label">
              <FaImage className="file-icon" />
              <span>{getUploadText()}</span>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
              />
            </label>
            {fileName && <span className="file-name">{fileName}</span>}
          </div>

          <button
            type="submit"
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            <FaPaperPlane className="send-icon" />
            {getSubmitText()}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;