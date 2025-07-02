// src/App.test.tsx
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

// Mock NotificationProvider and useNotifier as App uses them
// and we don't want to test the actual notification UI here.
vi.mock('./hooks/useNotifier', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNotifier: () => ({
    addNotification: vi.fn(),
  }),
  NotificationType: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
  }
}));

// Mock planService as App uses it on mount and for actions
vi.mock('./services/planService', () => ({
  loadPlanFromLocalStorage: vi.fn().mockResolvedValue(null), // Default mock: no plan found
  savePlanToLocalStorage: vi.fn().mockResolvedValue(undefined),
  deletePlanFromLocalStorage: vi.fn().mockResolvedValue(undefined),
}));


describe('App Component', () => {
  it('renders the main heading "Travel Planner"', () => {
    render(<App />);

    // Check for the main heading
    // Using a more specific query if possible, e.g., within a header role
    const headingElement = screen.getByRole('heading', { name: /Travel Planner/i, level: 1 });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders "My Awesome Trip" as the initial plan name in the input', () => {
    render(<App />);
    const planNameInput = screen.getByRole('textbox', { name: /Current plan name/i });
    expect(planNameInput).toHaveValue('My Awesome Trip');
  });

  it('renders "Save Plan" button', () => {
    render(<App />);
    const saveButton = screen.getByRole('button', { name: /Save Plan/i });
    expect(saveButton).toBeInTheDocument();
  });

  // Add more tests here for other App functionalities
  // For example, testing if ItineraryBuilder is rendered,
  // or if clicking save/load buttons calls the respective service functions.
});
