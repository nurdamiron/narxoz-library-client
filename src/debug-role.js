/**
 * Debug utility for role-based access issues
 * 
 * This file contains utility functions to help diagnose and fix role-based access issues
 * in the Narxoz Library application.
 */

// Function to check if a user has a role that matches any of the required roles
export const userHasRole = (user, requiredRoles) => {
  if (!user || !user.role) {
    console.log('User or user.role is null/undefined:', { user });
    return false;
  }

  if (!requiredRoles) {
    console.log('No required roles specified');
    return true; // No role requirements
  }

  const userRoleLowercase = user.role.toLowerCase();
  
  // Case-insensitive comparison
  if (Array.isArray(requiredRoles)) {
    const result = requiredRoles.some(role => 
      typeof role === 'string' && role.toLowerCase() === userRoleLowercase
    );
    
    console.log('Role check (array):', {
      userRole: user.role,
      userRoleLowercase,
      requiredRoles,
      requiredRolesLowercase: requiredRoles.map(r => typeof r === 'string' ? r.toLowerCase() : r),
      result
    });
    
    return result;
  } else if (typeof requiredRoles === 'string') {
    const result = requiredRoles.toLowerCase() === userRoleLowercase;
    
    console.log('Role check (string):', {
      userRole: user.role,
      userRoleLowercase,
      requiredRole: requiredRoles,
      requiredRoleLowercase: requiredRoles.toLowerCase(),
      result
    });
    
    return result;
  }
  
  console.log('Invalid requiredRoles format:', { requiredRoles });
  return false;
};

// Function to normalize role value (converts to lowercase)
export const normalizeRole = (role) => {
  if (typeof role !== 'string') {
    console.warn('Role is not a string:', role);
    return '';
  }
  return role.toLowerCase();
};

// Function to check if the user is a moderator
export const isModerator = (user) => {
  if (!user) {
    console.error('isModerator check failed: user object is null or undefined');
    return false;
  }
  
  if (!user.role) {
    console.error('isModerator check failed: user.role is null or undefined', user);
    return false;
  }
  
  if (typeof user.role !== 'string') {
    console.error('isModerator check failed: user.role is not a string', typeof user.role);
    return false;
  }
  
  const normalizedRole = user.role.toLowerCase();
  const result = normalizedRole === 'moderator';
  
  // Расширенное логирование для обнаружения проблем с регистром
  if (result) {
    // Если это модератор, проверим регистр
    if (user.role !== 'moderator') {
      console.warn('%c⚠️ Обнаружен модератор с неправильным регистром роли!', 'background: #ff9800; color: white; padding: 2px 6px; border-radius: 4px;');
      console.warn('Текущая роль:', user.role);
      console.warn('Требуемая роль (нижний регистр):', 'moderator');
    } else {
      console.log('%c✅ Проверка модератора успешна: роль в правильном регистре', 'color: #4caf50;');
    }
  }
  
  console.log('Moderator check:', {
    userId: user.id,
    userName: user.firstName ? `${user.firstName} ${user.lastName}` : user.username,
    userRole: user.role,
    normalizedRole,
    result
  });
  
  return result;
};

// Function to log user role information
export const logUserRoleInfo = (user) => {
  console.log('User role information:', {
    user,
    hasRole: !!user?.role,
    role: user?.role,
    roleLowercase: user?.role?.toLowerCase(),
    isAdmin: user?.role?.toLowerCase() === 'admin',
    isModerator: user?.role?.toLowerCase() === 'moderator',
    isTeacher: user?.role?.toLowerCase() === 'teacher'
  });
};