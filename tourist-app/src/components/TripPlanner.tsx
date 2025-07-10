import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button,
  Paper, Divider, CircularProgress, Alert, Grid, Card, CardContent, CardActions, Chip,
  Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { usePlaces, Place } from '../contexts/PlacesContext'; // Assuming Place type is exported

const TripPlanner: React.FC = () => {
  const {
    currentTripPlaces,
    removePlaceFromTrip,
    createTrip,
    isSubmittingTrip,
    submitTripError,
    submitTripSuccess,
    resetSubmitTripStatus,
    clearCurrentTrip,
  } = usePlaces();

  const [tripName, setTripName] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (submitTripSuccess) {
      setShowSuccessMessage(true);
      setTripName(''); // Clear trip name
      // Message will be hidden after a delay or on component unmount by resetSubmitTripStatus
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        resetSubmitTripStatus(); // Reset status in context
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitTripSuccess, resetSubmitTripStatus]);

  // Reset any lingering error/success messages when the component mounts or currentTripPlaces change
  useEffect(() => {
    resetSubmitTripStatus();
  }, [resetSubmitTripStatus, currentTripPlaces]);


  const handleSaveTrip = async () => {
    if (!tripName.trim()) {
      setSnackbarMessage('Please enter a name for your trip.');
      setSnackbarOpen(true);
      return;
    }
    if (currentTripPlaces.length === 0) {
      setSnackbarMessage('Please add at least one place to your trip.');
      setSnackbarOpen(true);
      return;
    }

    const placeIds = currentTripPlaces.map(p => p.id);
    await createTrip({ name: tripName, placeIds });
    // Success/error is handled by useEffect and context state
  };

  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = (confirmed: boolean) => {
    setConfirmDialogOpen(false);
    if (confirmed) {
      clearCurrentTrip();
      setTripName('');
      resetSubmitTripStatus();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  if (currentTripPlaces.length === 0 && !showSuccessMessage && !submitTripError) {
    return (
      <Paper elevation={3} sx={{ p: 2, mt: 2, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Trip Planner</Typography>
        <Typography color="text.secondary">
          Your trip planner is empty. Add places from the search results to start planning!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 1, sm: 2 }, mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        My Trip Plan
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {showSuccessMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => { setShowSuccessMessage(false); resetSubmitTripStatus(); }}>
          Trip saved successfully!
        </Alert>
      )}
      {submitTripError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={resetSubmitTripStatus}>
          {submitTripError}
        </Alert>
      )}

      {currentTripPlaces.length > 0 && (
        <>
          <TextField
            label="Trip Name"
            variant="outlined"
            fullWidth
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            sx={{ mb: 2 }}
            disabled={isSubmittingTrip}
          />
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
            Selected Places ({currentTripPlaces.length}):
          </Typography>
          <List dense sx={{ maxHeight: 300, overflow: 'auto', mb: 2, border: '1px solid #eee', borderRadius: 1 }}>
            {currentTripPlaces.map((place: Place) => (
              <ListItem
                key={place.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => removePlaceFromTrip(place.id)} disabled={isSubmittingTrip}>
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{ borderBottom: '1px solid #f0f0f0', '&:last-child': { borderBottom: 'none' } }}
              >
                <ListItemText
                  primary={place.name}
                  secondary={place.category}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1 }}>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleOpenConfirmDialog}
              disabled={isSubmittingTrip || currentTripPlaces.length === 0}
              sx={{ flexGrow: {sm: 1} }}
            >
              Clear Trip
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={isSubmittingTrip ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSaveTrip}
              disabled={isSubmittingTrip || !tripName.trim() || currentTripPlaces.length === 0}
              sx={{ flexGrow: {sm: 1} }}
            >
              {isSubmittingTrip ? 'Saving...' : 'Save Trip'}
            </Button>
          </Box>
        </>
      )}
       {/* Display this if places were just cleared by a successful save, but before success message fades */}
      {currentTripPlaces.length === 0 && (submitTripSuccess || showSuccessMessage) && !submitTripError && (
         <Typography color="text.secondary" sx={{textAlign: 'center', mt: 2}}>
          Trip saved! Add more places to plan another trip.
        </Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <Dialog
        open={confirmDialogOpen}
        onClose={() => handleCloseConfirmDialog(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to clear all places from the current trip planner? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleCloseConfirmDialog(true)} color="warning" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TripPlanner;
