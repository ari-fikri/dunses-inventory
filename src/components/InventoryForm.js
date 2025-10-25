import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import systemData from '../data/system.json';
import productData from '../data/products.json';
import './InventoryForm.css';

const InventoryForm = ({ onSave, inventory, inventoryDtl }) => {
  const { inventoryCode } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [transaction, setTransaction] = useState({
    inventory_code: '',
    inventory_date: new Date().toISOString().split('T')[0],
    inventory_type: '',
    description: '',
  });
  const [details, setDetails] = useState([]);
  const [inventoryTypes, setInventoryTypes] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const types = systemData.filter(
      (item) => item.function === 'inventory' && item.sub_function === 'inventory_type'
    );
    setInventoryTypes(types);

    const sortedProducts = [...productData].sort((a, b) => a.product_name.localeCompare(b.product_name));
    setProducts(sortedProducts);

    if (inventoryCode) {
      setIsEditing(true);
      const existingTransaction = inventory.find(
        (inv) => inv.inventory_code === inventoryCode
      );
      if (existingTransaction) {
        setTransaction({
            ...existingTransaction,
            inventory_date: existingTransaction.inventory_date ? new Date(existingTransaction.inventory_date).toISOString().split('T')[0] : '',
        });
      }
      const existingDetails = inventoryDtl.filter(
        (dtl) => dtl.inventory_code === inventoryCode
      );
      setDetails(existingDetails);
    } else {
        // New transaction
        if (types.length > 0) {
            setTransaction(prev => ({ ...prev, inventory_type: types[0].code }));
        }
    }
  }, [inventoryCode, inventory, inventoryDtl]);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetails = [...details];
    updatedDetails[index] = { ...updatedDetails[index], [name]: value };
    setDetails(updatedDetails);
  };

  const handleAddDetail = () => {
    setDetails([...details, { product_code: '', qty: 1 }]);
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(transaction, details, isEditing ? inventoryCode : null);
    navigate('/inventory');
  };

  return (
    <div className="inventory-form-container">
      <h2>{isEditing ? 'Edit Transaction' : 'New Transaction'}</h2>
      <form onSubmit={handleSubmit} className="inventory-form">
        <div className="form-section">
          <h3>Header</h3>
          <div className="form-group">
            <label>Transaction Code</label>
            <input
              type="text"
              name="inventory_code"
              value={transaction.inventory_code}
              onChange={handleHeaderChange}
              required
              disabled={isEditing}
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="inventory_date"
              value={transaction.inventory_date}
              onChange={handleHeaderChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              name="inventory_type"
              value={transaction.inventory_type}
              onChange={handleHeaderChange}
              required
            >
              {inventoryTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.value_en}
                </option>
              ))}
            </select>
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

        <div className="form-section">
          <h3>Details</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index}>
                  <td>
                    <select
                      name="product_code"
                      value={detail.product_code}
                      onChange={(e) => handleDetailChange(index, e)}
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map(p => (
                        <option key={p.product_code} value={p.product_code}>
                          {p.product_name}
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
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => handleRemoveDetail(index)} className="remove-detail-button">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={handleAddDetail} className="add-detail-button">
            Add Product
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Save</button>
          <button type="button" onClick={() => navigate('/inventory')} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;