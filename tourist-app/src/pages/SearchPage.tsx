import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography, Container, TextField, Box, Grid, Card, CardContent, Button,
  MenuItem, Select, FormControl, InputLabel, Chip, CircularProgress, Alert, SelectChangeEvent,
  Snackbar
} from '@mui/material';
import { Link } from 'react-router-dom';
import { usePlaces } from '../contexts/PlacesContext'; // Import the context hook
import { Place } from '../contexts/PlacesContext'; // Import the Place type
import TripPlanner from '../components/TripPlanner'; // Import TripPlanner

// Categories could also come from an API or be managed in context if dynamic
const categories = ['All', 'Nature', 'Park', 'Culture', 'Beach', 'Shopping', 'Food', 'Adventure', 'Historic', 'Relaxation'];

const SearchPage: React.FC = () => {
  const { places, isLoading, error, fetchPlaces, addPlaceToTrip } = usePlaces();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Local state for tags input, assuming tags are entered as a comma-separated string
  const [tagsInput, setTagsInput] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


  // Initial fetch of all places or based on some default criteria
  useEffect(() => {
    fetchPlaces(); // Fetch all places initially
  }, [fetchPlaces]);

  const handleSearch = useCallback(() => {
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    fetchPlaces(searchTerm, selectedCategory, tagsArray);
  }, [fetchPlaces, searchTerm, selectedCategory, tagsInput]);

  // Effect to trigger search when category changes
  useEffect(() => {
    // Optional: Fetch immediately on category change, or wait for explicit search button click
    // For this example, we'll make it explicit via the search button.
    // If you want to auto-search on category change: handleSearch();
  }, [selectedCategory, handleSearch]);


  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
    // Optionally, trigger search immediately:
    // const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    // fetchPlaces(searchTerm, event.target.value as string, tagsArray);
  };

  const handleAddPlaceToPlanner = (place: Place) => {
    addPlaceToTrip(place);
    setSnackbarMessage(`${place.name} added to your trip planner!`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        Find Your Next Adventure
      </Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4, alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Search by keyword"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          fullWidth
          label="Filter by tags (comma-separated)"
          variant="outlined"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
          sx={{ flexGrow: 1, mt: { xs: 2, sm: 0 } }}
        />
        <FormControl sx={{ minWidth: 150, width: { xs: '100%', sm: 'auto' }, mt: { xs: 2, sm: 0 } }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSearch} sx={{ py: '15px', width: { xs: '100%', sm: 'auto' }, mt: { xs: 2, sm: 0 } }} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
        </Button>
      </Box>

      {/* Loading and Error States */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {/* Main content area with Search Results and Trip Planner */}
      <Grid container spacing={3}>
        {/* Search Results Section */}
        <Grid item xs={12} md={8}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          {!isLoading && !error && (
            <Grid container spacing={3}>
              {places.length > 0 ? (
                places.map(place => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={place.id}> {/* Adjusted lg for better fit */}
                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      {place.photos && place.photos.length > 0 && (
                        <Box
                          component="img"
                          src={place.photos[0]} // Display the first photo
                          alt={place.name}
                          sx={{
                            height: 180, // Slightly reduced height
                            width: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" sx={{ mb: 1, fontSize: '1.1rem' }}> {/* Slightly smaller title */}
                          {place.name}
                        </Typography>
                        <Chip label={place.category} size="small" sx={{ mt: 0.5, mb: 1, mr: 0.5 }} color="primary" variant="outlined"/>
                        {place.tags && place.tags.slice(0, 3).map(tag => ( // Show max 3 tags initially
                          <Chip key={tag} label={tag} size="small" sx={{ mt: 0.5, mb: 1, mr: 0.5 }} />
                        ))}
                        <Typography variant="body2" color="text.secondary" sx={{ my: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}> {/* Max 2 lines for description */}
                          {place.description}
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> {/* Reduced padding */}
                        <Button component={Link} to={`/place/${place.id}`} variant="outlined" size="small">
                          Details
                        </Button>
                        <Button variant="contained" size="small" onClick={() => handleAddPlaceToPlanner(place)}>
                          Add to Trip
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography sx={{ textAlign: 'center', mt: 3 }}>
                    No places found matching your criteria. Try a different search or adjust your filters.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>

        {/* Trip Planner Section - visible on medium screens and up as a sidebar, stacks on small screens */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: '80px' } /* Adjust based on header height */ }}>
            <TripPlanner />
          </Box>
        </Grid>
      </Grid>
       <Snackbar
         open={snackbarOpen}
         autoHideDuration={4000} // Slightly shorter for quick info
         onClose={handleSnackbarClose}
         message={snackbarMessage}
         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
       />
    </Container>
  );
};

export default SearchPage;
