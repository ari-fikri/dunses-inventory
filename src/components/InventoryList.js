import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './InventoryList.css';
import inventoryData from '../data/Inventory.json';
import systemData from '../data/system.json';

const InventoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getInventoryTypeName = (typeCode) => {
    const inventoryType = systemData.find(
      (item) =>
        item.function === 'inventory' &&
        item.sub_function === 'inventory_type' &&
        item.code === typeCode
    );
    return inventoryType ? inventoryType.value_en : typeCode;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventoryData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

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
    <div className="inventory-list-container">
      <h2>Inventory Transactions</h2>
      <Link to="/inventory-form" className="add-inventory-button">
        Add New Transaction
      </Link>
      <Link to="/" className="back-to-home-button">
        Back to Home
      </Link>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Code</th>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.inventory_code}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{item.inventory_code}</td>
              <td>{formatDate(item.inventory_date)}</td>
              <td>{getInventoryTypeName(item.inventory_type)}</td>
              <td>{item.description}</td>
              <td>
                <Link to={`/inventory-form/${item.inventory_code}`} className="action-button">
                  Edit
                </Link>
                <button className="action-button delete-button">
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