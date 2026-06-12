# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-15

### Added

#### Public Landing Page
- Hero section with app branding, description, and call-to-action buttons (Get Started, Login).
- Features section highlighting Write & Publish, Role-Based Access, and Local & Private capabilities.
- Latest posts preview displaying up to three most recent blog posts.
- Footer with navigation links and copyright notice.
- Public navigation bar with Login and Register links.

#### Authentication
- Login page with username and password fields and inline error messages.
- Registration page with display name, username, password, and confirm password fields.
- Hard-coded admin account with default credentials (`admin` / `admin123`).
- Session persistence via `localStorage` under the `writespace_session` key.
- Automatic redirect for already-authenticated users on login and register pages.

#### Role-Based Route Guards
- `ProtectedRoute` component enforcing authentication for private routes.
- Admin-only route protection redirecting non-admin users to `/blogs`.
- Unauthenticated users redirected to `/login`.

#### Avatar System
- Role-distinct avatar component with crown emoji (👑) for admins and book emoji (📖) for users.
- Violet background for admin avatars and indigo background for user avatars.
- Three size variants: small, medium, and large.

#### Blog CRUD with Ownership
- Create new blog posts with title (max 100 characters) and content (max 2000 characters).
- Read full blog posts on dedicated reader page with author info and formatted date.
- Edit existing blog posts with pre-populated form fields.
- Delete blog posts with confirmation dialog on the reader page.
- Ownership enforcement: users can only edit and delete their own posts.
- Admin override: admins can edit and delete any post.
- Character counters on title and content fields.
- Content excerpts on blog card previews (max 150 characters).

#### Admin Dashboard
- Gradient banner header with personalized welcome message.
- Four stat cards displaying total posts, total users, admin count, and user count.
- Quick action buttons for writing a new post and managing users.
- Recent posts section showing the five most recent posts with edit and delete controls.
- Empty state with call-to-action when no posts exist.

#### User Management
- Admin-only user management page listing all users including the hard-coded admin.
- Create new user form with display name, username, password, confirm password, and role selection.
- Username uniqueness validation across all users and the hard-coded admin.
- Delete user functionality with confirmation dialog.
- Protection rules: hard-coded admin cannot be deleted; logged-in admin cannot delete themselves.
- `UserRow` component displaying user info with avatar, role badge, and join date.

#### localStorage Persistence
- `writespace_posts` key for storing blog post objects.
- `writespace_users` key for storing registered user objects.
- `writespace_session` key for storing the current logged-in user session.
- Graceful error handling for all localStorage read and write operations.

#### Responsive Tailwind UI
- Fully responsive layout using Tailwind CSS utility classes.
- Responsive grid layouts for blog cards (1 column on mobile, 2 on tablet, 3 on desktop).
- Responsive navigation bar with authenticated and guest variants.
- Mobile-friendly form layouts with stacked fields on small screens.
- Hover and transition effects on interactive elements.

#### Deployment
- Vercel deployment configuration with SPA rewrite rules in `vercel.json`.
- Vite build configuration with React plugin.
- PostCSS configuration for Tailwind CSS processing.

#### Testing
- Unit tests for `storage.js` utility functions covering happy paths and error cases.
- Unit tests for `auth.js` covering login, register, logout, getCurrentUser, and isAdmin.
- Component tests for `Home` page covering rendering, empty state, edit/delete controls, and navigation.
- Component tests for `LandingPage` covering hero, features, latest posts, and footer sections.
- Test setup with `@testing-library/react`, `@testing-library/jest-dom`, and `vitest`.