import PropTypes from 'prop-types';
import { getCurrentUser } from '../utils/auth.js';
import { Avatar } from './Avatar.jsx';

/**
 * UserRow component for the admin user management panel.
 * Displays user info (display name, username, role, created date) with Avatar.
 * Shows delete button with protection rules:
 * - Hard-coded admin (userId === 'admin') cannot be deleted.
 * - Logged-in admin cannot delete themselves.
 *
 * @param {object} props
 * @param {object} props.user - The user object to display.
 * @param {string} props.user.id - The user's unique ID.
 * @param {string} props.user.displayName - The user's display name.
 * @param {string} props.user.username - The user's username.
 * @param {string} props.user.role - The user's role ('admin' or 'user').
 * @param {string} props.user.createdAt - The ISO date string of account creation.
 * @param {function} [props.onDelete] - Callback when delete is clicked, receives user id.
 * @returns {JSX.Element}
 */
export function UserRow({ user, onDelete }) {
  const currentUser = getCurrentUser();

  const isHardCodedAdmin = user.id === 'admin';
  const isSelf = currentUser && currentUser.userId === user.id;
  const canDelete = !isHardCodedAdmin && !isSelf;

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(user.id);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 transition-shadow hover:shadow-lg">
      <div className="flex items-center space-x-4">
        <Avatar role={user.role} size="md" />
        <div>
          <p className="text-base font-semibold text-gray-900">{user.displayName}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right hidden sm:block">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin'
                ? 'bg-violet-100 text-violet-700'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-gray-400">Joined</p>
          <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
        </div>
        {canDelete ? (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
            aria-label={`Delete user ${user.displayName}`}
            title="Delete user"
          >
            🗑️
          </button>
        ) : (
          <div className="p-2 w-10" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
};

export default UserRow;