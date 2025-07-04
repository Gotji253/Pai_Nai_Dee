import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Explore Thailand heading on the home page', () => {
  render(<App />);
  const headingElement = screen.getByText(/Explore Thailand/i);
  expect(headingElement).toBeInTheDocument();
});
