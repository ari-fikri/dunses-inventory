import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = ({ products, onSave }) => {
  const { productCode } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    product_code: '',
    product_name: '',
    product_category: 'FG',
    product_price: '',
    current_stock: '',
    materials: [],
  });

  const [material, setMaterial] = useState({
    material_code: '',
    material_qty: '',
  });

  useEffect(() => {
    console.log('ProductForm useEffect triggered. productCode:', productCode);
    if (productCode) {
      const existingProduct = products.find(p => p.product_code === productCode);
      console.log('Found existing product:', existingProduct);
      if (existingProduct) {
        setProduct({
          ...existingProduct,
          materials: existingProduct.materials || [],
        });
      }
    }
  }, [productCode, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: value });
  };

  const handleAddMaterial = () => {
    if (material.material_code && material.material_qty) {
      if (product.materials.some(m => m.material_code === material.material_code)) {
        alert('Material already exists.');
        return;
      }
      const newMaterials = [...product.materials, { ...material, material_qty: parseFloat(material.material_qty) }];
      setProduct({ ...product, materials: newMaterials });
      setMaterial({ material_code: '', material_qty: '' });
    }
  };

  const handleRemoveMaterial = (materialCode) => {
    const newMaterials = product.materials.filter(m => m.material_code !== materialCode);
    setProduct({ ...product, materials: newMaterials });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product);
    navigate('/products');
  };

  const getMaterialInfo = (materialCode, info) => {
    const materialProduct = products.find(p => p.product_code === materialCode);
    return materialProduct ? materialProduct[info] : '';
  };

  const availableMaterials = products.filter(p => p.product_code !== product.product_code);

  const calculateTotal = () => {
    return (product.materials || []).reduce((total, mat) => {
      const price = getMaterialInfo(mat.material_code, 'product_price') || 0;
      return total + (price * mat.material_qty);
    }, 0);
  };

  console.log('Rendering ProductForm. Current product state:', product);
  console.log('Is category FG?', product.product_category === 'FG');

  return (
    <div className="product-form-container">
      <h2>{productCode ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Code</label>
          <input
            type="text"
            name="product_code"
            value={product.product_code}
            onChange={handleChange}
            required
            readOnly={!!productCode}
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
          <label>Category</label>
          <select
            name="product_category"
            value={product.product_category}
            onChange={handleChange}
          >
            <option value="FG">Finished Good</option>
            <option value="RM">Raw Material</option>
          </select>
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
          <label>Stock (kg)</label>
          <input
            type="number"
            name="current_stock"
            value={product.current_stock}
            onChange={handleChange}
            required
          />
        </div>

        {product.product_category === 'FG' && (
          <div className="materials-section">
            <h3>Bill of Materials</h3>
            <table className="materials-table">
              <thead>
                <tr>
                  <th>Material Code</th>
                  <th>Material Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(product.materials || []).map((mat) => {
                  const price = getMaterialInfo(mat.material_code, 'product_price') || 0;
                  const subtotal = price * mat.material_qty;
                  return (
                    <tr key={mat.material_code}>
                      <td>{mat.material_code}</td>
                      <td>{getMaterialInfo(mat.material_code, 'product_name')}</td>
                      <td>{price}</td>
                      <td>{mat.material_qty}</td>
                      <td>{subtotal.toFixed(2)}</td>
                      <td>
                        <button type="button" onClick={() => handleRemoveMaterial(mat.material_code)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total</strong></td>
                  <td><strong>{calculateTotal().toFixed(2)}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <div className="add-material-form">
              <select
                name="material_code"
                value={material.material_code}
                onChange={handleMaterialChange}
              >
                <option value="">Select Material</option>
                {availableMaterials.map(p => (
                  <option key={p.product_code} value={p.product_code}>
                    {p.product_name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="material_qty"
                placeholder="Quantity"
                value={material.material_qty}
                onChange={handleMaterialChange}
              />
              <button type="button" onClick={handleAddMaterial}>
                Add Material
              </button>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate('/products')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;