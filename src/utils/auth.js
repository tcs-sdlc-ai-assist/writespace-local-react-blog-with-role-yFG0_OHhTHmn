import { getUsers, saveUsers, getSession, saveSession, clearSession } from './storage.js';

/**
 * Hard-coded admin credentials.
 */
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

/**
 * Generates a simple unique ID.
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

/**
 * Attempts to log in a user with the given credentials.
 * Checks hard-coded admin credentials first, then localStorage users.
 * @param {string} username
 * @param {string} password
 * @returns {{userId: string, username: string, displayName: string, role: string}} The session object.
 * @throws {Error} If credentials are invalid.
 */
export function login(username, password) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session = {
      userId: 'admin',
      username: ADMIN_USERNAME,
      displayName: 'Administrator',
      role: 'admin',
    };
    saveSession(session);
    return session;
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
  saveSession(session);
  return session;
}

/**
 * Registers a new user.
 * @param {{displayName: string, username: string, password: string, confirmPassword: string}} userData
 * @returns {{userId: string, username: string, displayName: string, role: string}} The session object.
 * @throws {Error} If validation fails or username is taken.
 */
export function register({ displayName, username, password, confirmPassword }) {
  if (!displayName || !username || !password || !confirmPassword) {
    throw new Error('All fields are required');
  }

  if (displayName.length > 40) {
    throw new Error('Display name must be 40 characters or less');
  }

  if (username.length > 20) {
    throw new Error('Username must be 20 characters or less');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  if (username === ADMIN_USERNAME) {
    throw new Error('Username already exists');
  }

  const users = getUsers();
  const existingUser = users.find((u) => u.username === username);

  if (existingUser) {
    throw new Error('Username already exists');
  }

  const newUser = {
    id: generateId(),
    displayName,
    username,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const session = {
    userId: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
  };
  saveSession(session);
  return session;
}

/**
 * Logs out the current user by clearing the session.
 */
export function logout() {
  clearSession();
}

/**
 * Retrieves the current logged-in user's session.
 * @returns {{userId: string, username: string, displayName: string, role: string} | null}
 */
export function getCurrentUser() {
  return getSession();
}

/**
 * Checks if the current logged-in user has the admin role.
 * @returns {boolean}
 */
export function isAdmin() {
  const session = getSession();
  return session !== null && session.role === 'admin';
}