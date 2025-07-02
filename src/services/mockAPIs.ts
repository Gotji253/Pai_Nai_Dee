// src/services/mockAPIs.ts
import { Location } from '../data/mockData';

// --- Mock Weather API ---
export interface WeatherForecast {
  locationId: string;
  temperatureC: number;
  description: string; // e.g., "Sunny", "Cloudy with showers"
  iconCode?: string; // For displaying a weather icon
  humidity?: number; // Percentage
  windSpeedKph?: number;
}

const mockWeatherConditions: Omit<WeatherForecast, 'locationId' | 'temperatureC'>[] = [
  { description: 'Sunny', iconCode: '01d', humidity: 45, windSpeedKph: 10 },
  { description: 'Partly Cloudy', iconCode: '02d', humidity: 55, windSpeedKph: 15 },
  { description: 'Cloudy', iconCode: '03d', humidity: 65, windSpeedKph: 12 },
  { description: 'Light Rain', iconCode: '10d', humidity: 75, windSpeedKph: 20 },
  { description: 'Clear Night', iconCode: '01n', humidity: 50, windSpeedKph: 5 },
];

export const fetchMockWeather = (location: Location): Promise<WeatherForecast> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple mock: generate random weather based on location name's hash or randomly
      const randomIndex = Math.abs(location.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % mockWeatherConditions.length;
      const condition = mockWeatherConditions[randomIndex];
      const temperatureC = 10 + (Math.abs(location.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 20); // Temp between 10-29C

      resolve({
        locationId: location.id,
        temperatureC: temperatureC,
        ...condition,
      });
    }, 300 + Math.random() * 700); // Simulate API delay
  });
};

// --- Mock Place Info API ---
export interface PlaceDetails {
  locationId: string;
  rating?: number; // e.g., 4.5 (out of 5)
  photos?: string[]; // URLs to images
  reviewsCount?: number;
  openingHours?: string; // e.g., "Mon-Fri: 9 AM - 6 PM"
  website?: string;
}

const mockPlaceDetailsDb: Record<string, Omit<PlaceDetails, 'locationId'>> = {
  'loc1': { // Eiffel Tower
    rating: 4.7,
    photos: ['https://via.placeholder.com/150/0000FF/808080?Text=Eiffel+Tower+1', 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Eiffel+Tower+2'],
    reviewsCount: 150000,
    openingHours: '9 AM - 11 PM daily',
    website: 'https://www.toureiffel.paris/',
  },
  'loc2': { // Louvre Museum
    rating: 4.8,
    photos: ['https://via.placeholder.com/150/008000/FFFFFF?Text=Louvre+1'],
    reviewsCount: 80000,
    openingHours: 'Wed-Mon: 9 AM - 6 PM (Closed Tue)',
    website: 'https://www.louvre.fr/',
  },
  'loc3': { // Notre-Dame Cathedral
    rating: 4.6,
    // No photos for a place under reconstruction perhaps, or fewer details
    reviewsCount: 60000,
    openingHours: 'Varies (check official site)',
  },
  'loc4': { // Sacré-Cœur Basilica
    rating: 4.7,
    photos: ['https://via.placeholder.com/150/FFFF00/000000?Text=Sacre+Coeur'],
    reviewsCount: 45000,
    openingHours: '6 AM - 10:30 PM daily',
  },
  'loc5': { // Gare du Nord
    rating: 3.5, // Stations might have lower ratings
    reviewsCount: 15000,
    openingHours: '24/7 (train services vary)',
  }
};

export const fetchMockPlaceDetails = (location: Location): Promise<PlaceDetails | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const details = mockPlaceDetailsDb[location.id];
      if (details) {
        resolve({
          locationId: location.id,
          ...details,
        });
      } else {
        // Simulate not finding details for some locations
        resolve(null);
      }
    }, 400 + Math.random() * 800); // Simulate API delay
  });
};

/*
// --- Mock Booking/Travel Services API (Example Structure) ---
export interface BookingOption {
  type: 'hotel' | 'tour' | 'car_rental';
  name: string;
  priceEstimate: string; // e.g., "$150/night" or "$50/person"
  bookingLink?: string; // Mock link
}

export const fetchMockBookingOptions = (location: Location): Promise<BookingOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const options: BookingOption[] = [];
      // Example: Add some generic options based on location or randomly
      if (location.id === 'loc1' || location.id === 'loc2') { // Eiffel Tower or Louvre
        options.push({ type: 'tour', name: `Guided Tour of ${location.name}`, priceEstimate: '$75/person' });
        options.push({ type: 'hotel', name: 'Nearby Luxury Hotel', priceEstimate: '$300/night' });
      }
      if (Math.random() > 0.5) {
        options.push({ type: 'car_rental', name: 'Compact Car Rental', priceEstimate: '$60/day'});
      }
      resolve(options);
    }, 500 + Math.random() * 1000);
  });
};
*/
