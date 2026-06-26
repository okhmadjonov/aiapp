import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  toggleSidebar, 
  toggleTheme, 
  markAsRead, 
  markAllAsRead, 
  clearNotification, 
  clearAllNotifications 
} from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { 
  FiMenu, 
  FiBell, 
  FiSun, 
  FiMoon, 
  FiX, 
  FiLogOut, 
  FiSettings, 
  FiUser 
} from 'react-icons/fi';
import './Header.scss';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { theme, notifications } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Derive breadcrumbs based on routing path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/users') return 'Users CRUD';
    if (path === '/products') return 'Products API';
    if (path === '/kanban') return 'Task Board';
    if (path === '/analytics') return 'Analytics';
    if (path === '/logs') return 'Audit Logs';
    if (path === '/settings') return 'Settings';
    return 'Admin';
  };

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header animate-fade-in">
      <div className="header-left">
        <button 
          className="sidebar-toggle" 
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle Sidebar"
        >
          <FiMenu />
        </button>
        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-header-primary)' }}>
          {getBreadcrumbs()}
        </span>
      </div>

      <div className="header-right">
        {/* Theme Toggle */}
        <button 
          className="header-action-btn" 
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        {/* Notifications Dropdown */}
        <div ref={notificationRef} style={{ position: 'relative' }}>
          <button 
            className="header-action-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <FiBell />
            {unreadCount > 0 && <span className="badge-dot"></span>}
          </button>

          {showNotifications && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <h3>Notifications ({unreadCount} new)</h3>
                {unreadCount > 0 && (
                  <button onClick={() => dispatch(markAllAsRead())}>Mark all as read</button>
                )}
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="empty-state">No notifications yet.</div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${notif.read ? '' : 'unread'} ${notif.type}`}
                      onClick={() => dispatch(markAsRead(notif.id))}
                    >
                      <div className="notification-content">
                        <p>{notif.message}</p>
                        <span>{notif.time}</span>
                      </div>
                      <button 
                        className="clear-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(clearNotification(notif.id));
                        }}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <button 
                    style={{ fontSize: '0.8rem', color: 'var(--color-danger)', cursor: 'pointer', fontWeight: 500 }}
                    onClick={() => dispatch(clearAllNotifications())}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar Dropdown */}
        {user && (
          <div ref={profileRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
              alt={user.username} 
              className="profile-avatar"
              onClick={() => setShowProfile(!showProfile)}
            />

            {showProfile && (
              <div className="dropdown-menu profile-menu">
                <div className="profile-header">
                  <span className="name">{user.username}</span>
                  <span className="email">{user.email}</span>
                </div>
                <div className="profile-item" onClick={() => { setShowProfile(false); navigate('/settings'); }}>
                  <FiUser /> Account Profile
                </div>
                <div className="profile-item" onClick={() => { setShowProfile(false); navigate('/settings'); }}>
                  <FiSettings /> Dashboard Settings
                </div>
                <div className="profile-item logout" onClick={handleLogout}>
                  <FiLogOut /> Log Out
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
