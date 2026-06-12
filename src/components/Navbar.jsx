import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCurrentUser, logout } from '../utils/auth.js';
import { Avatar } from './Avatar.jsx';

/**
 * Navbar component for authenticated users.
 * Displays app name, user info with Avatar, role-based navigation links,
 * and a Logout button.
 * @returns {JSX.Element}
 */
export function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const isAdminUser = user.role === 'admin';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/blogs" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            ✍️ WriteSpace
          </Link>
          <div className="flex items-center space-x-4">
            {isAdminUser && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors px-3 py-2 rounded-md text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors px-3 py-2 rounded-md text-sm"
                >
                  Users
                </Link>
              </>
            )}
            <Link
              to="/blogs"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors px-3 py-2 rounded-md text-sm"
            >
              Blogs
            </Link>
            <Link
              to="/write"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors px-3 py-2 rounded-md text-sm"
            >
              Write
            </Link>
            <div className="flex items-center space-x-2">
              <Avatar role={user.role} size="sm" />
              <span className="text-gray-700 font-medium text-sm">{user.displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;