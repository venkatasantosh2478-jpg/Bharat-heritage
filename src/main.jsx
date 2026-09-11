import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress benign iframe/sandbox websocket connection rejections & HMR notices
window.addEventListener('unhandledrejection', (event) => {
  const msg = (event?.reason?.message || String(event?.reason || '')).toLowerCase();
  if (
    msg.includes('websocket') ||
    msg.includes('closed without opened') ||
    msg.includes('failed to connect') ||
    msg.includes('vite')
  ) {
    event.preventDefault();
    event.stopPropagation();
  }
});

window.addEventListener('error', (event) => {
  const msg = (event?.message || String(event || '')).toLowerCase();
  if (
    msg.includes('websocket') ||
    msg.includes('closed without opened') ||
    msg.includes('failed to connect') ||
    msg.includes('vite')
  ) {
    event.preventDefault();
    event.stopPropagation();
  }
});

// Register Service Worker for offline capability & local storage caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[SW] Registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
