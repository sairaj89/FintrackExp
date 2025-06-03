// src/components/AddExpenseForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddExpenseForm.css';

function AddExpenseForm({ onExpenseAdded, currentUser }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.id) {
      toast.error('No user selected!');
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/users/${currentUser.id}/expenses`,
        {
          ...formData,
          amount: parseFloat(formData.amount),
          userId: currentUser.id, // Include for backend safety
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      toast.success('Expense added successfully!');

      if (onExpenseAdded) onExpenseAdded();

      setFormData({
        title: '',
        amount: '',
        category: '',
      });
    } catch (error) {
      console.error('❌ Failed to add expense:', error);
      toast.error('Failed to add expense');
    }
  };

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Expense Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default AddExpenseForm;
