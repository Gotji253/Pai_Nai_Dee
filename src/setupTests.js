// src/setupTests.ts
import '@testing-library/jest-dom'; // Updated import path

// You can add other global setup code here if needed.
// For example, mocking global objects or functions.

// Example: Mocking localStorage if it's heavily used and needs consistent behavior in tests
/*
const localStorageMock = (function() {
  let store: { [key: string]: string } = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem: function(key: string) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
*/
