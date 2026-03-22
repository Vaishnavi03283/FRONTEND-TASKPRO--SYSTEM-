import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/login');
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">🚫</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p className="unauthorized-message">
          Please contact your administrator if you believe this is an error.
        </p>
        <div className="unauthorized-actions">
          <button onClick={handleGoBack} className="back-btn">
            ← Go Back
          </button>
          <button onClick={handleGoHome} className="home-btn">
            🏠 Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
