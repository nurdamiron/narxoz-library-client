import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Divider, Chip, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { runLoginDiagnostic, printDiagnosticReport } from '../../utils/loginDiagnostic';
import { testModeratorAccess } from '../../debug-moderator-access';

/**
 * Role Diagnostic Component
 * 
 * This component helps diagnose and debug role-based access issues in the application.
 * It displays detailed information about the current user's roles and permissions.
 * 
 * Use this component during development or troubleshooting access issues.
 */
const RoleDiagnostic = () => {
  const { user, isAuthenticated } = useAuth();
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [moderatorAccessData, setModeratorAccessData] = useState(null);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      const diagnostic = runLoginDiagnostic(user);
      setDiagnosticData(diagnostic);
      
      const moderatorAccess = testModeratorAccess(user);
      setModeratorAccessData(moderatorAccess);
      
      // Print the diagnostic report to console
      printDiagnosticReport(diagnostic);
    }
  }, [isAuthenticated, user]);
  
  const runDiagnostics = () => {
    if (isAuthenticated && user) {
      const diagnostic = runLoginDiagnostic(user);
      setDiagnosticData(diagnostic);
      printDiagnosticReport(diagnostic);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h5" gutterBottom>Role Diagnostic</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography color="error">
          You must be logged in to use the role diagnostic tool.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Role Diagnostic Tool</Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        This tool helps diagnose role-based access issues in the application
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>User Information</Typography>
      <Box sx={{ mb: 3 }}>
        <Typography><strong>Name:</strong> {user.firstName} {user.lastName}</Typography>
        <Typography><strong>Role:</strong> {user.role}</Typography>
        <Typography><strong>Normalized Role:</strong> {user.role?.toLowerCase()}</Typography>
        <Typography><strong>Email:</strong> {user.email}</Typography>
      </Box>
      
      <Typography variant="h6" gutterBottom>Role Access</Typography>
      {moderatorAccessData && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={`Has Moderator Access: ${moderatorAccessData.hasModeratorAccess ? 'Yes' : 'No'}`} 
            color={moderatorAccessData.hasModeratorAccess ? 'success' : 'error'}
          />
          <Chip 
            label={`Can Access Admin Panel: ${moderatorAccessData.canAccessAdminPanel ? 'Yes' : 'No'}`} 
            color={moderatorAccessData.canAccessAdminPanel ? 'success' : 'error'}
          />
          <Chip 
            label={`Can Access User Management: ${moderatorAccessData.canAccessUserManagement ? 'Yes' : 'No'}`} 
            color={moderatorAccessData.canAccessUserManagement ? 'success' : 'error'}
          />
        </Box>
      )}
      
      {diagnosticData && (
        <>
          <Typography variant="h6" gutterBottom>Route Access</Typography>
          <List dense>
            {Object.entries(diagnosticData.routeAccess).map(([route, hasAccess]) => (
              <ListItem key={route} divider>
                <ListItemText primary={route} />
                <Chip 
                  label={hasAccess ? 'Allowed' : 'Denied'} 
                  color={hasAccess ? 'success' : 'error'} 
                  size="small"
                />
              </ListItem>
            ))}
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Potential Issues</Typography>
          {Object.values(diagnosticData.potentialIssues).some(issue => issue) ? (
            <List dense>
              {diagnosticData.potentialIssues.roleCapitalizationIssue && (
                <ListItem divider>
                  <ListItemText 
                    primary="Role Capitalization Issue" 
                    secondary="The role value contains mixed case characters which may cause case-sensitive comparison issues."
                  />
                  <Chip label="Issue" color="error" size="small" />
                </ListItem>
              )}
              {diagnosticData.potentialIssues.missingRole && (
                <ListItem divider>
                  <ListItemText 
                    primary="Missing Role" 
                    secondary="The user does not have a role assigned."
                  />
                  <Chip label="Issue" color="error" size="small" />
                </ListItem>
              )}
              {diagnosticData.potentialIssues.roleFormatIssue && (
                <ListItem divider>
                  <ListItemText 
                    primary="Role Format Issue" 
                    secondary="The role is not stored as a string value."
                  />
                  <Chip label="Issue" color="error" size="small" />
                </ListItem>
              )}
            </List>
          ) : (
            <Typography color="success.main">
              No issues detected with user role or permissions
            </Typography>
          )}
        </>
      )}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={runDiagnostics}
        >
          Run Diagnostics Again
        </Button>
      </Box>
    </Paper>
  );
};

export default RoleDiagnostic;