import { apiRequest, USE_MOCK_API } from './apiConfig.js';

const DEMO_ADMIN_USER = {
  id: 1,
  name: 'Claire Bennett',
  email: 'admin@foliolibrary.org',
  role: 'Head Librarian',
};

const simulateNetworkDelay = (ms = 220) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Authenticates an admin user.
 * Spring Boot endpoint: POST /api/auth/login
 */
export async function loginAdmin({ email, password }) {
  if (!USE_MOCK_API) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  await simulateNetworkDelay();

  const normalizedEmail = email.trim().toLowerCase();
  if (
    normalizedEmail === 'admin@foliolibrary.org' &&
    password === 'admin123'
  ) {
    return {
      user: DEMO_ADMIN_USER,
      token: 'demo-session-token',
    };
  }

  throw new Error(
    'Invalid email or password. Use admin@foliolibrary.org / admin123 for demo access.'
  );
}

/**
 * Logs out the current admin session.
 * Spring Boot endpoint: POST /api/auth/logout
 */
export async function logoutAdmin() {
  if (!USE_MOCK_API) {
    return apiRequest('/auth/logout', { method: 'POST' });
  }

  await simulateNetworkDelay(100);
  return { success: true };
}
