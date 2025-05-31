import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeDashboard from './pages/HomeDashboard';
import AuctionList from './pages/AuctionList';
import LotDetails from './pages/LotDetails';
import BrowseLots from './pages/BrowseLots';
import MyBids from './pages/MyBids';
import Navbar from './components/Navbar'; // ⬅️ Import Navbar
import AdminDashboard from './pages/AdminDashboard'; // ⬅️ Import it

function App() {
  return (
    <Router>
      <Navbar /> {/* ⬅️ Navbar appears on all pages */}
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auctions" element={<AuctionList />} />
        <Route path="/lots/:id" element={<LotDetails />} />
        <Route path="/browse" element={<BrowseLots />} />
        <Route path="/my-bids" element={<MyBids />} />
        <Route path="/admin" element={<AdminDashboard />} />{/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
