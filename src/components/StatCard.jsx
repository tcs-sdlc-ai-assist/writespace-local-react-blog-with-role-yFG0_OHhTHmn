import PropTypes from 'prop-types';

/**
 * StatCard component for the admin dashboard.
 * Displays a label, value, and optional icon with configurable color theme.
 *
 * @param {object} props
 * @param {string} props.label - The statistic label text.
 * @param {string|number} props.value - The statistic value to display.
 * @param {string} [props.icon] - Optional emoji or icon string to display.
 * @param {'indigo' | 'violet' | 'emerald' | 'rose' | 'amber'} [props.color='indigo'] - The color theme for the card.
 * @returns {JSX.Element}
 */
export function StatCard({ label, value, icon, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      gradient: 'from-indigo-500 to-indigo-600',
      shadow: 'shadow-indigo-200',
      iconBg: 'bg-indigo-400/30',
    },
    violet: {
      gradient: 'from-violet-500 to-violet-600',
      shadow: 'shadow-violet-200',
      iconBg: 'bg-violet-400/30',
    },
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-200',
      iconBg: 'bg-emerald-400/30',
    },
    rose: {
      gradient: 'from-rose-500 to-rose-600',
      shadow: 'shadow-rose-200',
      iconBg: 'bg-rose-400/30',
    },
    amber: {
      gradient: 'from-amber-500 to-amber-600',
      shadow: 'shadow-amber-200',
      iconBg: 'bg-amber-400/30',
    },
  };

  const theme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`bg-gradient-to-br ${theme.gradient} ${theme.shadow} rounded-xl shadow-lg p-6 text-white transition-transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
        {icon && (
          <div
            className={`${theme.iconBg} h-12 w-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0`}
          >
            <span>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string,
  color: PropTypes.oneOf(['indigo', 'violet', 'emerald', 'rose', 'amber']),
};

export default StatCard;