import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts, savePosts } from '../utils/storage.js';
import { Navbar } from '../components/Navbar.jsx';
import { Avatar } from '../components/Avatar.jsx';

/**
 * ReadBlog component - full blog post reader page at /blog/:id.
 * Displays title, author name with Avatar, formatted date, and full content.
 * Admin sees edit/delete buttons on all posts; users see these only on their own.
 * Delete requires confirmation dialog and removes post from localStorage, redirecting to /blogs.
 * Invalid/missing ID shows 'Post not found' message.
 * @returns {JSX.Element}
 */
export function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const allPosts = getPosts();
    const found = allPosts.find((p) => p.id === id);

    if (found) {
      setPost(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const isAdmin = user && user.role === 'admin';
  const isOwner = user && post && user.userId === post.authorId;
  const canModify = isAdmin || isOwner;

  const authorRole = post && post.authorId === 'admin' ? 'admin' : 'user';

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

  const handleEdit = () => {
    navigate(`/write?edit=${post.id}`);
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowConfirm(false);
  };

  const handleDeleteConfirm = () => {
    const allPosts = getPosts();
    const updatedPosts = allPosts.filter((p) => p.id !== post.id);
    savePosts(updatedPosts);
    navigate('/blogs', { replace: true });
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
            <p className="text-gray-500 text-lg mb-6">
              The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/blogs')}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Avatar role={authorRole} size="md" />
              <div>
                <p className="text-base font-medium text-gray-800">{post.authorName}</p>
                <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            {canModify && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-md hover:bg-indigo-50"
                  aria-label="Edit post"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                  aria-label="Delete post"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate('/blogs')}
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm"
          >
            ← Back to all posts
          </button>
        </div>
      </main>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Post</h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
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

export default ReadBlog;