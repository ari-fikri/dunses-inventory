import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleDelete = (productCode) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(productCode);
    }
  };

  return (
    <div className="list-container">
      <h2>Product List</h2>
      <Link to="/product-form" className="add-button">
        Add New Product
      </Link>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
      <table className="data-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price (Rp)</th>
            <th>Stock (kg)</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => (
            <tr key={product.product_code}>
              <td>{indexOfFirstProduct + index + 1}</td>
              <td>{product.product_code}</td>
              <td>{product.product_name}</td>
              <td>{product.product_category}</td>
              <td>{product.product_price}</td>
              <td>{product.current_stock}</td>
              <td>{formatDate(product.created_at)}</td>
              <td>{formatDate(product.updated_at)}</td>
              <td>
                <Link to={`/product-form/${product.product_code}`} className="action-button">
                  Edit
                </Link>
                <button onClick={() => handleDelete(product.product_code)} className="action-button delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;