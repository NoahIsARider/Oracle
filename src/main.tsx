import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/cinzel-decorative/900.css';
import '@fontsource/cinzel-decorative/700.css';
import '@fontsource/alegreya/700.css';
import '@fontsource/alegreya/800.css';
import '@fontsource/alegreya/800-italic.css';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
