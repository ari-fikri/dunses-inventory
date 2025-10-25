import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClientList.css';

// Mock data for demonstration
const mockClients = Array.from({ length: 25 }, (_, i) => ({
  client_code: `C${100 + i}`,
  client_name: `Client Name ${i + 1}`,
  client_address: `Address ${i + 1}`,
  client_office_phone: `123-456-789${i}`,
  client_pic_name: `PIC ${i + 1}`,
  client_mobile_phone: `987-654-321${i}`,
}));

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    setClients(mockClients);
  }, []);

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const totalPages = Math.ceil(clients.length / clientsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="client-list-container">
      <h2>Client List</h2>
      <Link to="/client-form" className="add-client-button">
        Add New Client
      </Link>
      <table className="client-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Address</th>
            <th>Office Phone</th>
            <th>PIC</th>
            <th>Mobile Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.map((client) => (
            <tr key={client.client_code}>
              <td>{client.client_code}</td>
              <td>{client.client_name}</td>
              <td>{client.client_address}</td>
              <td>{client.client_office_phone}</td>
              <td>{client.client_pic_name}</td>
              <td>{client.client_mobile_phone}</td>
              <td>
                <Link to={`/client-form/${client.client_code}`} className="action-button">
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

export default ClientList;