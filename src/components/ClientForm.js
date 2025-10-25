import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClientForm.css';

const ClientForm = ({ clients, onSave }) => {
  const { clientCode } = useParams(); // Changed from clientId to clientCode
  const navigate = useNavigate();
  const [client, setClient] = useState({
    client_code: '',
    client_name: '',
    client_address: '',
    client_office_phone: '',
    client_pic_name: '',
    client_mobile_phone: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (clientCode) {
      const existingClient = clients.find(c => c.client_code === clientCode);
      if (existingClient) {
        setClient(existingClient);
        setIsEditing(true);
      }
    }
  }, [clientCode, clients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(client, isEditing ? clientCode : null);
    navigate('/clients');
  };

  return (
    <div className="client-form-container">
      <h2>{isEditing ? 'Edit Client' : 'Add Client'}</h2>
      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-group">
          <label>Client Code</label>
          <input
            type="text"
            name="client_code"
            value={client.client_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="client_name"
            value={client.client_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="client_address"
            value={client.client_address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Office Phone</label>
          <input
            type="text"
            name="client_office_phone"
            value={client.client_office_phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>PIC Name</label>
          <input
            type="text"
            name="client_pic_name"
            value={client.client_pic_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Mobile Phone</label>
          <input
            type="text"
            name="client_mobile_phone"
            value={client.client_mobile_phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">Save</button>
          <button type="button" onClick={() => navigate('/clients')} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;