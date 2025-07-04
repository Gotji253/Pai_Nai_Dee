import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    // This should ideally not happen if AuthProvider is set up correctly
    return <CircularProgress />;
  }

  const { userInfo, logout, isAuthenticated, isLoading, token } = authContext;

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    // This case might be handled by a protected route component later,
    // but as a direct access guard:
    // For now, we allow access but show a message. A <ProtectedRoute> component would be better.
    return (
        <Container component="main" maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Paper elevation={3} sx={{padding: 3}}>
                <Typography variant="h5" gutterBottom>Profile Page</Typography>
                <Typography variant="body1" gutterBottom>
                    You are currently not logged in. Please login to see your profile.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/login')} sx={{mr: 1}}>Login</Button>
                <Button variant="outlined" onClick={() => navigate('/register')}>Register</Button>
            </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Profile
        </Typography>
        {userInfo ? (
          <Box>
            <Typography variant="h6">Welcome, {userInfo.username || userInfo.email || 'User'}!</Typography>
            {userInfo.email && <Typography>Email: {userInfo.email}</Typography>}
            {userInfo.full_name && <Typography>Full Name: {userInfo.full_name}</Typography>}
            {userInfo.id && <Typography>ID: {userInfo.id}</Typography>}
            {/* Display other user information as available and needed */}
            <Box sx={{mt: 2, p:1, border: '1px dashed grey', borderRadius: '4px', background: '#f9f9f9'}}>
                <Typography variant="caption" display="block" gutterBottom>For dev: User Info Object</Typography>
                <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '150px', overflowY: 'auto', fontSize: '0.8em'}}>
                    {JSON.stringify(userInfo, null, 2)}
                </pre>
            </Box>
            <Box sx={{mt: 2, p:1, border: '1px dashed grey', borderRadius: '4px', background: '#f9f9f9'}}>
                 <Typography variant="caption" display="block" gutterBottom>For dev: Auth Token (first 100 chars)</Typography>
                <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '100px', overflowY: 'auto', fontSize: '0.8em'}}>
                    {token?.substring(0,100) + (token && token.length > 100 ? "..." : "")}
                </pre>
            </Box>

          </Box>
        ) : (
          <Alert severity="info" sx={{mt: 2}}>User details could not be loaded. This might happen if the `/users/me` endpoint is not available or the token is invalid.</Alert>
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mt: 3 }}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
