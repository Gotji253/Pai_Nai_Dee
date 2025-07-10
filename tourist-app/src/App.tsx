import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import LoginPage from './pages/LoginPage'; // Import LoginPage
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { PlacesProvider } from './contexts/PlacesContext'; // Import PlacesProvider
import theme from './theme'; // Import the custom theme
import './App.css'; // Keep for global styles if any

// Placeholder component for pages not yet created or for error handling
const PlaceholderPage: React.FC<{ title: string; message?: string }> = ({ title, message }) => (
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <h1>{title}</h1>
    {message && <p>{message}</p>}
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies baseline styles and background color from theme */}
      <Router>
        <AuthProvider> {/* AuthProvider should ideally wrap PlacesProvider if PlacesContext depends on Auth */}
          <PlacesProvider> {/* Wrap relevant parts of the app with PlacesProvider */}
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/place/:id" element={<PlaceDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Fallback for undefined routes */}
                <Route
                  path="*"
                  element={<PlaceholderPage title="404 - Page Not Found" message="Sorry, the page you are looking for does not exist." />}
                />
              </Routes>
            </AppLayout>
          </PlacesProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
