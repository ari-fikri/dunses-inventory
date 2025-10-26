import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SalesOrderList.css';

const SalesOrderList = ({ salesOrders, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salesOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(salesOrders.length / itemsPerPage);

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
      <h2>Sales Order List</h2>
      <Link to="/sales-order-form" className="add-button">
        Add New Sales Order
      </Link>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
      <table className="data-table">
        <thead>
          <tr>
            <th>Rec No</th>
            <th>SO Code</th>
            <th>SO Date</th>
            <th>Client</th>
            <th>Reference</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.sales_order_code}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{item.sales_order_code}</td>
              <td>{formatDate(item.sales_order_date)}</td>
              <td>{item.sales_order_client}</td>
              <td>{item.reference_code}</td>
              <td>{item.description}</td>
              <td>
                <Link to={`/sales-order-form/${item.sales_order_code}`} className="action-button">
                  Edit
                </Link>
                <button onClick={() => onDelete(item.sales_order_code)} className="action-button delete-button">
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

export default SalesOrderList;