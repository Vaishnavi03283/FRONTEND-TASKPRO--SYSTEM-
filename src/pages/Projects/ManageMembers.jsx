import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMembers, removeMember } from "../../api/project.api";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "../../components/common/Card";
import { cn } from "../../utils";
import "./ManageMembers.css";

const ManageMembers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [removingUserId, setRemovingUserId] = useState(null);

  // Fetch project members
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Fetching project members...');
      const response = await getMembers(id);
      console.log('📡 Members API Response:', response);
      
      const membersData = response.data || response || [];
      const formattedMembers = Array.isArray(membersData) ? membersData.map(member => ({
        id: member.user_id || member.id,
        name: member.name,
        email: member.email,
        role: member.role || 'USER',
        joinedAt: member.created_at || member.joinedAt
      })) : [];
      
      setMembers(formattedMembers);
      console.log('✅ Members loaded:', formattedMembers.length);
      
    } catch (err) {
      console.error('❌ Error fetching members:', err);
      setError('Failed to load project members. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Remove member from project
  const handleRemoveMember = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove ${userName} from this project?`)) {
      return;
    }

    try {
      setRemovingUserId(userId);
      setError(null);
      
      console.log('🚀 Removing member:', { projectId: id, userId });
      
      await removeMember(id, userId);
      console.log('✅ Member removed successfully');
      
      // Update local state
      setMembers(prev => prev.filter(member => member.id !== userId));
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('❌ Error removing member:', err);
      setError(err.response?.data?.message || 'Failed to remove member. Please try again.');
    } finally {
      setRemovingUserId(null);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(`/projects/${id}`);
  };

  // Navigate to assign members
  const handleAssignMembers = () => {
    navigate(`/projects/${id}/assign-members`);
  };

  return (
    <div className="manage-members-container">
      <Card variant="default" shadow="md" className="manage-members-header">
        <CardBody className="manage-members-header-body">
          <Button 
            variant="ghost" 
            size="sm"
            className="back-arrow" 
            onClick={handleBack}
            title="Back to Project"
          >
            ←
          </Button>
          <CardTitle className="page-title">Manage Project Members</CardTitle>
          <Button 
            variant="primary"
            size="md"
            className="assign-btn"
            onClick={handleAssignMembers}
          >
            + Assign Members
          </Button>
        </CardBody>
      </Card>

      <Card variant="default" shadow="lg" className="manage-members-content">
        <CardBody className="manage-members-body">
          {success && (
            <div className={cn("success-message", styles.successAlert)}>
              <div className="success-icon">✓</div>
              <p>Member removed successfully!</p>
            </div>
          )}

          {error && (
            <div className={cn("error-message", styles.errorAlert)}>
              <div className="error-icon">⚠</div>
              <p>{error}</p>
              <Button onClick={() => setError(null)} variant="ghost" size="sm" className="close-btn">×</Button>
            </div>
          )}

        {/* Members Summary */}
        <div className="members-summary">
          <div className="summary-card">
            <div className="summary-number">{members.length}</div>
            <div className="summary-label">Total Members</div>
          </div>
        </div>

        {/* Members List */}
        <div className="members-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Members Found</h3>
              <p>This project doesn't have any members yet.</p>
              <button 
                onClick={handleAssignMembers}
                className="assign-first-btn"
              >
                + Assign First Member
              </button>
            </div>
          ) : (
            <div className="members-table">
              <div className="table-header">
                <div className="header-cell">Member Name</div>
                <div className="header-cell">Email</div>
                <div className="header-cell">Role</div>
                <div className="header-cell">Joined Date</div>
                <div className="header-cell">Actions</div>
              </div>
              
              {members.map(member => (
                <div key={member.id} className="member-row">
                  <div className="member-cell name-cell">
                    <div className="member-avatar">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-name">{member.name}</div>
                  </div>
                  
                  <div className="member-cell email-cell">
                    {member.email}
                  </div>
                  
                  <div className="member-cell role-cell">
                    <span className={`role-badge ${member.role.toLowerCase()}`}>
                      {member.role}
                    </span>
                  </div>
                  
                  <div className="member-cell date-cell">
                    {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
                  </div>
                  
                  <div className="member-cell actions-cell">
                    <Button 
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      variant="danger"
                      size="sm"
                      disabled={removingUserId === member.id}
                      loading={removingUserId === member.id}
                      className="remove-btn"
                      title="Remove member"
                    >
                      {removingUserId === member.id ? 'Removing...' : '🗑️ Remove'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Button 
            onClick={handleBack}
            variant="secondary"
            size="md"
            className="back-btn"
          >
            Back to Project
          </Button>
        </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ManageMembers;
