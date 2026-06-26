import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  addUser, 
  updateUser, 
  deleteUser, 
  setSearchTerm, 
  setRoleFilter 
} from '../../store/slices/usersSlice';
import { addNotification } from '../../store/slices/uiSlice';
import type { User } from '../../services/mockApi';
import Modal from '../../components/UI/Modal';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiUserPlus, 
  FiMail, 
  FiShield, 
  FiCheckCircle 
} from 'react-icons/fi';
import './Users.scss';

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list: users, searchTerm, roleFilter } = useAppSelector((state) => state.users);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Viewer');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Suspended'>('Active');
  
  const [formError, setFormError] = useState('');

  // Handle filter/search logic
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Modal open helpers
  const openAddModal = () => {
    setName('');
    setEmail('');
    setRole('Viewer');
    setStatus('Active');
    setFormError('');
    setIsAddOpen(true);
  };

  const openEditModal = (u: User) => {
    setSelectedUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setStatus(u.status);
    setFormError('');
    setIsEditOpen(true);
  };

  // Submit operations
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    dispatch(addUser({ name, email, role, status }));
    dispatch(addNotification({
      type: 'success',
      message: `User "${name}" has been successfully added.`
    }));
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!name || !email) {
      setFormError('Please fill in all required fields.');
      return;
    }

    // Role safety logic for Editor
    if (currentUser?.role === 'Editor' && selectedUser.role === 'Admin') {
      setFormError('Editors cannot modify Admin users.');
      return;
    }

    dispatch(updateUser({ id: selectedUser.id, name, email, role, status }));
    dispatch(addNotification({
      type: 'info',
      message: `User "${name}" details have been updated.`
    }));
    setIsEditOpen(false);
  };

  const handleDeleteClick = (id: string, userName: string) => {
    if (currentUser?.role !== 'Admin') {
      dispatch(addNotification({
        type: 'error',
        message: 'Permission Denied: Only Admins can delete users.'
      }));
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      dispatch(deleteUser(id));
      dispatch(addNotification({
        type: 'warning',
        message: `User "${userName}" has been deleted.`
      }));
    }
  };

  return (
    <div className="users-page animate-fade-in">
      <div className="page-header-row">
        <div>
          <h1>User Operations (Redux)</h1>
          <p>Create, read, update, and delete accounts inside the global Redux state.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus /> Add User
        </button>
      </div>

      {/* Filter and Search Actions Bar */}
      <div className="card filters-card">
        <div className="search-bar-inline">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </div>
        <div className="filter-dropdowns">
          <label htmlFor="role-filter">Role Filter:</label>
          <div className="select-wrapper">
            <select
              id="role-filter"
              value={roleFilter}
              onChange={(e) => dispatch(setRoleFilter(e.target.value))}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User Info</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No users found matching current filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="user-profile-cell">
                    <img src={u.avatar} alt={u.name} className="table-avatar" />
                    <span>{u.name}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${
                      u.status === 'Active' ? 'success' : 
                      u.status === 'Inactive' ? 'warning' : 'danger'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.joinedDate}</td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => openEditModal(u)}
                        aria-label="Edit user"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDeleteClick(u.id, u.name)}
                        aria-label="Delete user"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD USER MODAL --- */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Dashboard User"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddSubmit}>Save User</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {formError && <div className="auth-error-banner" style={{ margin: '0 0 16px' }}>{formError}</div>}
          
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="name-input">Full Name *</label>
            <div className="input-wrapper">
              <FiUserPlus />
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alisher Fayzullaev"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="email-input">Email Address *</label>
            <div className="input-wrapper">
              <FiMail />
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alisher@work.uz"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="role-select">Access Privilege Role</label>
            <div className="input-wrapper">
              <FiShield />
              <select id="role-select" value={role} onChange={(e) => setRole(e.target.value as any)}>
                <option value="Admin">Admin (Full Control)</option>
                <option value="Editor">Editor (Write Access)</option>
                <option value="Viewer">Viewer (Read Only)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label htmlFor="status-select">Account Status</label>
            <div className="input-wrapper">
              <FiCheckCircle />
              <select id="status-select" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* --- EDIT USER MODAL --- */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit User Profile"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>Save Changes</button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {formError && <div className="auth-error-banner" style={{ margin: '0 0 16px' }}>{formError}</div>}
          
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="edit-name">Full Name *</label>
            <div className="input-wrapper">
              <FiUserPlus />
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="edit-email">Email Address *</label>
            <div className="input-wrapper">
              <FiMail />
              <input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="edit-role">Access Privilege Role</label>
            <div className="input-wrapper">
              <FiShield />
              <select id="edit-role" value={role} onChange={(e) => setRole(e.target.value as any)}>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label htmlFor="edit-status">Account Status</label>
            <div className="input-wrapper">
              <FiCheckCircle />
              <select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
