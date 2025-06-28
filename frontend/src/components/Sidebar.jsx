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
    <div className="w-64 min-h-screen bg-gray-900 text-gray-300 flex flex-col font-sans">
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
          <li>
            <NavLink to="/prompt-engineering" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-2.21 0-4.2-.896-5.657-2.343A7.963 7.963 0 014 12c0-2.21.896-4.2 2.343-5.657A7.963 7.963 0 0112 4c2.21 0 4.2.896 5.657 2.343A7.963 7.963 0 0120 12c0 2.21-.896 4.2-2.343 5.657A7.963 7.963 0 0112 20z" /></svg>
              <span>Prompt Engineering</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/ai-assistant" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              <span>AI Assistant</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/prompt-builder" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              <span>Prompt Builder</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/community" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span>Community</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="p-4 mt-auto border-t border-gray-800 flex flex-col flex-grow justify-end">
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
