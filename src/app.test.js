import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Use MemoryRouter for testing routed components
import { describe, it, expect, vi } from 'vitest';

import MainApp from './app.js';
import { FirebaseProvider } from './FirebaseContext.js'; // Actual provider

// Mock parts of FirebaseContext if direct interaction is complex or not needed for this test
// For a basic render test, we might not need to mock much if FirebaseProvider handles errors.
// However, for more specific tests, deeper mocks for db, auth, userId might be needed.

vi.mock('./FirebaseContext.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // Example of mocking a specific value from the context if needed:
    // useFirebase: () => ({
    //   db: {}, // mock db
    //   userId: 'test-user-id',
    //   isAuthReady: true,
    //   getAppId: () => 'pai_nai_dee_test',
    //   firebaseError: null,
    // }),
  };
});


// Mock child components that are complex or make their own API calls
// to keep the test focused on MainApp's rendering and routing logic.
vi.mock('./pages/HomePage', () => ({
  default: () => <div data-testid="home-page">HomePage Mock</div>,
}));
vi.mock('./pages/ItineraryPage', () => ({
  default: () => <div data-testid="itinerary-page">ItineraryPage Mock</div>,
}));
vi.mock('./pages/CommunityFeedPage', () => ({
  default: () => <div data-testid="community-feed-page">CommunityFeedPage Mock</div>,
}));
vi.mock('./components/InterestsForm', () => ({
  default: () => <div data-testid="interests-form">InterestsForm Mock</div>,
}));
vi.mock('./components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));


describe('MainApp Component', () => {
  const renderWithProviders = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <FirebaseProvider> {/* Use the actual provider */}
        <MemoryRouter initialEntries={[route]}>
          {ui}
        </MemoryRouter>
      </FirebaseProvider>
    );
  };

  it('renders HomePage by default when auth is ready', async () => {
    // Mock isAuthReady to be true for this test scenario
    // This might require adjusting the FirebaseContext mock or ensuring provider sets it.
    // For simplicity, assuming FirebaseProvider will eventually set isAuthReady to true.
    // Vitest's auto-mocking or a more detailed manual mock for FirebaseContext might be needed
    // if the real FirebaseProvider's async logic interferes.

    // For now, let's assume FirebaseProvider makes isAuthReady true.
    // If not, we'd need to mock useContext(FirebaseContext) to return isAuthReady: true.

    renderWithProviders(<MainApp />);
    // Wait for HomePage mock to appear, which implies isAuthReady became true
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
  });

  it('renders ItineraryPage when navigating to /itinerary', async () => {
    renderWithProviders(<MainApp />, { route: '/itinerary' });
    expect(await screen.findByTestId('itinerary-page')).toBeInTheDocument();
  });

  it('renders CommunityFeedPage when navigating to /community', async () => {
    renderWithProviders(<MainApp />, { route: '/community' });
    expect(await screen.findByTestId('community-feed-page')).toBeInTheDocument();
  });

  it('renders InterestsForm when navigating to /interests', async () => {
    renderWithProviders(<MainApp />, { route: '/interests' });
    expect(await screen.findByTestId('interests-form')).toBeInTheDocument();
  });

  it('renders navigation links', async () => {
    renderWithProviders(<MainApp />);
    expect(await screen.findByText('ค้นหา')).toBeInTheDocument(); // Search link
    expect(screen.getByText('แผนเดินทาง')).toBeInTheDocument(); // Itinerary link
    expect(screen.getByText('ชุมชน')).toBeInTheDocument(); // Community link
    expect(screen.getByText('ความสนใจ')).toBeInTheDocument(); // Interests link
  });
});
