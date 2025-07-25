import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>載入中...</p>
    </div>
  );
};

export default LoadingSpinner;
