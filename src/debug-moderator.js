// Add this code to the main application entry point (index.js) or context/AuthContext.js to debug moderator authorization issues

// Debug function to be called when the application starts
export function debugModeratorRole() {
  console.log('🔍 DEBUG - Moderator role debugging started');
  // 1. Check stored credentials
  const email = sessionStorage.getItem('email') || localStorage.getItem('email');
  const password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
  
  console.log('🔍 DEBUG - Stored credentials:', { 
    email,
    passwordExists: !!password,
    storageLocation: sessionStorage.getItem('email') ? 'sessionStorage' : (localStorage.getItem('email') ? 'localStorage' : 'none')
  });
  
  // 2. Manually check if the admin panel should be visible based on stored user data
  // Add this to see what the Sidebar component will check
  const userDataString = localStorage.getItem('userData');
  let userData = null;
  
  try {
    if (userDataString) {
      userData = JSON.parse(userDataString);
      console.log('🔍 DEBUG - Stored user data:', {
        role: userData?.role,
        isModerator: userData?.role === 'moderator',
        isAdmin: userData?.role === 'admin',
        lastLogin: userData?.lastLogin,
      });
    } else {
      console.log('🚫 DEBUG - No stored user data found in localStorage');
    }
  } catch (error) {
    console.error('🚫 DEBUG - Error parsing stored user data:', error);
  }
  
  // 3. Add this to the start of login function to debug authentication issues
  console.log('🔍 DEBUG - Login response received, checking for moderator role...');
  
  // 4. Add this to Sidebar.jsx main menu items code to debug role checking
  console.log('🔍 DEBUG - Sidebar checking admin panel visibility:', {
    isAuthenticated: true, // This will be replaced with actual value in the component
    userRole: userData?.role,
    shouldShowAdminPanel: userData?.role === 'admin' || userData?.role === 'moderator'
  });
  
  // 5. Add debugging to the requireRole check in Sidebar
  const shouldShow = (requireRole, user) => {
    if (!requireRole) return true;
    const result = Array.isArray(requireRole) 
      ? requireRole.includes(user?.role) 
      : user?.role === requireRole;
    
    console.log('🔍 DEBUG - Role check result:', {
      requiredRole: requireRole,
      userRole: user?.role,
      result
    });
    
    return result;
  };
  
  // Example check for the admin panel
  if (userData) {
    const adminPanelVisible = shouldShow(['admin', 'moderator'], userData);
    console.log('🔍 DEBUG - Should admin panel be visible?', adminPanelVisible);
  }

  // Additional checks
  window.checkModeratorAccess = () => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    const role = user.role;
    
    console.log(`
      ===== MODERATOR ACCESS DEBUG =====
      Current user role: ${role || 'Not logged in'}
      Is admin: ${role === 'admin'}
      Is moderator: ${role === 'moderator'}
      Admin panel should be visible: ${role === 'admin' || role === 'moderator'}
      ================================
    `);
  };
  
  // Suggest to run the debug function in the console
  console.log('📋 You can run window.checkModeratorAccess() in the console to check moderator access');
}

// Export function to be used in various places
export function logUserCredentials() {
  const email = sessionStorage.getItem('email') || localStorage.getItem('email');
  const password = sessionStorage.getItem('userPassword') || localStorage.getItem('userPassword');
  
  console.log('👤 Current user credentials:', {
    email,
    hasPassword: !!password
  });
  
  return { email, hasPassword: !!password };
}