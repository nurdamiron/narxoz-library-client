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
import eventService from './eventService';

// Admin services
import adminBookService from './adminBookService';
import adminUserService from './adminUserService';
import adminBorrowService from './adminBorrowService';
import adminEventService from './adminEventService';
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
  eventService,
  
  // Admin services
  adminBookService,
  adminUserService,
  adminBorrowService,
  adminEventService,
  dashboardService
};