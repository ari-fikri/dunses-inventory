import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomeScreen from './components/HomeScreen';
import ClientList from './components/ClientList';
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
            <Route path="/clients" element={<ClientList />} />
            <Route path="/client-form" element={<ClientForm />} />
            <Route path="/client-form/:clientId" element={<ClientForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;