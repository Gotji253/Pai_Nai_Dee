import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { get, post } from '../api'; // Assuming your API utility is in src/api.ts

// --- Type Definitions ---

export interface Place {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  photos: string[]; // Array of image URLs
  tags: string[]; // e.g., ["beach", "historic", "nature"]
  category: string; // e.g., "Adventure", "Relaxation", "Culture"
  rating?: number; // Average rating
  reviewsCount?: number;
  // Add any other relevant fields for a place
}

export interface NewTrip {
  name: string;
  placeIds: string[];
  startDate?: Date;
  endDate?: Date;
  notes?: string;
}

export interface Trip extends NewTrip {
  id: string;
  userId: string; // Assuming trips are user-specific
  createdAt: Date;
}

interface PlacesState {
  places: Place[];
  currentTripPlaces: Place[]; // Places selected for the current trip being planned
  isLoading: boolean;
  error: string | null;
  isSubmittingTrip: boolean;
  submitTripError: string | null;
  submitTripSuccess: boolean;
}

interface PlacesContextType extends PlacesState {
  fetchPlaces: (searchTerm?: string, category?: string, tags?: string[]) => Promise<void>;
  getPlaceById: (id: string) => Place | undefined;
  addPlaceToTrip: (place: Place) => void;
  removePlaceFromTrip: (placeId: string) => void;
  clearCurrentTrip: () => void;
  createTrip: (tripData: NewTrip) => Promise<Trip | null>;
  resetSubmitTripStatus: () => void;
}

// --- Context Creation ---

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

// --- Provider Component ---

interface PlacesProviderProps {
  children: ReactNode;
}

export const PlacesProvider: React.FC<PlacesProviderProps> = ({ children }) => {
  const [state, setState] = useState<PlacesState>({
    places: [],
    currentTripPlaces: [],
    isLoading: false,
    error: null,
    isSubmittingTrip: false,
    submitTripError: null,
    submitTripSuccess: false,
  });

  const fetchPlaces = useCallback(async (searchTerm?: string, category?: string, tags?: string[]): Promise<void> => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
    try {
      // Construct query parameters
      const queryParams: Record<string, string | string[]> = {};
      if (searchTerm) queryParams.q = searchTerm;
      if (category && category.toLowerCase() !== 'all') queryParams.category = category;
      if (tags && tags.length > 0) queryParams.tags = tags.join(','); // Assuming API takes tags as comma-separated string

      const data = await get<Place[]>('/places', queryParams);
      setState(prevState => ({ ...prevState, places: data, isLoading: false }));
    } catch (err: any) {
      console.error("Failed to fetch places:", err);
      setState(prevState => ({ ...prevState, isLoading: false, error: err.message || 'Failed to fetch places' }));
    }
  }, []);

  const getPlaceById = useCallback((id: string): Place | undefined => {
    return state.places.find(p => p.id === id) || state.currentTripPlaces.find(p => p.id === id);
  }, [state.places, state.currentTripPlaces]);

  const addPlaceToTrip = useCallback((place: Place) => {
    setState(prevState => {
      if (prevState.currentTripPlaces.find(p => p.id === place.id)) {
        return prevState; // Avoid duplicates
      }
      return { ...prevState, currentTripPlaces: [...prevState.currentTripPlaces, place] };
    });
  }, []);

  const removePlaceFromTrip = useCallback((placeId: string) => {
    setState(prevState => ({
      ...prevState,
      currentTripPlaces: prevState.currentTripPlaces.filter(p => p.id !== placeId),
    }));
  }, []);

  const clearCurrentTrip = useCallback(() => {
    setState(prevState => ({ ...prevState, currentTripPlaces: [] }));
  }, []);

  const createTrip = useCallback(async (tripData: NewTrip): Promise<Trip | null> => {
    setState(prevState => ({
      ...prevState,
      isSubmittingTrip: true,
      submitTripError: null,
      submitTripSuccess: false,
    }));
    try {
      const newTrip = await post<Trip>('/trips', tripData);
      setState(prevState => ({
        ...prevState,
        isSubmittingTrip: false,
        submitTripSuccess: true,
        currentTripPlaces: [], // Clear trip after successful submission
      }));
      return newTrip;
    } catch (err: any) {
      console.error("Failed to create trip:", err);
      setState(prevState => ({
        ...prevState,
        isSubmittingTrip: false,
        submitTripError: err.message || 'Failed to create trip',
        submitTripSuccess: false,
      }));
      return null;
    }
  }, []);

 const resetSubmitTripStatus = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isSubmittingTrip: false,
      submitTripError: null,
      submitTripSuccess: false,
    }));
  }, []);

  return (
    <PlacesContext.Provider value={{
      ...state,
      fetchPlaces,
      getPlaceById,
      addPlaceToTrip,
      removePlaceFromTrip,
      clearCurrentTrip,
      createTrip,
      resetSubmitTripStatus,
    }}>
      {children}
    </PlacesContext.Provider>
  );
};

// --- Custom Hook for Consuming Context ---

export const usePlaces = (): PlacesContextType => {
  const context = useContext(PlacesContext);
  if (context === undefined) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
};
