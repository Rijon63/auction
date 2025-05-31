// src/pages/LotDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import BidForm from '../components/BidForm';

const LotDetails = () => {
  const { id } = useParams();
  const [lot, setLot] = useState(null);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    
    const fetchLotDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch the lot details
        const lotResponse = await API.get(`/lots/${id}`);
        setLot(lotResponse.data);
        
        // If user is logged in, fetch bids
        if (storedUser) {
          try {
            const bidsResponse = await API.get(`/bids/lot/${id}`);
            setBids(bidsResponse.data);
          } catch (bidError) {
            console.error('Error fetching bids:', bidError);
            // Don't set error state here to allow the page to display
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching lot details:', err);
        setError('Failed to load lot details');
        setIsLoading(false);
      }
    };
    
    fetchLotDetails();
  }, [id]);
  
  const handleBidPlaced = async () => {
    try {
      const bidsResponse = await API.get(`/bids/lot/${id}`);
      setBids(bidsResponse.data);
    } catch (err) {
      console.error('Error refreshing bids:', err);
    }
  };
  
  // Helper function to render category-specific details
  const renderCategoryDetails = () => {
    if (!lot || !lot.details) return null;
    
    switch (lot.category) {
      case 'painting':
      case 'drawing':
        return (
          <>
            <p><strong>Medium:</strong> {lot.details.medium}</p>
            <p><strong>Framed:</strong> {lot.details.framed ? 'Yes' : 'No'}</p>
            <p><strong>Dimensions:</strong> {lot.details.dimensions.height} x {lot.details.dimensions.length} cm</p>
          </>
        );
      case 'photo':
        return (
          <>
            <p><strong>Image Type:</strong> {lot.details.imageType}</p>
            <p><strong>Dimensions:</strong> {lot.details.dimensions.height} x {lot.details.dimensions.length} cm</p>
          </>
        );
      case 'sculpture':
      case 'carving':
        return (
          <>
            <p><strong>Material:</strong> {lot.details.material}</p>
            <p><strong>Dimensions:</strong> {lot.details.dimensions.height} x {lot.details.dimensions.length} x {lot.details.dimensions.width} cm</p>
            <p><strong>Weight:</strong> {lot.details.weight} kg</p>
          </>
        );
      default:
        return null;
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!lot) return <div>Lot not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.lotHeader}>
        <div style={styles.lotBasicInfo}>
          <h1>{lot.artist}</h1>
          <p style={styles.lotNumber}>Lot #{lot.lotNumber}</p>
          <p style={styles.category}>{lot.category.charAt(0).toUpperCase() + lot.category.slice(1)}</p>
          <p style={styles.year}>Created in {lot.year}</p>
        </div>
        
        <div style={styles.estimatedPrice}>
          <p style={styles.priceLabel}>Estimated Price</p>
          <p style={styles.price}>${lot.estimatedPrice}</p>
          {lot.auctionDate && (
            <p style={styles.auctionDate}>
              Auction date: {new Date(lot.auctionDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      <div style={styles.content}>
        <div style={styles.imageAndDetails}>
          <div style={styles.imagePlaceholder}>
            <p>Image coming soon</p>
          </div>
          
          <div style={styles.lotDetails}>
            <h2>Details</h2>
            <div style={styles.detailsGrid}>
              <div>
                <h3>General Information</h3>
                <p><strong>Subject:</strong> {lot.subject}</p>
                <p><strong>Artist:</strong> {lot.artist}</p>
                <p><strong>Year:</strong> {lot.year}</p>
              </div>
              
              <div>
                <h3>Specifications</h3>
                {renderCategoryDetails()}
              </div>
            </div>
            
            <div style={styles.description}>
              <h3>Description</h3>
              <p>{lot.description}</p>
            </div>
          </div>
        </div>
        
        {user && (
          <div style={styles.biddingSection}>
            <h2>Bidding</h2>
            <BidForm lotId={id} onBidPlaced={handleBidPlaced} />
            
            {bids.length > 0 && (
              <div style={styles.bidsHistory}>
                <h3>Current Bids</h3>
                <table style={styles.bidsTable}>
                  <thead>
                    <tr>
                      <th>Bidder</th>
                      <th>Amount</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map(bid => (
                      <tr key={bid._id}>
                        <td>{bid.clientId.name}</td>
                        <td>${bid.amount}</td>
                        <td>{new Date(bid.placedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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
  lotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  lotBasicInfo: {
    flex: '1',
  },
  lotNumber: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '8px',
  },
  category: {
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '8px',
  },
  year: {
    fontSize: '16px',
  },
  estimatedPrice: {
    textAlign: 'right',
  },
  priceLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
  },
  auctionDate: {
    fontSize: '14px',
    color: '#6b7280',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  imageAndDetails: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  imagePlaceholder: {
    flex: '0 0 40%',
    backgroundColor: '#e5e7eb',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    borderRadius: '8px',
  },
  lotDetails: {
    flex: '1',
    minWidth: '300px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  description: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  biddingSection: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
  },
  bidsHistory: {
    marginTop: '20px',
  },
  bidsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
};

export default LotDetails;