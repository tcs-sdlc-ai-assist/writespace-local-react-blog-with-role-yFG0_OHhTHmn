import PropTypes from 'prop-types';

/**
 * Avatar component that renders role-distinct visual avatars.
 * Admin: crown emoji (👑) with violet background.
 * User: book emoji (📖) with indigo background.
 *
 * @param {object} props
 * @param {'admin' | 'user'} props.role - The role of the user.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the avatar.
 * @returns {JSX.Element}
 */
export function Avatar({ role, size = 'md' }) {
  const isAdmin = role === 'admin';

  const emoji = isAdmin ? '👑' : '📖';
  const bgClass = isAdmin ? 'bg-violet-500' : 'bg-indigo-500';

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-lg',
    lg: 'h-14 w-14 text-2xl',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`${bgClass} ${sizeClass} inline-flex items-center justify-center rounded-full flex-shrink-0`}
      role="img"
      aria-label={isAdmin ? 'Admin avatar' : 'User avatar'}
    >
      <span>{emoji}</span>
    </div>
  );
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Avatar;