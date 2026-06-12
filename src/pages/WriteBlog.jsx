import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts, savePosts } from '../utils/storage.js';
import { Navbar } from '../components/Navbar.jsx';

/**
 * Generates a simple unique ID.
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 2000;

/**
 * WriteBlog component for creating and editing blog posts.
 * Accessible at /write (create) and /write?edit=:id (edit).
 * Title and content fields are required with inline validation errors.
 * Character counter below content textarea.
 * On save, creates or updates post in localStorage and redirects to /blog/:id.
 * Ownership checks: users can edit only their own posts; admin can edit any.
 * @returns {JSX.Element}
 */
export function WriteBlog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const user = getCurrentUser();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (editId) {
      const allPosts = getPosts();
      const post = allPosts.find((p) => p.id === editId);

      if (!post) {
        navigate('/blogs', { replace: true });
        return;
      }

      const isAdmin = user.role === 'admin';
      const isOwner = user.userId === post.authorId;

      if (!isAdmin && !isOwner) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setIsEditing(true);
    }
  }, [editId, navigate, user]);

  const validate = () => {
    const newErrors = { title: '', content: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (title.trim().length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less`;
      isValid = false;
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    } else if (content.trim().length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Content must be ${MAX_CONTENT_LENGTH} characters or less`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const allPosts = getPosts();

      if (isEditing && editId) {
        const postIndex = allPosts.findIndex((p) => p.id === editId);

        if (postIndex === -1) {
          navigate('/blogs', { replace: true });
          return;
        }

        const existingPost = allPosts[postIndex];
        const isAdmin = user.role === 'admin';
        const isOwner = user.userId === existingPost.authorId;

        if (!isAdmin && !isOwner) {
          navigate('/blogs', { replace: true });
          return;
        }

        allPosts[postIndex] = {
          ...existingPost,
          title: title.trim(),
          content: content.trim(),
        };

        savePosts(allPosts);
        navigate(`/blog/${editId}`, { replace: true });
      } else {
        const newPost = {
          id: generateId(),
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          authorId: user.userId,
          authorName: user.displayName,
        };

        allPosts.push(newPost);
        savePosts(allPosts);
        navigate(`/blog/${newPost.id}`, { replace: true });
      }
    } catch (err) {
      console.error('Error saving post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing
              ? 'Update your blog post below.'
              : 'Share your thoughts with the community.'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 ${
                  errors.title ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Enter your post title"
                maxLength={MAX_TITLE_LENGTH}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.title ? (
                  <p className="text-sm text-red-600">{errors.title}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-gray-400">
                  {title.length}/{MAX_TITLE_LENGTH}
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-gray-900 resize-vertical ${
                  errors.content ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Write your blog post content here..."
                maxLength={MAX_CONTENT_LENGTH}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.content ? (
                  <p className="text-sm text-red-600">{errors.content}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-gray-400">
                  {content.length}/{MAX_CONTENT_LENGTH}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEditing
                    ? 'Updating...'
                    : 'Publishing...'
                  : isEditing
                    ? 'Update Post'
                    : 'Publish Post'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="text-gray-600 hover:text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default WriteBlog;