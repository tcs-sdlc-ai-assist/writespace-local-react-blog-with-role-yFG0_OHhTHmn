import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts, savePosts, getUsers } from '../utils/storage.js';
import { Navbar } from '../components/Navbar.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { BlogCard } from '../components/BlogCard.jsx';

/**
 * AdminDashboard component - admin-only overview page at /admin/dashboard.
 * Displays gradient banner header, four stat cards (total posts, total users,
 * admin count, user count), quick action buttons, and recent posts list
 * with edit/delete controls.
 * Non-admins are redirected to /blogs.
 * @returns {JSX.Element}
 */
export function AdminDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (user.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }

    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);

    const allUsers = getUsers();
    setUsers(allUsers);
  }, [navigate, user]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = users.filter((u) => u.role === 'user').length;
  const recentPosts = posts.slice(0, 5);

  const handleDelete = (postId) => {
    const allPosts = getPosts();
    const updatedPosts = allPosts.filter((p) => p.id !== postId);
    savePosts(updatedPosts);

    const sorted = [...updatedPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
  };

  const handleEdit = (postId) => {
    navigate(`/write?edit=${postId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Gradient Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold">Welcome back, {user.displayName} 👋</h1>
          <p className="mt-2 text-white/80 text-lg">
            Here&apos;s an overview of your WriteSpace platform.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Posts" value={totalPosts} icon="📝" color="indigo" />
          <StatCard label="Total Users" value={totalUsers} icon="👥" color="violet" />
          <StatCard label="Admins" value={adminCount} icon="👑" color="amber" />
          <StatCard label="Users" value={userCount} icon="📖" color="emerald" />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/write')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors"
            >
              ✍️ Write Post
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors"
            >
              👥 Manage Users
            </button>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Posts</h2>
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">📝</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 text-base mb-6">
                Get started by creating the first post.
              </p>
              <button
                onClick={() => navigate('/write')}
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors"
              >
                Write Your First Post
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;