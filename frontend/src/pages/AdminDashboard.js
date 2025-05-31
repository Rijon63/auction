// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [lots, setLots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('auctions');
  
  // Form states
  const [auctionForm, setAuctionForm] = useState({
    name: '',
    date: '',
  });
  
  const [lotForm, setLotForm] = useState({
    artist: '',
    year: '',
    subject: '',
    description: '',
    estimatedPrice: '',
    category: 'painting',
    auctionId: '',
    // Category-specific fields will be dynamically shown based on category
    medium: '',
    framed: false,
    height: '',
    length: '',
    width: '',
    weight: '',
    imageType: '',
    material: ''
  });
  
  const navigate = useNavigate();

  // Check if user is admin on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.role !== 'admin') {
      navigate('/');
      return;
    }
    
    setUser(storedUser);
    fetchAuctions();
    fetchLots();
  }, [navigate]);

  const fetchAuctions = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/admin/auctions');
      setAuctions(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching auctions:', err);
      setError('Failed to fetch auctions');
      setIsLoading(false);
    }
  };

  const fetchLots = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/admin/lots');
      setLots(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching lots:', err);
      setError('Failed to fetch lots');
      setIsLoading(false);
    }
  };

  const handleAuctionSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/auctions', auctionForm);
      setAuctionForm({ name: '', date: '' });
      fetchAuctions();
      alert('Auction created successfully!');
    } catch (err) {
      console.error('Error creating auction:', err);
      alert('Failed to create auction');
    }
  };

  const handleLotSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert numeric fields
      const lotData = {
        ...lotForm,
        year: Number(lotForm.year),
        estimatedPrice: Number(lotForm.estimatedPrice),
        height: Number(lotForm.height),
        length: Number(lotForm.length),
        width: lotForm.width ? Number(lotForm.width) : undefined,
        weight: lotForm.weight ? Number(lotForm.weight) : undefined
      };
      
      await API.post(`/admin/auctions/${lotForm.auctionId}/lots`, lotData);
      // Reset form except for auctionId to make it easier to add multiple lots
      setLotForm({
        ...lotForm,
        artist: '',
        year: '',
        subject: '',
        description: '',
        estimatedPrice: '',
        medium: '',
        framed: false,
        height: '',
        length: '',
        width: '',
        weight: '',
        imageType: '',
        material: ''
      });
      fetchLots();
      alert('Lot added successfully!');
    } catch (err) {
      console.error('Error adding lot:', err);
      alert('Failed to add lot');
    }
  };

  const handleArchiveAuction = async (auctionId) => {
    if (window.confirm('Are you sure you want to archive this auction?')) {
      try {
        await API.put(`/admin/auctions/${auctionId}/archive`);
        fetchAuctions();
        alert('Auction archived successfully!');
      } catch (err) {
        console.error('Error archiving auction:', err);
        alert('Failed to archive auction');
      }
    }
  };

  const handleDeleteLot = async (lotId) => {
    if (window.confirm('Are you sure you want to delete this lot?')) {
      try {
        await API.delete(`/admin/lots/${lotId}`);
        fetchLots();
        alert('Lot deleted successfully!');
      } catch (err) {
        console.error('Error deleting lot:', err);
        alert('Failed to delete lot');
      }
    }
  };

  // Render form fields based on selected category
  const renderCategoryFields = () => {
    const { category } = lotForm;
    
    switch (category) {
      case 'painting':
      case 'drawing':
        return (
          <>
            <div className="form-group">
              <label>Medium:</label>
              <input
                type="text"
                value={lotForm.medium}
                onChange={(e) => setLotForm({ ...lotForm, medium: e.target.value })}
                placeholder={category === 'painting' ? 'e.g., oil, acrylic, watercolor' : 'e.g., pencil, ink, charcoal'}
                required
              />
            </div>
            <div className="form-group">
              <label>Framed:</label>
              <input
                type="checkbox"
                checked={lotForm.framed}
                onChange={(e) => setLotForm({ ...lotForm, framed: e.target.checked })}
              />
            </div>
            <div className="form-group">
              <label>Height (cm):</label>
              <input
                type="number"
                value={lotForm.height}
                onChange={(e) => setLotForm({ ...lotForm, height: e.target.value })}
                placeholder="Height in cm"
                required
              />
            </div>
            <div className="form-group">
              <label>Length (cm):</label>
              <input
                type="number"
                value={lotForm.length}
                onChange={(e) => setLotForm({ ...lotForm, length: e.target.value })}
                placeholder="Length in cm"
                required
              />
            </div>
          </>
        );
      case 'photo':
        return (
          <>
            <div className="form-group">
              <label>Image Type:</label>
              <select
                value={lotForm.imageType}
                onChange={(e) => setLotForm({ ...lotForm, imageType: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                <option value="Black and White">Black and White</option>
                <option value="Color">Color</option>
              </select>
            </div>
            <div className="form-group">
              <label>Height (cm):</label>
              <input
                type="number"
                value={lotForm.height}
                onChange={(e) => setLotForm({ ...lotForm, height: e.target.value })}
                placeholder="Height in cm"
                required
              />
            </div>
            <div className="form-group">
              <label>Length (cm):</label>
              <input
                type="number"
                value={lotForm.length}
                onChange={(e) => setLotForm({ ...lotForm, length: e.target.value })}
                placeholder="Length in cm"
                required
              />
            </div>
          </>
        );
      case 'sculpture':
      case 'carving':
        return (
          <>
            <div className="form-group">
              <label>Material:</label>
              <input
                type="text"
                value={lotForm.material}
                onChange={(e) => setLotForm({ ...lotForm, material: e.target.value })}
                placeholder={category === 'sculpture' ? 'e.g., Bronze, Marble, Pewter' : 'e.g., Oak, Beach, Pine, Willow'}
                required
              />
            </div>
            <div className="form-group">
              <label>Height (cm):</label>
              <input
                type="number"
                value={lotForm.height}
                onChange={(e) => setLotForm({ ...lotForm, height: e.target.value })}
                placeholder="Height in cm"
                required
              />
            </div>
            <div className="form-group">
              <label>Length (cm):</label>
              <input
                type="number"
                value={lotForm.length}
                onChange={(e) => setLotForm({ ...lotForm, length: e.target.value })}
                placeholder="Length in cm"
                required
              />
            </div>
            <div className="form-group">
              <label>Width (cm):</label>
              <input
                type="number"
                value={lotForm.width}
                onChange={(e) => setLotForm({ ...lotForm, width: e.target.value })}
                placeholder="Width in cm"
                required
              />
            </div>
            <div className="form-group">
              <label>Weight (kg):</label>
              <input
                type="number"
                value={lotForm.weight}
                onChange={(e) => setLotForm({ ...lotForm, weight: e.target.value })}
                placeholder="Weight in kg"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      
      <div style={styles.tabs}>
        <button 
          style={activeTab === 'auctions' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('auctions')}
        >
          Auctions
        </button>
        <button 
          style={activeTab === 'lots' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('lots')}
        >
          Lots
        </button>
        <button 
          style={activeTab === 'newAuction' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('newAuction')}
        >
          New Auction
        </button>
        <button 
          style={activeTab === 'newLot' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('newLot')}
        >
          New Lot
        </button>
      </div>
      
      {activeTab === 'auctions' && (
        <div>
          <h2>Manage Auctions</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map(auction => (
                <tr key={auction._id}>
                  <td>{auction.name}</td>
                  <td>{new Date(auction.date).toLocaleDateString()}</td>
                  <td>{auction.archived ? 'Archived' : 'Active'}</td>
                  <td>
                    <button 
                      onClick={() => handleArchiveAuction(auction._id)}
                      disabled={auction.archived}
                      style={styles.actionButton}
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'lots' && (
        <div>
          <h2>Manage Lots</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Lot Number</th>
                <th>Artist</th>
                <th>Category</th>
                <th>Est. Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lots.map(lot => (
                <tr key={lot._id}>
                  <td>{lot.lotNumber}</td>
                  <td>{lot.artist}</td>
                  <td>{lot.category}</td>
                  <td>${lot.estimatedPrice}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteLot(lot._id)}
                      style={styles.actionButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'newAuction' && (
        <div>
          <h2>Create New Auction</h2>
          <form onSubmit={handleAuctionSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Auction Name:</label>
              <input
                type="text"
                value={auctionForm.name}
                onChange={(e) => setAuctionForm({ ...auctionForm, name: e.target.value })}
                placeholder="e.g., Spring Contemporary Art Auction"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Auction Date:</label>
              <input
                type="date"
                value={auctionForm.date}
                onChange={(e) => setAuctionForm({ ...auctionForm, date: e.target.value })}
                required
              />
            </div>
            <button type="submit" style={styles.submitButton}>Create Auction</button>
          </form>
        </div>
      )}
      
      {activeTab === 'newLot' && (
        <div>
          <h2>Add New Lot</h2>
          <form onSubmit={handleLotSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Select Auction:</label>
              <select
                value={lotForm.auctionId}
                onChange={(e) => setLotForm({ ...lotForm, auctionId: e.target.value })}
                required
              >
                <option value="">Select an Auction</option>
                {auctions
                  .filter(auction => !auction.archived)
                  .map(auction => (
                    <option key={auction._id} value={auction._id}>
                      {auction.name} - {new Date(auction.date).toLocaleDateString()}
                    </option>
                  ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label>Artist:</label>
              <input
                type="text"
                value={lotForm.artist}
                onChange={(e) => setLotForm({ ...lotForm, artist: e.target.value })}
                placeholder="Artist's name"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Year:</label>
              <input
                type="number"
                value={lotForm.year}
                onChange={(e) => setLotForm({ ...lotForm, year: e.target.value })}
                placeholder="Year produced"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Subject Classification:</label>
              <select
                value={lotForm.subject}
                onChange={(e) => setLotForm({ ...lotForm, subject: e.target.value })}
                required
              >
                <option value="">Select Subject</option>
                <option value="landscape">Landscape</option>
                <option value="seascape">Seascape</option>
                <option value="portrait">Portrait</option>
                <option value="figure">Figure</option>
                <option value="still life">Still Life</option>
                <option value="nude">Nude</option>
                <option value="animal">Animal</option>
                <option value="abstract">Abstract</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label>Description:</label>
              <textarea
                value={lotForm.description}
                onChange={(e) => setLotForm({ ...lotForm, description: e.target.value })}
                placeholder="Detailed description of the artwork"
                rows="4"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Estimated Price ($):</label>
              <input
                type="number"
                value={lotForm.estimatedPrice}
                onChange={(e) => setLotForm({ ...lotForm, estimatedPrice: e.target.value })}
                placeholder="Estimated value"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Category:</label>
              <select
                value={lotForm.category}
                onChange={(e) => setLotForm({ ...lotForm, category: e.target.value })}
                required
              >
                <option value="painting">Painting</option>
                <option value="drawing">Drawing</option>
                <option value="photo">Photographic Image</option>
                <option value="sculpture">Sculpture</option>
                <option value="carving">Carving</option>
              </select>
            </div>
            
            {/* Render different fields based on category */}
            {renderCategoryFields()}
            
            <button type="submit" style={styles.submitButton}>Add Lot</button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  tabs: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '1px solid #ccc',
  },
  tab: {
    padding: '10px 20px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '16px',
  },
  activeTab: {
    padding: '10px 20px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid #1f2937',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  form: {
    maxWidth: '600px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  submitButton: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  actionButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default AdminDashboard;