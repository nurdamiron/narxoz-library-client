/**
 * Debug utility for testing moderator access
 * 
 * This file contains utility functions to help diagnose and fix moderator access issues
 * in the Narxoz Library application.
 */

import { userHasRole, normalizeRole, logUserRoleInfo } from './debug-role';

// Export the user role testing function for use in debugging
export const testModeratorAccess = (user) => {
  console.group('🔍 Testing Moderator Access');
  
  // Log detailed user information
  console.log('User object:', user);
  logUserRoleInfo(user);
  
  // Test role comparisons
  const requiredRoles = ['admin', 'moderator'];
  const userRole = user?.role || '';
  
  console.log('Role comparison tests:', {
    'User role': userRole,
    'User role lowercase': normalizeRole(userRole),
    'Direct equality test (admin)': userRole === 'admin',
    'Direct equality test (moderator)': userRole === 'moderator',
    'Case-insensitive test (admin)': normalizeRole(userRole) === 'admin',
    'Case-insensitive test (moderator)': normalizeRole(userRole) === 'moderator',
    'Array inclusion test': requiredRoles.includes(userRole),
    'Case-insensitive array test': requiredRoles.some(role => 
      normalizeRole(role) === normalizeRole(userRole)
    ),
    'userHasRole utility test': userHasRole(user, requiredRoles)
  });
  
  // Test sidebar menu item visibility
  const testMenuItems = [
    { text: 'Admin Panel', requireRole: ['admin', 'moderator'] },
    { text: 'Users (admin only)', requireRole: 'admin' },
    { text: 'Books (admin & moderator)', requireRole: ['admin', 'moderator'] }
  ];
  
  console.log('Menu item visibility tests:');
  testMenuItems.forEach(item => {
    console.log(`Menu item "${item.text}":`, {
      'Should be visible': userHasRole(user, item.requireRole),
      'Required role': item.requireRole,
      'User role': userRole
    });
  });
  
  console.groupEnd();
  
  return {
    userRole,
    normalizedRole: normalizeRole(userRole),
    hasModeratorAccess: normalizeRole(userRole) === 'moderator' || normalizeRole(userRole) === 'admin',
    canAccessAdminPanel: userHasRole(user, ['admin', 'moderator']),
    canAccessUserManagement: userHasRole(user, 'admin')
  };
};

// Function to test if a route is accessible to the user
export const canAccessRoute = (user, routePath) => {
  // Define route access rules
  const routeAccessMap = {
    '/admin': ['admin', 'moderator'],
    '/admin/dashboard': ['admin', 'moderator'],
    '/admin/users': ['admin'],
    '/admin/books': ['admin', 'moderator'],
    '/admin/borrows': ['admin', 'moderator'],
    '/admin/categories': ['admin', 'moderator'],
    '/admin/events': ['admin', 'moderator'],
    '/admin/reviews': ['admin', 'moderator']
  };
  
  const requiredRoles = routeAccessMap[routePath];
  if (!requiredRoles) {
    // If path is not in the map, assume it's public
    return true;
  }
  
  return userHasRole(user, requiredRoles);
};