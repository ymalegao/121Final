import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Change the file extension from .tsx to .js

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}

