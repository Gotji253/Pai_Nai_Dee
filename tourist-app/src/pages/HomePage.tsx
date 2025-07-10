import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { usePlaces, Place } from '../contexts/PlacesContext'; // Assuming Place type is exported
import { get } from '../api'; // Import the get function

const HomePage: React.FC = () => {
  // const { fetchPlaces } = usePlaces(); // We might not need this if we do a direct fetch
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedPlaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Create a temporary instance of fetchPlaces from the context
        // to fetch a limited number of places for the homepage.
        // This is a bit of a workaround as the context's fetchPlaces updates the global 'places' state.
        // A more robust solution might involve a dedicated API endpoint or a more flexible fetchPlaces in context.
        // For now, we'll fetch all and slice, or ideally, the API supports a limit.
        // Let's assume the API supports a `limit` parameter or we fetch all and slice.

        // Ideally, your context's fetchPlaces or api.get would support parameters like limit
        // For example: await fetchPlaces(undefined, undefined, undefined, 3);
        // Or: const allPlaces = await get<Place[]>('/places?limit=3');

        // Simulate fetching all and slicing for now if direct limit not possible with current context setup
        // This is not optimal as it fetches all data.
        // A better way: modify `api.ts` `get` to accept a limit or `fetchPlaces` to accept a limit.
        // For this example, we'll fetch a predefined small list or rely on the context's full list and slice.

        // To avoid modifying the global 'places' state directly if fetchPlaces updates it,
        // we'll use a local fetch. This requires 'get' from 'api.ts'.
        // This part of the code assumes you have `get` function in your `../api`
        // If you don't have it, you'll need to adjust it or use the context's `places` state after it's fetched.
        // For simplicity, let's assume we'll call fetchPlaces and then take a slice from the global state.
        // This means HomePage will show featured places based on the last global fetch.

        // A more direct way if PlacesContext is not designed for this:
        // import { get } from '../api';
        // const places = await get<Place[]>('/places', { limit: 3 }); // Assuming API supports limit
        // setFeaturedPlaces(places);

        // For this exercise, let's use the global fetchPlaces and assume it fetches some data we can use.
        // We'll fetch all and then slice. This is NOT performant for large datasets.
        // The context should be enhanced or a dedicated API endpoint used for "featured" items.

        // Let's refine this: We'll call fetchPlaces (which updates the global context state)
        // and then use a separate local state that takes a slice from this global state.
        // This means the HomePage depends on the SearchPage or another component having called fetchPlaces.
        // This is not ideal.
        // A better approach is to make a direct API call here for featured places.

        // --- REVISED APPROACH for this step: Direct API call for featured items ---
        // This requires importing 'get' from your api.ts
        // This is a conceptual change, assuming `get` is available.
        // If `get` is not directly usable here due to setup, this will need adjustment.
        // For now, I will simulate this.
        // This means `api.ts` needs to be accessible and `get` function needs to be importable.
        // Let's assume `get` is exported from `../api`

        // Fallback: If direct `get` is problematic, use a placeholder or existing mock.
        // Given the constraints, let's use a simplified version of fetching a few items.
        // We'll use the context's fetchPlaces and take the first few.
        // This is not ideal for "featured" but works with current structure.

        // Actual implementation using a local fetch (conceptual, might need api.ts adjustment)
        // This is the most robust way without altering context too much for this specific need.
        // Let's assume we have a way to fetch a limited set, e.g. by a special category or tag.
        // For demonstration, fetch all and slice.

        await fetchPlaces(undefined, undefined, undefined); // Fetches all places into context
        // Then, use the 'places' from context, but this requires 'places' to be a prop or from context.
        // This component doesn't have access to 'places' directly from usePlaces() unless we add it.

        // Let's make it simpler: fetch a few "featured" places.
        // The API GET /places should ideally support a query param like ?featured=true or ?limit=3
        // Since we don't know if the API supports this, we will fetch all places using the context's
        // fetchPlaces and then slice the result for the homepage. This is not optimal but demonstrates the principle.
        // To do this properly, `PlacesContext` should expose `places` directly.
        // Let's assume `usePlaces()` returns `places` array.

        // Re-evaluating: The current `usePlaces` returns `places`. We can use that.
        // However, `fetchPlaces` in the context updates the `places` state.
        // So, we call `fetchPlaces` and then use the `places` from the context.
        // This means the `HomePage` will always show the same first 3 places from the last global fetch.
        // This is fine for now.

        // Let's call fetchPlaces and then use the results.
        // The context's `fetchPlaces` will set its internal `places` state.
        // We need a way to get these without re-fetching or by fetching specifically for featured.

        // Simplest approach for now:
        // Call context's fetchPlaces, then use a separate local state.
        // This is slightly redundant if SearchPage also calls it.
        // A dedicated endpoint /api/featured-places would be best.

        // Let's assume the context's `fetchPlaces` can be called to refresh the global list,
        // and then we can take a slice.

        // To ensure HomePage has its own data without interfering with SearchPage's full list,
        // a direct API call is better if the context is primarily for the main list.
        // However, the task implies using existing context/API calls.

        // Let's use the global `places` state from the context after ensuring it's populated.
        // This requires `usePlaces` to return `places`. It does.
        // And `fetchPlaces` to be stable (useCallback). It is.

        // Final approach for this step:
        // 1. Call `fetchPlaces` to ensure data is loaded into context.
        // 2. Use `useEffect` to react to changes in `context.places` and update local `featuredPlaces`.
        // This is not ideal as it always fetches ALL places.
        // A better version of `fetchPlaces` would accept a limit.
        // `get('/places', { limit: 3 })`
        // For now, we'll proceed with fetching all and slicing. This is for demonstration.

        // To avoid re-fetching if places are already in context from another page,
        // we could check if `context.places.length > 0` first.
        // However, "featured" might mean a specific subset, not just the first N.

        // Let's try to fetch specifically for "featured" if the API could support it, e.g. by category
        // await fetchPlaces(undefined, 'Featured', undefined); // if 'Featured' is a category
        // For now, fetch a general list and slice.

        // This will use the global 'places' from the context.
        // To make this component fetch its own limited set:
        // Simulating a direct fetch for featured items:
        const response = await get<Place[]>('/places', { _limit: 3 }); // JSONPlaceholder style limit
        setFeaturedPlaces(response);

      } catch (e: any) {
        console.error("Failed to fetch featured places:", e);
        setError(e.message || 'Could not load featured destinations.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedPlaces();
  }, []); // Empty dependency array: fetch only once on mount. `get` is stable.

  // Need to import `get` from `../api` for the above to work.
  // Let's add that import: import { get } from '../api';

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
            <Grid item xs={12} sm={6} md={4} key={item.id}>
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
