// src/utils/validationUtils.js

/**
 * Validates a single form field and returns appropriate error message
 * 
 * @param {string} name - Field name to validate
 * @param {string} value - Field value to validate
 * @param {Object} formData - Complete form data for cross-field validation
 * @returns {string} Error message if invalid, empty string if valid
 */

import apiClient from '../services/api'; // Import your API client

/**
 * Validates a single form field and returns appropriate error message
 * Can perform async validation for certain fields
 * 
 * @param {string} name - Field name to validate
 * @param {string} value - Field value to validate
 * @param {Object} formData - Complete form data for cross-field validation
 * @param {Function} setFieldError - Function to set field error asynchronously
 * @returns {string} Error message if invalid, empty string if valid
 */
export const validateField = (name, value, formData, setFieldError = null) => {
    // For empty check, ensure we handle both null/undefined and empty strings
    const isEmpty = value === null || value === undefined || value.trim() === '';
    
    switch (name) {
      case 'name':
        if (isEmpty) return 'Атыңызды енгізіңіз';
        if (value.trim().length < 2) return 'Аты кемінде 2 таңбадан тұруы керек';
        return '';
        
      case 'email':
        if (isEmpty) return 'Электрондық поштаңызды енгізіңіз';
        
        // More comprehensive email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) return 'Жарамды электрондық пошта мекенжайын енгізіңіз';
        
        // Async validation for email can be added here if needed
        return '';
        
      case 'phone':
        if (isEmpty) return 'Телефон нөміріңізді енгізіңіз';
        
        // Accept various phone formats with international or local format
        const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{9,12}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) 
          return 'Жарамды телефон нөмірін енгізіңіз';
        return '';
        
      case 'faculty':
        if (isEmpty) return 'Факультетті таңдаңыз';
        return '';
        
      case 'specialization':
        if (isEmpty) return 'Мамандықты таңдаңыз';
        return '';
        
      case 'studentId':
        if (isEmpty) return 'Студенттік ID енгізіңіз';
        
        // Student ID format validation
        const studentIdRegex = /^[a-zA-Z0-9]+$/;
        if (!studentIdRegex.test(value)) 
          return 'Студенттік ID тек әріптер мен сандардан тұруы керек';
        
        // Async validation for student ID
        if (setFieldError && value.trim().length > 5) {
          // Only check if the ID is reasonably complete (to avoid too many requests)
          checkStudentIdExists(value).then(exists => {
            if (exists) {
              setFieldError('studentId', 'Бұл студенттік ID жүйеде тіркелген');
            }
          });
        }
        
        return '';
        
      case 'year':
        if (isEmpty) return 'Оқу жылын таңдаңыз';
        return '';
        
      case 'password':
        if (isEmpty) return 'Құпия сөзді енгізіңіз';
        if (value.length < 8) return 'Құпия сөз кемінде 8 таңбадан тұруы керек';
        
        // Enhanced password validation
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /[0-9]/.test(value);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
          return 'Құпия сөз кем дегенде бір бас әріп, бір кіші әріп және бір сан қамтуы керек';
        }
        return '';
        
      case 'confirmPassword':
        if (isEmpty) return 'Құпия сөзді қайталаңыз';
        if (value !== formData.password) return 'Құпия сөздер сәйкес келмейді';
        return '';
        
      default:
        return '';
    }
  };
  
  /**
   * Validates all fields for a specific step
   * 
   * @param {number} step - Current step index (0-based)
   * @param {Object} formData - Complete form data
   * @param {Object} formErrors - Current form validation errors
   * @returns {boolean} True if the step is valid, false otherwise
   */
  export const validateStep = (step, formData, formErrors) => {
    // Helper to check if any required fields are empty
    const checkRequiredFields = (fields) => {
      return fields.every(field => 
        formData[field] !== undefined && 
        formData[field] !== null && 
        formData[field].toString().trim() !== ''
      );
    };
    
    // Helper to check if any fields have errors
    const checkNoErrors = (fields) => {
      return fields.every(field => 
        !formErrors[field] || formErrors[field] === ''
      );
    };
    
    switch (step) {
      case 0: // Personal Info
        const personalFields = ['name'];
        return checkRequiredFields(personalFields) && checkNoErrors(personalFields);
        
      case 1: // Contact Info
        const contactFields = ['email', 'phone'];
        return checkRequiredFields(contactFields) && checkNoErrors(contactFields);
        
      case 2: // Education Info
        const educationFields = ['faculty', 'specialization', 'studentId', 'year'];
        return checkRequiredFields(educationFields) && checkNoErrors(educationFields);
        
      case 3: // Password
        const passwordFields = ['password', 'confirmPassword'];
        return checkRequiredFields(passwordFields) && checkNoErrors(passwordFields);
        
      default:
        console.warn(`Invalid step index: ${step}`);
        return false;
    }
  };
  
  /**
   * Calculates the overall form completion percentage
   * 
   * @param {Object} formValid - Object with validation status for each step
   * @returns {number} Percentage of completion (0-100)
   */
  export const calculateCompletionPercentage = (formValid) => {
    // Count valid steps
    const validSteps = Object.values(formValid).filter(Boolean).length;
    
    // Calculate percentage based on total number of steps
    const totalSteps = Object.keys(formValid).length;
    const percentage = Math.floor((validSteps / totalSteps) * 100);
    
    return percentage;
  };
  

/**
 * Checks if a student ID already exists in the database
 * 
 * @param {string} studentId - The student ID to check
 * @returns {Promise<boolean>} - True if the student ID exists, false otherwise
 */
export const checkStudentIdExists = async (studentId) => {
  try {
    const response = await apiClient.post('/auth/check-student-id', { studentId });
    return response.data.exists;
  } catch (error) {
    console.error('Error checking student ID:', error);
    return false;
  }
};

  /**
   * Validates all steps and returns overall form validity
   * 
   * @param {Object} formData - Complete form data
   * @param {Object} formErrors - Current form validation errors
   * @returns {boolean} True if the entire form is valid
   */
  export const isFormValid = (formData, formErrors) => {
    // Check validity of all steps
    const step0Valid = validateStep(0, formData, formErrors);
    const step1Valid = validateStep(1, formData, formErrors);
    const step2Valid = validateStep(2, formData, formErrors);
    const step3Valid = validateStep(3, formData, formErrors);
    
    // Form is valid if all steps are valid
    return step0Valid && step1Valid && step2Valid && step3Valid;
  };
  
  /**
   * Gets a summary of form validation state
   * 
   * @param {Object} formData - Complete form data
   * @param {Object} formErrors - Current form validation errors
   * @returns {Object} Summary of validation state
   */
  export const getValidationSummary = (formData, formErrors) => {
    return {
      step0: validateStep(0, formData, formErrors),
      step1: validateStep(1, formData, formErrors),
      step2: validateStep(2, formData, formErrors),
      step3: validateStep(3, formData, formErrors),
      isComplete: isFormValid(formData, formErrors)
    };
  };