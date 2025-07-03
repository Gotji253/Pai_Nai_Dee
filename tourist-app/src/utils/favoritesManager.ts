// Utility functions for managing favorites in localStorage

const FAVORITES_KEY = 'touristAppFavorites';

export interface FavoritePlace {
  id: string;
  name: string;
  // Add other relevant details you want to store for a favorite item
  // For example: image, category, shortDescription
  image?: string;
  category?: string;
  description?: string;
}

// Get all favorite places
export const getFavoritePlaces = (): FavoritePlace[] => {
  const favoritesJson = localStorage.getItem(FAVORITES_KEY);
  if (favoritesJson) {
    try {
      return JSON.parse(favoritesJson) as FavoritePlace[];
    } catch (e) {
      console.error("Error parsing favorites from localStorage", e);
      return [];
    }
  }
  return [];
};

// Check if a place is a favorite
export const isPlaceFavorite = (placeId: string): boolean => {
  const favorites = getFavoritePlaces();
  return favorites.some(place => place.id === placeId);
};

// Add a place to favorites
export const addFavoritePlace = (place: FavoritePlace): void => {
  if (!place || !place.id) {
    console.error("Cannot add invalid place to favorites", place);
    return;
  }
  const favorites = getFavoritePlaces();
  if (!favorites.some(p => p.id === place.id)) {
    const updatedFavorites = [...favorites, place];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  }
};

// Remove a place from favorites
export const removeFavoritePlace = (placeId: string): void => {
  const favorites = getFavoritePlaces();
  const updatedFavorites = favorites.filter(place => place.id !== placeId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
};
