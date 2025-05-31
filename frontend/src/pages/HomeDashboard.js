// src/pages/HomeDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  const handleNavigation = (path) => navigate(path);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome, {user.name}!</h1>
      <h2 style={styles.subheader}>Role: {user.role}</h2>

      <div style={styles.buttonContainer}>
        {user.role === 'buyer' && (
          <>
            <button onClick={() => handleNavigation('/browse')} style={styles.button}>Browse Lots</button>
            <button onClick={() => handleNavigation('/my-bids')} style={styles.button}>My Bids</button>
          </>
        )}
        {user.role === 'seller' && (
          <>
            <button onClick={() => handleNavigation('/create-auction')} style={styles.button}>Create Auction</button>
            <button onClick={() => handleNavigation('/my-lots')} style={styles.button}>My Lots</button>
          </>
        )}
        {user.role === 'admin' && (
          <>
            <button onClick={() => handleNavigation('/clients')} style={styles.button}>Manage Clients</button>
            <button onClick={() => handleNavigation('/reports')} style={styles.button}>View Reports</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f0f4f8',
    minHeight: '100vh',
  },
  header: {
    fontSize: '36px',
    color: '#333',
  },
  subheader: {
    fontSize: '20px',
    color: '#666',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '15px 30px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: '0.3s',
  },
};

export default HomeDashboard;
