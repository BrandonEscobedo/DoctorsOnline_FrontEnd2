// src/pages/LandingPage.jsx

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Container, Grid, Typography, Button, Box, Paper, AppBar, Toolbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// ===== INICIO DEL CAMBIO 1: Importar herramientas para el tema =====
import { createTheme, ThemeProvider } from '@mui/material/styles';
// =================================================================

// --- Iconos ---
import PsychologyIcon from '@mui/icons-material/Psychology';
import SpeedIcon from '@mui/icons-material/Speed';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

// --- Imágenes Locales ---
import heroImage from '../assets/doctor.png';
import solutionImage from '../assets/app.png';

// --- Paleta de Colores para la Landing Page ---
const Colors = {
  primary: '#007BFF',
  secondary: '#1976D2',
  accent: '#1976D2',
  background: '#ffffff',
  backgroundSubtle: '#f8f9fa',
  text: '#34495e',
  textLight: '#7f8c8d',
};

// ===== INICIO DEL CAMBIO 2: Crear un tema específico para la Landing Page =====
const landingPageTheme = createTheme({
  palette: {
    primary: {
      main: Colors.primary,
    },
    secondary: {
      main: Colors.secondary,
    },
    // Puedes añadir más configuraciones aquí si lo necesitas
  },
});
// ===========================================================================

// --- Animaciones ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

// --- Componentes Estilizados (sin cambios) ---
const PageWrapper = styled(Box)` background-color: ${Colors.background}; `;
const HeroSection = styled(Box)`
  background-color: ${Colors.primary};
  color: ${Colors.white};
  padding: 80px 0;
  position: relative;
  overflow: hidden;
  &::before { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 100px; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100 C40 0 60 0 100 100 Z" fill="${Colors.background}" /></svg>'); background-size: 100% 100px; background-repeat: no-repeat; }
`;
const HeroContent = styled(Container)` position: relative; z-index: 2; animation: ${fadeIn} 1s ease-out; `;
const TrustBar = styled(Box)` padding: 40px 0; background-color: ${Colors.backgroundSubtle}; border-bottom: 1px solid #e0e0e0; `;
const TrustMetric = styled(Box)` text-align: center; color: ${Colors.text}; .MuiSvgIcon-root { color: ${Colors.accent}; font-size: 2.5rem; margin-bottom: 8px; } p { margin: 0; font-weight: 500; } `;
const NarrativeSection = styled(Box)` padding: 80px 0; background-color: ${props => props.bgColor || Colors.background}; `;
const SectionTitle = styled(Typography)` font-weight: 700 !important; color: ${Colors.primary}; margin-bottom: 16px !important; text-align: center; `;
const SectionSubtitle = styled(Typography)` text-align: center; color: ${Colors.textLight}; margin-bottom: 48px !important; max-width: 700px; margin-left: auto; margin-right: auto; `;
const ServiceCard = styled(Paper)` padding: 32px; text-align: center; border-radius: 12px; border-top: 4px solid ${Colors.accent}; box-shadow: 0 10px 30px rgba(0,0,0,0.08); transition: transform 0.3s, box-shadow 0.3s; height: 100%; &:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.12); } `;

// --- COMPONENTE PRINCIPAL ---
const LandingPage = () => {
  return (
    // ===== INICIO DEL CAMBIO 3: Envolver todo en el ThemeProvider local =====
    <ThemeProvider theme={landingPageTheme}>
      <PageWrapper>
        {/* Todo el contenido de la página va aquí dentro, sin cambios */}
        <HeroSection>
          <HeroContent>{/* ... */}</HeroContent>
        </HeroSection>
        <TrustBar>{/* ... */}</TrustBar>
        <NarrativeSection>{/* ... */}</NarrativeSection>
        <NarrativeSection bgColor={Colors.backgroundSubtle} id="como-funciona">{/* ... */}</NarrativeSection>
        <NarrativeSection>{/* ... */}</NarrativeSection>
        <Box sx={{ p: 4, backgroundColor: Colors.primary, color: 'white', textAlign: 'center' }}><Container><Typography variant="body2">© {new Date().getFullYear()} DoctorsOnline. Todos los derechos reservados.</Typography></Container></Box>
      </PageWrapper>
    </ThemeProvider>
    // ======================================================================
  );
};

// El contenido detallado de las secciones se omite aquí por brevedad, pero en tu archivo debe estar completo
export default LandingPage;