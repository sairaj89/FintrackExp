import React, { useState, useEffect } from 'react';
import './EditExpenseForm.css';

function EditExpenseForm({ expense, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (expense) {
      setTitle(expense.title || '');
      setAmount(expense.amount || '');
      setCategory(expense.category || '');
    }
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category) {
      alert('Please fill in all fields.');
      return;
    }
    // Include the id here when calling onSave
    onSave({ id: expense.id, title, amount: Number(amount), category, userId: expense.userId });

  };

  return (
    <div className="modal-overlay">
      <form className="edit-expense-form" onSubmit={handleSubmit}>
        <h2>Edit Expense</h2>

        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label htmlFor="amount">Amount ($):</label>
        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />

        <label htmlFor="category">Category:</label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />

        <div className="buttons">
          <button type="submit" className="save-btn">Save</button>
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditExpenseForm;
