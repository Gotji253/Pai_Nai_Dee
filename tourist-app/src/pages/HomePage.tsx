import React from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

// Mock data for featured items
const featuredItems = [
  {
    id: '1',
    title: 'Beautiful Mountain Peak',
    description: 'Experience the breathtaking views from the top of the serene mountains.',
    image: 'https://via.placeholder.com/300x200.png?text=Mountain+Peak',
    category: 'Adventure',
  },
  {
    id: '2',
    title: 'Sunny Beach Resort',
    description: 'Relax and unwind at this luxurious beach resort with golden sands.',
    image: 'https://via.placeholder.com/300x200.png?text=Beach+Resort',
    category: 'Relaxation',
  },
  {
    id: '3',
    title: 'Historic City Tour',
    description: 'Explore the rich history and culture of this ancient city.',
    image: 'https://via.placeholder.com/300x200.png?text=Historic+City',
    category: 'Culture',
  },
];

const HomePage: React.FC = () => {
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
      <Grid container spacing={3}>
        {featuredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-start', pl: 2, pb: 2 }}>
                <Button size="small" component={Link} to={`/place/${item.id}`} variant="contained">
                  Learn More
                </Button>
                {/* <Button size="small">Save</Button> */}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* You can add more sections here, e.g., "Top Activities", "Special Promotions" */}
      {/* Example:
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 5, mb: 3, fontWeight: '500' }}>
        Promotions
      </Typography>
      <Grid container spacing={3}>
        // Promotion cards
      </Grid>
      */}
    </Container>
  );
};

export default HomePage;
