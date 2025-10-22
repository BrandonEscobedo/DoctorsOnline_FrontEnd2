// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Tema AZUL VIBRANTE para TODA la aplicación
const globalTheme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // ===== NUEVO AZUL VIBRANTE COMO COLOR PRINCIPAL =====
    },
    secondary: {
      main: '#007BFF', // Mantenemos consistencia en el secundario
    },
    background: {
      default: '#f8f9fa',
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={globalTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);