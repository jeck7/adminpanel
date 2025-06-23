import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authService } from './services/authService';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import AdminLayout from './components/AdminLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
}

const AppRoutes = ({ isAuthenticated, onLogin, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={onLogin} />
        }
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <AdminLayout onLogout={onLogout}>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route index element={<Navigate to="/dashboard" />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default App;
