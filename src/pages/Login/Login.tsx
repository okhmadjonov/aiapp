import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginSuccess, loginFailure, clearError } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { RiShieldFlashLine } from 'react-icons/ri';
import './Login.scss';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  const from = (location.state as any)?.from?.pathname || '/';
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clean error state on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      dispatch(loginFailure('Please enter both username and password'));
      return;
    }

    setIsLoading(true);
    dispatch(clearError());

    // Simulate auth check response delay
    setTimeout(() => {
      setIsLoading(false);
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        dispatch(loginSuccess({
          username: 'Administrator',
          role: 'Admin',
          email: 'admin@aurashield.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        }));
        dispatch(addNotification({
          type: 'success',
          message: 'Access granted. Welcome back, Administrator!'
        }));
      } else if (username.toLowerCase() === 'editor' && password === 'editor123') {
        dispatch(loginSuccess({
          username: 'Editor Node',
          role: 'Editor',
          email: 'editor@aurashield.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        }));
        dispatch(addNotification({
          type: 'info',
          message: 'Editor workspace loaded.'
        }));
      } else {
        dispatch(loginFailure('Invalid username or password credentials.'));
      }
    }, 1000);
  };

  return (
    <div className="login-wrapper">
      {/* Dynamic ambient gradient shapes */}
      <div className="glow-shape shape-1"></div>
      <div className="glow-shape shape-2"></div>

      <div className="login-card animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <RiShieldFlashLine />
          </div>
          <h1>AURA SHIELD</h1>
          <p>Next-generation Admin Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="auth-error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <FiUser />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin or editor..."
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FiLock />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={isLoading}
          >
            {isLoading ? <span className="auth-spinner"></span> : 'Secure Sign In'}
          </button>
        </form>

        <div className="login-demo-helper">
          <h4>Demo Accounts:</h4>
          <div>
            <span>Admin Access:</span> <code>admin</code> / <code>admin123</code>
          </div>
          <div>
            <span>Editor Access:</span> <code>editor</code> / <code>editor123</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
