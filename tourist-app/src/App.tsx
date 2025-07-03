import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
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
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/place/:id" element={<PlaceDetailsPage />} />
            {/* Fallback for undefined routes */}
            <Route
              path="*"
              element={<PlaceholderPage title="404 - Page Not Found" message="Sorry, the page you are looking for does not exist." />}
            />
          </Routes>
        </AppLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
