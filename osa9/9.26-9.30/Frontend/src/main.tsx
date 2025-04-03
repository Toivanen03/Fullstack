import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Ohittaa konsolihuomautuksen alustetusta healthCheckRating arvosta 4, joka mahdollistaa virheen tuottamisen konsoliin
// Zod-tarkistuksessa. Koska Enum palauttaa aina oikean arvon, olisi tarkistus turha, koska se ei koskaan palauta virhettä.
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('MUI: You have provided an out-of-range value')
  ) {
    return;
  }
  originalWarn(...args);
};


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />,
  </React.StrictMode>
);
