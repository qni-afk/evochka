import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import '../styles/CircleAdmin.css';

/**
 * Компонент для администрирования кружков
 * Позволяет:
 * - добавлять новые видео (кружки)
 * - редактировать существующие
 * - удалять кружки
 */
const CircleAdmin = ({ circles, onSave, onCancel }) => {
  const { language } = useLanguage();
  const [editableCircles, setEditableCircles] = useState([...circles]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const translations = {
    adminPanel: {
      ru: 'Панель администратора',
      en: 'Admin Panel'
    },
    addCircle: {
      ru: 'Добавить кружок',
      en: 'Add Circle'
    },
    editCircle: {
      ru: 'Редактировать кружок',
      en: 'Edit Circle'
    },
    deleteCircle: {
      ru: 'Удалить',
      en: 'Delete'
    },
    save: {
      ru: 'Сохранить',
      en: 'Save'
    },
    cancel: {
      ru: 'Отмена',
      en: 'Cancel'
    },
    circleId: {
      ru: 'ID кружка',
      en: 'Circle ID'
    },
    videoPath: {
      ru: 'Путь к видео',
      en: 'Video Path'
    },
    videoFile: {
      ru: 'Файл видео',
      en: 'Video File'
    },
    chooseFile: {
      ru: 'Выбрать файл',
      en: 'Choose File'
    },
    noFileChosen: {
      ru: 'Файл не выбран',
      en: 'No file chosen'
    },
    saveChanges: {
      ru: 'Сохранить изменения',
      en: 'Save Changes'
    },
    confirmDelete: {
      ru: 'Вы уверены, что хотите удалить этот кружок?',
      en: 'Are you sure you want to delete this circle?'
    },
    uploading: {
      ru: 'Загрузка...',
      en: 'Uploading...'
    },
    uploadSuccess: {
      ru: 'Файл успешно загружен',
      en: 'File uploaded successfully'
    },
    uploadError: {
      ru: 'Ошибка при загрузке файла',
      en: 'Error uploading file'
    }
  };

  const t = (key) => translations[key][language === 'ru' ? 'ru' : 'en'];

  // Добавление нового кружка
  const handleAddCircle = () => {
    // Генерируем новый ID (максимальный + 1)
    const newId = editableCircles.length > 0
      ? Math.max(...editableCircles.map(c => c.id)) + 1
      : 1;

    const newCircle = {
      id: newId,
      path: `/circle/circle${newId}.mp4`
    };

    setEditableCircles([...editableCircles, newCircle]);
    setSelectedCircle(newCircle);
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  // Редактирование существующего кружка
  const handleEditCircle = (circle) => {
    setSelectedCircle(circle);
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  // Удаление кружка
  const handleDeleteCircle = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      setEditableCircles(editableCircles.filter(circle => circle.id !== id));
      setSuccess('Кружок успешно удален');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Загрузка файла на сервер
  const uploadFile = async (file, circleId) => {
    if (!file || !circleId) return null;

    const formData = new FormData();
    formData.append('video', file);

    try {
      setLoading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `http://localhost:5000/api/upload-circle/${circleId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setLoading(false);
      setSuccess(t('uploadSuccess'));
      return response.data.path;
    } catch (error) {
      setLoading(false);
      setError(t('uploadError') + ': ' + (error.response?.data?.error || error.message));
      return null;
    }
  };

  // Отслеживание изменения файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Обновляем имя файла для отображения
    e.target.nextElementSibling.nextElementSibling.textContent = file.name;
  };

  // Сохранение изменений в выбранном кружке
  const handleSaveCircle = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const circleId = Number(formData.get('circleId'));
    let path = formData.get('videoPath');
    const file = formData.get('videoFile');

    // Проверяем корректность данных
    if (!circleId || !path) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Если выбран файл, загружаем его на сервер
    if (file && file.size > 0) {
      const uploadedPath = await uploadFile(file, circleId);
      if (uploadedPath) {
        path = uploadedPath;
      }
    }

    // Обновляем выбранный кружок
    const updatedCircle = {
      id: circleId,
      path: path
    };

    // Если это новый кружок, добавляем его, иначе обновляем существующий
    if (selectedCircle && selectedCircle.id) {
      setEditableCircles(editableCircles.map(c =>
        c.id === selectedCircle.id ? updatedCircle : c
      ));
    } else {
      setEditableCircles([...editableCircles, updatedCircle]);
    }

    setIsEditing(false);
    setSelectedCircle(null);
    setSuccess('Кружок успешно сохранен');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Сохранение всех изменений
  const handleSaveAll = () => {
    onSave(editableCircles);
    setSuccess('Все изменения сохранены');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Обработчик отмены редактирования
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedCircle(null);
    setError('');
  };

  // Обработчик нажатия на кнопку "Отмена" для всей панели
  const handleCancelAll = () => {
    onCancel();
  };

  return (
    <div className="circle-admin-container">
      <h2 className="circle-admin-title">{t('adminPanel')}</h2>

      {error && <div className="circle-admin-error">{error}</div>}
      {success && <div className="circle-admin-success">{success}</div>}
      {loading && (
        <div className="circle-admin-loading">
          <div className="loading-text">{t('uploading')} {uploadProgress}%</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="circle-edit-form-container">
          <h3>{selectedCircle && selectedCircle.id ? t('editCircle') : t('addCircle')}</h3>

          <form onSubmit={handleSaveCircle} className="circle-edit-form">
            <div className="form-group">
              <label htmlFor="circleId">{t('circleId')}:</label>
              <input
                type="number"
                id="circleId"
                name="circleId"
                defaultValue={selectedCircle ? selectedCircle.id : ''}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="videoPath">{t('videoPath')}:</label>
              <input
                type="text"
                id="videoPath"
                name="videoPath"
                defaultValue={selectedCircle ? selectedCircle.path : ''}
                placeholder="/circle/circle1.mp4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="videoFile">{t('videoFile')}:</label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="videoFile"
                  name="videoFile"
                  ref={fileInputRef}
                  accept="video/mp4,video/webm,video/ogg"
                  className="file-input"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="file-input-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  {t('chooseFile')}
                </button>
                <span className="file-name">
                  {t('noFileChosen')}
                </span>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? t('uploading') : t('save')}
              </button>
              <button type="button" className="cancel-button" onClick={handleCancelEdit} disabled={loading}>
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="circle-list-container">
            <h3>Список кружков</h3>
            <div className="circle-list">
              {editableCircles.map(circle => (
                <div key={circle.id} className="circle-list-item">
                  <span className="circle-id">ID: {circle.id}</span>
                  <span className="circle-path">{circle.path}</span>
                  <div className="circle-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditCircle(circle)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteCircle(circle.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="add-circle-button" onClick={handleAddCircle}>
              {t('addCircle')}
            </button>
          </div>

          <div className="circle-admin-actions">
            <button className="save-all-button" onClick={handleSaveAll}>{t('saveChanges')}</button>
            <button className="cancel-all-button" onClick={handleCancelAll}>{t('cancel')}</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CircleAdmin;