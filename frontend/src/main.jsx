import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              background: '#4a4540',
              color: '#faf9f7',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#8B6F47',
                secondary: '#faf9f7',
              },
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#faf9f7',
              },
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
