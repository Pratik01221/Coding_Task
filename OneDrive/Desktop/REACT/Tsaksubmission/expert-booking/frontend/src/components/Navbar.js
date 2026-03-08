import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <div className="logo-icon">✦</div>
        <span className="brand-name">ExpertConnect</span>
      </NavLink>
      
      <div className="navbar-links">
        <NavLink to="/" end>Experts</NavLink>
        {user && <NavLink to="/my-bookings">My Bookings</NavLink>}
      </div>

      <div className="navbar-user" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {user ? (
          <>
            {user.role === 'expert' ? (
              <Link to="/profile" style={{ fontWeight: '600', color: 'var(--primary)', textDecoration: 'none' }}>
                Hello, {user.name} (Expert)
              </Link>
            ) : (
              <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                Hello, {user.name} (User)
              </span>
            )}
            <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
