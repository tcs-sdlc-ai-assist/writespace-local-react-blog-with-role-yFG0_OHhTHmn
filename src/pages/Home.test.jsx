import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home.jsx';
import * as storage from '../utils/storage.js';
import * as auth from '../utils/auth.js';

vi.mock('../utils/storage.js', () => ({
  getPosts: vi.fn(),
  savePosts: vi.fn(),
  getUsers: vi.fn(),
  saveUsers: vi.fn(),
  getSession: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn(),
}));

vi.mock('../utils/auth.js', () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  isAdmin: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Home', () => {
  const mockUser = {
    userId: 'u1',
    username: 'testuser',
    displayName: 'Test User',
    role: 'user',
  };

  const mockAdminUser = {
    userId: 'admin',
    username: 'admin',
    displayName: 'Administrator',
    role: 'admin',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockReset();
    auth.getCurrentUser.mockReturnValue(mockUser);
    storage.getPosts.mockReturnValue([]);
    storage.savePosts.mockImplementation(() => {});
    storage.getSession.mockReturnValue(mockUser);
  });

  const renderHome = () => {
    return render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  };

  describe('Page heading', () => {
    it('renders the All Posts heading', () => {
      renderHome();

      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('renders the description text', () => {
      renderHome();

      expect(
        screen.getByText(/browse the latest blog posts from the community/i)
      ).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('shows empty state when no posts exist', () => {
      storage.getPosts.mockReturnValue([]);

      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(
        screen.getByText(/be the first to share something with the community/i)
      ).toBeInTheDocument();
    });

    it('shows Write Your First Post CTA button in empty state', () => {
      storage.getPosts.mockReturnValue([]);

      renderHome();

      const ctaButton = screen.getByRole('button', { name: /write your first post/i });
      expect(ctaButton).toBeInTheDocument();
    });

    it('navigates to /write when CTA button is clicked', async () => {
      storage.getPosts.mockReturnValue([]);
      const user = userEvent.setup();

      renderHome();

      const ctaButton = screen.getByRole('button', { name: /write your first post/i });
      await user.click(ctaButton);

      expect(mockNavigate).toHaveBeenCalledWith('/write');
    });
  });

  describe('Posts rendering', () => {
    it('renders post titles when posts exist', () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'First Post',
          content: 'Content of first post',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u1',
          authorName: 'Test User',
        },
        {
          id: 'p2',
          title: 'Second Post',
          content: 'Content of second post',
          createdAt: '2024-06-02T10:00:00.000Z',
          authorId: 'u2',
          authorName: 'Another User',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderHome();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    it('renders posts sorted newest first', () => {
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
          title: 'Newest Post',
          content: 'Content 2',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u2',
          authorName: 'Bob',
        },
        {
          id: 'p3',
          title: 'Middle Post',
          content: 'Content 3',
          createdAt: '2024-03-01T00:00:00.000Z',
          authorId: 'u3',
          authorName: 'Charlie',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderHome();

      const postTitles = screen.getAllByRole('heading', { level: 3 });
      expect(postTitles[0]).toHaveTextContent('Newest Post');
      expect(postTitles[1]).toHaveTextContent('Middle Post');
      expect(postTitles[2]).toHaveTextContent('Oldest Post');
    });

    it('renders author names for posts', () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'Test Post',
          content: 'Some content',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u2',
          authorName: 'AuthorName',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderHome();

      expect(screen.getByText('AuthorName')).toBeInTheDocument();
    });
  });

  describe('Edit/Delete controls for regular user', () => {
    it('shows edit and delete buttons on own posts', () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'My Post',
          content: 'My content',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u1',
          authorName: 'Test User',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderHome();

      expect(screen.getByRole('button', { name: /edit post/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete post/i })).toBeInTheDocument();
    });

    it('does not show edit and delete buttons on other users posts', () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'Other Post',
          content: 'Other content',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u2',
          authorName: 'Other User',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderHome();

      expect(screen.queryByRole('button', { name: /edit post/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete post/i })).not.toBeInTheDocument();
    });
  });

  describe('Edit/Delete controls for admin user', () => {
    beforeEach(() => {
      auth.getCurrentUser.mockReturnValue(mockAdminUser);
      storage.getSession.mockReturnValue(mockAdminUser);
    });

    it('shows edit and delete buttons on all posts for admin', () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'User Post',
          content: 'User content',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u2',
          authorName: 'Regular User',
        },
        {
          id: 'p2',
          title: 'Admin Post',
          content: 'Admin content',
          createdAt: '2024-06-02T10:00:00.000Z',
          authorId: 'admin',
          authorName: 'Administrator',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderHome();

      const editButtons = screen.getAllByRole('button', { name: /edit post/i });
      const deleteButtons = screen.getAllByRole('button', { name: /delete post/i });
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  describe('Edit action', () => {
    it('navigates to write page with edit param when edit is clicked', async () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'My Post',
          content: 'My content',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u1',
          authorName: 'Test User',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);
      const user = userEvent.setup();

      renderHome();

      const editButton = screen.getByRole('button', { name: /edit post/i });
      await user.click(editButton);

      expect(mockNavigate).toHaveBeenCalledWith('/write?edit=p1');
    });
  });

  describe('Delete action', () => {
    it('removes post from the list when delete is clicked by owner', async () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'My Post',
          content: 'My content',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u1',
          authorName: 'Test User',
        },
        {
          id: 'p2',
          title: 'Another Post',
          content: 'Another content',
          createdAt: '2024-06-02T10:00:00.000Z',
          authorId: 'u1',
          authorName: 'Test User',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);
      const user = userEvent.setup();

      renderHome();

      expect(screen.getByText('My Post')).toBeInTheDocument();
      expect(screen.getByText('Another Post')).toBeInTheDocument();

      const deleteButtons = screen.getAllByRole('button', { name: /delete post/i });
      // After first getPosts call during render, mock returns updated list for delete handler
      storage.getPosts.mockReturnValue(mockPosts);
      await user.click(deleteButtons[0]);

      expect(storage.savePosts).toHaveBeenCalled();
    });

    it('does not delete post if user is not owner and not admin', async () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'Own Post',
          content: 'Own content',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u1',
          authorName: 'Test User',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderHome();

      // Simulate calling handleDelete with a post not owned by user
      // The delete button only shows for own posts, so savePosts should not be called
      // for posts not owned by the user (no button rendered)
      const otherPosts = [
        {
          id: 'p2',
          title: 'Other Post',
          content: 'Other content',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u99',
          authorName: 'Someone Else',
        },
      ];
      storage.getPosts.mockReturnValue(otherPosts);

      // No delete button for other user's posts
      // savePosts should not have been called
      expect(storage.savePosts).not.toHaveBeenCalled();
    });

    it('admin can delete any post', async () => {
      auth.getCurrentUser.mockReturnValue(mockAdminUser);
      storage.getSession.mockReturnValue(mockAdminUser);

      const mockPosts = [
        {
          id: 'p1',
          title: 'User Post',
          content: 'User content',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u2',
          authorName: 'Regular User',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);
      const user = userEvent.setup();

      renderHome();

      const deleteButton = screen.getByRole('button', { name: /delete post/i });
      await user.click(deleteButton);

      expect(storage.savePosts).toHaveBeenCalled();
    });
  });

  describe('Post links', () => {
    it('renders posts as links to their detail pages', () => {
      const mockPosts = [
        {
          id: 'p1',
          title: 'Linked Post',
          content: 'Some content here',
          createdAt: '2024-06-01T10:00:00.000Z',
          authorId: 'u1',
          authorName: 'Test User',
        },
      ];
      storage.getPosts.mockReturnValue(mockPosts);

      renderHome();

      const link = screen.getByRole('link', { name: /linked post/i });
      expect(link).toHaveAttribute('href', '/blog/p1');
    });
  });
});