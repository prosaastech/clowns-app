import React from 'react';
import { Navigate } from 'react-router-dom';
 import { getUserFromToken } from './authUtils';

const ProtectedRoute = ({ children }) => {
  const user = getUserFromToken();
  
  if (!user) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/" replace />;
  }

  // If the user is logged in, render the child components
  return children;
};

export default ProtectedRoute;
