// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MedicalFormPage from './pages/Medical-Form';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientRecordPage from './pages/PatientRecordPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
        <Routes>
          {/* Rutas que no usan el layout del dashboard */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/medical-form" element={<MedicalFormPage />} />
          
          {/* Opcional: Mantenemos las rutas de login/registro por si las necesitas después */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas del panel principal, ahora accesibles para todos */}
          <Route path="/" element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:patientId" element={<PatientRecordPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;