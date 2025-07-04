import React, { useContext } from 'react'; // Import useContext
import { BottomNavigationAction, Paper } from '@mui/material';
import { Home, Search, Favorite, Person, Login } from '@mui/icons-material'; // Import Login icon
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation as MuiBottomNavigation } from '@mui/material'; // Alias to avoid naming conflict
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext

const AppBottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  // Determine the correct path and icon for the profile/login action
  const profileActionPath = authContext?.isAuthenticated ? "/profile" : "/login";
  const profileActionIcon = authContext?.isAuthenticated ? <Person /> : <Login />;
  const profileActionLabel = authContext?.isAuthenticated ? "Profile" : "Login";

  // Determine the active tab. If on /login or /register, consider the "Profile" tab active.
  let currentValue = location.pathname;
  if (location.pathname === "/login" || location.pathname === "/register") {
    currentValue = profileActionPath; // Highlight the profile/login tab
  }


  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <MuiBottomNavigation showLabels value={currentValue}>
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={<Home />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Search"
          value="/search"
          icon={<Search />}
          component={Link}
          to="/search"
        />
        <BottomNavigationAction
          label="Favorites"
          value="/favorites" // This should also be protected or show a message if not logged in
          icon={<Favorite />}
          component={Link}
          to="/favorites"
        />
        <BottomNavigationAction
          label={profileActionLabel}
          value={profileActionPath}
          icon={profileActionIcon}
          onClick={() => navigate(profileActionPath)} // Use navigate for dynamic path
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default AppBottomNavigation;
