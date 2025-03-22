// src/hooks/useBorrows.js
import { useState, useEffect, useCallback } from 'react';
import { borrowService } from '../services';

/**
 * Custom hook for managing book borrows
 * @param {Object} initialFilters - Initial filters for borrows list
 */
const useBorrows = (initialFilters = {}) => {
  const [borrows, setBorrows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's borrows with filters
  const fetchBorrows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await borrowService.getUserBorrows(filters);
      
      if (response.success) {
        setBorrows(response.data);
        setTotalItems(response.total);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      console.error('Error fetching borrows:', err);
      setError('Қарыздарды жүктеу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Borrow a book
  const borrowBook = async (bookId) => {
    try {
      setLoading(true);
      const response = await borrowService.borrowBook({ bookId });
      
      if (response.success) {
        // Add new borrow to state if it's for the current user
        setBorrows(prev => [response.data, ...prev]);
      }
      
      return response;
    } catch (err) {
      console.error('Error borrowing book:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Return a borrowed book
  const returnBook = async (borrowId) => {
    try {
      setLoading(true);
      const response = await borrowService.returnBook(borrowId);
      
      if (response.success) {
        // Update borrow in state
        setBorrows(prev => 
          prev.map(borrow => 
            borrow.id === borrowId ? response.data : borrow
          )
        );
      }
      
      return response;
    } catch (err) {
      console.error('Error returning book:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Extend borrow period
  const extendBorrow = async (borrowId) => {
    try {
      setLoading(true);
      const response = await borrowService.extendBorrow(borrowId);
      
      if (response.success) {
        // Update borrow in state
        setBorrows(prev => 
          prev.map(borrow => 
            borrow.id === borrowId ? response.data : borrow
          )
        );
      }
      
      return response;
    } catch (err) {
      console.error('Error extending borrow period:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single borrow by ID
  const getBorrow = async (borrowId) => {
    try {
      setLoading(true);
      const response = await borrowService.getBorrow(borrowId);
      return response.data;
    } catch (err) {
      console.error('Error getting borrow details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of borrows
  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  return {
    borrows,
    totalItems,
    totalPages,
    filters,
    loading,
    error,
    fetchBorrows,
    updateFilters,
    borrowBook,
    returnBook,
    extendBorrow,
    getBorrow
  };
};

export default useBorrows;