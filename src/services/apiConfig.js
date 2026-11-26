/**
 * Central API configuration for connecting to a Java Spring Boot REST backend.
 *
 * When your Spring Boot server is running (e.g., on http://localhost:8080),
 * set USE_MOCK_API to `false` and configure VITE_API_BASE_URL in `.env`.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const USE_MOCK_API = true;

/**
 * Standard fetch wrapper ready for Spring Boot REST endpoints.
 * Automatically parses JSON responses and throws descriptive errors.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // Response body was not JSON; keep default status message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
