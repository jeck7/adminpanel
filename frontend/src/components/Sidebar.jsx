import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { authService } from '../services/authService';

const Sidebar = ({ onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col font-sans">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              <span>Users</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="p-4 mt-auto border-t border-gray-800">
        {user && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="text-md font-semibold text-white truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-700 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
