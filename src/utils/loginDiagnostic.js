/**
 * Login Diagnostic Utility
 * 
 * This utility helps diagnose login and access-related issues
 * by providing comprehensive information about the logged-in user
 * and their permissions within the system.
 */

import { userHasRole, normalizeRole } from '../debug-role';
import { canAccessRoute } from '../debug-moderator-access';

// List of admin routes to test
const adminRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/admin/books',
  '/admin/borrows',
  '/admin/categories',
  '/admin/events',
  '/admin/reviews'
];

/**
 * Function to run diagnostics on the current user login status
 * 
 * @param {Object} user - The user object from AuthContext
 * @returns {Object} - Diagnostic information
 */
export const runLoginDiagnostic = (user) => {
  console.group('📊 Login Diagnostic Report');
  
  // Basic user information
  const userInfo = {
    isLoggedIn: !!user,
    userId: user?.id,
    username: user?.username,
    name: user ? `${user.firstName} ${user.lastName}` : null,
    originalRole: user?.role,
    normalizedRole: normalizeRole(user?.role),
    email: user?.email
  };
  
  console.log('User Information:', userInfo);
  
  // Role-based access checks
  const roleChecks = {
    isAdmin: userHasRole(user, 'admin'),
    isModerator: userHasRole(user, 'moderator'),
    isStudent: userHasRole(user, 'student'),
    isLibrarian: userHasRole(user, 'librarian'),
    hasAdminAccess: userHasRole(user, ['admin', 'moderator']),
    hasUserManagementAccess: userHasRole(user, 'admin')
  };
  
  console.log('Role Checks:', roleChecks);
  
  // Route access checks
  const routeAccess = {};
  adminRoutes.forEach(route => {
    routeAccess[route] = canAccessRoute(user, route);
  });
  
  console.log('Route Access:', routeAccess);
  
  // Check for potential role capitalization issues
  const roleCapitalizationIssue = user && 
    user.role && 
    user.role !== user.role.toLowerCase() && 
    user.role !== user.role.toUpperCase();
    
  console.log('Potential Issues:', {
    roleCapitalizationIssue,
    missingRole: user && !user.role,
    roleFormatIssue: user && user.role && typeof user.role !== 'string'
  });
  
  console.groupEnd();
  
  return {
    userInfo,
    roleChecks,
    routeAccess,
    potentialIssues: {
      roleCapitalizationIssue,
      missingRole: user && !user.role,
      roleFormatIssue: user && user.role && typeof user.role !== 'string'
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Function to log the diagnostic information in a readable format
 * for troubleshooting
 * 
 * @param {Object} diagnosticData - The data returned by runLoginDiagnostic
 */
export const printDiagnosticReport = (diagnosticData) => {
  const { userInfo, roleChecks, routeAccess, potentialIssues } = diagnosticData;
  
  console.group('===== LOGIN DIAGNOSTIC REPORT =====');
  console.log(`Timestamp: ${new Date().toLocaleString()}`);
  console.log('');
  
  console.log('USER INFORMATION:');
  console.log(`- Logged In: ${userInfo.isLoggedIn ? 'Yes' : 'No'}`);
  if (userInfo.isLoggedIn) {
    console.log(`- User ID: ${userInfo.userId}`);
    console.log(`- Name: ${userInfo.name}`);
    console.log(`- Original Role: ${userInfo.originalRole}`);
    console.log(`- Normalized Role: ${userInfo.normalizedRole}`);
    console.log(`- Email: ${userInfo.email}`);
  }
  console.log('');
  
  console.log('ROLE CHECKS:');
  console.log(`- Is Admin: ${roleChecks.isAdmin ? 'Yes' : 'No'}`);
  console.log(`- Is Moderator: ${roleChecks.isModerator ? 'Yes' : 'No'}`);
  console.log(`- Has Admin Access: ${roleChecks.hasAdminAccess ? 'Yes' : 'No'}`);
  console.log(`- Has User Management Access: ${roleChecks.hasUserManagementAccess ? 'Yes' : 'No'}`);
  console.log('');
  
  console.log('ADMIN ROUTE ACCESS:');
  Object.entries(routeAccess).forEach(([route, hasAccess]) => {
    console.log(`- ${route}: ${hasAccess ? 'Allowed' : 'Denied'}`);
  });
  console.log('');
  
  console.log('POTENTIAL ISSUES:');
  const hasIssues = Object.values(potentialIssues).some(issue => issue);
  if (hasIssues) {
    console.log(`- Role Capitalization Issue: ${potentialIssues.roleCapitalizationIssue ? 'Yes' : 'No'}`);
    console.log(`- Missing Role: ${potentialIssues.missingRole ? 'Yes' : 'No'}`);
    console.log(`- Role Format Issue: ${potentialIssues.roleFormatIssue ? 'Yes' : 'No'}`);
    
    console.log('');
    console.log('RECOMMENDATIONS:');
    
    if (potentialIssues.roleCapitalizationIssue) {
      console.log('- Fix role capitalization in the database to use a consistent format (e.g., all lowercase)');
    }
    
    if (potentialIssues.missingRole) {
      console.log('- Ensure that the user has a role assigned in the database');
    }
    
    if (potentialIssues.roleFormatIssue) {
      console.log('- Check that the role value is stored as a string in the database');
    }
  } else {
    console.log('No issues detected with user role or permissions');
  }
  
  console.groupEnd();
};