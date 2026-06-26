import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer animate-fade-in">
      <div className="footer-left">
        <span>© 2026 Aura Shield. All rights reserved.</span>
      </div>
      
      <div className="footer-right">
        <span>Version 1.0.4 (Enterprise)</span>
        <div className="status-indicator">
          <span className="pulse-dot"></span>
          <span>Cluster Node: UZ-TAS-1</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
