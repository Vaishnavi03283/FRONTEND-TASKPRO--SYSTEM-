import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsers } from "../../api/user.api";
import { addMembers } from "../../api/project.api";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "../../components/common/Card";
import { cn } from "../../utils";
import "./AssignMembers.css";

const AssignMembers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Fetching users for member assignment...');
      const response = await getUsers();
      console.log('📡 Users API Response:', response);
      
      const usersData = response.data || response || [];
      const formattedUsers = Array.isArray(usersData) ? usersData.map(user => ({
        id: user.user_id || user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'USER'
      })) : [];
      
      setUsers(formattedUsers);
      console.log('✅ Users loaded:', formattedUsers.length);
      
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle user selection
  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Add members to project
  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user to add as member.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      console.log('🚀 Adding members to project:', { projectId: id, userIds: selectedUsers });
      
      const response = await addMembers(id, { userIds: selectedUsers });
      console.log('✅ Members added successfully:', response);
      
      setSuccess(true);
      setSelectedUsers([]);
      
      // Navigate back to project details after 2 seconds
      setTimeout(() => {
        navigate(`/projects/${id}`, { 
          state: { 
            message: `${selectedUsers.length} member(s) added successfully!`,
            timestamp: Date.now()
          }
        });
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error adding members:', err);
      setError(err.response?.data?.message || 'Failed to add members. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="assign-members-container">
      <Card variant="default" shadow="md" className="assign-members-header">
        <CardBody className="assign-members-header-body">
          <Button 
            variant="ghost" 
            size="sm"
            className="back-arrow" 
            onClick={handleCancel}
            title="Back to Project"
          >
            ←
          </Button>
          <CardTitle className="page-title">Assign Members to Project</CardTitle>
        </CardBody>
      </Card>

      <Card variant="primary" shadow="lg" className="assign-members-content">
        <CardBody className="assign-members-body">
          {success && (
            <div className={cn("success-message", styles.successAlert)}>
              <div className="success-icon">✓</div>
              <p>Members added successfully! Redirecting...</p>
          </div>
          )}

        {error && (
          <div className={cn("error-message", styles.errorAlert)}>
            <div className="error-icon">⚠</div>
            <p>{error}</p>
            <Button onClick={() => setError(null)} variant="ghost" size="sm" className="close-btn">×</Button>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Selected Users Summary */}
        {selectedUsers.length > 0 && (
          <div className="selected-summary">
            <span className="selected-count">
              {selectedUsers.length} user(s) selected
            </span>
            <button 
              onClick={() => setSelectedUsers([])}
              className="clear-selection"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Users List */}
        <div className="users-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No users found</h3>
              <p>
                {searchTerm ? 'No users match your search criteria.' : 'No users available.'}
              </p>
            </div>
          ) : (
            <div className="users-grid">
              {filteredUsers.map(user => (
                <div 
                  key={user.id}
                  className={`user-card ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => handleUserToggle(user.id)}
                >
                  <div className="user-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                    />
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                    <div className="user-role">{user.role}</div>
                  </div>
                  <div className="selection-indicator">
                    {selectedUsers.includes(user.id) && <span>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Button 
            onClick={handleCancel}
            variant="secondary"
            size="md"
            disabled={submitting}
            className="cancel-btn"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddMembers}
            variant="primary"
            size="lg"
            disabled={submitting || selectedUsers.length === 0}
            loading={submitting}
            className="add-members-btn"
          >
            {submitting ? 'Adding Members...' : `Add ${selectedUsers.length} Member${selectedUsers.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </CardBody>
    </Card>
  </div>
);
};

export default AssignMembers;
