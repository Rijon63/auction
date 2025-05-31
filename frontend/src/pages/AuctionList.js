import React, { useEffect, useState } from 'react';
import API from '../services/api';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    API.get('/auctions')
      .then(res => setAuctions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Auctions</h1>
      {auctions.map(auction => (
        <div key={auction._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h2>{auction.name}</h2>
          <p>Date: {new Date(auction.date).toLocaleDateString()}</p>
          <h3>Lots:</h3>
          <ul>
            {auction.lots.map((lot, index) => (
              <li key={index}>{lot.title} by {lot.artist} - ${lot.price}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AuctionList;
