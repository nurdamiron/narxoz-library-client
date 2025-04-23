// src/services/adminBookService.js
import apiClient from './api';

const adminBookService = {
  /**
   * Get all books
   * @returns {Promise} Promise object with list of books
   */
  getBooks: async () => {
    const response = await apiClient.get('/books');
    return response.data;
  },

  /**
   * Get all categories
   * @returns {Promise} Promise object with list of categories
   */
  getCategories: async () => {
    const response = await apiClient.get('/books/categories');
    return response.data;
  },

  /**
   * Create a new book
   * @param {Object} bookData - Book data
   * @returns {Promise} Promise object with created book
   */
  createBook: async (bookData) => {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  },

  /**
   * Update book
   * @param {string} id - Book ID
   * @param {Object} bookData - Book data to update
   * @returns {Promise} Promise object with updated book
   */
  updateBook: async (id, bookData) => {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  },

  /**
   * Delete book
   * @param {string} id - Book ID
   * @returns {Promise} Promise object
   */
  deleteBook: async (id) => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  },

  /**
   * Upload book cover
   * @param {string} id - Book ID
   * @param {File} file - Cover image file
   * @returns {Promise} Promise object with updated cover URL
   */
  uploadBookCover: async (id, file) => {
    const formData = new FormData();
    // Use 'file' as the field name to match what the backend expects
    formData.append('file', file);

    const response = await apiClient.put(`/books/${id}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Update book inventory
   * @param {string} id - Book ID
   * @param {Object} data - Inventory data
   * @returns {Promise} Promise object with updated book
   */
  updateInventory: async (id, data) => {
    const response = await apiClient.put(`/books/${id}/inventory`, data);
    return response.data;
  },

  /**
   * Create category
   * @param {Object} categoryData - Category data
   * @returns {Promise} Promise object with created category
   */
  createCategory: async (categoryData) => {
    const response = await apiClient.post('/books/categories', categoryData);
    return response.data;
  },

  /**
   * Update category
   * @param {string} id - Category ID
   * @param {Object} categoryData - Category data to update
   * @returns {Promise} Promise object with updated category
   */
  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(`/books/categories/${id}`, categoryData);
    return response.data;
  },

  /**
   * Delete category
   * @param {string} id - Category ID
   * @returns {Promise} Promise object
   */
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/books/categories/${id}`);
    return response.data;
  }
};

export default adminBookService;