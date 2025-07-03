import React, { useState } from 'react';
import {
  Typography, Container, TextField, Box, Grid, Card, CardContent, Button,
  MenuItem, Select, FormControl, InputLabel, Chip
} from '@mui/material';
import { Link } from 'react-router-dom';

// Mock search results - in a real app, this would come from an API
const mockPlaces = [
  { id: '1', name: 'Mountain View Point', category: 'Nature', tags: ['hiking', 'scenic'] },
  { id: '2', name: 'City Central Park', category: 'Park', tags: ['relax', 'greenery'] },
  { id: '3', name: 'Historical Museum', category: 'Culture', tags: ['history', 'exhibits'] },
  { id: '4', name: 'Sunny Beach', category: 'Beach', tags: ['sand', 'sea', 'relaxation'] },
  { id: '5', name: 'Local Market', category: 'Shopping', tags: ['food', 'souvenirs'] },
];

const categories = ['All', 'Nature', 'Park', 'Culture', 'Beach', 'Shopping', 'Food'];

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchResults, setSearchResults] = useState(mockPlaces);

  const handleSearch = () => {
    let filteredPlaces = mockPlaces;
    if (searchTerm) {
      filteredPlaces = filteredPlaces.filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCategory !== 'All') {
      filteredPlaces = filteredPlaces.filter(place => place.category === selectedCategory);
    }
    setSearchResults(filteredPlaces);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        Find Your Next Adventure
      </Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Search by keyword (e.g., beach, museum)"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value as string)}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSearch} sx={{ py: '15px' }}>
          Search
        </Button>
      </Box>

      {/* Search Results */}
      <Grid container spacing={3}>
        {searchResults.length > 0 ? (
          searchResults.map(place => (
            <Grid item xs={12} sm={6} md={4} key={place.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {place.name}
                  </Typography>
                  <Chip label={place.category} size="small" sx={{ mt: 1, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                    Tags: {place.tags.join(', ')}
                  </Typography>
                  <Button component={Link} to={`/place/${place.id}`} variant="outlined" size="small">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography sx={{ textAlign: 'center', mt: 3 }}>
              No places found matching your criteria. Try a different search!
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default SearchPage;
