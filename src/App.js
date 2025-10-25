import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomeScreen from './components/HomeScreen';
import ClientForm from './components/ClientForm';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Client Management</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/client-form" element={<ClientForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;