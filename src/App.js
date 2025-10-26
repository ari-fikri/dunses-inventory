import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import InventoryList from './components/InventoryList';
import InventoryForm from './components/InventoryForm';
import SalesOrderList from './components/SalesOrderList';
import SalesOrderForm from './components/SalesOrderForm';
import clientData from './data/clients.json';
import productData from './data/products.json';
import initialInventoryData from './data/Inventory.json';
import initialInventoryDtlData from './data/inventory_dtl.json';
import initialSalesOrderData from './data/sales_order.json';
import initialSalesOrderDtlData from './data/sales_order_dtl.json';
import './App.css';

function App() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventoryDtl, setInventoryDtl] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [salesOrderDtls, setSalesOrderDtls] = useState([]);

  useEffect(() => {
    const sortedClients = [...clientData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setClients(sortedClients);

    const sortedProducts = [...productData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setProducts(sortedProducts);

    const sortedInventory = [...initialInventoryData].sort((a, b) => new Date(b.inventory_date) - new Date(a.inventory_date));
    setInventory(sortedInventory);
    setInventoryDtl(initialInventoryDtlData);

    const sortedSalesOrders = [...initialSalesOrderData].sort((a, b) => new Date(b.sales_order_date) - new Date(a.sales_order_date));
    setSalesOrders(sortedSalesOrders);
    setSalesOrderDtls(initialSalesOrderDtlData);
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

  const handleSaveInventory = (transaction, details, originalInventoryCode = null) => {
    const now = new Date().toISOString();

    if (originalInventoryCode) {
      // Editing
      const updatedInventory = inventory.map(inv =>
        inv.inventory_code === originalInventoryCode ? { ...inv, ...transaction, updated_at: now } : inv
      );
      setInventory(updatedInventory);

      const otherDetails = inventoryDtl.filter(d => d.inventory_code !== originalInventoryCode);
      const updatedDetails = details.map(d => ({ ...d, inventory_code: originalInventoryCode, created_at: d.created_at || now, updated_at: now }));
      setInventoryDtl([...otherDetails, ...updatedDetails]);

    } else {
      // Adding
      if (inventory.some(i => i.inventory_code === transaction.inventory_code)) {
        alert('Inventory code already exists.');
        return;
      }
      const newTransaction = {
        ...transaction,
        created_at: now,
        updated_at: now,
      };
      setInventory([newTransaction, ...inventory]);

      const newDetails = details.map(d => ({ ...d, inventory_code: transaction.inventory_code, created_at: now, updated_at: now }));
      setInventoryDtl([...inventoryDtl, ...newDetails]);
    }
  };

  const handleDeleteInventory = (inventoryCode) => {
    setInventory(inventory.filter(i => i.inventory_code !== inventoryCode));
    setInventoryDtl(inventoryDtl.filter(d => d.inventory_code !== inventoryCode));
  };

  const handleSaveSalesOrder = (transaction, details, originalSalesOrderCode = null) => {
    const now = new Date().toISOString();

    if (originalSalesOrderCode) {
      // Editing
      const updatedSalesOrders = salesOrders.map(so =>
        so.sales_order_code === originalSalesOrderCode ? { ...so, ...transaction, updated_at: now } : so
      );
      setSalesOrders(updatedSalesOrders);

      const otherDetails = salesOrderDtls.filter(d => d.sales_order_code !== originalSalesOrderCode);
      const updatedDetails = details.map(d => ({ ...d, sales_order_code: originalSalesOrderCode, created_at: d.created_at || now, updated_at: now }));
      setSalesOrderDtls([...otherDetails, ...updatedDetails]);

    } else {
      // Adding
      if (salesOrders.some(i => i.sales_order_code === transaction.sales_order_code)) {
        alert('Sales order code already exists.');
        return;
      }
      const newTransaction = {
        ...transaction,
        created_at: now,
        updated_at: now,
      };
      setSalesOrders([newTransaction, ...salesOrders]);

      const newDetails = details.map(d => ({ ...d, sales_order_code: transaction.sales_order_code, created_at: now, updated_at: now }));
      setSalesOrderDtls([...salesOrderDtls, ...newDetails]);
    }
  };

  const handleDeleteSalesOrder = (salesOrderCode) => {
    setSalesOrders(salesOrders.filter(i => i.sales_order_code !== salesOrderCode));
    setSalesOrderDtls(salesOrderDtls.filter(d => d.sales_order_code !== salesOrderCode));
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
        <Route path="/inventory" element={<InventoryList inventory={inventory} onDelete={handleDeleteInventory} />} />
        <Route path="/inventory-form" element={<InventoryForm onSave={handleSaveInventory} inventory={inventory} inventoryDtl={inventoryDtl} />} />
        <Route path="/inventory-form/:inventoryCode" element={<InventoryForm onSave={handleSaveInventory} inventory={inventory} inventoryDtl={inventoryDtl} />} />
        <Route path="/sales-order" element={<SalesOrderList salesOrders={salesOrders} onDelete={handleDeleteSalesOrder} />} />
        <Route path="/sales-order-form" element={<SalesOrderForm onSave={handleSaveSalesOrder} salesOrders={salesOrders} salesOrderDtls={salesOrderDtls} />} />
        <Route path="/sales-order-form/:salesOrderCode" element={<SalesOrderForm onSave={handleSaveSalesOrder} salesOrders={salesOrders} salesOrderDtls={salesOrderDtls} />} />
      </Routes>
    </div>
  );
}

export default App;