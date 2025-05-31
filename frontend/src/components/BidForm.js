import React, { useState } from 'react';
import { placeBid } from '../services/api';

const BidForm = ({ lotId, onBidPlaced }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await placeBid({ amount, lot: lotId });
      setMessage('Bid placed successfully!');
      setAmount('');
      if (onBidPlaced) onBidPlaced(); // reload bids list
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error placing bid');
    }
  };

  return (
    <div>
      <h4>Place a Bid</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Place Bid</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BidForm;
