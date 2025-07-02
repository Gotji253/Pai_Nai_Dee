import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Path to your setup file
    // You might want to configure coverage options here as well
    // coverage: {
    //   provider: 'v8', // or 'istanbul'
    //   reporter: ['text', 'json', 'html'],
    // },
  },
  // Optional: Define a server port if needed
  // server: {
  //   port: 3000,
  // },
  // Optional: Set a different base if deploying to a subdirectory
  // base: '/my-app/',
  // Environment variable handling is typically VITE_ prefix by default
  // envPrefix: 'APP_', // If you want to use APP_ instead of VITE_
});
