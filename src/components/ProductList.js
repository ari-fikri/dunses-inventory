import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products }) => {
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

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      <Link to="/product-form" className="add-product-button">
        Add New Product
      </Link>
      <table className="product-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Price (Rp)</th>
            <th>Stock (kg)</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.product_code}>
              <td>{product.product_code}</td>
              <td>{product.product_name}</td>
              <td>{product.product_price}</td>
              <td>{product.current_stock}</td>
              <td>{new Date(product.created_at).toLocaleString()}</td>
              <td>{new Date(product.updated_at).toLocaleString()}</td>
              <td>
                <Link to={`/product-form/${product.product_code}`} className="action-button">
                  Edit
                </Link>
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