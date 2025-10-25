import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import clientData from './data/clients.json';
import productData from './data/products.json';
import './App.css';

function App() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const sortedClients = [...clientData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setClients(sortedClients);

    const sortedProducts = [...productData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setProducts(sortedProducts);
  }, []);

  const handleSaveClient = (clientToSave, originalClientCode = null) => {
    const now = new Date().toISOString();

    if (originalClientCode) {
      // Editing an existing client
      const existingClientIndex = clients.findIndex(c => c.client_code === originalClientCode);
      if (existingClientIndex > -1) {
        // Check if the new client code is already taken by another client
        if (clientToSave.client_code !== originalClientCode && clients.some(c => c.client_code === clientToSave.client_code)) {
          alert('Client code already exists. Please choose a different one.');
          return;
        }
        const updatedClients = [...clients];
        updatedClients[existingClientIndex] = { ...clients[existingClientIndex], ...clientToSave, updated_at: now };
        setClients(updatedClients);
      }
    } else {
      // Adding a new client
      if (clients.some(c => c.client_code === clientToSave.client_code)) {
        alert('Client code already exists. Please choose a different one.');
        return;
      }
      const newClient = {
        ...clientToSave,
        created_at: now,
        updated_at: now,
      };
      setClients([newClient, ...clients]);
    }
  };

  const handleDeleteClient = (clientCode) => {
    setClients(clients.filter(c => c.client_code !== clientCode));
  };

  const handleSaveProduct = (product) => {
    const now = new Date().toISOString();
    if (product.product_code && products.some(p => p.product_code === product.product_code)) {
      // Update existing product
      const updatedProducts = products.map(p =>
        p.product_code === product.product_code ? { ...p, ...product, updated_at: now } : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct = {
        ...product,
        created_at: now,
        updated_at: now,
        materials: product.product_category === 'FG' ? product.materials || [] : [],
      };
      setProducts([...products, newProduct]);
    }
  };

  const handleDeleteProduct = (productCode) => {
    setProducts(products.filter(p => p.product_code !== productCode));
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/clients" element={<ClientList clients={clients} onDelete={handleDeleteClient} />} />
        <Route path="/client-form" element={<ClientForm onSave={handleSaveClient} clients={clients} />} />
        <Route path="/client-form/:clientCode" element={<ClientForm onSave={handleSaveClient} clients={clients} />} />
        <Route path="/products" element={<ProductList products={products} onDelete={handleDeleteProduct} />} />
        <Route path="/product-form" element={<ProductForm onSave={handleSaveProduct} products={products} />} />
        <Route path="/product-form/:productCode" element={<ProductForm onSave={handleSaveProduct} products={products} />} />
      </Routes>
    </div>
  );
}

export default App;