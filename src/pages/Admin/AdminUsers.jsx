import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllUsers, useAdminUserActions } from '../../hooks/useAdmin';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/common/Button';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../../components/common/Card';
import { cn } from '../../utils';
import styles from './AdminUsers.module.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { users, loading, error, pagination, updateFilters, nextPage, prevPage } = useAllUsers();
  const { loading: actionLoading, updateUserRole, deactivateUser, activateUser } = useAdminUserActions();
  const { actions } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleUserClick = useCallback((userId) => {
    navigate(`/admin/users/${userId}`);
  }, [navigate]);

  const handleRoleChange = useCallback(async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      actions.updateUser({ id: userId, role: newRole });
      console.log('User role updated:', userId, newRole);
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  }, [updateUserRole, actions]);

  const handleDeactivateUser = useCallback(async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await deactivateUser(userId);
        actions.deactivateUser(userId);
        console.log('User deactivated:', userId);
      } catch (err) {
        console.error('Error deactivating user:', err);
      }
    }
  }, [deactivateUser, actions]);

  const handleActivateUser = useCallback(async (userId) => {
    try {
      await activateUser(userId);
      actions.activateUser(userId);
      console.log('User activated:', userId);
    } catch (err) {
      console.error('Error activating user:', err);
    }
  }, [activateUser, actions]);

  const handleBulkRoleChange = useCallback(async (role) => {
    if (selectedUsers.length === 0) {
      alert('Please select users to update their roles');
      return;
    }

    if (window.confirm(`Change role to ${role} for ${selectedUsers.length} selected users?`)) {
      try {
        const promises = selectedUsers.map(userId => updateUserRole(userId, role));
        await Promise.all(promises);
        
        selectedUsers.forEach(userId => {
          actions.updateUser({ id: userId, role });
        });
        
        setSelectedUsers([]);
        console.log('Bulk role update completed:', selectedUsers, role);
      } catch (err) {
        console.error('Error in bulk role update:', err);
      }
    }
  }, [selectedUsers, updateUserRole, actions]);

  const handleUserSelection = useCallback((userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const allUserIds = users.map(user => user.id);
    setSelectedUsers(allUserIds);
  }, [users]);

  const handleClearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  const applyFilters = useCallback(() => {
    updateFilters({
      search: searchTerm,
      priority: filterPriority,
      role: filterRole,
      status: filterStatus,
      page: 1
    });
  }, [searchTerm, filterPriority, filterRole, filterStatus, updateFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, filterPriority, filterRole, filterStatus, applyFilters]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '#dc2626';
      case 'manager': return '#2563eb';
      case 'user': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'suspended': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Users</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.adminUsers}>
      <div className={styles.adminHeader}>
        <h1>User Management</h1>
        <p>Manage all users with priority-based filtering and role assignment</p>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.controlsGrid}>
          <div className={styles.searchBar}>
            <span className="searchIcon">🔍</span>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filtersRow}>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Priority</option>
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="USER">User</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        <div className="bulk-actions">
          <Button 
            onClick={() => setSelectedUsers([])}
            variant="ghost"
            size="sm"
            disabled={selectedUsers.length === 0}
          >
            Clear Selection
          </Button>
          <Button 
            onClick={() => handleBulkAction('activate')}
            variant="success"
            size="sm"
            disabled={selectedUsers.length === 0 || actionLoading}
          >
            Activate Selected
          </Button>
          <Button 
            onClick={() => handleBulkAction('deactivate')}
            variant="warning"
            size="sm"
            disabled={selectedUsers.length === 0 || actionLoading}
          >
            Deactivate Selected
          </Button>
        </div>
      </div>

      <div className="users-grid">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-header">
                <div className="user-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelection(user.id)}
                  />
                </div>
                <div className="user-avatar">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="user-badges">
                  <span 
                    className="user-role"
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  >
                    {user.role}
                  </span>
                  <span 
                    className="user-priority"
                    style={{ backgroundColor: getPriorityColor(user.priority) }}
                  >
                    {user.priority || 'MEDIUM'}
                  </span>
                  <span 
                    className="user-status"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  >
                    {user.status || 'ACTIVE'}
                  </span>
                </div>
              </div>
              
              <div className="user-details">
                <div className="detail-item">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">{formatDate(user.created_at)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Login:</span>
                  <span className="detail-value">{formatDate(user.last_login)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Projects:</span>
                  <span className="detail-value">{user.project_count || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tasks:</span>
                  <span className="detail-value">{user.task_count || 0}</span>
                </div>
              </div>
              
              <div className="user-actions">
                <button
                  onClick={() => handleUserClick(user.id)}
                  className="view-btn"
                  title="View user details"
                >
                  👁️ View
                </button>
                <select
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="role-select"
                  disabled={actionLoading[user.id]}
                  value={user.role}
                >
                  <option value="USER">User</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {user.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleDeactivateUser(user.id)}
                    className="deactivate-btn"
                    disabled={actionLoading[user.id]}
                    title="Deactivate user"
                  >
                    {actionLoading[user.id] ? 'Deactivating...' : '🔒 Deactivate'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivateUser(user.id)}
                    className="activate-btn"
                    disabled={actionLoading[user.id]}
                    title="Activate user"
                  >
                    {actionLoading[user.id] ? 'Activating...' : '🔓 Activate'}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-users">
            <div className="empty-icon">👥</div>
            <h3>No Users Found</h3>
            <p>
              {searchTerm 
                ? 'No users match your search criteria.' 
                : 'No users are available in the system.'
              }
            </p>
          </div>
        )}
      </div>

      {pagination.total > pagination.limit && (
        <div className="pagination">
          <button 
            onClick={prevPage}
            className="pagination-btn"
            disabled={pagination.page <= 1}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button 
            onClick={nextPage}
            className="pagination-btn"
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          >
            Next →
          </button>
        </div>
      )}

      <div className="users-summary">
        <div className="summary-item">
          <span className="summary-label">Total Users:</span>
          <span className="summary-value">{pagination.total}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Filtered Results:</span>
          <span className="summary-value">{users.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Selected:</span>
          <span className="summary-value">{selectedUsers.length}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;