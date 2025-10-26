import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './InventoryList.css';

const InventoryList = ({ inventory, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'inventory_date', direction: 'descending' });
  const inventoryPerPage = 10;

  const sortedInventory = useMemo(() => {
    let sortableInventory = [...inventory];
    if (sortConfig !== null) {
      sortableInventory.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableInventory;
  }, [inventory, sortConfig]);

  // Pagination logic
  const indexOfLastInventory = currentPage * inventoryPerPage;
  const indexOfFirstInventory = indexOfLastInventory - inventoryPerPage;
  const currentInventory = sortedInventory.slice(indexOfFirstInventory, indexOfLastInventory);

  const totalPages = Math.ceil(inventory.length / inventoryPerPage);

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
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = (inventoryCode) => {
    if (window.confirm('Are you sure you want to delete this inventory transaction?')) {
      onDelete(inventoryCode);
    }
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
      <h2>Inventory Transactions</h2>
      <Link to="/inventory-form" className="add-button">
        Add New Transaction
      </Link>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
      <table className="data-table">
        <thead>
          <tr>
            <th>No.</th>
            <SortableHeader name="inventory_code" label="Inventory Code" />
            <SortableHeader name="inventory_date" label="Date" />
            <SortableHeader name="reference_code" label="Reference" />
            <SortableHeader name="type" label="Type" />
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentInventory.map((inv, index) => (
            <tr key={inv.inventory_code}>
              <td>{indexOfFirstInventory + index + 1}</td>
              <td>{inv.inventory_code}</td>
              <td>{formatDate(inv.inventory_date)}</td>
              <td>{inv.reference_code}</td>
              <td>{inv.type}</td>
              <td>{inv.description}</td>
              <td>
                <Link to={`/inventory-form/${inv.inventory_code}`} className="action-button">
                  Edit
                </Link>
                <button onClick={() => handleDelete(inv.inventory_code)} className="action-button delete-button">
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

export default InventoryList;