import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBidsForLot } from '../services/api';

const LotDetails = () => {
  const { id } = useParams();
  const [lot, setLot] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    // Fetch the lot details (you can replace this with your own API call)
    fetch(`http://localhost:5000/api/auctions/${id}`)
      .then(res => res.json())
      .then(data => setLot(data));

    getBidsForLot(id).then(res => setBids(res.data));
  }, [id]);

  if (!lot) return <p>Loading lot details...</p>;

  return (
    <div>
      <h2>{lot.title}</h2>
      <p>Description: {lot.description}</p>
      <p>Starting Price: ${lot.startingPrice}</p>
      <h4>Bids:</h4>
      {bids.length > 0 ? (
        <ul>
          {bids.map((bid, i) => (
            <li key={i}>${bid.amount} by {bid.client.name}</li>
          ))}
        </ul>
      ) : (
        <p>No bids yet.</p>
      )}
    </div>
  );
};

export default LotDetails;
