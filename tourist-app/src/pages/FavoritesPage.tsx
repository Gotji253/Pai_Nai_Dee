import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { DeleteForever } from '@mui/icons-material'; // Changed icon for unfavorite
import { getFavoritePlaces, removeFavoritePlace, FavoritePlace } from '../utils/favoritesManager';

const FavoritesPage: React.FC = () => {
  const [favoritePlaces, setFavoritePlaces] = useState<FavoritePlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const places = getFavoritePlaces();
    setFavoritePlaces(places);
    setLoading(false);
  }, []);

  const handleRemoveFavorite = (placeId: string) => {
    removeFavoritePlace(placeId);
    setFavoritePlaces(prevFavorites => prevFavorites.filter(place => place.id !== placeId));
  };

  if (loading) {
    // Basic loading state, can be replaced with a spinner component
    return <Container sx={{mt: 2, textAlign: 'center'}}><Typography>Loading your favorite places...</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 7 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        My Favorite Places
      </Typography>

      {favoritePlaces.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
            No Favorites Yet!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb:2}}>
            Looks like you haven't added any places to your favorites.
            </Typography>
            <Button component={Link} to="/" variant="contained">
            Explore Places
            </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favoritePlaces.map(place => (
            <Grid item component="div" xs={12} sm={6} md={4} key={place.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                 {place.image && (
                    <CardMedia
                        component="img"
                        height="180"
                        image={place.image}
                        alt={place.name}
                    />
                 )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" noWrap>
                    {place.name}
                  </Typography>
                  {place.category && <Chip label={place.category} size="small" sx={{ mt: 0.5, mb: 1 }} color="secondary" />}
                  <Typography variant="body2" color="text.secondary" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '60px' // Approx 3 lines
                  }}>
                    {place.description || "No description available."}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2, borderTop: '1px solid #eee' }}>
                  <Button component={Link} to={`/place/${place.id}`} variant="outlined" size="small">
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteForever />}
                    onClick={() => handleRemoveFavorite(place.id)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage;
