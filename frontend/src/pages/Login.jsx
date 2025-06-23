import React, { useState } from 'react';
import { authService } from '../services/authService';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData.email, formData.password);
      onLoginSuccess();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-400">Please sign in to continue</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
                <div className="p-3 text-sm text-red-400 bg-red-900/30 border border-red-500/30 rounded-lg text-center">
                    {error}
                </div>
            )}

            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-indigo-500 focus:bg-gray-600 focus:outline-none transition"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-indigo-500 focus:bg-gray-600 focus:outline-none transition"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="w-full py-3 px-4 bg-indigo-600 rounded-lg font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
        <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Admin Panel. All Rights Reserved.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
