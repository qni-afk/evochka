import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/Register.css';

function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!username || !email || !password || !confirmPassword) {
      setError(t('register', 'allFieldsRequired'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('register', 'invalidEmail'));
      return;
    }

    if (!validatePassword(password)) {
      setError(t('register', 'weakPassword'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('register', 'passwordMismatch'));
      return;
    }

    if (!agreeToTerms) {
      setError(t('register', 'agreeToTerms'));
      return;
    }

    try {
      setIsLoading(true);
      const success = await register(username, email, password);

      if (success) {
        navigate('/');
      } else {
        setError(t('register', 'registrationFailed'));
      }
    } catch (err) {
      if (err.message === 'User already exists') {
        setError(t('register', 'userExists'));
      } else {
        setError(t('register', 'serverError'));
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>{t('register', 'title')}</h1>
          <p>{t('register', 'subtitle')}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder={t('register', 'usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder={t('register', 'emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('register', 'passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="password-strength-meter">
              <div
                className={`strength-bar ${password.length >= 6 ? 'strong' : password.length > 0 ? 'medium' : ''}`}
              ></div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t('register', 'confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isLoading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="agree-terms">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                disabled={isLoading}
              />
              <span>{t('register', 'agreeTerms')} <Link to="/terms">{t('register', 'termsLink')}</Link></span>
            </label>
          </div>

          <button
            type="submit"
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-loader"></span>
            ) : (
              t('register', 'registerButton')
            )}
          </button>
        </form>

        <div className="login-prompt">
          <p>{t('register', 'alreadyAccount')}</p>
          <Link to="/login" className="login-link">
            {t('register', 'loginLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;