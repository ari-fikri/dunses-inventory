import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ClientList.css';

const ClientList = ({ clients, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });
  const clientsPerPage = 10;

  const sortedClients = useMemo(() => {
    let sortableClients = [...clients];
    if (sortConfig !== null) {
      sortableClients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableClients;
  }, [clients, sortConfig]);

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = sortedClients.slice(indexOfFirstClient, indexOfLastClient);

  const totalPages = Math.ceil(clients.length / clientsPerPage);

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
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleDelete = (clientCode) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      onDelete(clientCode);
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
      <h2>Client List</h2>
      <Link to="/client-form" className="add-button">
        Add New Client
      </Link>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
      <table className="data-table">
        <thead>
          <tr>
            <th>Rec No</th>
            <SortableHeader name="client_code" label="Code" />
            <SortableHeader name="client_name" label="Name" />
            <SortableHeader name="client_address" label="Address" />
            <SortableHeader name="client_office_phone" label="Office Phone" />
            <SortableHeader name="client_pic_name" label="PIC" />
            <SortableHeader name="client_mobile_phone" label="Mobile Phone" />
            <SortableHeader name="created_at" label="Created At" />
            <SortableHeader name="updated_at" label="Updated At" />
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.map((client, index) => (
            <tr key={client.client_code}>
              <td>{indexOfFirstClient + index + 1}</td>
              <td>{client.client_code}</td>
              <td>{client.client_name}</td>
              <td>{client.client_address}</td>
              <td>{client.client_office_phone}</td>
              <td>{client.client_pic_name}</td>
              <td>{client.client_mobile_phone}</td>
              <td>{formatDate(client.created_at)}</td>
              <td>{formatDate(client.updated_at)}</td>
              <td>
                <Link to={`/client-form/${client.client_code}`} className="action-button">
                  Edit
                </Link>
                <button onClick={() => handleDelete(client.client_code)} className="action-button delete-button">
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

export default ClientList;