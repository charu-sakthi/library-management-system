
/**
 * Central API configuration for Spring Boot backend.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const USE_MOCK_API = false;

/**
 * Standard API request wrapper.
 * Automatically attaches JWT authentication token.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get JWT token saved during login
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',

      // Attach JWT token to protected API requests
      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // Handle API errors
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();

      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep default error message
    }

    throw new Error(message);
  }

  // Handle empty responses
  if (response.status === 204) {
    return null;
  }

  // Return JSON response
  return response.json();
}
