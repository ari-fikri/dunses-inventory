import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = ({ onSave, products }) => {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    product_code: '',
    product_name: '',
    product_price: '',
    current_stock: '',
    product_category: 'FG', // Default to Finished Goods
  });

  useEffect(() => {
    if (productCode) {
      const existingProduct = products.find(p => p.product_code === productCode);
      if (existingProduct) {
        setProduct(existingProduct);
      }
    }
  }, [productCode, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product);
    navigate('/products');
  };

  return (
    <div className="product-form-container">
      <h2>{productCode ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Code</label>
          <input
            type="text"
            name="product_code"
            value={product.product_code}
            onChange={handleChange}
            required
            disabled={!!productCode}
          />
        </div>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="product_name"
            value={product.product_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price (Rp)</label>
          <input
            type="number"
            name="product_price"
            value={product.product_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Current Stock (kg)</label>
          <input
            type="number"
            name="current_stock"
            value={product.current_stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="product_category"
            value={product.product_category}
            onChange={handleChange}
            required
          >
            <option value="RM">Raw Material (RM)</option>
            <option value="SFG">Semi-Finished Goods (SFG)</option>
            <option value="FG">Finished Goods (FG)</option>
            <option value="CIM">Consumable/Indirect Material (CIM)</option>
            <option value="PM">Packaging Material (PM)</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Save Product</button>
      </form>
    </div>
  );
};

export default ProductForm;