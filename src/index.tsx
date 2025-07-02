import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NotificationProvider } from './hooks/useNotifier'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider defaultDuration={5000}> {/* Optionally set a default duration */}
      <App />
    </NotificationProvider>
  </React.StrictMode>,
);
