import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
      <HashRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/medical-form" element={<MedicalFormPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Rutas protegidas / dashboard */}
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:patientId" element={<PatientRecordPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </Box>
  );
}

export default App;
