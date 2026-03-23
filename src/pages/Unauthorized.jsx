import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/common/Card';
import { cn } from '../utils';
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
      <Card variant="error" shadow="lg" className="unauthorized-content">
        <CardBody className="unauthorized-body">
          <div className="unauthorized-icon">🚫</div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You don't have permission to access this page.</CardDescription>
          <p className="unauthorized-message">
            Please contact your administrator if you believe this is an error.
          </p>
          <div className="unauthorized-actions">
            <Button onClick={handleGoBack} variant="ghost" size="md" className="back-btn">
              ← Go Back
            </Button>
            <Button onClick={handleGoHome} variant="primary" size="md" className="home-btn">
              🏠 Login
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Unauthorized;
