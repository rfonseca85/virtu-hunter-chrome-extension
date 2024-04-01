import React, { useState } from 'react';
import './Alert.css'; // You can style the alert component in Alert.css

const Alert = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleAlertClick = () => {
    handleClose();
  };

  return (
    <>
      {/* Modal-like Alert */}
      {isVisible && (
        <div className="alert-overlay">
          <div className="alert" onClick={handleAlertClick}>
            <p>Autofill Running</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Alert;
