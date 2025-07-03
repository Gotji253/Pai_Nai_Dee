import React from 'react';
import { Typography, Container, Button, Box, Paper, Avatar, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Edit, Bookmark, Settings, Logout } from '@mui/icons-material';

// Mock user data
const mockUser = {
  name: 'Wanderlust User',
  email: 'user@example.com',
  avatarUrl: 'https://via.placeholder.com/150/FFA500/FFFFFF?Text=WU', // Orange background, white text "WU"
  joinDate: 'Joined on October 26, 2023',
  bio: 'Travel enthusiast exploring the world, one destination at a time. Loves beaches and mountains equally!',
};

const ProfilePage: React.FC = () => {
  // Placeholder functions for actions
  const handleEditProfile = () => {
    alert('Edit Profile clicked - functionality to be implemented.');
  };

  const handleSettings = () => {
    alert('Settings clicked - functionality to be implemented.');
  };

  const handleLogout = () => {
    alert('Logout clicked - functionality to be implemented.');
    // In a real app, this would clear auth state and redirect.
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2, mb: 7 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <Avatar
          alt={mockUser.name}
          src={mockUser.avatarUrl}
          sx={{ width: 120, height: 120, margin: '0 auto', mb: 2, fontSize: '3rem' }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          {mockUser.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {mockUser.email}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          {mockUser.joinDate}
        </Typography>
        <Typography variant="body2" sx={{ my: 2, fontStyle: 'italic' }}>
          "{mockUser.bio}"
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<Bookmark />}
            component={RouterLink}
            to="/favorites"
            fullWidth
          >
            My Saved Places
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEditProfile}
            fullWidth
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={handleSettings}
            fullWidth
          >
            Account Settings
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            fullWidth
            sx={{ mt: 1 }}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
