// src/services/bookService.js
import apiClient from './api';

const bookService = {
  /**
   * Get books with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Books per page
   * @param {string} params.search - Search query
   * @param {string} params.categoryId - Category ID
   * @param {string} params.year - Publication year
   * @param {string} params.language - Book language
   * @param {string} params.sort - Sort field (e.g. 'title', '-publicationYear')
   * @returns {Promise} Promise object with books data
   */
  getBooks: async (params = {}) => {
    const response = await apiClient.get('/books', { params });
    return response.data;
  },

  /**
   * Get single book by ID
   * @param {string} id - Book ID
   * @returns {Promise} Promise object with book data
   */
  getBook: async (id) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  /**
   * Get popular books
   * @param {number} limit - Number of books to return
   * @returns {Promise} Promise object with popular books
   */
  getPopularBooks: async (limit = 4) => {
    const response = await apiClient.get('/books/popular', { params: { limit } });
    return response.data;
  },

  /**
   * Get new books
   * @param {number} limit - Number of books to return
   * @returns {Promise} Promise object with new books
   */
  getNewBooks: async (limit = 4) => {
    const response = await apiClient.get('/books/new', { params: { limit } });
    return response.data;
  },

  /**
   * Get all categories
   * @returns {Promise} Promise object with categories data
   */
  getCategories: async () => {
    const response = await apiClient.get('/books/categories');
    return response.data;
  },

  /**
   * Create a new book (Admin only)
   * @param {Object} bookData - Book data
   * @returns {Promise} Promise object with created book
   */
  createBook: async (bookData) => {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  },

  /**
   * Update book (Admin only)
   * @param {string} id - Book ID
   * @param {Object} bookData - Book data to update
   * @returns {Promise} Promise object with updated book
   */
  updateBook: async (id, bookData) => {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  },

  /**
   * Delete book (Admin only)
   * @param {string} id - Book ID
   * @returns {Promise} Promise object
   */
  deleteBook: async (id) => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data;
  },

  /**
   * Upload book cover (Admin only)
   * @param {string} id - Book ID
   * @param {File} file - Cover image file
   * @returns {Promise} Promise object with updated cover URL
   */
  uploadBookCover: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.put(`/books/${id}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Update book inventory (Admin only)
   * @param {string} id - Book ID
   * @param {Object} data - Inventory data
   * @returns {Promise} Promise object with updated book
   */
  updateInventory: async (id, data) => {
    const response = await apiClient.put(`/books/${id}/inventory`, data);
    return response.data;
  }
};

export default bookService;