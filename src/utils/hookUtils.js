/**
 * Utilities for custom hooks and React Router hooks
 */
import { useParams as useRouterParams } from 'react-router-dom';

/**
 * Enhanced useParams hook that sanitizes parameter values
 * Removes any trailing quotes or apostrophes from URL parameters
 * 
 * @returns {Object} Sanitized URL parameters
 */
export const useParams = () => {
  // Get the original params
  const params = useRouterParams();
  
  // Create a new object with sanitized values
  const sanitizedParams = {};
  
  // Sanitize each parameter
  Object.keys(params).forEach(key => {
    const value = params[key];
    
    // Skip null or undefined values
    if (value == null) {
      sanitizedParams[key] = value;
      return;
    }
    
    // Remove quotes and apostrophes from string values
    if (typeof value === 'string') {
      sanitizedParams[key] = value.replace(/['"`]/g, '');
    } else {
      // Keep non-string values as is
      sanitizedParams[key] = value;
    }
  });
  
  return sanitizedParams;
};

/**
 * Sanitizes a URL parameter value
 * 
 * @param {string} value - The parameter value to sanitize 
 * @returns {string} The sanitized parameter
 */
export const sanitizeParam = (value) => {
  if (value == null) return value;
  
  if (typeof value === 'string') {
    return value.replace(/['"`]/g, '');
  }
  
  return value;
};