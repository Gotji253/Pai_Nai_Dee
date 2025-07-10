## Agent Instructions for `tourist-app`

This document provides guidance for AI agents working on the `tourist-app` React project.

### 1. Project Overview

The `tourist-app` is a web application designed to help users discover tourist attractions, plan trips, and share their experiences. It's built with React, TypeScript, and Material-UI.

### 2. Getting Started & Running the App

1.  **Navigate to the project directory:**
    ```bash
    cd tourist-app
    ```
2.  **Install dependencies:** If you haven't already or if `package.json` has changed:
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    This will typically open the app in your default browser at `http://localhost:3000`.

### 3. Code Structure

*   **`src/`**: Contains all the application source code.
    *   **`api.ts`**: Contains helper functions for making API requests using Axios.
    *   **`components/`**: Reusable UI components (e.g., `AppLayout.tsx`, `BottomNavigation.tsx`, `TripPlanner.tsx`).
    *   **`contexts/`**: React Context API providers and hooks (e.g., `AuthContext.tsx`, `PlacesContext.tsx`).
    *   **`pages/`**: Top-level components representing different views/pages of the app (e.g., `HomePage.tsx`, `SearchPage.tsx`).
    *   **`utils/`**: Utility functions and modules (e.g., `favoritesManager.ts` for handling localStorage).
    *   **`assets/`**: (Future) For static assets like images, icons, etc.
    *   **`App.tsx`**: Main application component, sets up routing, theme, and global context providers.
    *   **`theme.ts`**: Material-UI theme customization.
    *   **`index.tsx`**: Entry point of the React application.

### 4. Key Technologies & Libraries

*   **React**: Core UI library.
*   **TypeScript**: For static typing.
*   **Material-UI (MUI)**: UI component library. Refer to MUI documentation for component usage and styling.
    *   Custom theme is defined in `src/theme.ts`.
    *   Responsive design is primarily handled using MUI's Grid system, `sx` prop with responsive breakpoints (e.g., `{ xs: ..., md: ... }`), and responsive typography.
*   **React Router DOM**: For client-side routing. Routes are defined in `src/App.tsx`.
*   **Axios**: Used for making HTTP requests to the backend API. Configured in `src/api.ts`.
*   **React Context API**: Used for global state management, particularly for places and trip planning data (`PlacesContext.tsx`).
*   **`localStorage`**: Used for persisting user favorites (see `src/utils/favoritesManager.ts`). (Note: Trip data is now handled via API).

### 5. Development Guidelines

*   **Components:**
    *   Keep components small and focused on a single responsibility.
    *   Use PascalCase for component file names and component names (e.g., `MyComponent.tsx`).
*   **Styling:**
    *   Primarily use Material-UI's styling solutions ( `sx` prop or `styled` components).
    *   Leverage the custom theme in `src/theme.ts` for consistent colors, fonts, and spacing.
    *   Ensure components are responsive and test on different screen sizes (conceptually, if direct testing isn't possible).
*   **State Management:**
    *   For local component state, use `useState`.
    *   **React Context API** is the primary method for managing global application state such as places data, trip planning information, loading/error states related to API calls. See `src/contexts/PlacesContext.tsx`.
    *   `localStorage` is used for persisting user favorites.
*   **Data Fetching:**
    *   API calls are managed through helper functions in `src/api.ts` which uses `axios`.
    *   Data fetching logic (including loading and error states) is primarily handled within the React Context (`PlacesContext.tsx`) and consumed by page/component hooks.
    *   Mock data has been replaced with live API calls in `SearchPage.tsx` and `HomePage.tsx`.
*   **File Naming:**
    *   Utility files/modules: camelCase (e.g., `favoritesManager.ts`).
    *   Context files: PascalCase (e.g., `PlacesContext.tsx`).
*   **Commenting:** Add comments for complex logic or non-obvious code sections.

### 6. Backend Integration & Data Flow

*   The application now integrates with a backend API for fetching places (`GET /places`) and saving trips (`POST /trips`).
*   Mock data in `HomePage.tsx` and `SearchPage.tsx` has been replaced with API calls.
*   `PlacesContext.tsx` is central to managing place data, search/filter operations, and trip creation logic.
    *   `fetchPlaces` in the context handles fetching and filtering places.
    *   `createTrip` in the context handles submitting new trips to the backend.
*   Loading spinners and error messages are implemented for all API interactions.
*   The "Favorite" feature still uses `localStorage`.

### 7. Key New/Updated Components

*   **`src/api.ts`**: Centralized Axios instance and API call helper functions (get, post).
*   **`src/contexts/PlacesContext.tsx`**: Manages state for places, search results, and trip planning. Provides functions to interact with the places and trips API endpoints.
*   **`src/components/TripPlanner.tsx`**: UI component for users to view selected places, name their trip, and save it. Integrated into `SearchPage.tsx`.
*   **`src/pages/SearchPage.tsx`**: Significantly updated to use `PlacesContext` for data, handle API states (loading, error), and integrate the `TripPlanner` component. Supports keyword search, category, and tag-based filtering via API.
*   **`src/pages/HomePage.tsx`**: Updated to fetch a limited set of "featured" places from the API instead of using mock data.

### 8. Testing

*   (Future) Implement unit tests using Jest and React Testing Library.
*   (Future) Implement end-to-end tests using a framework like Cypress or Playwright.
*   For now, perform thorough manual testing (or conceptual walkthroughs if direct interaction is not possible) of user flows and component interactions.

### 8. Contribution & Commits

*   Ensure new code follows the established patterns and guidelines.
*   Write clear and descriptive commit messages.
*   If adding new major features or making significant architectural changes, consider updating this `AGENTS.md` file.

---

This document is a living guide. Please update it as the project evolves.
