import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors'; // Example color

// Define a theme for the application
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6347', // Tomato - A bright, friendly color
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4682B4', // SteelBlue - A calming, modern blue
      contrastText: '#FFFFFF',
    },
    error: {
      main: red.A400, // Standard MUI red for errors
    },
    background: {
      default: '#f4f6f8', // A very light grey for a clean, modern background
      paper: '#FFFFFF',   // White for cards, papers, etc.
    },
    text: {
      primary: '#333333', // Dark grey for primary text - good readability
      secondary: '#555555', // Lighter grey for secondary text
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.5rem', // Slightly smaller for better mobile views
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // More modern look than all-caps
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 8, // Slightly more rounded corners for a modern feel
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Example: padding: '8px 20px',
        },
        containedPrimary: {
          // Example: color: 'white',
        }
      }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                '&:hover': { // Optional: subtle hover effect for cards
                    // transform: 'translateY(-2px)',
                    // boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                }
            }
        }
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          // Example: borderTop: '1px solid #e0e0e0',
        }
      }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                fontWeight: 500,
            }
        }
    }
  }
});

export default theme;
