import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/login');
  };

  return (
    <div className={styles.unauthorizedContainer}>
      <div className={styles.unauthorizedContent}>
        <div className={styles.unauthorizedIcon}>🚫</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p className={styles.unauthorizedMessage}>
          Please contact your administrator if you believe this is an error.
        </p>
        <div className={styles.unauthorizedActions}>
          <button onClick={handleGoBack} className={styles.backBtn}>
            ← Go Back
          </button>
          <button onClick={handleGoHome} className={styles.homeBtn}>
            🏠 Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
