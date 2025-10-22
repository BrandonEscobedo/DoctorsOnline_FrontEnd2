// src/pages/ReportsPage.jsx
import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.1) 0px 8px 25px 0px, hsla(220, 25%, 10%, 0.15) 0px 25px 50px -10px',
  backgroundColor: '#ebecf0ff',
}));

const ReportsPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Generación de Reportes
      </Typography>

      <CustomPaper>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Panel de Reportes
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Selecciona el tipo de reporte que deseas generar. Podrás filtrar por fechas, pacientes o tipo de consulta.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<AssessmentIcon />}>Reporte de Actividad</Button>
            <Button variant="contained" startIcon={<AssessmentIcon />}>Reporte Financiero</Button>
            <Button variant="contained" startIcon={<AssessmentIcon />}>Reporte de Pacientes</Button>
        </Box>
      </CustomPaper>
    </Box>
  );
};

export default ReportsPage;