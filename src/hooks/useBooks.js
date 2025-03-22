// src/hooks/useBooks.js
import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../services';

/**
 * Custom hook for managing books catalog
 * @param {Object} initialFilters - Initial filters for books list
 */
const useBooks = (initialFilters = {}) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch books with filters
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getBooks(filters);
      
      if (response.success) {
        setBooks(response.data);
        setTotalItems(response.total);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Кітаптарды жүктеу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await bookService.getCategories();
      
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Get a single book
  const getBook = async (id) => {
    try {
      setLoading(true);
      const response = await bookService.getBook(id);
      
      if (response.success) {
        return response.data;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Кітап мәліметтерін жүктеу кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get popular books
  const getPopularBooks = async (limit = 4) => {
    try {
      setLoading(true);
      const response = await bookService.getPopularBooks(limit);
      
      if (response.success) {
        return response.data;
      }
      
      return [];
    } catch (err) {
      console.error('Error fetching popular books:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get new books
  const getNewBooks = async (limit = 4) => {
    try {
      setLoading(true);
      const response = await bookService.getNewBooks(limit);
      
      if (response.success) {
        return response.data;
      }
      
      return [];
    } catch (err) {
      console.error('Error fetching new books:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of books and categories
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [fetchBooks, fetchCategories]);

  return {
    books,
    categories,
    totalItems,
    totalPages,
    filters,
    loading,
    error,
    fetchBooks,
    fetchCategories,
    updateFilters,
    getBook,
    getPopularBooks,
    getNewBooks
  };
};

export default useBooks;