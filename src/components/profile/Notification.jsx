import React, { useEffect } from 'react';

const Notification = ({ message, onDismiss, duration = 3000 }) => {
  useEffect(() => {
    // Автоматически скрываем уведомление через duration мс
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss, duration]);

  if (!message) return null;

  return (
    <div className="notification">
      {message}
    </div>
  );
};

export default Notification;