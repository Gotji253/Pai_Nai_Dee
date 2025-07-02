// src/data/mockData.ts

export enum TransitMode {
  WALKING = 'WALKING',
  DRIVING = 'DRIVING',
  TRANSIT = 'TRANSIT', // Could be public transport
  MIXED = 'MIXED', // Could involve multiple modes
}

export interface Location {
  id: string;
  name: string;
  address?: string; // Optional address
  coordinates: { lat: number; lng: number }; // For potential map integration
  details?: string; // Optional details about the place
}

export interface RouteSegment {
  mode: TransitMode;
  durationMinutes: number; // Duration of this segment in minutes
  distanceKm?: number; // Optional distance
  instructions?: string; // e.g., "Walk to Main Street"
}

export interface CalculatedRoute {
  origin: Location;
  destination: Location;
  totalDurationMinutes: number;
  totalDistanceKm?: number;
  segments: RouteSegment[];
  summary?: string; // e.g., "Driving via Main St"
}

// Sample Locations
export const sampleLocations: Location[] = [
  {
    id: 'loc1',
    name: 'Eiffel Tower',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    details: 'Iconic landmark in Paris, France.',
  },
  {
    id: 'loc2',
    name: 'Louvre Museum',
    coordinates: { lat: 48.8606, lng: 2.3376 },
    details: 'World-renowned art museum.',
  },
  {
    id: 'loc3',
    name: 'Notre-Dame Cathedral',
    coordinates: { lat: 48.8530, lng: 2.3499 },
    details: 'Historic Catholic cathedral.',
  },
  {
    id: 'loc4',
    name: 'Sacré-Cœur Basilica',
    coordinates: { lat: 48.8867, lng: 2.3431 },
    details: 'Roman Catholic church and minor basilica.',
  },
  {
    id: 'loc5',
    name: 'Gare du Nord',
    coordinates: { lat: 48.8809, lng: 2.3553 },
    details: 'Major railway station in Paris.'
  }
];

// Predefined mock routes between some locations
// In a real app, this would be calculated by a routing engine.
export const mockRoutes: Record<string, Record<string, CalculatedRoute[]>> = {
  'loc1': { // From Eiffel Tower
    'loc2': [ // To Louvre Museum
      {
        origin: sampleLocations.find(l => l.id === 'loc1')!,
        destination: sampleLocations.find(l => l.id === 'loc2')!,
        totalDurationMinutes: 25,
        totalDistanceKm: 2.5,
        summary: 'Pleasant walk along the Seine',
        segments: [
          { mode: TransitMode.WALKING, durationMinutes: 25, distanceKm: 2.5, instructions: 'Walk along Quai Branly, cross Pont Royal.' },
        ],
      },
      {
        origin: sampleLocations.find(l => l.id === 'loc1')!,
        destination: sampleLocations.find(l => l.id === 'loc2')!,
        totalDurationMinutes: 15,
        totalDistanceKm: 3,
        summary: 'Quick drive via Voie Georges Pompidou',
        segments: [
          { mode: TransitMode.DRIVING, durationMinutes: 15, distanceKm: 3, instructions: 'Take Voie Georges Pompidou towards city center.' },
        ],
      },
    ],
  },
  'loc2': { // From Louvre Museum
    'loc3': [ // To Notre-Dame Cathedral
      {
        origin: sampleLocations.find(l => l.id === 'loc2')!,
        destination: sampleLocations.find(l => l.id === 'loc3')!,
        totalDurationMinutes: 15,
        totalDistanceKm: 1.2,
        summary: 'Short walk through historic Paris',
        segments: [
          { mode: TransitMode.WALKING, durationMinutes: 15, distanceKm: 1.2, instructions: 'Walk along Rue de Rivoli, then cross Pont Neuf.' },
        ],
      },
    ],
  },
  'loc1': { // From Eiffel Tower
    'loc5': [ // To Gare du Nord
        {
            origin: sampleLocations.find(l => l.id === 'loc1')!,
            destination: sampleLocations.find(l => l.id === 'loc5')!,
            totalDurationMinutes: 40,
            totalDistanceKm: 7,
            summary: 'Mixed: Drive then Metro',
            segments: [
                { mode: TransitMode.DRIVING, durationMinutes: 15, distanceKm: 3, instructions: 'Drive to Charles de Gaulle - Étoile station.' },
                { mode: TransitMode.TRANSIT, durationMinutes: 20, distanceKm: 4, instructions: 'Take Metro Line 2 towards Nation, get off at La Chapelle, walk to Gare du Nord.' },
                { mode: TransitMode.WALKING, durationMinutes: 5, distanceKm: 0.3, instructions: 'Walk from La Chapelle to Gare du Nord.'}
            ],
        },
    ]
  }
  // Add more mock routes as needed
};

// Helper to get a specific location by ID
export const getLocationById = (id: string): Location | undefined => {
  return sampleLocations.find(loc => loc.id === id);
};
