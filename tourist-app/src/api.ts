import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Define a base URL for your API.
// Replace this with your actual API endpoint.
// For example: 'https://api.yourdomain.com/v1'
// Or, if you are running a local backend: 'http://localhost:8000/api'
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api'; // Fallback to /api if not set in .env

interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for request or response
// For example, to add an auth token to every request
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken'); // Directly get token from localStorage
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle global errors here
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized (401). Token might be invalid or expired.');
      // Optional: Clear token and redirect to login
      // localStorage.removeItem('authToken'); // Consider if AuthContext should solely manage this
      // window.location.href = '/login'; // Force redirect
      // Or, simply let the caller handle the error if more specific action is needed.
      // For now, we will just log it and re-throw. Specific components or contexts
      // can catch this error and decide to logout or redirect.
      // If we want a hard redirect, uncomment localStorage.removeItem and window.location.
    }
    // It's important to return Promise.reject(error) so that individual .catch() blocks still work.
    // However, we are already wrapping errors in handleApiError in get/post/put/del.
    // The handleApiError function will be the one shaping the error.
    // So, the interceptor's main job here is to react to specific statuses globally if needed.
    // The actual error object will be processed by handleApiError.
    return Promise.reject(error); // This will then be caught by handleApiError
  }
);

/**
 * Generic GET request handler
 * @param path API endpoint path (e.g., "/places")
 * @param params Optional query parameters
 * @returns Promise<T>
 */
export const get = async <T>(path: string, params?: Record<string, any>): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(path, { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

/**
 * Generic POST request handler
 * @param path API endpoint path (e.g., "/trips")
 * @param data Data to be sent in the request body
 * @returns Promise<T>
 */
export const post = async <T>(path: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.post(path, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

/**
 * Generic PUT request handler
 * @param path API endpoint path (e.g., "/trips/1")
 * @param data Data to be sent in the request body
 * @returns Promise<T>
 */
export const put = async <T>(path: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.put(path, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

/**
 * Generic DELETE request handler
 * @param path API endpoint path (e.g., "/trips/1")
 * @returns Promise<T>
 */
export const del = async <T>(path: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.delete(path);
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

/**
 * Handles API errors and transforms them into a consistent error object.
 * @param error The error object from Axios (or other sources)
 * @returns ApiError
 */
const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
    return {
      message: (error.response.data as any)?.message || error.message || 'An unknown server error occurred.',
      status: error.response.status,
      details: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API No Response:', error.request);
    return {
      message: 'No response from server. Please check your network connection.',
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Request Setup Error:', error.message);
    return {
      message: error.message || 'An error occurred while setting up the request.',
    };
  }
};

export default apiClient;
