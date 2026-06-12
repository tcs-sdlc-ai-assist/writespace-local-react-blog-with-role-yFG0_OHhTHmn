import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  savePosts,
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'Test User',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_posts', '{invalid json}');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const posts = getPosts();
      expect(posts).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const posts = getPosts();
      expect(posts).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'Test User',
        },
      ];

      savePosts(mockPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(mockPosts);
    });

    it('overwrites existing posts in localStorage', () => {
      const oldPosts = [{ id: '1', title: 'Old' }];
      const newPosts = [{ id: '2', title: 'New' }];

      localStorage.setItem('writespace_posts', JSON.stringify(oldPosts));
      savePosts(newPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(newPosts);
    });

    it('handles localStorage.setItem throwing gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => savePosts([{ id: '1' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns parsed users array from localStorage', () => {
      const mockUsers = [
        {
          id: 'u1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toEqual(mockUsers);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_users', 'not-json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const users = getUsers();
      expect(users).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const users = getUsers();
      expect(users).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage', () => {
      const mockUsers = [
        {
          id: 'u1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      saveUsers(mockUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(mockUsers);
    });

    it('overwrites existing users in localStorage', () => {
      const oldUsers = [{ id: 'u1', username: 'old' }];
      const newUsers = [{ id: 'u2', username: 'new' }];

      localStorage.setItem('writespace_users', JSON.stringify(oldUsers));
      saveUsers(newUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(newUsers);
    });

    it('handles localStorage.setItem throwing gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => saveUsers([{ id: 'u1' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      const mockSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
    });

    it('returns null when localStorage contains invalid JSON for session', () => {
      localStorage.setItem('writespace_session', '{{broken');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const session = getSession();
      expect(session).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns null when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const session = getSession();
      expect(session).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('saveSession', () => {
    it('saves session object to localStorage', () => {
      const mockSession = {
        userId: 'u1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };

      saveSession(mockSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(mockSession);
    });

    it('overwrites existing session in localStorage', () => {
      const oldSession = { userId: 'u1', username: 'old', displayName: 'Old', role: 'user' };
      const newSession = { userId: 'u2', username: 'new', displayName: 'New', role: 'admin' };

      localStorage.setItem('writespace_session', JSON.stringify(oldSession));
      saveSession(newSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(newSession);
    });

    it('handles localStorage.setItem throwing gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() =>
        saveSession({ userId: 'u1', username: 'test', displayName: 'Test', role: 'user' })
      ).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const mockSession = {
        userId: 'u1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      clearSession();

      expect(localStorage.getItem('writespace_session')).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('handles localStorage.removeItem throwing gracefully', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => clearSession()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('does not affect other localStorage keys', () => {
      const mockPosts = [{ id: '1', title: 'Test' }];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
      localStorage.setItem('writespace_session', JSON.stringify({ userId: 'u1' }));

      clearSession();

      expect(localStorage.getItem('writespace_session')).toBeNull();
      const storedPosts = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(storedPosts).toEqual(mockPosts);
    });
  });
});