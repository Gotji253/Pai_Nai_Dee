export interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceRange: string;
  distance: string;
  image: string;
  description: string;
  openingHours: string;
  admissionFee: string;
  contact: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  hiddenGem: boolean;
}

export const fetchPlaces = async (): Promise<Place[]> => {
  try {
    const response = await fetch('http://localhost:8000/api/places');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as Place[];
  } catch (error) {
    console.error("Failed to fetch places:", error);
    // In a real application, you might want to throw the error or handle it differently
    return []; // Return empty array or throw error as per app's error handling strategy
  }
};
