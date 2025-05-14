/**
 * Special diagnostic utility for moderator login issues
 * 
 * This file is specifically designed to help diagnose and fix moderator login issues
 */

// Function to check if moderator role is recognized
export const checkModeratorAccess = () => {
  console.group('%c🔎 MODERATOR ACCESS DIAGNOSTIC', 'background: #ff5722; color: white; padding: 2px 6px; border-radius: 4px;');
  
  try {
    // Check localStorage and sessionStorage
    const sessionEmail = sessionStorage.getItem('email');
    const sessionPassword = sessionStorage.getItem('userPassword');
    const localEmail = localStorage.getItem('email');
    const localPassword = localStorage.getItem('userPassword');
    const storedUserData = localStorage.getItem('userData');
    
    console.log('Storage credentials check:', {
      sessionStorage: {
        hasEmail: !!sessionEmail,
        hasPassword: !!sessionPassword
      },
      localStorage: {
        hasEmail: !!localEmail,
        hasPassword: !!localPassword,
        hasUserData: !!storedUserData
      }
    });
    
    // Check stored user data
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        
        console.log('Stored user data:', {
          id: userData.id,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          originalRole: userData.role,
          lowerCaseRole: userData.role ? userData.role.toLowerCase() : null,
          isModerator: userData.role ? userData.role.toLowerCase() === 'moderator' : false,
          isAdmin: userData.role ? userData.role.toLowerCase() === 'admin' : false
        });
        
        // Check role capitalization
        if (userData.role && userData.role !== userData.role.toLowerCase()) {
          console.warn('⚠️ ROLE CAPITALIZATION ISSUE DETECTED!', {
            role: userData.role,
            normalizedRole: userData.role.toLowerCase(),
            shouldBeLowercase: true
          });
        }
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
      }
    } else {
      console.warn('No userData found in localStorage');
    }
    
    // Check if the code for userHasRole is loaded
    const isDebugRoleLoaded = typeof window.userHasRole === 'function';
    console.log('Debug utilities loaded:', {
      userHasRole: isDebugRoleLoaded
    });
    
    // Check menu visibility for moderator
    console.log('Menu visibility conditions:', {
      adminMenuItem: {
        path: '/admin',
        requireRole: ['admin', 'moderator'],
        shouldBeVisible: true
      }
    });
    
    console.log('TROUBLESHOOTING INSTRUCTIONS:');
    console.log('1. Logout and log back in with the moderator account');
    console.log('2. After logging in, check the browser console for the "Login response received" message');
    console.log('3. Check if the normalizedRole is "moderator" (lowercase)');
    console.log('4. Navigate to /debug/role to run the diagnostic tool');
    
  } catch (error) {
    console.error('Error in moderator diagnostic:', error);
  }
  
  console.groupEnd();
};

// Function to inject diagnostic code into the page
export const injectDiagnosticButton = () => {
  // Only inject if not already present
  if (document.getElementById('moderator-diagnostic-button')) {
    return;
  }
  
  const button = document.createElement('button');
  button.id = 'moderator-diagnostic-button';
  button.innerHTML = '🔍 Диагностика модератора';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  button.style.padding = '8px 12px';
  button.style.backgroundColor = '#3f51b5';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  button.style.cursor = 'pointer';
  
  button.addEventListener('click', () => {
    checkModeratorAccess();
  });
  
  document.body.appendChild(button);
  
  // Also expose the function globally for console access
  window.checkModeratorAccess = checkModeratorAccess;
  
  console.log('%c🔍 Moderator diagnostic tools installed', 'background: #3f51b5; color: white; padding: 2px 6px; border-radius: 4px;');
  console.log('Run window.checkModeratorAccess() in console to diagnose moderator access issues');
};

// Auto-run the diagnostic on page load for moderator users
const autoRunDiagnostic = () => {
  setTimeout(() => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.role && user.role.toLowerCase() === 'moderator') {
          console.log('%c👨‍💼 Moderator user detected, running diagnostic...', 'background: #ff9800; color: white; padding: 2px 6px; border-radius: 4px;');
          checkModeratorAccess();
          injectDiagnosticButton();
        }
      }
    } catch (error) {
      console.error('Error in auto diagnostic:', error);
    }
  }, 2000); // Wait 2 seconds for app to initialize
};

// Run the auto-diagnostic
autoRunDiagnostic();