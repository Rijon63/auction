// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add auth token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Authentication endpoints
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// Auction endpoints
export const getAuctions = () => API.get('/auctions');
export const getAuctionById = (id) => API.get(`/auctions/${id}`);
export const searchAuctions = (params) => API.get(`/search/auctions`, { params });

// Lot endpoints
export const getLots = () => API.get('/lots');
export const getLotById = (id) => API.get(`/lots/${id}`);
export const searchLots = (params) => API.get(`/search/lots`, { params });

// Bid endpoints
export const placeBid = (data) => API.post('/bids', data);
export const getBidsForLot = (lotId) => API.get(`/bids/lot/${lotId}`);

// Admin endpoints
export const createAuction = (data) => API.post('/admin/auctions', data);
export const updateAuction = (id, data) => API.put(`/admin/auctions/${id}`, data);
export const archiveAuction = (id) => API.put(`/admin/auctions/${id}/archive`);
export const deleteAuction = (id) => API.delete(`/admin/auctions/${id}`);

export const addLotToAuction = (auctionId, data) => API.post(`/admin/auctions/${auctionId}/lots`, data);
export const updateLot = (id, data) => API.put(`/admin/lots/${id}`, data);
export const deleteLot = (id) => API.delete(`/admin/lots/${id}`);
export const getAllLots = () => API.get('/admin/lots');

// Comprehensive search
export const comprehensiveSearch = (keyword) => API.get(`/search/comprehensive?keyword=${encodeURIComponent(keyword)}`);

export default API;