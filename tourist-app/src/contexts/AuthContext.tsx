import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
// import axios from 'axios'; // No longer directly needed here, api service will handle it
import { get } from '../api'; // Import the generic get function

interface AuthContextType {
  token: string | null;
  userInfo: Record<string, any> | null; // Adjust 'any' to a more specific user type if available
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (newToken: string) => Promise<void>;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to parse JWT token (optional, if you need to extract info directly)
// const parseJwt = (token: string) => {
//   try {
//     return JSON.parse(atob(token.split('.')[1]));
//   } catch (e) {
//     return null;
//   }
// };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True initially to check for existing token

  const fetchUserInfo = useCallback(async () => {
    if (token) {
      try {
        // Assuming an endpoint to get user info based on the token
        // The Authorization header is now automatically added by the request interceptor in api.ts
        const userData = await get<Record<string, any>>('/users/me');
        setUserInfo(userData);
      } catch (error: any) {
        console.error('Failed to fetch user info:', error.message);
        // Potentially logout if token is invalid or request fails (e.g., 401)
        // This logic might be refined when response interceptors are in place.
        // For now, just log the error. Consider calling logout() if error.status === 401
        // if (error.status === 401) {
        //   logout();
        // }
      }
    }
  }, [token]); // `logout` should be added if used inside the catch block and it's memoized via useCallback


  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false); // Finished initial loading
  }, []);

  useEffect(() => {
    if (token) {
        fetchUserInfo();
    } else {
        setUserInfo(null); // Clear user info if no token
    }
  }, [token, fetchUserInfo]);


  const login = async (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    // await fetchUserInfo(); // fetchUserInfo will be called by the useEffect hook when token changes
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUserInfo(null);
    // Optionally, redirect to login page or home page
    // navigate('/login'); // If using useNavigate, ensure AuthProvider is within Router context
  };

  return (
    <AuthContext.Provider
      value={{ token, userInfo, isAuthenticated: !!token, isLoading, login, logout, fetchUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
