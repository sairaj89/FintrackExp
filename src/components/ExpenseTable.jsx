import React, { useState } from 'react';
import './ExpenseTable.css';

function ExpenseTable({ expenses = [], onDelete, onEdit }) {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [slideDirection, setSlideDirection] = useState('');

  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const visibleExpenses = expenses.slice(startIdx, startIdx + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      setSlideDirection('slide-right');
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setSlideDirection('slide-left');
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="expense-table">
      <h2>Expense List</h2>
      {expenses.length === 0 ? (
        <p>No expenses to show.</p>
      ) : (
        <>
          <div className={`table-wrapper ${slideDirection}`}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount ($)</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleExpenses.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.amount}</td>
                    <td>{item.category}</td>
                    <td className="actions-cell">
                      <button
                        className="edit-btn"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-controls">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="arrow-btn"
            >
              &#8592;
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="arrow-btn"
            >
              &#8594;
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseTable;
