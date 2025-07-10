import React, { useEffect } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Box, CircularProgress, Alert, Chip, GridProps } from '@mui/material';
import { Link } from 'react-router-dom';
import { usePlaces, Place } from '../contexts/PlacesContext'; // Import usePlaces

const gridItemProps: GridProps = {
  item: true,
  xs: 12,
  sm: 6,
  md: 4,
  component: "div" // Added based on previous step, kept for consistency
};

const HomePage: React.FC = () => {
  const { places, isLoading, error, fetchPlaces } = usePlaces();

  useEffect(() => {
    // Fetch places if they haven't been loaded yet or if we specifically want to refresh them for the homepage.
    // Consider if the PlacesContext already loads places on app start.
    // If PlacesContext doesn't load initially, or if HomePage needs specific filters:
    if (places.length === 0) { // Only fetch if places array is empty, or tailor based on requirements
      fetchPlaces(); // No specific params, fetches all or default set from context's fetchPlaces
    }
    // If you want HomePage to always refresh or use specific query like "featured":
    // fetchPlaces(undefined, undefined, ['featured']); // Example: if API supports a 'featured' tag
  }, [fetchPlaces, places.length]); // Add places.length to dependencies if you only fetch when empty

  // Determine featured places from the context's places array
  // For now, let's take the first 3 as "featured"
  const featuredPlaces = places.slice(0, 3);

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Explore Thailand
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover amazing places, plan your next adventure, and create unforgettable memories.
        </Typography>
      </Box>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: '500' }}>
        Featured Destinations
      </Typography>

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

      {!isLoading && !error && featuredPlaces.length === 0 && (
        <Typography sx={{ textAlign: 'center', mt: 3 }}>
          No featured destinations available at the moment.
        </Typography>
      )}

      {!isLoading && !error && featuredPlaces.length > 0 && (
        <Grid container spacing={3}>
          {featuredPlaces.map((item) => (
            <Grid {...gridItemProps} key={item.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.photos && item.photos.length > 0 ? item.photos[0] : 'https://via.placeholder.com/300x200.png?text=No+Image'}
                  alt={item.name}
                  sx={{objectFit: 'cover'}}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.name}
                  </Typography>
                   {item.category && <Chip label={item.category} size="small" color="primary" variant="outlined" sx={{mb:1}} />}
                  <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-start', pl: 2, pb: 2 }}>
                  <Button size="small" component={Link} to={`/place/${item.id}`} variant="contained">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Example of another section */}
      {/*
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 5, mb: 3, fontWeight: '500' }}>
        Top Categories
      </Typography>
      <Grid container spacing={2}>
        {['Adventure', 'Culture', 'Relaxation', 'Foodie'].map(category => (
          <Grid item xs={6} sm={3} key={category}>
            <Button component={Link} to={`/search?category=${category}`} variant="outlined" fullWidth sx={{py:2}}>
              {category}
            </Button>
          </Grid>
        ))}
      </Grid>
      */}
    </Container>
  );
};

// Need to ensure `get` is imported if used directly.
// Let's adjust the import at the top of the file.
// import { get } from '../api'; // This line would be added.

export default HomePage;

// Note: The fetch logic for featuredPlaces assumes `get` from `../api.ts` can be imported
// and that the API might support a limit parameter like `_limit`.
// If the API is strictly `/places` and returns all, then slicing is the only option without backend changes.
// The code uses a direct `get` call to avoid altering the global `places` state in the context,
// which is primarily managed by and for `SearchPage.tsx`.
// If `get` cannot be imported or used this way, an alternative is to use `fetchPlaces` and slice,
// accepting that `HomePage` might show a subset of what `SearchPage` has.
// For the purpose of this exercise, the direct `get` with `_limit` is a cleaner approach for "featured items".
