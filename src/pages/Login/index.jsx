import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, authError } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Show auth errors from context
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(t('login.allFieldsRequired', 'All fields are required'));
      return;
    }

    try {
      setIsLoading(true);
      const success = await login(username, password);

      if (success) {
        navigate('/');
      } else {
        setError(t('login.invalidCredentials', 'Invalid username or password'));
      }
    } catch (err) {
      setError(t('login.serverError', 'Server error. Please try again later.'));
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{t('login.title', 'Login')}</h1>
          <p>{t('login.subtitle', 'Welcome back! Please log in to your account.')}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder={t('login.emailPlaceholder', 'Username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('login.passwordPlaceholder', 'Password')}
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
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
              />
              <span>{t('login.rememberMe', 'Remember me')}</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              {t('login.forgotPassword', 'Forgot password?')}
            </Link>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-loader"></span>
            ) : (
              t('login.loginButton', 'Log In')
            )}
          </button>
        </form>

        <div className="register-prompt">
          <p>{t('login.noAccount', 'Don\'t have an account?')}</p>
          <Link to="/register" className="register-link">
            {t('login.registerLink', 'Register')}
          </Link>
        </div>

        <div className="login-footer">
          <p>{t('login.termsText', 'By logging in, you agree to our')} <Link to="/terms">{t('login.termsLink', 'Terms & Privacy')}</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;