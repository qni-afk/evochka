import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import './styles/SecretLove.css';

function SecretLove() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeMessage, setActiveMessage] = useState(0);
  const [typedText, setTypedText] = useState('');

  // Messages to be typed one character at a time
  const messages = [
    t('secretLove', 'message1'),
    t('secretLove', 'message2'),
    t('secretLove', 'message3'),
    t('secretLove', 'message4'),
    t('secretLove', 'message5')
  ];

  // Typing effect
  useEffect(() => {
    let index = 0;
    const currentMessage = messages[activeMessage];

    if (!currentMessage) return;

    // Reset typed text when changing messages
    setTypedText('');

    const typingInterval = setInterval(() => {
      if (index < currentMessage.length) {
        setTypedText(prev => prev + currentMessage.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);

        // Move to next message after a delay
        setTimeout(() => {
          setActiveMessage((prev) => (prev + 1) % messages.length);
        }, 3000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [activeMessage, messages]);

  return (
    <div className="secret-love-container">
      <div className="secret-content">
        <div className="secret-header">
          <h1>{t('secretLove', 'title')}</h1>
          <p>{t('secretLove', 'subtitle')}</p>
        </div>

        <div className="love-message-container">
          <div className="typewriter">
            <div className="typewriter-text">{typedText}</div>
            <div className="cursor"></div>
          </div>
        </div>

        <div className="heart-container">
          <div className="heart"></div>
        </div>

        <div className="secret-footer">
          <p>{t('secretLove', 'footer')}</p>
        </div>
      </div>
    </div>
  );
}

export default SecretLove;