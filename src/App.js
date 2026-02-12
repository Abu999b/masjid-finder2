import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminMasjids from './pages/AdminMasjids';
import AdminUsers from './pages/AdminUsers';
import AdminRequests from './pages/AdminRequests';
import MyRequests from './pages/MyRequests';

const PrivateRoute = ({ children, adminOnly = false, mainAdminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (mainAdminOnly && user.role !== 'main_admin') {
    return <Navigate to="/" />;
  }

  if (adminOnly && user.role !== 'admin' && user.role !== 'main_admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Routes */}
          <Route
            path="/my-requests"
            element={
              <PrivateRoute>
                <MyRequests />
              </PrivateRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/masjids"
            element={
              <PrivateRoute adminOnly>
                <AdminMasjids />
              </PrivateRoute>
            }
          />
          
          {/* Main Admin Only Routes */}
          <Route
            path="/admin/requests"
            element={
              <PrivateRoute mainAdminOnly>
                <AdminRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute mainAdminOnly>
                <AdminUsers />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;