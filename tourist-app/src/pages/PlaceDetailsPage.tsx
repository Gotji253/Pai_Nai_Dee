import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Button, Box, Paper, Grid, Rating, Chip, Menu, MenuItem, CircularProgress } from '@mui/material';
import { Favorite, FavoriteBorder, Share, LocationOn, Comment, Facebook, Twitter, WhatsApp } from '@mui/icons-material';
import { isPlaceFavorite, addFavoritePlace, removeFavoritePlace, FavoritePlace } from '../utils/favoritesManager';
import { fetchPlaceById, PlaceDetailsType, Review } from '../api'; // Import types from api.ts

// Local type definitions are removed as they are now imported from api.ts


const PlaceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [placeData, setPlaceData] = useState<PlaceDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [anchorElShare, setAnchorElShare] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    if (id) {
      const loadPlaceDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await fetchPlaceById(id);
          setPlaceData(data);
          if (data && data.id !== 'unknown') { // 'unknown' might not be relevant with API
            setIsFavorite(isPlaceFavorite(data.id));
          } else if (!data) {
            setError('Place not found.');
          }
        } catch (err: any) {
          console.error("Failed to fetch place details:", err);
          setError(err.message || 'Failed to fetch place details. Please try again later.');
          setPlaceData(null); // Clear any old data
        } finally {
          setIsLoading(false);
        }
      };
      loadPlaceDetails();
    } else {
      setError("No place ID provided.");
      setIsLoading(false);
      setPlaceData(null);
    }
  }, [id]); // Dependency array ensures this runs when `id` changes

  const handleToggleFavorite = () => {
    if (!placeData || placeData.id === 'unknown') return; // 'unknown' might not be relevant

    const imageUrl = placeData.images && placeData.images.length > 0 ? placeData.images[0] : 'https://via.placeholder.com/150';

    const favoritePlaceData: FavoritePlace = {
        id: placeData.id,
        name: placeData.name,
        image: imageUrl,
        category: placeData.category,
        description: placeData.description.substring(0, 100) + '...'
    };

    if (isFavorite) {
      removeFavoritePlace(placeData.id);
    } else {
      addFavoritePlace(favoritePlaceData);
    }
    setIsFavorite(!isFavorite);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    if (navigator.share && placeData) {
      navigator.share({
        title: placeData.name,
        text: `Check out ${placeData.name}!`,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      setAnchorElShare(event.currentTarget);
    }
  };

  const handleShareClose = () => {
    setAnchorElShare(null);
  };

  const openShareLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    handleShareClose();
  };

  // Loading and error states will be handled in the next step.
  // For now, the conditional rendering for `placeData` (previously `place`) remains.
  // This will be updated to show spinner/error messages.

  if (!placeData && !isLoading && !error) { // Handles case where id is not present or initial state
    // This condition might be updated based on how loading/error states are displayed
    return <Container sx={{mt:2}}><Typography>Place details not available.</Typography></Container>;
  }

  // The rest of the component remains largely the same, but references `placeData` instead of `place`.
  // The loading spinner and error message display will be added in the next step.

  // Conditional rendering for loading and error states will be added here in the next step.
  // For now, we keep the existing check for `placeData` to avoid breaking the page
  // before the full loading/error UI is implemented.

  // If still loading, show spinner (to be refined in next step)
  // if (isLoading) {
  //   return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Container>;
  // }

  // If error, show error message (to be refined in next step)
  // if (error) {
  //   return <Container sx={{mt:2}}><Typography color="error">Error: {error}</Typography></Container>;
  // }

  // If no placeData and not loading (e.g. after an error or if ID was invalid and API returned null/empty)
  // if (!placeData) {
  //   return <Container sx={{mt:2}}><Typography>Place not found or details could not be loaded.</Typography></Container>;
  // }


  // The main content rendering, assuming placeData is available (or will be, post-loading)
  // Note: The actual display of loading/error will be added in the next step.
  // For now, we just ensure `placeData` is used. If `placeData` is null after loading/error handling,
  // the page might appear blank or with a generic message depending on the exact logic above.
  // The current `if (!placeData && !isLoading && !error)` handles one such case.

  // The actual UI for loading/error will be added in step 3.
  // For now, we just proceed assuming `placeData` will be populated or error/loading handled by then.

  const place = placeData; // Temporary alias for easier replacement in JSX below. Will be removed.

  if (!place) {
    // This will be replaced by proper loading/error UI in the next step.
    // For now, this handles the case where placeData is null after the effect runs.
    // It could be because loading is still true (handled by spinner later), or an error occurred (handled by error message later),
    // or the API returned nothing for a valid ID (which means "not found").
    // The `if (isLoading)` and `if (error)` blocks (commented out for now) will provide better UI.
    return <Container sx={{mt:2}}><Typography>Loading or place details not available...</Typography></Container>;
  }

  // --- End of temporary alias and basic null check ---

  // Proper Loading State
  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Proper Error State
  if (error) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography color="error" paragraph>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }

  // Proper Not Found State (if placeData is null after loading and no error)
  if (!placeData) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Place Not Found
        </Typography>
        <Typography color="text.secondary" paragraph>
          We couldn't find details for the place you're looking for.
        </Typography>
        <Button variant="outlined" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Container>
    );
  }
  // At this point, placeData is guaranteed to be non-null.
  // We can remove the temporary 'place' alias and use 'placeData' directly.
  // const place = placeData; // This line can now be safely removed.


  const shareUrl = window.location.href;
  const shareTitle = `Check out ${placeData.name}!`; // Use placeData directly

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 7 }}> {/* Added mb to avoid overlap with bottom nav */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {placeData.name}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid component="div" item xs={12} md={7}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 0 } }}>
              <img
                src={placeData.images && placeData.images.length > 0 ? placeData.images[0] : 'https://via.placeholder.com/600x400.png?text=No+Image+Available'}
                alt={placeData.name}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            {placeData.images && placeData.images.slice(1,3).map((img: string, index: number) => (
              <Box key={index} sx={{ mb: index < placeData.images.slice(1,3).length -1 ? 1: 0 }}>
                 <img src={img} alt={`${placeData.name} additional view ${index + 1}`} style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '4px' }} />
              </Box>
            ))}
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOn color="action" />
            <Typography variant="subtitle1" color="text.secondary">
                {placeData.location}
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip label={placeData.category} color="primary" size="small" />
            {placeData.tags && placeData.tags.map((tag: string) => <Chip key={tag} label={tag} size="small" />)}
        </Box>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          {placeData.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant={isFavorite ? "contained" : "outlined"}
            startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
            onClick={handleToggleFavorite}
            color={isFavorite ? "secondary" : "primary"}
            disabled={placeData.id === 'unknown'} // This might need adjustment if 'unknown' id is not a concept from API
          >
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Button>
          <Button variant="outlined" startIcon={<Share />} onClick={handleShareClick} disabled={placeData.id === 'unknown'}>
            Share
          </Button>
          <Menu
            anchorEl={anchorElShare}
            open={Boolean(anchorElShare)}
            onClose={handleShareClose}
          >
            <MenuItem onClick={() => openShareLink(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}>
              <Facebook sx={{mr:1}}/> Facebook
            </MenuItem>
            <MenuItem onClick={() => openShareLink(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`)}>
              <Twitter sx={{mr:1}}/> Twitter / X
            </MenuItem>
            <MenuItem onClick={() => openShareLink(`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`)}>
              <WhatsApp sx={{mr:1}}/> WhatsApp
            </MenuItem>
             <MenuItem onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied to clipboard!'); handleShareClose(); }}>
              Copy Link
            </MenuItem>
          </Menu>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: '500' }}>
        Reviews & Ratings <Comment fontSize="small" sx={{verticalAlign: 'middle'}}/>
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Rating value={placeData.rating} precision={0.1} readOnly />
        <Typography variant="subtitle1">
          {typeof placeData.rating === 'number' ? (placeData.rating % 1 === 0 ? placeData.rating.toFixed(0) : placeData.rating.toFixed(1)) : 'N/A'} out of 5 ({placeData.reviews ? placeData.reviews.length : 0} reviews)
        </Typography>
      </Box>

      {placeData.reviews && placeData.reviews.length > 0 ? (
        placeData.reviews.map((review: Review, index: number) => (
          <Paper key={review.id || index} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{review.user}</Typography>
              <Rating value={review.rating} size="small" readOnly />
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              {review.date ? new Date(review.date).toLocaleDateString() : 'Date not available'}
            </Typography>
            <Typography variant="body2">{review.comment}</Typography>
          </Paper>
        ))
      ) : (
        <Typography>No reviews yet for this place.</Typography>
      )}
      <Button variant="contained" sx={{mt: 2}} disabled={placeData.id === 'unknown'}>Write a Review</Button>
    </Container>
  );
};

export default PlaceDetailsPage;
