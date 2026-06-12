import { Link } from 'react-router-dom';

/**
 * PublicNavbar component for unauthenticated (guest) users.
 * Displays the app name/logo and links to Login and Register pages.
 * @returns {JSX.Element}
 */
export function PublicNavbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            ✍️ WriteSpace
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors px-3 py-2 rounded-md text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;