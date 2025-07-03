import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Button, Box, Paper, Grid, Rating, Chip, Menu, MenuItem, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder, Share, LocationOn, Comment, Facebook, Twitter, WhatsApp } from '@mui/icons-material'; // Added specific share icons
import { getFavoritePlaces, isPlaceFavorite, addFavoritePlace, removeFavoritePlace, FavoritePlace } from '../utils/favoritesManager';

// Mock data structure - in a real app, this would come from an API based on `id`
// Ensure this structure is compatible with FavoritePlace interface for relevant fields
const mockPlaceDatabase: { [key: string]: any } = {
  '1': {
    id: '1', // Important for favoritesManager
    name: 'Beautiful Mountain Peak',
    description: 'Experience the breathtaking views from the top of the serene mountains. This destination offers challenging hikes and rewarding vistas, perfect for adventure seekers and nature lovers alike. Remember to bring appropriate gear.',
    images: ['https://via.placeholder.com/600x400.png?text=Mountain+View+1', 'https://via.placeholder.com/300x200.png?text=Mountain+Path', 'https://via.placeholder.com/300x200.png?text=Summit+Selfie'],
    rating: 4.7,
    reviews: [
      { id: 'r1', user: 'Alex P.', comment: 'Absolutely stunning views! The hike was tough but worth it.', rating: 5, date: '2023-10-15' },
      { id: 'r2', user: 'Jamie L.', comment: 'A bit crowded on weekends, but the scenery is undeniable.', rating: 4, date: '2023-10-22' },
    ],
    location: 'Northern Highlands, Region A',
    category: 'Adventure',
    tags: ['hiking', 'scenic', 'nature', 'mountains'],
    priceRange: 'Free - $$ (for guided tours)',
  },
  '2': {
    id: '2', // Important for favoritesManager
    name: 'Sunny Beach Resort',
    description: 'Relax and unwind at this luxurious beach resort with golden sands and crystal clear waters. Enjoy various water sports, spa treatments, and exquisite dining options. Perfect for a family vacation or a romantic getaway.',
    images: ['https://via.placeholder.com/600x400.png?text=Beach+Resort+Main', 'https://via.placeholder.com/300x200.png?text=Beach+Activities', 'https://via.placeholder.com/300x200.png?text=Resort+Pool'],
    rating: 4.5,
    reviews: [
      { id: 'r3', user: 'Casey B.', comment: 'Paradise on Earth! The staff were amazing.', rating: 5, date: '2023-11-05' },
      { id: 'r4', user: 'Morgan K.', comment: 'Food was a bit pricey, but the beach itself is perfect.', rating: 4, date: '2023-11-10' },
    ],
    location: 'Coastal Paradise, Region B',
    category: 'Relaxation',
    tags: ['beach', 'resort', 'luxury', 'sea', 'sand'],
    priceRange: '$$$ - $$$$',
  },
  '3': { // Added item from HomePage mock data
    id: '3',
    name: 'Historic City Tour',
    description: 'Explore the rich history and culture of this ancient city.',
    images: ['https://via.placeholder.com/600x400.png?text=Historic+City+Main', 'https://via.placeholder.com/300x200.png?text=Ancient+Ruins', 'https://via.placeholder.com/300x200.png?text=Museum+Exhibit'],
    rating: 4.6,
    reviews: [
        { id: 'r5', user: 'Sam G.', comment: 'So much to learn and see. Highly recommended!', rating: 5, date: '2023-09-12' },
    ],
    location: 'Old Town, Region C',
    category: 'Culture',
    tags: ['history', 'museum', 'architecture'],
    priceRange: '$ - $$',
  },
  'default': {
    id: 'unknown',
    name: 'Place Not Found',
    description: 'The place you are looking for does not exist or has been moved.',
    images: ['https://via.placeholder.com/600x400.png?text=Not+Found'],
    rating: 0,
    reviews: [],
    location: 'Unknown',
    category: 'Unknown',
    tags: [],
  }
};


const PlaceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<any>(null); // Consider defining a proper type for place
  const [isFavorite, setIsFavorite] = useState(false);
  const [anchorElShare, setAnchorElShare] = React.useState<null | HTMLElement>(null);


  useEffect(() => {
    if (id) {
        const currentPlace = mockPlaceDatabase[id] || mockPlaceDatabase['default'];
        setPlace(currentPlace);
        if (currentPlace.id !== 'unknown') {
             setIsFavorite(isPlaceFavorite(currentPlace.id));
        }
    }
  }, [id]);

  const handleToggleFavorite = () => {
    if (!place || place.id === 'unknown') return;

    const favoritePlaceData: FavoritePlace = {
        id: place.id,
        name: place.name,
        image: place.images[0], // Store primary image
        category: place.category,
        description: place.description.substring(0, 100) + '...' // Store a short description
    };

    if (isFavorite) {
      removeFavoritePlace(place.id);
    } else {
      addFavoritePlace(favoritePlaceData);
    }
    setIsFavorite(!isFavorite);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    if (navigator.share) {
      navigator.share({
        title: place?.name,
        text: `Check out ${place?.name}!`,
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


  if (!place) {
    return <Container sx={{mt:2}}><Typography>Loading place details...</Typography></Container>;
  }

  const shareUrl = window.location.href;
  const shareTitle = `Check out ${place?.name}!`;

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 7 }}> {/* Added mb to avoid overlap with bottom nav */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {place.name}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 0 } }}>
              <img src={place.images[0]} alt={place.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            {place.images.slice(1,3).map((img: string, index: number) => ( // Show only 2 additional small images
              <Box key={index} sx={{ mb: index < place.images.slice(1,3).length -1 ? 1: 0 }}>
                 <img src={img} alt={`${place.name} ${index + 1}`} style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '4px' }} />
              </Box>
            ))}
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOn color="action" />
            <Typography variant="subtitle1" color="text.secondary">
                {place.location}
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip label={place.category} color="primary" size="small" />
            {place.tags.map((tag: string) => <Chip key={tag} label={tag} size="small" />)}
        </Box>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          {place.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant={isFavorite ? "contained" : "outlined"}
            startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
            onClick={handleToggleFavorite}
            color={isFavorite ? "secondary" : "primary"}
            disabled={place.id === 'unknown'}
          >
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Button>
          <Button variant="outlined" startIcon={<Share />} onClick={handleShareClick} disabled={place.id === 'unknown'}>
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
        <Rating value={place.rating} precision={0.1} readOnly />
        <Typography variant="subtitle1">
          {place.rating % 1 === 0 ? place.rating.toFixed(0) : place.rating.toFixed(1)} out of 5 ({place.reviews.length} reviews)
        </Typography>
      </Box>

      {place.reviews.length > 0 ? (
        place.reviews.map((review: any, index: number) => ( // Define a proper type for review
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
      <Button variant="contained" sx={{mt: 2}} disabled={place.id === 'unknown'}>Write a Review</Button>
    </Container>
  );
};

export default PlaceDetailsPage;
