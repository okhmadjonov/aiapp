import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginSuccess } from '../../store/slices/authSlice';
import { toggleTheme, addNotification } from '../../store/slices/uiSlice';
import { 
  FiUser, 
  FiSettings, 
  FiLock, 
  FiGlobe, 
  FiTrash2 
} from 'react-icons/fi';
import './Settings.scss';

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'security'>('profile');

  // Profile forms
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // System settings
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [backupWeekly, setBackupWeekly] = useState(true);

  // Security forms
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ text: '', type: '' });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) {
      dispatch(addNotification({ type: 'error', message: 'Name and email are required fields.' }));
      return;
    }

    if (user) {
      dispatch(loginSuccess({
        ...user,
        username,
        email,
        avatar
      }));
      dispatch(addNotification({
        type: 'success',
        message: 'Your admin profile details have been successfully updated.'
      }));
    }
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg({ text: '', type: '' });

    if (!currentPw || !newPw || !confirmPw) {
      setSecurityMsg({ text: 'All security password fields are required.', type: 'error' });
      return;
    }

    if (newPw !== confirmPw) {
      setSecurityMsg({ text: 'Confirmation password does not match new password.', type: 'error' });
      return;
    }

    if (newPw.length < 6) {
      setSecurityMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }

    // Success simulation
    setSecurityMsg({ text: 'Account credentials changed successfully!', type: 'success' });
    dispatch(addNotification({
      type: 'success',
      message: 'Dashboard session security credentials updated.'
    }));
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  const handleResetCaches = () => {
    if (window.confirm('Reset all mock database stores? This restores original catalog lists.')) {
      localStorage.removeItem('admin_products');
      localStorage.removeItem('admin_users');
      localStorage.removeItem('admin_tasks');
      dispatch(addNotification({
        type: 'warning',
        message: 'Mock store caches purged. Please refresh the browser.'
      }));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header-row">
        <div>
          <h1>Global System Settings</h1>
          <p>Modify session details, notifications rules, and security profiles.</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Sidebar Nav Tabs */}
        <div className="card settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FiUser />
            <span>Profile Settings</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <FiSettings />
            <span>System Configuration</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FiLock />
            <span>Security Settings</span>
          </button>
        </div>

        {/* Dynamic Forms Panel */}
        <div className="card settings-content">
          
          {/* PROFILE SETTINGS TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <h3 className="tab-title">Admin Profile Settings</h3>
              
              <div className="avatar-preview-row">
                <img 
                  src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                  alt="Profile Avatar" 
                  className="settings-avatar"
                />
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Avatar Image URL
                  </label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      marginTop: '6px',
                      background: 'rgba(0,0,0,0.15)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="set-name">Display Username</label>
                <div className="input-wrapper">
                  <FiUser />
                  <input
                    id="set-name"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="set-email">Session Email Address</label>
                <div className="input-wrapper">
                  <FiGlobe />
                  <input
                    id="set-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Save Profile Changes
              </button>
            </form>
          )}

          {/* SYSTEM SETTINGS TAB */}
          {activeTab === 'system' && (
            <div className="system-settings-list">
              <h3 className="tab-title">System Configurations</h3>

              <div className="setting-toggle-row">
                <div>
                  <h4>Theme Environment</h4>
                  <p>Swap between light and dark UI themes.</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => dispatch(toggleTheme())}>
                  Set {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
              </div>

              <hr className="divider" />

              <div className="setting-toggle-row">
                <div>
                  <h4>Email Alerts</h4>
                  <p>Send weekly email alerts for audit logs and activities.</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={emailAlerts} 
                    onChange={(e) => setEmailAlerts(e.target.checked)} 
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <h4>Real-time Push Notifications</h4>
                  <p>Display pop-up banners instantly for product mutations.</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={pushNotif} 
                    onChange={(e) => setPushNotif(e.target.checked)} 
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <h4>Weekly System Backups</h4>
                  <p>Schedule automatic local snapshot dumps database backups.</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={backupWeekly} 
                    onChange={(e) => setBackupWeekly(e.target.checked)} 
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <hr className="divider" />

              <div className="setting-toggle-row danger-zone">
                <div>
                  <h4 style={{ color: 'var(--color-danger)' }}>Purge Mock Stores</h4>
                  <p>Wipe localStorage DB indexes and reload default datasets.</p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={handleResetCaches}>
                  <FiTrash2 /> Reset Catalog DB
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySubmit}>
              <h3 className="tab-title">Security Credentials</h3>
              
              {securityMsg.text && (
                <div 
                  className={`auth-error-banner ${securityMsg.type}`}
                  style={{
                    background: securityMsg.type === 'success' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                    borderColor: securityMsg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: securityMsg.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'
                  }}
                >
                  {securityMsg.text}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="curr-pw">Current Password</label>
                <div className="input-wrapper">
                  <FiLock />
                  <input
                    id="curr-pw"
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Enter current password..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="new-pw">New Password</label>
                <div className="input-wrapper">
                  <FiLock />
                  <input
                    id="new-pw"
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Enter new password..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm-pw">Confirm New Password</label>
                <div className="input-wrapper">
                  <FiLock />
                  <input
                    id="confirm-pw"
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Confirm new password..."
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Update Security Credentials
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
