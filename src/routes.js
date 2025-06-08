import React from 'react';
import { Navigate } from 'react-router-dom';

// Public pages
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import BookmarksPage from './pages/BookmarksPage';
import BorrowHistoryPage from './pages/BorrowHistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import MyEventsPage from './pages/MyEventsPage';

// Debug tools
import RoleDiagnostic from './components/debug/RoleDiagnostic';

// User pages  
import UserDashboard from './pages/UserDashboard';
import MyReviewsPage from './pages/MyReviewsPage';
import UserEventsManager from './pages/UserEventsManager';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooksPage from './pages/admin/BooksPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminBorrowsPage from './pages/admin/BorrowsPage';
import AdminCategoriesPage from './pages/admin/CategoriesPage';
import AdminEventsPage from './pages/admin/EventsPage';
import CreateEventPage from './pages/admin/CreateEventPage';
import EditEventPage from './pages/admin/EditEventPage';
import EventRegistrationsPage from './pages/admin/EventRegistrationsPage';

// Route configuration
const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/books',
    element: <BooksPage />,
  },
  {
    path: '/books/:id',
    element: <BookDetailsPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    protected: true,
  },
  {
    path: '/bookmarks',
    element: <BookmarksPage />,
    protected: true,
  },
  {
    path: '/borrows',
    element: <BorrowHistoryPage />,
    protected: true,
  },
  {
    path: '/notifications',
    element: <NotificationsPage />,
    protected: true,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/events',
    element: <EventsPage />,
  },
  {
    path: '/events/:id',
    element: <EventDetailsPage />,
  },
  {
    path: '/my-events',
    element: <MyEventsPage />,
    protected: true,
  },
  {
    path: '/user-dashboard',
    element: <UserDashboard />,
    protected: true,
    roles: ['moderator', 'admin', 'librarian'], // Dashboard only for moderators and admins
  },
  {
    path: '/my-reviews',
    element: <MyReviewsPage />,
    protected: true,
  },
  {
    path: '/user-events-manager',
    element: <UserEventsManager />,
    protected: true,
  },
  
  // Admin routes - role-based access according to specifications
  {
    path: '/admin',
    element: <Navigate to="/admin/books" replace />, // Redirect to books for moderators, dashboard for admins handled in AdminLayout
    protected: true,
    roles: ['admin', 'moderator', 'librarian'],
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
    protected: true,
    roles: ['admin', 'librarian'], // ❌ Dashboard - not visible to moderators
  },
  {
    path: '/admin/books',
    element: <AdminBooksPage />,
    protected: true,
    roles: ['admin', 'moderator', 'librarian'], // ✅ Books - visible to moderators (read-only)
  },
  {
    path: '/admin/users',
    element: <AdminUsersPage />,
    protected: true,
    roles: ['admin', 'librarian'], // ❌ Users - not accessible to moderators
  },
  {
    path: '/admin/borrows',
    element: <AdminBorrowsPage />,
    protected: true,
    roles: ['admin', 'librarian'], // ❌ Loans - not accessible to moderators
  },
  {
    path: '/admin/categories',
    element: <AdminCategoriesPage />,
    protected: true,
    roles: ['admin', 'moderator', 'librarian'], // ✅ Categories - visible to moderators (read-only)
  },
  {
    path: '/admin/events',
    element: <AdminEventsPage />,
    protected: true,
    roles: ['admin', 'moderator', 'librarian'], // ✅ Events - accessible to moderators (limited rights)
  },
  {
    path: '/admin/events/create',
    element: <CreateEventPage />,
    protected: true,
    roles: ['admin', 'moderator', 'librarian'], // ✅ Events management - accessible to moderators
  },
  {
    path: '/admin/events/edit/:id',
    element: <EditEventPage />,
    protected: true,
    roles: ['admin', 'moderator', 'librarian'], // ✅ Events management - accessible to moderators
  },
  {
    path: '/admin/events/:id/registrations',
    element: <EventRegistrationsPage />,
    protected: true,
    roles: ['admin', 'moderator', 'librarian'], // ✅ Events management - accessible to moderators
  },
  // Add Reviews admin page route
  {
    path: '/admin/reviews',
    element: <div>Reviews Admin Page - Coming Soon</div>, // ✅ Reviews - primary work for moderators
    protected: true,
    roles: ['admin', 'moderator', 'librarian'],
  },
  
  // Debug routes
  {
    path: '/debug/role',
    element: <RoleDiagnostic />,
    protected: true,
  },
  
  // Not found route
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;