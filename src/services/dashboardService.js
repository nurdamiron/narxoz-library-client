/**
 * Admin Dashboard Service
 * 
 * Provides functionality for statistics and dashboard data
 */
import apiClient from './api';

const dashboardService = {
  /**
   * Get dashboard statistics
   * 
   * @returns {Promise<Object>} Statistics for dashboard
   */
  getStatistics: async () => {
    try {
      // Использование нового консолидированного API для статистики дашборда
      const response = await apiClient.get('/dashboard/stats');
      
      const stats = response.data.data;
      
      return {
        users: stats.counts.users || 0,
        books: stats.counts.books || 0,
        borrows: stats.counts.activeBorrows || 0,
        categories: stats.counts.categories || 0,
        mostBorrowedBooks: stats.mostBorrowedBooks || [],
        mostActiveBorrowers: stats.mostActiveBorrowers || []
      };
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  },

  /**
   * Get trending books
   * 
   * @param {number} limit Number of books to fetch
   * @returns {Promise<Array>} List of trending books
   */
  getTrendingBooks: async (limit = 5) => {
    try {
      // Данные о популярных книгах теперь доступны через дашборд API
      const response = await apiClient.get('/dashboard/stats');
      return response.data.data.mostBorrowedBooks || [];
    } catch (error) {
      console.error('Error fetching trending books:', error);
      throw error;
    }
  },

  /**
   * Get latest books added to the library
   * 
   * @param {number} limit Number of books to fetch
   * @returns {Promise<Array>} List of new books
   */
  getNewBooks: async (limit = 5) => {
    try {
      // Новые книги теперь доступны через дашборд API
      const response = await apiClient.get('/dashboard/stats');
      return response.data.data.newBooks || [];
    } catch (error) {
      console.error('Error fetching new books:', error);
      throw error;
    }
  },

  /**
   * Get overdue borrows count
   * 
   * @returns {Promise<number>} Count of overdue borrows
   */
  getOverdueBorrows: async () => {
    try {
      // Количество просроченных книг теперь доступно через дашборд API
      const response = await apiClient.get('/dashboard/stats');
      return response.data.data.counts.overdueBorrows || 0;
    } catch (error) {
      console.error('Error fetching overdue borrows:', error);
      throw error;
    }
  },
  
  /**
   * Get yearly statistics
   * 
   * @param {number} year Year to get statistics for
   * @returns {Promise<Object>} Yearly statistics data
   */
  getYearlyStats: async (year = new Date().getFullYear()) => {
    try {
      const response = await apiClient.get('/dashboard/yearly-stats', {
        params: { year }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching yearly statistics:', error);
      throw error;
    }
  },
  
  /**
   * Get category statistics
   * 
   * @returns {Promise<Array>} Category statistics
   */
  getCategoryStats: async () => {
    try {
      const response = await apiClient.get('/dashboard/category-stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category statistics:', error);
      throw error;
    }
  }
};

export default dashboardService;