/**
 * src/api/adminService.js
 * 
 * Админ панелі үшін API сервисі
 * Әртүрлі бэкенд контроллерлермен интеграцияланады
 */
import api from './axios';

// Барлық қарыздарды алу (админ, кітапханашы)
export const getAllBorrows = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/borrows/all?${queryString}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Қарызды жаңарту (админ, кітапханашы)
export const updateBorrow = async (borrowId, borrowData) => {
  try {
    const response = await api.put(`/borrows/${borrowId}`, borrowData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Мерзімі өткен қарыздарды тексеру (админ, кітапханашы)
export const checkOverdueBorrows = async () => {
  try {
    const response = await api.get('/borrows/check-overdue');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Қарыз статистикасын алу (админ, кітапханашы)
export const getBorrowStats = async () => {
  try {
    const response = await api.get('/borrows/stats');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Санатты жасау (админ, кітапханашы)
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/books/categories', categoryData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Санатты жаңарту (админ, кітапханашы)
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/books/categories/${categoryId}`, categoryData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Санатты жою (админ, кітапханашы)
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/books/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Кітап қорын жаңарту (админ, кітапханашы)
export const updateBookInventory = async (bookId, inventoryData) => {
  try {
    const response = await api.put(`/books/${bookId}/inventory`, inventoryData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Барлық бетбелгілерді алу (админ)
export const getAllBookmarks = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/bookmarks/all?${queryString}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Трендтегі кітаптарды алу (админ)
export const getTrendingBooks = async () => {
  try {
    const response = await api.get('/bookmarks/trending');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Админ тіркеу (тек суперадмин үшін)
export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post('/auth/register-admin', adminData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
