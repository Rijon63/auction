import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auctions');
      setAuctions(res.data);
    } catch (err) {
      console.error('Error fetching auctions:', err);
    }
  };

  const filtered = auctions.filter(a =>
    a.artist.toLowerCase().includes(search.toLowerCase()) ||
    a.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>🎨 Available Auctions</h2>
      <input
        type="text"
        placeholder="Search by artist or subject..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filtered.map((item) => (
          <li key={item._id}>
            <strong>{item.artist}</strong> - {item.subject} ({item.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
