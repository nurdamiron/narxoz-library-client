// src/hooks/useBookmarks.js
import { useState, useEffect, useCallback } from 'react';
import { bookmarkService } from '../services';

/**
 * Custom hook for managing bookmarks
 */
const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all user bookmarks
  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookmarkService.getBookmarks();
      
      if (response.success) {
        setBookmarks(response.data);
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('Бетбелгілерді жүктеу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if a book is bookmarked
  const checkBookmark = async (bookId) => {
    try {
      const response = await bookmarkService.checkBookmark(bookId);
      return response.data.isBookmarked;
    } catch (err) {
      console.error('Error checking bookmark status:', err);
      return false;
    }
  };

  // Toggle bookmark (add or remove)
  const toggleBookmark = async (bookId) => {
    try {
      setLoading(true);
      const response = await bookmarkService.toggleBookmark(bookId);
      
      if (response.success) {
        if (response.data.bookmarked) {
          // Book was bookmarked, add to state
          if (response.data.bookmark) {
            setBookmarks(prev => [...prev, response.data.bookmark]);
          }
        } else {
          // Book was un-bookmarked, remove from state
          setBookmarks(prev => 
            prev.filter(bookmark => bookmark.bookId !== bookId)
          );
        }
        
        return response.data.bookmarked;
      }
      
      return false;
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setError('Бетбелгіні өзгерту кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add bookmark
  const addBookmark = async (bookId) => {
    try {
      setLoading(true);
      const response = await bookmarkService.addBookmark({ bookId });
      
      if (response.success) {
        setBookmarks(prev => [...prev, response.data]);
      }
      
      return response;
    } catch (err) {
      console.error('Error adding bookmark:', err);
      setError('Бетбелгі қосу кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove bookmark
  const removeBookmark = async (id) => {
    try {
      setLoading(true);
      const response = await bookmarkService.deleteBookmark(id);
      
      if (response.success) {
        setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
      }
      
      return response;
    } catch (err) {
      console.error('Error removing bookmark:', err);
      setError('Бетбелгіні жою кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove bookmark by book ID
  const removeBookmarkByBookId = async (bookId) => {
    try {
      setLoading(true);
      const response = await bookmarkService.deleteBookmarkByBookId(bookId);
      
      if (response.success) {
        setBookmarks(prev => prev.filter(bookmark => bookmark.bookId !== bookId));
      }
      
      return response;
    } catch (err) {
      console.error('Error removing bookmark by book ID:', err);
      setError('Бетбелгіні жою кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of bookmarks
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    checkBookmark,
    toggleBookmark,
    addBookmark,
    removeBookmark,
    removeBookmarkByBookId
  };
};

export default useBookmarks;