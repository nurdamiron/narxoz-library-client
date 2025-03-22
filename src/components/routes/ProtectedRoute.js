// src/components/routes/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * Protected route component that checks if user is authenticated
 * @param {Object} props - Component props
 * @param {string} props.requiredRole - Role required to access the route (optional)
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page and save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a role is required, check if user has that role
  if (requiredRole && user.role !== requiredRole) {
    // User doesn't have the required role, redirect to home page
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the required role (if any), render the protected route
  return <Outlet />;
};

export default ProtectedRoute;