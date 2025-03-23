// src/utils/apiDebugger.js
/**
 * API debugging utility for tracking requests and responses
 */

const apiDebugger = {
    /**
     * Log request details before sending to API
     * 
     * @param {string} endpoint - API endpoint
     * @param {string} method - HTTP method
     * @param {Object} data - Request data
     */
    logRequest: (endpoint, method, data = null) => {
      if (process.env.NODE_ENV !== 'production') {
        console.group(`🚀 API Request: ${method} ${endpoint}`);
        console.log('📝 Request Data:', data);
        console.groupEnd();
      }
    },
  
    /**
     * Log successful response from API
     * 
     * @param {string} endpoint - API endpoint
     * @param {Object} response - API response
     */
    logResponse: (endpoint, response) => {
      if (process.env.NODE_ENV !== 'production') {
        console.group(`✅ API Response: ${endpoint}`);
        console.log('📊 Status:', response.status);
        console.log('📦 Data:', response.data);
        console.groupEnd();
      }
    },
  
    /**
     * Log error response from API
     * 
     * @param {string} endpoint - API endpoint
     * @param {Object} error - Error object
     */
    logError: (endpoint, error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.group(`❌ API Error: ${endpoint}`);
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('📊 Status:', error.response.status);
          console.log('📦 Response Data:', error.response.data);
          console.log('📋 Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('📫 No Response:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('🔄 Error Message:', error.message);
        }
        
        console.log('⚙️ Error Config:', error.config);
        console.groupEnd();
      }
    }
  };
  
  export default apiDebugger;