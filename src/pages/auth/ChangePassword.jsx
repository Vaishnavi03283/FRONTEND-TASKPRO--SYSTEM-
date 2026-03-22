import React, { useState } from 'react';
import { changePassword } from '../../api/auth.api';
import styles from './ChangePassword.module.css';

const ChangePassword = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending password change request:', {
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      const response = await changePassword({
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      console.log('Password change response:', response);
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setMessage('Password changed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Password change error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response data message:', error.response?.data?.message);
      console.error('Error response data error:', error.response?.data?.error);
      
      // Extract more detailed error message
      let errorMessage = 'Failed to change password';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors) {
        // Handle validation errors array
        if (Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.join(', ');
        } else {
          errorMessage = JSON.stringify(error.response.data.errors);
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your current password and try again.';
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.changePassword}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Change Password</h1>
          <p>Update your account password</p>
        </div>

        {message && (
          <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
            <p>{message}</p>
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handleInputChange}
              required
              placeholder="Enter your current password"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handleInputChange}
              required
              placeholder="Enter your new password"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your new password"
            />
          </div>

          <div className={styles.passwordRequirements}>
            <p>Password must:</p>
            <ul>
              <li>Be at least 6 characters long</li>
              <li>Include both letters and numbers</li>
              <li>Not be the same as your current password</li>
            </ul>
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
