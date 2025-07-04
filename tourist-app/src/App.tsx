import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage'; // Will be updated later
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import LoginPage from './pages/LoginPage'; // Import LoginPage
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
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
        <AuthProvider> {/* Wrap AppLayout and Routes with AuthProvider */}
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/profile" element={<ProfilePage />} /> {/* Will require auth */}
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
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
