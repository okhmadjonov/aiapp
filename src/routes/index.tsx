import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout/Layout.tsx';

// Page components
import Dashboard from '../pages/Dashboard/Dashboard';
import Users from '../pages/Users/Users';
import Products from '../pages/Products/Products';
import Kanban from '../pages/Kanban/Kanban';
import Settings from '../pages/Settings/Settings';
import Login from '../pages/Login/Login';
import Analytics from '../pages/Analytics/Analytics';
import Logs from '../pages/Logs/Logs';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="kanban" element={<Kanban />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="logs" element={<Logs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
