import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';
import { getUsers, saveUsers } from '../utils/storage.js';
import { Navbar } from '../components/Navbar.jsx';
import { UserRow } from '../components/UserRow.jsx';

/**
 * Generates a simple unique ID.
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * UserManagement component - admin-only user management page at /admin/users.
 * Displays list of all users (including hard-coded admin) using UserRow components.
 * Provides a create user form with display name, username, password, confirm password,
 * and role selection. Validates all fields and username uniqueness.
 * Delete requires confirmation; hard-coded admin cannot be deleted;
 * logged-in admin cannot delete themselves.
 * Non-admins are redirected to /blogs.
 * @returns {JSX.Element}
 */
export function UserManagement() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (user.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }

    loadUsers();
  }, [navigate, user]);

  const loadUsers = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  const hardCodedAdmin = {
    id: 'admin',
    displayName: 'Administrator',
    username: 'admin',
    role: 'admin',
    createdAt: new Date('2024-01-01').toISOString(),
  };

  const allUsersWithAdmin = [hardCodedAdmin, ...users];

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!displayName.trim() || !username.trim() || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (displayName.trim().length > 40) {
        throw new Error('Display name must be 40 characters or less');
      }

      if (username.trim().length > 20) {
        throw new Error('Username must be 20 characters or less');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (username.trim() === 'admin') {
        throw new Error('Username already exists');
      }

      const currentUsers = getUsers();
      const existingUser = currentUsers.find((u) => u.username === username.trim());

      if (existingUser) {
        throw new Error('Username already exists');
      }

      const newUser = {
        id: generateId(),
        displayName: displayName.trim(),
        username: username.trim(),
        password,
        role,
        createdAt: new Date().toISOString(),
      };

      currentUsers.push(newUser);
      saveUsers(currentUsers);
      setUsers(currentUsers);

      setDisplayName('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRole('user');
      setSuccess(`User "${newUser.displayName}" created successfully!`);
    } catch (err) {
      setError(err.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteConfirm(userId);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;

    const currentUsers = getUsers();
    const updatedUsers = currentUsers.filter((u) => u.id !== deleteConfirm);
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setDeleteConfirm(null);
    setSuccess('User deleted successfully.');
    setError('');
  };

  const deleteTargetUser = deleteConfirm
    ? allUsersWithAdmin.find((u) => u.id === deleteConfirm)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage all users on the WriteSpace platform.
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New User</h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900"
                  placeholder="Enter display name"
                  required
                  maxLength={40}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900"
                  placeholder="Choose a username"
                  required
                  maxLength={20}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 bg-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>

        {/* User List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            All Users ({allUsersWithAdmin.length})
          </h2>
          <div className="space-y-4">
            {allUsersWithAdmin.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      </main>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete User</h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {deleteTargetUser ? deleteTargetUser.displayName : 'this user'}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;