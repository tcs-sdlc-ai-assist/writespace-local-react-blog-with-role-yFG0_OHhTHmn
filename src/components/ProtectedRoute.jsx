import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCurrentUser } from '../utils/auth.js';

/**
 * ProtectedRoute component for authentication and role-based access control.
 * Checks authentication via getCurrentUser.
 * If not authenticated, redirects to /login.
 * If adminOnly prop is true and user is not admin, redirects to /blogs.
 * Otherwise renders children.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The child components to render if authorized.
 * @param {boolean} [props.adminOnly=false] - Whether the route requires admin role.
 * @returns {JSX.Element}
 */
export function ProtectedRoute({ children, adminOnly = false }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;