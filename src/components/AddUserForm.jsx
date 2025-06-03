import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddUserForm.css';

const AddUserForm = ({ onUserAdded, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and Email are required!');
      return;
    }

    try {
      console.log('➡️ Submitting user data:', JSON.stringify(formData));

      const response = await axios.post(`${BASE_URL}/api/users`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Server response:', response.data);
      toast.success('User added successfully!');
      setFormData({ name: '', email: '' });

      if (onUserAdded) onUserAdded(response.data);
    } catch (error) {
      console.error('❌ Failed to add user. Details:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }

      toast.error('Failed to add user.');
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="modal-overlay">
      <form className="add-user-form" onSubmit={handleSubmit}>
        <h3>Add New User</h3>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="button-group">
          <button type="submit">Add</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
