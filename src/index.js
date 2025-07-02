import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import MainApp from './app.js'; // Assuming MainApp is in app.js
import { FirebaseProvider } from './FirebaseContext.js';
// import './index.css'; // If you have a global stylesheet

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <FirebaseProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </FirebaseProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Ensure your HTML has a div with id 'root'.");
}
