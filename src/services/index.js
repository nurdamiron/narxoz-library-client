// src/services/index.js
import apiClient from './api';
import authService from './authService';
import bookService from './bookService';
import bookmarkService from './bookmarkService';
import borrowService from './borrowService';
import notificationService from './notificationService';
import userService from './userService';
import reviewService from './reviewService';
import categoryService from './categoryService';

// Admin services
import adminBookService from './adminBookService';
import adminUserService from './adminUserService';
import adminBorrowService from './adminBorrowService';
import dashboardService from './dashboardService';

export {
  apiClient,
  authService,
  bookService,
  bookmarkService,
  borrowService,
  notificationService,
  userService,
  reviewService,
  categoryService,
  
  // Admin services
  adminBookService,
  adminUserService,
  adminBorrowService,
  dashboardService
};