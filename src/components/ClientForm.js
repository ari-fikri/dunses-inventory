import React, { useState } from 'react';
import './ClientForm.css';

const ClientForm = () => {
  const [formData, setFormData] = useState({
    client_code: '',
    client_name: '',
    client_address: '',
    client_office_phone: '',
    client_pic_name: '',
    client_mobile_phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="client-form">
      <div className="form-group">
        <label htmlFor="client_code">Client Code</label>
        <input
          type="text"
          id="client_code"
          name="client_code"
          value={formData.client_code}
          onChange={handleChange}
          maxLength="5"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="client_name">Client Name</label>
        <input
          type="text"
          id="client_name"
          name="client_name"
          value={formData.client_name}
          onChange={handleChange}
          maxLength="100"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="client_address">Client Address</label>
        <textarea
          id="client_address"
          name="client_address"
          value={formData.client_address}
          onChange={handleChange}
          maxLength="250"
        />
      </div>
      <div className="form-group">
        <label htmlFor="client_office_phone">Office Phone</label>
        <input
          type="text"
          id="client_office_phone"
          name="client_office_phone"
          value={formData.client_office_phone}
          onChange={handleChange}
          maxLength="20"
        />
      </div>
      <div className="form-group">
        <label htmlFor="client_pic_name">PIC Name</label>
        <input
          type="text"
          id="client_pic_name"
          name="client_pic_name"
          value={formData.client_pic_name}
          onChange={handleChange}
          maxLength="50"
        />
      </div>
      <div className="form-group">
        <label htmlFor="client_mobile_phone">Mobile Phone</label>
        <input
          type="text"
          id="client_mobile_phone"
          name="client_mobile_phone"
          value={formData.client_mobile_phone}
          onChange={handleChange}
          maxLength="20"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ClientForm;