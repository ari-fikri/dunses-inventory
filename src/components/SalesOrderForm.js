import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import systemData from '../data/system.json';
import productData from '../data/products.json';
import clientData from '../data/clients.json';
import './SalesOrderForm.css';

const SalesOrderForm = ({ onSave, salesOrders, salesOrderDtls }) => {
  const { salesOrderCode } = useParams();
  const navigate = useNavigate();
  const isEditing = !!salesOrderCode;

  const [transaction, setTransaction] = useState({
    sales_order_code: '',
    sales_order_date: new Date().toISOString().split('T')[0],
    sales_order_client: '',
    reference_code: '',
    description: '',
    sales_currency: 'IDR', 
  });
  const [details, setDetails] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    setClients(clientData);
    setProducts(productData);
    const currencyData = systemData.filter(
      (item) => item.function === 'sales_order' && item.sub_function === 'sale_currency'
    );
    setCurrencies(currencyData);

    if (isEditing) {
      const existingTransaction = salesOrders.find(
        (so) => so.sales_order_code === salesOrderCode
      );
      if (existingTransaction) {
        setTransaction({
          ...existingTransaction,
          sales_order_date: existingTransaction.sales_order_date
            ? new Date(existingTransaction.sales_order_date).toISOString().split('T')[0]
            : '',
        });
      }
      const existingDetails = salesOrderDtls.filter(
        (dtl) => dtl.sales_order_code === salesOrderCode
      );
      setDetails(existingDetails);
    }
  }, [salesOrderCode, salesOrders, salesOrderDtls]);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetails = [...details];
    const newDetail = { ...updatedDetails[index], [name]: value };

    if (name === 'product_code') {
      const product = products.find((p) => p.product_code === value);
      if (product) {
        newDetail.price = product.product_price;
      }
    }

    if (name !== 'sale_tax') {
      const qty = parseFloat(newDetail.qty) || 0;
      const price = parseFloat(newDetail.price) || 0;
      const discount = parseFloat(newDetail.sale_discount) || 0;
      const grossSubtotal = qty * price;
      const taxBase = grossSubtotal - discount;
      
      if (taxBase > 0) {
        const tax = taxBase * 0.11;
        newDetail.sale_tax = tax.toFixed(2);
      } else {
        newDetail.sale_tax = '0.00';
      }
    }

    updatedDetails[index] = newDetail;
    setDetails(updatedDetails);
  };

  const handleAddDetail = () => {
    setDetails([
      ...details,
      {
        product_code: '',
        qty: 1,
        price: 0,
        sale_discount: 0,
        sale_tax: 0,
        sale_currency: transaction.sales_currency,
      },
    ]);
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(transaction, details, isEditing ? salesOrderCode : null);
    navigate('/sales-order');
  };

  const totalNetSubtotal = details.reduce((total, detail) => {
    const qty = parseFloat(detail.qty) || 0;
    const price = parseFloat(detail.price) || 0;
    const grossSubtotal = qty * price;
    const discount = parseFloat(detail.sale_discount) || 0;
    const tax = parseFloat(detail.sale_tax) || 0;
    return total + (grossSubtotal - discount + tax);
  }, 0);

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Edit Sales Order' : 'New Sales Order'}</h2>
      <form onSubmit={handleSubmit} className="sales-order-form">
        <div className="form-section">
          <h3>Header</h3>
          <div className="form-group">
            <label>SO Code</label>
            <input
              type="text"
              name="sales_order_code"
              value={transaction.sales_order_code}
              onChange={handleHeaderChange}
              required
              disabled={isEditing}
            />
          </div>
          <div className="form-group">
            <label>SO Date</label>
            <input
              type="date"
              name="sales_order_date"
              value={transaction.sales_order_date}
              onChange={handleHeaderChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Client</label>
            <select
              name="sales_order_client"
              value={transaction.sales_order_client}
              onChange={handleHeaderChange}
              required
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.client_code} value={c.client_code}>
                  {c.client_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Reference Code</label>
            <input
              type="text"
              name="reference_code"
              value={transaction.reference_code}
              onChange={handleHeaderChange}
            />
          </div>
          <div className="form-group">
            <label>TOTAL</label>
            <input
              type="number"
              value={totalNetSubtotal.toFixed(2)}
              readOnly
              tabIndex="-1"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={transaction.description}
              onChange={handleHeaderChange}
            />
          </div>
        </div>

        <div className="details-section">
          <h3>Details</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Gross Subtotal</th>
                <th>- Discount</th>
                <th>+ Tax (11%)</th>
                <th>Net Subtotal</th>
                <th>Currency</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => {
                const qty = parseFloat(detail.qty) || 0;
                const price = parseFloat(detail.price) || 0;
                const grossSubtotal = qty * price;
                const discount = parseFloat(detail.sale_discount) || 0;
                const tax = parseFloat(detail.sale_tax) || 0;
                const netSubtotal = grossSubtotal - discount + tax;
                const isProductSelected = !!detail.product_code;

                return (
                <tr key={index}>
                  <td>
                    <select
                      name="product_code"
                      value={detail.product_code}
                      onChange={(e) => handleDetailChange(index, e)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.product_code} value={product.product_code}>
                          {product.product_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="qty"
                      value={detail.qty}
                      onChange={(e) => handleDetailChange(index, e)}
                      min="1"
                      required
                      disabled={!isProductSelected}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={detail.price}
                      onChange={(e) => handleDetailChange(index, e)}
                      min="0"
                      required
                      disabled={!isProductSelected}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="gross_subtotal"
                      value={grossSubtotal.toFixed(2)}
                      readOnly
                      tabIndex="-1"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="sale_discount"
                      value={detail.sale_discount}
                      onChange={(e) => handleDetailChange(index, e)}
                      disabled={!isProductSelected}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="sale_tax"
                      value={detail.sale_tax}
                      onChange={(e) => handleDetailChange(index, e)}
                      disabled={!isProductSelected}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="net_subtotal"
                      value={netSubtotal.toFixed(2)}
                      readOnly
                      tabIndex="-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="sale_currency"
                      value={detail.sale_currency}
                      readOnly
                      tabIndex="-1"
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => handleRemoveDetail(index)} className="remove-detail-button">
                      Remove
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          <button type="button" onClick={handleAddDetail} className="add-detail-button">
            Add Product
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Save</button>
          <button type="button" onClick={() => navigate('/sales-order')} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesOrderForm;