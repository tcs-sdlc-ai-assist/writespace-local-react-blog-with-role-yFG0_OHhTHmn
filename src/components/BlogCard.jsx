import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCurrentUser } from '../utils/auth.js';
import { Avatar } from './Avatar.jsx';

/**
 * BlogCard component for displaying a blog post preview in a grid.
 * Shows title, author with Avatar, date, content excerpt, and
 * conditional edit/delete controls based on ownership.
 * Admin can edit/delete all posts; users can only edit/delete their own.
 *
 * @param {object} props
 * @param {object} props.post - The blog post object.
 * @param {string} props.post.id - The post ID.
 * @param {string} props.post.title - The post title.
 * @param {string} props.post.content - The post content.
 * @param {string} props.post.createdAt - The ISO date string of creation.
 * @param {string} props.post.authorId - The author's user ID.
 * @param {string} props.post.authorName - The author's display name.
 * @param {function} [props.onDelete] - Callback when delete is clicked, receives post id.
 * @param {function} [props.onEdit] - Callback when edit is clicked, receives post id.
 * @returns {JSX.Element}
 */
export function BlogCard({ post, onDelete, onEdit }) {
  const user = getCurrentUser();

  const isAdmin = user && user.role === 'admin';
  const isOwner = user && user.userId === post.authorId;
  const canModify = isAdmin || isOwner;

  const authorRole = post.authorId === 'admin' ? 'admin' : 'user';

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

  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trimEnd() + '...';
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(post.id);
    }
  };

  return (
    <Link
      to={`/blog/${post.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar role={authorRole} size="sm" />
            <div>
              <p className="text-sm font-medium text-gray-800">{post.authorName}</p>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {canModify && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-indigo-50"
                aria-label="Edit post"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                aria-label="Delete post"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{getExcerpt(post.content)}</p>
      </div>
    </Link>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default BlogCard;