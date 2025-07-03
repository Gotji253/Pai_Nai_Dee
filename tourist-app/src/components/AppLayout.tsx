import React from 'react';
import { Box, Container } from '@mui/material';
import AppBottomNavigation from './BottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container component="main" sx={{ flexGrow: 1, pb: 7, pt: 2 }}> {/* Padding bottom to avoid overlap with BottomNavigation */}
        {children}
      </Container>
      <AppBottomNavigation />
    </Box>
  );
};

export default AppLayout;
