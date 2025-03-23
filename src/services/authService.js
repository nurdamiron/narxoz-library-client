// src/services/authService.js
import apiClient from './api';

const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} Promise object with user data and token
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  /**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise object with user data and token
 * @throws {Error} Error with message from API response
 */
register: async (userData) => {
  try {
    // Make sure we're sending the data in the exact format the backend expects
    const registrationData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      faculty: userData.faculty,
      specialization: userData.specialization,
      studentId: userData.studentId,
      year: userData.year
    };
    
    // Log the data being sent for debugging purposes
    console.log('Sending registration data:', registrationData);
    
    const response = await apiClient.post('/auth/register', registrationData);
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error('Registration error:', error);
    
    // Handle specific API error responses
    if (error.response && error.response.data) {
      // Extract the error message from the API response
      const errorData = error.response.data;
      
      // If the API returns a structured error object
      if (errorData.error) {
        throw new Error(errorData.error);
      } else {
        throw new Error('Тіркелу кезінде қате орын алды. Әрекетті қайталап көріңіз.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Сервер жауап бермеді. Интернет байланысыңызды тексеріңіз.');
    } else {
      // Something happened in setting up the request
      throw new Error('Тіркелу сұранысын жіберу кезінде қате орын алды.');
    }
  }
},

  /**
   * Logout current user
   * @returns {Promise} Promise object
   */
  logout: async () => {
    try {
      await apiClient.get('/auth/logout');
    } finally {
      // Always clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user data
   * @returns {Promise} Promise object with user data
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Update user details
   * @param {Object} userData - User data to update
   * @returns {Promise} Promise object with updated user data
   */
  updateUserDetails: async (userData) => {
    const response = await apiClient.put('/auth/updatedetails', userData);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise} Promise object
   */
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/auth/updatepassword', passwordData);
    return response.data;
  },

  /**
   * Request password reset
   * @param {Object} data - Request data
   * @param {string} data.email - User email
   * @returns {Promise} Promise object
   */
  forgotPassword: async (data) => {
    const response = await apiClient.post('/auth/forgotpassword', data);
    return response.data;
  },

  /**
   * Reset password with token
   * @param {string} resetToken - Reset token from email
   * @param {Object} data - Password data
   * @param {string} data.password - New password
   * @returns {Promise} Promise object
   */
  resetPassword: async (resetToken, data) => {
    const response = await apiClient.put(`/auth/resetpassword/${resetToken}`, data);
    return response.data;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get current user from local storage
   * @returns {Object|null} User object or null
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;