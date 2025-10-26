import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductionList.css';

const ProductionList = ({ production, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = production.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(production.length / itemsPerPage);

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
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="list-container">
      <h2>Production List</h2>
      <Link to="/production-form" className="add-button">
        Add New Production
      </Link>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
      <table className="data-table">
        <thead>
          <tr>
            <th>Rec No</th>
            <th>Production Code</th>
            <th>Production Date</th>
            <th>Product Code</th>
            <th>Sales Order Code</th>
            <th>Target Qty</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.production_code}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{item.production_code}</td>
              <td>{formatDate(item.production_date)}</td>
              <td>{item.product_code}</td>
              <td>{item.sales_order_code}</td>
              <td>{item.production_target_qty}</td>
              <td>{item.description}</td>
              <td>
                <Link to={`/production-form/${item.production_code}`} className="action-button">
                  Edit
                </Link>
                <button onClick={() => onDelete(item.production_code)} className="action-button delete-button">
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

export default ProductionList;