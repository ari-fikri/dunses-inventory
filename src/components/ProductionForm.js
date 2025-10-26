import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productData from '../data/products.json';
import salesOrderData from '../data/sales_order.json';
import './ProductionForm.css';

const ProductionForm = ({ onSave, production, salesOrders }) => {
  const { productionCode } = useParams();
  const navigate = useNavigate();
  const isEditing = !!productionCode;

  const [transaction, setTransaction] = useState({
    production_code: '',
    production_date: new Date().toISOString().split('T')[0],
    production_target_qty: 0,
    product_code: '',
    sales_order_code: '',
    description: '',
  });

  const [products, setProducts] = useState([]);
  const [allSalesOrders, setAllSalesOrders] = useState([]);
  const [selectedProductMaterials, setSelectedProductMaterials] = useState([]);

  useEffect(() => {
    setProducts(productData);
    setAllSalesOrders(salesOrderData);

    if (isEditing) {
      const existingTransaction = production.find(
        (p) => p.production_code === productionCode
      );
      if (existingTransaction) {
        setTransaction({
          ...existingTransaction,
          production_date: existingTransaction.production_date
            ? new Date(existingTransaction.production_date).toISOString().split('T')[0]
            : '',
        });
        if (existingTransaction.product_code) {
          const product = productData.find(p => p.product_code === existingTransaction.product_code);
          if (product && product.materials) {
            setSelectedProductMaterials(product.materials);
          }
        }
      }
    }
  }, [isEditing, productionCode, production]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newTransaction = { ...transaction, [name]: value };

    if (name === 'product_code') {
      const product = productData.find((p) => p.product_code === value);
      if (product) {
        newTransaction.production_target_qty = 1;
        if (product.materials) {
          setSelectedProductMaterials(product.materials);
        } else {
          setSelectedProductMaterials([]);
        }
      } else {
        newTransaction.production_target_qty = 0;
        setSelectedProductMaterials([]);
      }
    }
    setTransaction(newTransaction);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing) {
      const codeExists = production.some(
        (p) => p.production_code === transaction.production_code
      );
      if (codeExists) {
        alert('Production Code already exists. Please use a different code.');
        return;
      }
    }
    onSave(transaction, isEditing ? productionCode : null);
    navigate('/production');
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Edit Production' : 'New Production'}</h2>
      <form onSubmit={handleSubmit} className="production-form">
        <div className="form-section">
          <h3>Production Details</h3>
          <div className="form-group">
            <label>Production Code</label>
            <input
              type="text"
              name="production_code"
              value={transaction.production_code}
              onChange={handleChange}
              required
              disabled={isEditing}
            />
          </div>
          <div className="form-group">
            <label>Production Date</label>
            <input
              type="date"
              name="production_date"
              value={transaction.production_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Product</label>
            <select
              name="product_code"
              value={transaction.product_code}
              onChange={handleChange}
              required
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.product_code} value={p.product_code}>
                  {p.product_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Sales Order</label>
            <select
              name="sales_order_code"
              value={transaction.sales_order_code}
              onChange={handleChange}
            >
              <option value="">Select a sales order</option>
              {allSalesOrders.map((so) => (
                <option key={so.sales_order_code} value={so.sales_order_code}>
                  {so.sales_order_code}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Target Quantity</label>
            <input
              type="number"
              name="production_target_qty"
              value={transaction.production_target_qty}
              onChange={handleChange}
              required
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={transaction.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {selectedProductMaterials.length > 0 && (
          <div className="form-section">
            <h3>Material Requirement</h3>
            <table className="materials-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Required Quantity</th>
                  <th>Available Stock</th>
                </tr>
              </thead>
              <tbody>
                {selectedProductMaterials.map((material) => {
                  const materialProduct = products.find(
                    (p) => p.product_code === material.material_code
                  );
                  return (
                    <tr key={material.material_code}>
                      <td>{materialProduct ? materialProduct.product_name : material.material_code}</td>
                      <td>{material.material_qty * transaction.production_target_qty}</td>
                      <td>{materialProduct ? materialProduct.current_stock : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-button">Save</button>
          <button type="button" onClick={() => navigate('/production')} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductionForm;