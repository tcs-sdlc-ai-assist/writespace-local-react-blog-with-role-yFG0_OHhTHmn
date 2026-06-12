import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login, register, logout, getCurrentUser, isAdmin } from './auth.js';
import * as storage from './storage.js';

vi.mock('./storage.js', () => ({
  getUsers: vi.fn(),
  saveUsers: vi.fn(),
  getSession: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn(),
}));

describe('auth utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    storage.getUsers.mockReturnValue([]);
    storage.getSession.mockReturnValue(null);
    storage.saveUsers.mockImplementation(() => {});
    storage.saveSession.mockImplementation(() => {});
    storage.clearSession.mockImplementation(() => {});
  });

  describe('login', () => {
    it('logs in hard-coded admin with correct credentials', () => {
      const session = login('admin', 'admin123');

      expect(session).toEqual({
        userId: 'admin',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });
      expect(storage.saveSession).toHaveBeenCalledWith(session);
    });

    it('throws error for hard-coded admin with wrong password', () => {
      expect(() => login('admin', 'wrongpassword')).toThrow('Invalid username or password');
    });

    it('logs in a localStorage user with correct credentials', () => {
      const mockUsers = [
        {
          id: 'u1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'testpass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      const session = login('testuser', 'testpass');

      expect(session).toEqual({
        userId: 'u1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });
      expect(storage.saveSession).toHaveBeenCalledWith(session);
    });

    it('throws error for localStorage user with wrong password', () => {
      const mockUsers = [
        {
          id: 'u1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'testpass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      expect(() => login('testuser', 'wrongpass')).toThrow('Invalid username or password');
    });

    it('throws error for non-existent username', () => {
      storage.getUsers.mockReturnValue([]);

      expect(() => login('nonexistent', 'somepass')).toThrow('Invalid username or password');
    });

    it('throws error when username is empty', () => {
      expect(() => login('', 'password')).toThrow('Username and password are required');
    });

    it('throws error when password is empty', () => {
      expect(() => login('admin', '')).toThrow('Username and password are required');
    });

    it('throws error when both username and password are empty', () => {
      expect(() => login('', '')).toThrow('Username and password are required');
    });

    it('throws error when username is undefined', () => {
      expect(() => login(undefined, 'password')).toThrow('Username and password are required');
    });

    it('throws error when password is undefined', () => {
      expect(() => login('admin', undefined)).toThrow('Username and password are required');
    });

    it('logs in an admin-role localStorage user correctly', () => {
      const mockUsers = [
        {
          id: 'u2',
          displayName: 'Admin Two',
          username: 'admin2',
          password: 'adminpass',
          role: 'admin',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      const session = login('admin2', 'adminpass');

      expect(session).toEqual({
        userId: 'u2',
        username: 'admin2',
        displayName: 'Admin Two',
        role: 'admin',
      });
    });
  });

  describe('register', () => {
    it('registers a new user successfully', () => {
      storage.getUsers.mockReturnValue([]);

      const session = register({
        displayName: 'New User',
        username: 'newuser',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(session.username).toBe('newuser');
      expect(session.displayName).toBe('New User');
      expect(session.role).toBe('user');
      expect(session.userId).toBeDefined();
      expect(storage.saveUsers).toHaveBeenCalled();
      expect(storage.saveSession).toHaveBeenCalledWith(session);
    });

    it('saves the new user to the users array', () => {
      storage.getUsers.mockReturnValue([]);

      register({
        displayName: 'New User',
        username: 'newuser',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      const savedUsers = storage.saveUsers.mock.calls[0][0];
      expect(savedUsers).toHaveLength(1);
      expect(savedUsers[0].username).toBe('newuser');
      expect(savedUsers[0].displayName).toBe('New User');
      expect(savedUsers[0].password).toBe('pass123');
      expect(savedUsers[0].role).toBe('user');
      expect(savedUsers[0].id).toBeDefined();
      expect(savedUsers[0].createdAt).toBeDefined();
    });

    it('throws error when displayName is missing', () => {
      expect(() =>
        register({
          displayName: '',
          username: 'newuser',
          password: 'pass123',
          confirmPassword: 'pass123',
        })
      ).toThrow('All fields are required');
    });

    it('throws error when username is missing', () => {
      expect(() =>
        register({
          displayName: 'New User',
          username: '',
          password: 'pass123',
          confirmPassword: 'pass123',
        })
      ).toThrow('All fields are required');
    });

    it('throws error when password is missing', () => {
      expect(() =>
        register({
          displayName: 'New User',
          username: 'newuser',
          password: '',
          confirmPassword: 'pass123',
        })
      ).toThrow('All fields are required');
    });

    it('throws error when confirmPassword is missing', () => {
      expect(() =>
        register({
          displayName: 'New User',
          username: 'newuser',
          password: 'pass123',
          confirmPassword: '',
        })
      ).toThrow('All fields are required');
    });

    it('throws error when passwords do not match', () => {
      expect(() =>
        register({
          displayName: 'New User',
          username: 'newuser',
          password: 'pass123',
          confirmPassword: 'pass456',
        })
      ).toThrow('Passwords do not match');
    });

    it('throws error when username is "admin"', () => {
      expect(() =>
        register({
          displayName: 'Sneaky Admin',
          username: 'admin',
          password: 'pass123',
          confirmPassword: 'pass123',
        })
      ).toThrow('Username already exists');
    });

    it('throws error when username already exists in localStorage', () => {
      const mockUsers = [
        {
          id: 'u1',
          displayName: 'Existing User',
          username: 'existinguser',
          password: 'pass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      expect(() =>
        register({
          displayName: 'Another User',
          username: 'existinguser',
          password: 'pass123',
          confirmPassword: 'pass123',
        })
      ).toThrow('Username already exists');
    });

    it('throws error when display name exceeds 40 characters', () => {
      expect(() =>
        register({
          displayName: 'A'.repeat(41),
          username: 'newuser',
          password: 'pass123',
          confirmPassword: 'pass123',
        })
      ).toThrow('Display name must be 40 characters or less');
    });

    it('throws error when username exceeds 20 characters', () => {
      expect(() =>
        register({
          displayName: 'New User',
          username: 'a'.repeat(21),
          password: 'pass123',
          confirmPassword: 'pass123',
        })
      ).toThrow('Username must be 20 characters or less');
    });

    it('allows display name of exactly 40 characters', () => {
      storage.getUsers.mockReturnValue([]);

      const session = register({
        displayName: 'A'.repeat(40),
        username: 'newuser',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(session.displayName).toBe('A'.repeat(40));
    });

    it('allows username of exactly 20 characters', () => {
      storage.getUsers.mockReturnValue([]);

      const session = register({
        displayName: 'New User',
        username: 'a'.repeat(20),
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(session.username).toBe('a'.repeat(20));
    });
  });

  describe('logout', () => {
    it('calls clearSession to remove the session', () => {
      logout();

      expect(storage.clearSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCurrentUser', () => {
    it('returns the session when a user is logged in', () => {
      const mockSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      };
      storage.getSession.mockReturnValue(mockSession);

      const user = getCurrentUser();

      expect(user).toEqual(mockSession);
    });

    it('returns null when no user is logged in', () => {
      storage.getSession.mockReturnValue(null);

      const user = getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('returns true when the logged-in user has admin role', () => {
      storage.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });

      expect(isAdmin()).toBe(true);
    });

    it('returns false when the logged-in user has user role', () => {
      storage.getSession.mockReturnValue({
        userId: 'u1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      expect(isAdmin()).toBe(false);
    });

    it('returns false when no user is logged in', () => {
      storage.getSession.mockReturnValue(null);

      expect(isAdmin()).toBe(false);
    });
  });
});