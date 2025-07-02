// src/services/routeService.ts
import {
  Location,
  CalculatedRoute,
  TransitMode,
  mockRoutes,
  sampleLocations, // If needed for fallback or direct access
  getLocationById
} from '../data/mockData';

export interface RouteRequest {
  originId: string;
  destinationId: string;
  preferredMode?: TransitMode; // User can specify a preference
  departureTime?: Date; // For future use, not used in mock
}

export interface RouteResponse {
  route?: CalculatedRoute;
  error?: string;
  message?: string;
}

/**
 * Simulates fetching a route between two locations.
 *
 * In a real application, this would call an external Maps API (Google Maps, OpenRouteService, etc.)
 * and then transform the API response into the CalculatedRoute format.
 *
 * For this mock version, it looks up predefined routes in `mockRoutes`.
 */
export const calculateMockRoute = async (
  request: RouteRequest
): Promise<RouteResponse> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const origin = getLocationById(request.originId);
      const destination = getLocationById(request.destinationId);

      if (!origin || !destination) {
        resolve({ error: 'Invalid origin or destination ID.' });
        return;
      }

      const availableRoutesForOrigin = mockRoutes[request.originId];
      if (!availableRoutesForOrigin) {
        resolve({ message: `No routes found from ${origin.name}.` });
        return;
      }

      const specificRoutes = availableRoutesForOrigin[request.destinationId];
      if (!specificRoutes || specificRoutes.length === 0) {
        resolve({
          message: `No direct routes found from ${origin.name} to ${destination.name}.`,
        });
        return;
      }

      let foundRoute: CalculatedRoute | undefined = undefined;

      // Try to find a route matching the preferred mode
      if (request.preferredMode) {
        foundRoute = specificRoutes.find(route =>
          route.segments.some(segment => segment.mode === request.preferredMode) || // if any segment matches
          (request.preferredMode === TransitMode.MIXED && route.segments.length > 1) // or if preferred is mixed and route has multiple segments
        );
        // A more sophisticated check for MIXED might be needed if routes are not explicitly tagged
      }

      // If no preferred mode route found, or no preference, pick the first available
      if (!foundRoute) {
        foundRoute = specificRoutes[0]; // Default to the first available route
      }

      // If a specific mode was requested but not found, and we picked a default, we can mention it.
      if (request.preferredMode && foundRoute && !foundRoute.segments.some(s => s.mode === request.preferredMode)) {
         resolve({
          route: foundRoute,
          message: `Could not find a ${request.preferredMode} route. Showing available route.`,
        });
        return;
      }

      if (foundRoute) {
        resolve({ route: foundRoute });
      } else {
        // This case should ideally be covered by earlier checks
        resolve({
          message: `No routes available between ${origin.name} and ${destination.name}.`,
        });
      }
    }, 500 + Math.random() * 1000); // Simulate network latency (0.5s to 1.5s)
  });
};

// Example of how this service might be used:
/*
async function exampleUsage() {
  console.log('Calculating route from Eiffel Tower to Louvre (Driving)...');
  const route1Response = await calculateMockRoute({
    originId: 'loc1',
    destinationId: 'loc2',
    preferredMode: TransitMode.DRIVING,
  });

  if (route1Response.route) {
    console.log('Route found:', route1Response.route.summary, route1Response.route.totalDurationMinutes + ' mins');
  } else {
    console.error('Error/Message:', route1Response.error || route1Response.message);
  }

  console.log('\nCalculating route from Louvre to Notre-Dame (Walking)...');
  const route2Response = await calculateMockRoute({
    originId: 'loc2',
    destinationId: 'loc3',
    preferredMode: TransitMode.WALKING,
  });

  if (route2Response.route) {
    console.log('Route found:', route2Response.route.summary, route2Response.route.totalDurationMinutes + ' mins');
  } else {
    console.error('Error/Message:', route2Response.error || route2Response.message);
  }

  console.log('\nCalculating route from Eiffel Tower to Gare du Nord (Mixed)...');
  const route3Response = await calculateMockRoute({
    originId: 'loc1',
    destinationId: 'loc5',
    preferredMode: TransitMode.MIXED,
  });

  if (route3Response.route) {
    console.log('Route found:', route3Response.route.summary, route3Response.route.totalDurationMinutes + ' mins');
    route3Response.route.segments.forEach(seg => console.log(`  - ${seg.mode}: ${seg.durationMinutes} min, ${seg.instructions}`));
  } else {
    console.error('Error/Message:', route3Response.error || route3Response.message);
  }
}

// exampleUsage(); // Uncomment to test in Node.js environment
*/
