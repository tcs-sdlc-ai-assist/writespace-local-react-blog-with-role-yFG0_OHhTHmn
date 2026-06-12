import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import { PublicNavbar } from '../components/PublicNavbar.jsx';
import { BlogCard } from '../components/BlogCard.jsx';

/**
 * LandingPage component - public-facing landing page.
 * Renders hero section, features section, latest posts preview, and footer.
 * @returns {JSX.Element}
 */
export function LandingPage() {
  const allPosts = getPosts();
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const features = [
    {
      icon: '✍️',
      title: 'Write & Publish',
      description: 'Create and publish blog posts with an intuitive editor. Share your thoughts with the world in just a few clicks.',
    },
    {
      icon: '🔒',
      title: 'Role-Based Access',
      description: 'Secure role-based system with admin and user roles. Admins manage content and users, while writers focus on creating.',
    },
    {
      icon: '💾',
      title: 'Local & Private',
      description: 'All your data stays in your browser. No servers, no tracking — complete privacy for your writing journey.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            ✍️ WriteSpace
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Your private, local-first blogging platform. Write, publish, and manage blog posts — all without leaving your browser.
          </p>
          <div className="mt-10 flex items-center justify-center space-x-4">
            <Link
              to="/register"
              className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg text-base transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg text-base transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why WriteSpace?</h2>
            <p className="mt-3 text-gray-600 text-lg max-w-xl mx-auto">
              Everything you need to start blogging, right in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
            <p className="mt-3 text-gray-600 text-lg max-w-xl mx-auto">
              See what people are writing about on WriteSpace.
            </p>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">📝</p>
              <p className="text-gray-500 text-lg">No posts yet. Be the first to write something!</p>
              <Link
                to="/register"
                className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors"
              >
                Start Writing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-6 sm:mb-0">
              <span className="text-xl font-bold">✍️ WriteSpace</span>
              <p className="text-gray-400 text-sm mt-1">Your private blogging platform.</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;