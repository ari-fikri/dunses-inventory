import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Inventory Management</h1>
        <p>Welcome to your dashboard. Manage clients and products with ease.</p>
      </header>
      <div className="section">
        <h2 className="section-title">Master Data</h2>
        <div className="card-grid">
          <div className="card glass-surface">
            <h3>Clients</h3>
            <p className="card-description">Manage your client records, view details, and add new clients.</p>
            <Link to="/clients" className="card-link">Go to Clients</Link>
          </div>
          <div className="card glass-surface">
            <h3>Products</h3>
            <p className="card-description">Manage your product inventory, update stock, and add new items.</p>
            <Link to="/products" className="card-link">Go to Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;