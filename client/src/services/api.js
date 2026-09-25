import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for centralized error transformation
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected network error occurred';

    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      errorMessage = error.response.data?.error || error.response.data?.message || `Error ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received (server down, CORS issue)
      errorMessage = 'Unable to connect to the server. Please ensure the backend is running.';
    } else {
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    return Promise.reject(enhancedError);
  }
);

/**
 * Fetch all tickets with optional status and search filters
 * @param {Object} params - { status?: string, search?: string }
 */
export const getTickets = async (params = {}) => {
  const cleanParams = {};
  if (params.status && params.status !== 'All') {
    cleanParams.status = params.status;
  }
  if (params.search && params.search.trim()) {
    cleanParams.search = params.search.trim();
  }

  return apiClient.get('/tickets', { params: cleanParams });
};

/**
 * Fetch dashboard KPI statistics
 */
export const getTicketStats = async () => {
  return apiClient.get('/tickets/stats');
};

/**
 * Fetch single ticket details by ticketId
 * @param {string} ticketId - e.g. TKT-001
 */
export const getTicketById = async (ticketId) => {
  return apiClient.get(`/tickets/${encodeURIComponent(ticketId)}`);
};

/**
 * Create a new support ticket
 * @param {Object} ticketData - { customer_name, customer_email, subject, description, priority }
 */
export const createTicket = async (ticketData) => {
  return apiClient.post('/tickets', ticketData);
};

/**
 * Update an existing ticket (status, priority, and/or append notes)
 * @param {string} ticketId - e.g. TKT-001
 * @param {Object} updateData - { status?: string, priority?: string, notes?: string }
 */
export const updateTicket = async (ticketId, updateData) => {
  return apiClient.put(`/tickets/${encodeURIComponent(ticketId)}`, updateData);
};

export default apiClient;
