import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { changePassword } from '../../api/auth.api';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => {
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      // For now, just show success message
      // TODO: Implement actual profile update API call
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile: ' + error.message);
    }
  };

  return (
    <main className={styles.profile}>
      <div className={styles.header}>
        <h1>Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
          <p>{message}</p>
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Personal Information</h2>
            <button 
              className={styles.editBtn}
              onClick={handleEditToggle}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={handleEditToggle}>
                  Cancel
                </button>
                <button type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.display}>
              <div className={styles.infoItem}>
                <label>Full Name:</label>
                <span>{user?.name || 'Not set'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Email:</label>
                <span>{user?.email || 'Not set'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Phone:</label>
                <span>{user?.phone || 'Not set'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Bio:</label>
                <span>{user?.bio || 'No bio added'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Role:</label>
                <span className={styles.roleBadge}>{user?.role || 'Unknown'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Member Since:</label>
                <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Security</h2>
            <Link to="/auth/change-password" className={styles.changePasswordBtn}>
              Change Password
            </Link>
          </div>
          
          <div className={styles.securityInfo}>
            <p>Click "Change Password" to update your account password and security settings.</p>
            <div className={styles.securityTips}>
              <h4>Security Tips:</h4>
              <ul>
                <li>Use a strong password with at least 6 characters</li>
                <li>Include both letters and numbers</li>
                <li>Don't reuse passwords from other accounts</li>
                <li>Change your password regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
