// src/App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BalanceCard from './components/BalanceCard';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import AddUserForm from './components/AddUserForm';
import EditExpenseForm from './components/EditExpenseForm';
import Header from './components/Header';
import UserPage from './components/UserPage';
import './App.css';

// Set base URL from environment
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userExpenses, setUserExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchExpenses(currentUser.id);
    } else {
      setUserExpenses([]);
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/users`);
      const contentType = res.headers.get('content-type');

      if (!res.ok) throw new Error('Failed to fetch users');

      const data =
        contentType && contentType.includes('application/json')
          ? await res.json()
          : [];

      setUsers(data);

      if (data.length > 0 && !currentUser) {
        setCurrentUser(data[0]);
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchExpenses = async (userId) => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/users/${userId}/expenses`);
      const contentType = res.headers.get('content-type');

      if (!res.ok) throw new Error('Failed to fetch expenses');

      const data =
        contentType && contentType.includes('application/json')
          ? await res.json()
          : [];

      setUserExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      setUserExpenses([]);
    }
  };

  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    setShowAddUserModal(false);
    setCurrentView('dashboard');
  };

  const handleUserSelect = (user) => {
    if (currentUser && user.id === currentUser.id) {
      setCurrentView('dashboard');
      return;
    }
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete user: ${errorText}`);
      }

      await fetchUsers();

      if (currentUser && currentUser.id === id) {
        setCurrentUser(null);
        setUserExpenses([]);
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddOrEditExpense = async (expense) => {
    if (!currentUser) return;

    try {
      if (editingExpense) {
        const res = await fetch(
          `${VITE_API_BASE_URL}/api/Expenses/${expense.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
          }
        );
        if (!res.ok) throw new Error('Failed to update expense');
      } else {
        const res = await fetch(`${VITE_API_BASE_URL}/api/users/${currentUser.id}/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expense),
        });
        if (!res.ok) throw new Error('Failed to add expense');
      }

      await fetchExpenses(currentUser.id);
      setEditingExpense(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!currentUser) return;

    try {
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/Expenses/${expenseId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete expense');

      await fetchExpenses(currentUser.id);
      if (editingExpense && editingExpense.id === expenseId) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const balance = userExpenses.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  return (
    <div className="app-container">
      <Sidebar
        users={users}
        currentUser={currentUser}
        currentView={currentView}
        onAddUserClick={() => setShowAddUserModal(true)}
        onUsersClick={() => setCurrentView('users')}
        onExpenseClick={() => setCurrentView('dashboard')}
        onBudgetsClick={() => setCurrentView('budgets')}
      />

      <main className="main-content">
        <Header username={currentUser?.name || 'Guest'} />

        {currentView === 'dashboard' ? (
          <>
            <section className="top-section">
              <BalanceCard balance={balance} />
              {editingExpense ? (
                <EditExpenseForm
                  expense={editingExpense}
                  onSave={handleAddOrEditExpense}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <AddExpenseForm
                  onAddExpense={handleAddOrEditExpense}
                  onExpenseAdded={() => fetchExpenses(currentUser.id)}
                  currentUser={currentUser}
                />
              )}
            </section>

            <section aria-label="Expense List">
              <ExpenseTable
                expenses={userExpenses}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </section>
          </>
        ) : currentView === 'users' ? (
          <UserPage
            onUserSelect={handleUserSelect}
            onUserDelete={handleDeleteUser}
          />
        ) : (
          <div style={{ padding: '1rem' }}>
            <h2>Budgets page coming soon...</h2>
          </div>
        )}
      </main>

      {showAddUserModal && (
        <AddUserForm
          onUserAdded={handleUserAdded}
          onCancel={() => setShowAddUserModal(false)}
        />
      )}
    </div>
  );
}

export default App;
