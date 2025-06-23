import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = ({ children, onLogout }) => {
  return (
    <div className="flex">
      <Sidebar onLogout={onLogout} />
      <main className="flex-grow p-8 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
