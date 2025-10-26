import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './SalesOrderList.css';

const SalesOrderList = ({ salesOrders, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'sales_order_date', direction: 'descending' });
  const ordersPerPage = 10;

  const sortedSalesOrders = useMemo(() => {
    let sortableSalesOrders = [...salesOrders];
    if (sortConfig !== null) {
      sortableSalesOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableSalesOrders;
  }, [salesOrders, sortConfig]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedSalesOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(salesOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirection = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const SortableHeader = ({ name, label }) => {
    const direction = getSortDirection(name);
    return (
      <th onClick={() => requestSort(name)}>
        {direction === 'ascending' && '▲ '}
        {direction === 'descending' && '▼ '}
        {label}
      </th>
    );
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
            <th>No.</th>
            <SortableHeader name="sales_order_code" label="SO Code" />
            <SortableHeader name="sales_order_date" label="Date" />
            <SortableHeader name="client_code" label="Client Code" />
            <th>Total Amount (Rp)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order, index) => (
            <tr key={order.sales_order_code}>
              <td>{indexOfFirstOrder + index + 1}</td>
              <td>{order.sales_order_code}</td>
              <td>{formatDate(order.sales_order_date)}</td>
              <td>{order.client_code}</td>
              <td>
                {(order.sales_order_details || []).reduce((total, detail) => total + detail.total_price, 0).toLocaleString('id-ID')}
              </td>
              <td>
                <span className={`status ${(order.status || '').toLowerCase()}`}>{order.status || 'N/A'}</span>
              </td>
              <td>
                <Link to={`/sales-order-form/${order.sales_order_code}`} className="action-button">
                  Edit
                </Link>
                <button onClick={() => onDelete(order.sales_order_code)} className="action-button delete-button">
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