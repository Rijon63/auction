// src/pages/BrowseLots.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const BrowseLots = () => {
  const [lots, setLots] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search form state
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    artist: '',
    subject: '',
    category: '',
    priceMin: '',
    priceMax: '',
    year: ''
  });
  
  // Filtered results
  const [filteredLots, setFilteredLots] = useState([]);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [lotsResponse, auctionsResponse] = await Promise.all([
          API.get('/search/lots'),
          API.get('/search/auctions?active=true')
        ]);
        
        setLots(lotsResponse.data);
        setFilteredLots(lotsResponse.data);
        setAuctions(auctionsResponse.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle search form input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };
  
  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Build query string from non-empty search params
      const queryParams = Object.entries(searchParams)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      const response = await API.get(`/search/lots?${queryParams}`);
      setFilteredLots(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error searching lots:', err);
      setError('Search failed');
      setIsLoading(false);
    }
  };
  
  // Reset search form
  const handleResetSearch = () => {
    setSearchParams({
      keyword: '',
      artist: '',
      subject: '',
      category: '',
      priceMin: '',
      priceMax: '',
      year: ''
    });
    setFilteredLots(lots);
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1>Browse Auction Lots</h1>
      
      <div style={styles.searchSection}>
        <h2>Search</h2>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchGrid}>
            <div style={styles.formGroup}>
              <label>Keyword:</label>
              <input
                type="text"
                name="keyword"
                value={searchParams.keyword}
                onChange={handleSearchChange}
                placeholder="Search in title, artist, description"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Artist:</label>
              <input
                type="text"
                name="artist"
                value={searchParams.artist}
                onChange={handleSearchChange}
                placeholder="Artist name"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Subject:</label>
              <select
                name="subject"
                value={searchParams.subject}
                onChange={handleSearchChange}
              >
                <option value="">All Subjects</option>
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
              <label>Category:</label>
              <select
                name="category"
                value={searchParams.category}
                onChange={handleSearchChange}
              >
                <option value="">All Categories</option>
                <option value="painting">Painting</option>
                <option value="drawing">Drawing</option>
                <option value="photo">Photographic Image</option>
                <option value="sculpture">Sculpture</option>
                <option value="carving">Carving</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label>Price Min ($):</label>
              <input
                type="number"
                name="priceMin"
                value={searchParams.priceMin}
                onChange={handleSearchChange}
                placeholder="Minimum price"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Price Max ($):</label>
              <input
                type="number"
                name="priceMax"
                value={searchParams.priceMax}
                onChange={handleSearchChange}
                placeholder="Maximum price"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Year:</label>
              <input
                type="number"
                name="year"
                value={searchParams.year}
                onChange={handleSearchChange}
                placeholder="Year produced"
              />
            </div>
          </div>
          
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.searchButton}>Search</button>
            <button type="button" onClick={handleResetSearch} style={styles.resetButton}>Reset</button>
          </div>
        </form>
      </div>
      
      <div style={styles.resultsSection}>
        <h2>Lots ({filteredLots.length})</h2>
        {filteredLots.length === 0 ? (
          <p>No lots found matching your criteria.</p>
        ) : (
          <div style={styles.lotsGrid}>
            {filteredLots.map(lot => (
              <div key={lot._id} style={styles.lotCard}>
                <div style={styles.lotImagePlaceholder}>
                  <span style={styles.categoryTag}>{lot.category}</span>
                </div>
                <div style={styles.lotInfo}>
                  <h3>{lot.artist}</h3>
                  <p style={styles.lotSubject}>{lot.subject}</p>
                  <p style={styles.lotYear}>Year: {lot.year}</p>
                  <p style={styles.lotPrice}>Estimated: ${lot.estimatedPrice}</p>
                  <Link to={`/lots/${lot._id}`} style={styles.viewButton}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={styles.auctionsSection}>
        <h2>Upcoming Auctions</h2>
        <div style={styles.auctionsList}>
          {auctions.map(auction => (
            <div key={auction._id} style={styles.auctionCard}>
              <h3>{auction.name}</h3>
              <p>Date: {new Date(auction.date).toLocaleDateString()}</p>
              <p>Lots: {auction.lots ? auction.lots.length : 0}</p>
              <Link to={`/auctions/${auction._id}`} style={styles.viewButton}>View Auction</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  searchSection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
  },
  searchForm: {
    width: '100%',
  },
  searchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
  },
  formGroup: {
    marginBottom: '10px',
  },
  buttonGroup: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
  },
  searchButton: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  resetButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  resultsSection: {
    marginBottom: '30px',
  },
  lotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  lotCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  lotImagePlaceholder: {
    height: '180px',
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  categoryTag: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    textTransform: 'capitalize',
  },
  lotInfo: {
    padding: '15px',
  },
  lotSubject: {
    textTransform: 'capitalize',
    color: '#6b7280',
    marginBottom: '8px',
  },
  lotYear: {
    marginBottom: '8px',
  },
  lotPrice: {
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '15px',
  },
  viewButton: {
    display: 'inline-block',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    textDecoration: 'none',
  },
  auctionsSection: {
    marginTop: '40px',
  },
  auctionsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  auctionCard: {
    padding: '15px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
};

export default BrowseLots;