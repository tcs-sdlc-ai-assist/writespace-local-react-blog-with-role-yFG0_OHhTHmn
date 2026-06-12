import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from './LandingPage.jsx';
import * as storage from '../utils/storage.js';

vi.mock('../utils/storage.js', () => ({
  getPosts: vi.fn(),
  savePosts: vi.fn(),
  getUsers: vi.fn(),
  saveUsers: vi.fn(),
  getSession: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn(),
}));

describe('LandingPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    storage.getPosts.mockReturnValue([]);
    storage.getSession.mockReturnValue(null);
  });

  const renderLandingPage = () => {
    return render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
  };

  describe('Hero Section', () => {
    it('renders the app name in the hero section', () => {
      renderLandingPage();

      const headings = screen.getAllByText(/WriteSpace/i);
      expect(headings.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the Get Started CTA button linking to register', () => {
      renderLandingPage();

      const getStartedLink = screen.getByRole('link', { name: /get started/i });
      expect(getStartedLink).toBeInTheDocument();
      expect(getStartedLink).toHaveAttribute('href', '/register');
    });

    it('renders the Login CTA button linking to login', () => {
      renderLandingPage();

      const loginLinks = screen.getAllByRole('link', { name: /login/i });
      const heroLoginLink = loginLinks.find((link) => link.getAttribute('href') === '/login');
      expect(heroLoginLink).toBeInTheDocument();
    });

    it('renders the hero description text', () => {
      renderLandingPage();

      expect(
        screen.getByText(/your private, local-first blogging platform/i)
      ).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('renders the features section heading', () => {
      renderLandingPage();

      expect(screen.getByText(/why writespace\?/i)).toBeInTheDocument();
    });

    it('renders three feature cards', () => {
      renderLandingPage();

      expect(screen.getByText(/write & publish/i)).toBeInTheDocument();
      expect(screen.getByText(/role-based access/i)).toBeInTheDocument();
      expect(screen.getByText(/local & private/i)).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
      renderLandingPage();

      expect(
        screen.getByText(/create and publish blog posts with an intuitive editor/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/secure role-based system with admin and user roles/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/all your data stays in your browser/i)
      ).toBeInTheDocument();
    });
  });

  describe('Latest Posts Section', () => {
    it('renders the latest posts section heading', () => {
      renderLandingPage();

      expect(screen.getByText(/latest posts/i)).toBeInTheDocument();
    });

    it('shows empty state when no posts exist', () => {
      storage.getPosts.mockReturnValue([]);

      renderLandingPage();

      expect(
        screen.getByText(/no posts yet\. be the first to write something!/i)
      ).toBeInTheDocument();
    });

    it('shows a Start Writing link in empty state', () => {
      storage.getPosts.mockReturnValue([]);

      renderLandingPage();

      const startWritingLink = screen.getByRole('link', { name: /start writing/i });
      expect(startWritingLink).toBeInTheDocument();
      expect(startWritingLink).toHaveAttribute('href', '/register');
    });

    it('renders post titles when posts exist in localStorage', () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'First Blog Post',
          content: 'This is the content of the first post.',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u1',
          authorName: 'Alice',
        },
        {
          id: 'p2',
          title: 'Second Blog Post',
          content: 'This is the content of the second post.',
          createdAt: '2024-06-02T10:00:00.000Z',
          authorId: 'u2',
          authorName: 'Bob',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderLandingPage();

      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
    });

    it('renders at most three latest posts sorted by newest first', () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'Oldest Post',
          content: 'Content 1',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'u1',
          authorName: 'Alice',
        },
        {
          id: 'p2',
          title: 'Middle Post',
          content: 'Content 2',
          createdAt: '2024-03-01T00:00:00.000Z',
          authorId: 'u2',
          authorName: 'Bob',
        },
        {
          id: 'p3',
          title: 'Newest Post',
          content: 'Content 3',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u3',
          authorName: 'Charlie',
        },
        {
          id: 'p4',
          title: 'Extra Post Should Not Show',
          content: 'Content 4',
          createdAt: '2024-02-01T00:00:00.000Z',
          authorId: 'u4',
          authorName: 'Diana',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderLandingPage();

      expect(screen.getByText('Newest Post')).toBeInTheDocument();
      expect(screen.getByText('Middle Post')).toBeInTheDocument();
      expect(screen.getByText('Oldest Post')).toBeInTheDocument();
      expect(screen.queryByText('Extra Post Should Not Show')).not.toBeInTheDocument();
    });

    it('renders author names for displayed posts', () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'Test Post',
          content: 'Some content here',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u1',
          authorName: 'TestAuthor',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderLandingPage();

      expect(screen.getByText('TestAuthor')).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('renders the footer with app name', () => {
      renderLandingPage();

      const footerText = screen.getByText(/© \d{4} WriteSpace\. All rights reserved\./i);
      expect(footerText).toBeInTheDocument();
    });

    it('renders footer login and register links', () => {
      renderLandingPage();

      const registerLinks = screen.getAllByRole('link', { name: /register/i });
      expect(registerLinks.length).toBeGreaterThanOrEqual(1);

      const loginLinks = screen.getAllByRole('link', { name: /login/i });
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('PublicNavbar', () => {
    it('renders the PublicNavbar with app branding', () => {
      renderLandingPage();

      const navLinks = screen.getAllByText(/WriteSpace/i);
      expect(navLinks.length).toBeGreaterThanOrEqual(1);
    });
  });
});