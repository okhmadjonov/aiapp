import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import Footer from './Footer.tsx';
import './Layout.scss';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-body">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
