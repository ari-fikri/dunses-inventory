import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomeScreen from './components/HomeScreen';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import clientsData from './data/clients.json';

function App() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const sortedClients = [...clientsData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setClients(sortedClients);
  }, []);

  const handleSaveClient = (clientData) => {
    const now = new Date().toISOString();
    const existingClientIndex = clients.findIndex(
      (c) => c.client_code === clientData.client_code
    );

    if (existingClientIndex > -1) {
      const updatedClients = [...clients];
      const existingClient = updatedClients[existingClientIndex];
      updatedClients[existingClientIndex] = { ...existingClient, ...clientData, updated_at: now };
      setClients(updatedClients);
    } else {
      const newClient = { ...clientData, created_at: now, updated_at: now };
      setClients([newClient, ...clients]);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Client Management</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/clients" element={<ClientList clients={clients} />} />
            <Route
              path="/client-form"
              element={<ClientForm onSave={handleSaveClient} />}
            />
            <Route
              path="/client-form/:clientId"
              element={<ClientForm onSave={handleSaveClient} clients={clients} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;