import React, { useEffect, useState } from 'react';
import './UserPage.css';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("🔍 VITE_API_BASE_URL:", API_BASE_URL);

function UserPage({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState({ name: '', email: '', id: '' });
  const [selectedUserId, setSelectedUserId] = useState(() => localStorage.getItem('selectedUserId') || null);

  const [currentPage, setCurrentPage] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const usersPerPage = 6;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/users`)
      .then(res => {
        const validUsers = res.data.filter(user => user && user.id);
        setUsers(validUsers);

        if (selectedUserId && !validUsers.some(u => String(u.id) === String(selectedUserId))) {
          localStorage.removeItem('selectedUserId');
          setSelectedUserId(null);
          onUserSelect(null);
        }
      })
      .catch(err => console.error("Error fetching users:", err));
  }, [selectedUserId, onUserSelect]);

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/api/users/${id}`)
      .then(() => {
        const updatedUsers = users.filter(user => String(user.id) !== String(id));
        setUsers(updatedUsers);

        if (String(selectedUserId) === String(id)) {
          localStorage.removeItem('selectedUserId');
          setSelectedUserId(null);
          onUserSelect(null);
        }

        const totalPages = Math.ceil((updatedUsers.length || 1) / usersPerPage);
        if (currentPage >= totalPages) setCurrentPage(Math.max(totalPages - 1, 0));
      })
      .catch(err => console.error("Error deleting user:", err));
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditingUser(user);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const { id, name, email } = editingUser;

    axios.put(`${API_BASE_URL}/api/users/${id}`, { id, name, email })
      .then((res) => {
        const updatedUser = {
          ...editingUser,
          ...res.data,
          id: res.data.id || editingUser.id,
        };

        setUsers(users.map(user =>
          String(user.id) === String(id) ? updatedUser : user
        ));
        setIsEditing(false);

        if (String(selectedUserId) === String(id)) {
          onUserSelect(updatedUser);
        }
      })
      .catch(err => console.error("Error updating user:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUserClick = (user) => {
    setSelectedUserId(String(user.id));
    localStorage.setItem('selectedUserId', String(user.id));
    onUserSelect(user);
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = currentPage * usersPerPage;
  const visibleUsers = users.slice(startIndex, startIndex + usersPerPage);

  const handlePrev = () => {
    if (currentPage > 0) {
      setAnimationClass('slide-right');
      setTimeout(() => {
        setCurrentPage(prev => Math.max(prev - 1, 0));
        setAnimationClass('');
      }, 400);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setAnimationClass('slide-left');
      setTimeout(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
        setAnimationClass('');
      }, 400);
    }
  };

  return (
    <div className="user-page">
      <div className="user-table">
        <h2>All Users</h2>

        {isEditing && (
          <div className="modal-overlay" onClick={() => setIsEditing(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleUpdate} className="edit-form">
                <h3>Edit User</h3>

                <label htmlFor="edit-name">Name</label>
                <input
                  id="edit-name"
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleChange}
                  required
                />

                <div className="form-buttons">
                  <button type="submit" className="btn-update">Update</button>
                  <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={`table-wrapper ${animationClass}`}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map(user => (
                <tr
                  key={String(user.id)}
                  className={String(selectedUserId) === String(user.id) ? 'selected-row' : ''}
                  onClick={() => handleUserClick(user)}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="delete-btn">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button className="arrow-btn" onClick={handlePrev} disabled={currentPage === 0}>←</button>
            <span>{currentPage + 1} / {totalPages}</span>
            <button className="arrow-btn" onClick={handleNext} disabled={currentPage === totalPages - 1}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPage;
