import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <div className="card-container">
        <div className="card">
          <h3>Clients</h3>
          <p>Manage your clients.</p>
          <Link to="/clients" className="card-link">Go to Clients</Link>
        </div>
        <div className="card">
          <h3>Products</h3>
          <p>Manage your products.</p>
          <Link to="/products" className="card-link">Go to Products</Link>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;