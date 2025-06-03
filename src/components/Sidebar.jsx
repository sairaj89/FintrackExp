import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({
  users = [],
  onAddUserClick,
  onUsersClick,
  onExpenseClick,
  onBudgetsClick,
  currentView,
  currentUser
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Hamburger Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        {/* Wrapper to push down the sidebar content */}
        <div className="sidebar-content">
          <h1 className="logo">FinTrack</h1>

          <nav className="nav">
            <button
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={onExpenseClick}
            >
              🏠 Expense Tracker
            </button>
            <button
              className={`nav-item ${currentView === 'budgets' ? 'active' : ''}`}
              onClick={onBudgetsClick}
            >
              📊 Budgets
            </button>
            <button
              className={`nav-item ${currentView === 'users' ? 'active' : ''}`}
              onClick={onUsersClick}
            >
              👤 Users
            </button>
          </nav>

          <div className="users-wrapper">
            <div className="users-header">
              <span>👥 Add Users</span>
              <button className="add-user" onClick={onAddUserClick}>+ Add</button>
            </div>

            {currentUser && (
              <div className="user-card">
                <img
                  src={currentUser.avatar || "https://i.imgur.com/2DhmtJ4.png"}
                  alt="User"
                  className="avatar"
                />
                <div>
                  <div className="user-name">{currentUser.name}</div>
                  <div className="user-email">{currentUser.email}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
