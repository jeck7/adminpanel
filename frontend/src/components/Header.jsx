import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      onLogout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="w-full bg-gray-900 text-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/prompt-engineering" className="text-2xl font-bold tracking-tight hover:text-indigo-400 transition-colors">Prompt Engineering</Link>
        <Link to="/prompt-engineering-docs" className="text-sm hover:text-indigo-400 transition-colors">Prompt Engineering Docs</Link>
      </div>
      <button
        onClick={handleAuthClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
      >
        {isAuthenticated ? 'Logout' : 'Login'}
      </button>
    </header>
  );
};

export default Header; 