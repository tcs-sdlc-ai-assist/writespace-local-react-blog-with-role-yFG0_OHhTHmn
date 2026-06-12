import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';
import { Navbar } from '../components/Navbar.jsx';
import { BlogCard } from '../components/BlogCard.jsx';

/**
 * Home component - authenticated blog list page at /blogs.
 * Displays all posts in a responsive grid sorted newest first using BlogCard components.
 * Admin sees edit/delete on all posts; users see these only on their own.
 * Empty state with CTA to write first post if no posts exist.
 * @returns {JSX.Element}
 */
export function Home() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
  }, []);

  const handleDelete = (postId) => {
    const allPosts = getPosts();
    const post = allPosts.find((p) => p.id === postId);

    if (!post) return;

    const isAdmin = user && user.role === 'admin';
    const isOwner = user && user.userId === post.authorId;

    if (!isAdmin && !isOwner) return;

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="mt-2 text-gray-600">
            Browse the latest blog posts from the community.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📝</p>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No posts yet
            </h2>
            <p className="text-gray-500 text-lg mb-6">
              Be the first to share something with the community!
            </p>
            <button
              onClick={() => navigate('/write')}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors"
            >
              Write Your First Post
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;