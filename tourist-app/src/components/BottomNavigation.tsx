import React from 'react';
import { BottomNavigationAction, Paper } from '@mui/material';
import { Home, Search, Favorite, Person } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { BottomNavigation as MuiBottomNavigation } from '@mui/material'; // Alias to avoid naming conflict

const AppBottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <MuiBottomNavigation showLabels value={location.pathname}>
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
          value="/favorites"
          icon={<Favorite />}
          component={Link}
          to="/favorites"
        />
        <BottomNavigationAction
          label="Profile"
          value="/profile"
          icon={<Person />}
          component={Link}
          to="/profile"
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default AppBottomNavigation;
