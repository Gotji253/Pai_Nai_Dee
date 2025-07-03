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
    *   **`components/`**: Reusable UI components (e.g., `AppLayout.tsx`, `BottomNavigation.tsx`).
    *   **`pages/`**: Top-level components representing different views/pages of the app (e.g., `HomePage.tsx`, `SearchPage.tsx`).
    *   **`utils/`**: Utility functions and modules (e.g., `favoritesManager.ts` for handling localStorage).
    *   **`assets/`**: (Future) For static assets like images, icons, etc.
    *   **`App.tsx`**: Main application component, sets up routing and theme.
    *   **`theme.ts`**: Material-UI theme customization.
    *   **`index.tsx`**: Entry point of the React application.

### 4. Key Technologies & Libraries

*   **React**: Core UI library.
*   **TypeScript**: For static typing.
*   **Material-UI (MUI)**: UI component library. Refer to MUI documentation for component usage and styling.
    *   Custom theme is defined in `src/theme.ts`.
    *   Responsive design is primarily handled using MUI's Grid system, `sx` prop with responsive breakpoints (e.g., `{ xs: ..., md: ... }`), and responsive typography.
*   **React Router DOM**: For client-side routing. Routes are defined in `src/App.tsx`.
*   **`localStorage`**: Used for persisting user favorites (see `src/utils/favoritesManager.ts`).

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
    *   For simple global state or cross-component state that doesn't warrant a larger library, consider React Context API.
    *   Currently, `localStorage` is used for favorites. Be mindful of its limitations (string-only storage, synchronous).
*   **Data Fetching:**
    *   Currently, most data is mocked within the components (e.g., `mockPlaceDatabase` in `PlaceDetailsPage.tsx`).
    *   If integrating a backend, consider using `fetch` API or libraries like `axios`. Manage loading and error states appropriately.
*   **File Naming:**
    *   Utility files/modules: camelCase (e.g., `favoritesManager.ts`).
*   **Commenting:** Add comments for complex logic or non-obvious code sections.

### 6. Current Mock Data & Future Backend

*   The application currently uses mock data extensively (e.g., in `HomePage.tsx`, `SearchPage.tsx`, `PlaceDetailsPage.tsx`). This data is defined directly within the component files or as local constants.
*   The "Favorite" feature uses `localStorage` for persistence.
*   Future development will likely involve replacing mock data and `localStorage` for favorites with API calls to a backend service.

### 7. Testing

*   (Future) Implement unit tests using Jest and React Testing Library.
*   (Future) Implement end-to-end tests using a framework like Cypress or Playwright.
*   For now, perform thorough manual testing (or conceptual walkthroughs if direct interaction is not possible) of user flows and component interactions.

### 8. Contribution & Commits

*   Ensure new code follows the established patterns and guidelines.
*   Write clear and descriptive commit messages.
*   If adding new major features or making significant architectural changes, consider updating this `AGENTS.md` file.

---

This document is a living guide. Please update it as the project evolves.
