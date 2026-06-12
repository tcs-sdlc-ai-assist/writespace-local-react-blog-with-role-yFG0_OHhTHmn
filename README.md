# ✍️ WriteSpace

A private, local-first blogging platform built with React. Write, publish, and manage blog posts — all without leaving your browser.

## Tech Stack

- **React 18** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **React Router v6** — Client-side routing
- **localStorage** — Client-side data persistence (no backend required)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Build

```bash
# Create a production build
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration (Tailwind)
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest test configuration
├── vercel.json                 # Vercel deployment configuration
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with routing
│   ├── index.css               # Tailwind CSS imports
│   ├── setup-tests.js          # Test setup (jest-dom)
│   ├── components/
│   │   ├── Avatar.jsx          # Role-distinct avatar component
│   │   ├── BlogCard.jsx        # Blog post preview card
│   │   ├── Navbar.jsx          # Authenticated user navigation bar
│   │   ├── ProtectedRoute.jsx  # Auth and role-based route guard
│   │   ├── PublicNavbar.jsx    # Guest navigation bar
│   │   ├── StatCard.jsx        # Admin dashboard statistic card
│   │   └── UserRow.jsx         # Admin user management row
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin overview page
│   │   ├── Home.jsx            # Blog listing page
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── LoginPage.jsx       # User login page
│   │   ├── ReadBlog.jsx        # Full blog post reader
│   │   ├── RegisterPage.jsx    # User registration page
│   │   ├── UserManagement.jsx  # Admin user management page
│   │   └── WriteBlog.jsx       # Blog post create/edit page
│   └── utils/
│       ├── auth.js             # Authentication utilities
│       └── storage.js          # localStorage wrapper utilities
```

## Usage Guide

### Default Admin Credentials

WriteSpace ships with a hard-coded admin account:

- **Username:** `admin`
- **Password:** `admin123`

Use these credentials to log in as an administrator on first use.

### Registration Flow

1. Navigate to the landing page at `/`.
2. Click **Get Started** or **Register**.
3. Fill in your display name, username, password, and confirm password.
4. Click **Create Account**.
5. You will be redirected to the blog listing page at `/blogs`.

All registered users are assigned the **user** role by default. Only admins can create users with the **admin** role via the User Management page.

### Blog CRUD

#### Creating a Post

1. Log in to your account.
2. Click **Write** in the navigation bar or the **Write Your First Post** button on an empty blog listing.
3. Enter a title (max 100 characters) and content (max 2000 characters).
4. Click **Publish Post**.
5. You will be redirected to the published post.

#### Reading a Post

- Click on any blog card from the blog listing page (`/blogs`) or the landing page to view the full post.

#### Editing a Post

- On a blog card or the full post view, click the ✏️ (edit) button.
- Users can only edit their own posts.
- Admins can edit any post.
- Update the title and/or content, then click **Update Post**.

#### Deleting a Post

- On a blog card or the full post view, click the 🗑️ (delete) button.
- On the full post view, a confirmation dialog will appear before deletion.
- Users can only delete their own posts.
- Admins can delete any post.

### Admin Features

Admins have access to two additional pages:

#### Admin Dashboard (`/admin/dashboard`)

- Overview of platform statistics: total posts, total users, admin count, and user count.
- Quick action buttons to write a new post or manage users.
- List of the five most recent posts with edit/delete controls.

#### User Management (`/admin/users`)

- View all users (including the hard-coded admin).
- Create new users with a specified role (user or admin).
- Delete users (with the following protections):
  - The hard-coded admin account cannot be deleted.
  - An admin cannot delete themselves.
  - A confirmation dialog appears before deletion.

### Data Storage

All data is stored in the browser's `localStorage` under the following keys:

| Key | Description |
|---|---|
| `writespace_posts` | Array of blog post objects |
| `writespace_users` | Array of registered user objects |
| `writespace_session` | Current logged-in user session |

Since data is stored locally, it persists across page refreshes but is specific to the browser and device. Clearing browser data will remove all WriteSpace data.

## Deployment

### Vercel

WriteSpace includes a `vercel.json` configuration for seamless deployment on [Vercel](https://vercel.com/).

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the project in the [Vercel Dashboard](https://vercel.com/dashboard).
3. Vercel will auto-detect the Vite framework and configure the build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

The `vercel.json` file includes a rewrite rule that directs all routes to `index.html`, enabling client-side routing with React Router.

### Other Platforms

For other static hosting platforms (Netlify, GitHub Pages, etc.):

1. Run `npm run build` to generate the `dist/` directory.
2. Deploy the contents of `dist/` to your hosting provider.
3. Configure URL rewrites so that all routes serve `index.html` (required for client-side routing).

## License

Private — All rights reserved.