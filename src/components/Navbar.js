import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🕌 Masjid Finder
        </Link>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          
          {user && (user.role === 'admin' || user.role === 'main_admin') && (
            <>
              <li className="navbar-item">
                <Link to="/admin/masjids" className="navbar-link">Manage Masjids</Link>
              </li>
              {user.role === 'main_admin' && (
                <>
                  <li className="navbar-item">
                    <Link to="/admin/requests" className="navbar-link">
                      Requests
                    </Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/admin/users" className="navbar-link">Manage Users</Link>
                  </li>
                </>
              )}
            </>
          )}

          {user && user.role === 'user' && (
            <li className="navbar-item">
              <Link to="/my-requests" className="navbar-link">My Requests</Link>
            </li>
          )}
          
          {user ? (
            <>
              <li className="navbar-item">
                <span className="navbar-user">
                  {user.name} ({user.role.replace('_', ' ')})
                </span>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;