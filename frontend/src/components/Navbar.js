// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>🖼️ Fotheby’s</Link>
        <input type="text" placeholder="Search lots..." style={styles.search} />
      </div>

      <div style={styles.right}>
        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <>
            <span style={styles.user}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.button}>Sign Out</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    padding: '10px 30px',
    color: '#fff',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  search: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '14px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  user: {
    fontSize: '16px',
  },
  button: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Navbar;
