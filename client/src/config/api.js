/**
 * API Configuration
 * Handles API base URL for both development and production
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

export { API_BASE_URL, SOCKET_URL };

