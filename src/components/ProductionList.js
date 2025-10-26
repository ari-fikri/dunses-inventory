import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ProductionList.css';

const ProductionList = ({ production, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'production_date', direction: 'descending' });
  const productionPerPage = 10;

  const sortedProduction = useMemo(() => {
    let sortableProduction = [...production];
    if (sortConfig !== null) {
      sortableProduction.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProduction;
  }, [production, sortConfig]);

  // Pagination logic
  const indexOfLastProduction = currentPage * productionPerPage;
  const indexOfFirstProduction = indexOfLastProduction - productionPerPage;
  const currentProduction = sortedProduction.slice(indexOfFirstProduction, indexOfLastProduction);

  const totalPages = Math.ceil(production.length / productionPerPage);

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
            <th>No.</th>
            <SortableHeader name="production_code" label="Production Code" />
            <SortableHeader name="production_date" label="Date" />
            <SortableHeader name="product_code" label="Product Code" />
            <SortableHeader name="sales_order_code" label="SO Code" />
            <SortableHeader name="production_target_qty" label="Target (kg)" />
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProduction.map((prod, index) => (
            <tr key={prod.production_code}>
              <td>{indexOfFirstProduction + index + 1}</td>
              <td>{prod.production_code}</td>
              <td>{formatDate(prod.production_date)}</td>
              <td>{prod.product_code}</td>
              <td>{prod.sales_order_code}</td>
              <td>{prod.production_target_qty}</td>
              <td>
                <Link to={`/production-form/${prod.production_code}`} className="action-button">
                  Edit
                </Link>
                <button onClick={() => onDelete(prod.production_code)} className="action-button delete-button">
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