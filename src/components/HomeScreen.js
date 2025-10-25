import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <div className="card-container">
        <Link to="/clients" className="card">
          <h3>Clients</h3>
          <p>Manage client information</p>
        </Link>
        {/* Add more cards here as needed */}
      </div>
    </div>
  );
};

export default HomeScreen;