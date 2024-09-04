import React from 'react';
import { Circles } from 'react-loader-spinner';

const Loader = ({ isLoading }) => {
  if (!isLoading) return null; // Don't render if not loading

  return (
    <div style={styles.overlay}>
      <Circles
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="loading"
      />
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
};

export default Loader;
