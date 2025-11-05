// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '/src/supabase-client.js';
import { styled } from '@mui/material/styles';
import {
  Box, Typography, Divider, Grid, Card, CardContent,
  CardHeader, CircularProgress, Alert
} from '@mui/material';
import moment from 'moment';

// --- Paleta de Colores ---
const palette = {
  primary: '#3C607D', // Lapisázuli
  secondary: '#7192BE', // Azul grisáceo
  text: '#5C5C5D',      // Gris de Davy
  background: '#D9DBBC', // Beige (el más claro)
  white: '#FFFFFF'
};
// -------------------------

const CustomCard = styled(Card)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', width: '100%', padding: theme.spacing(2),
  backgroundColor: palette.background, // <-- CAMBIO: Usamos el beige claro
  gap: theme.spacing(1), borderRadius: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.1) 0px 8px 25px 0px, hsla(220, 25%, 10%, 0.15) 0px 25px 50px -10px',
  height: '100%',
}));

export default function DashboardPage() {
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [latestPatient, setLatestPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Obtener citas para hoy
        const today = moment().format('YYYY-MM-DD');
        const { data: appointments, error: appointmentsError } = await supabase
          .from('cita')
          .select('*, paciente(nombres, apellidos)') 
          .eq('fechaCita', today);
        if (appointmentsError) throw appointmentsError;
        setTodaysAppointments(appointments);

        // 2. Obtener el último paciente registrado
        const { data: patient, error: patientError } = await supabase
          .from('paciente')
          .select('*, historialmedico(*)') 
          .order('idpaciente', { ascending: false }) 
          .limit(1) 
          .single(); 
        if (patientError) throw patientError;
        setLatestPatient(patient);

      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // <-- CAMBIO: Añadido color primario al spinner
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, color: palette.primary }}><CircularProgress color="inherit" /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <CustomCard>
          <CardHeader
            // <-- CAMBIO: Color y peso para el título
            titleTypographyProps={{ color: palette.primary, fontWeight: 'bold' }}
            title="Tareas de Hoy"
            action={
              // <-- CAMBIO: Usamos el azul primario de fondo y texto blanco para el contador
              <Typography variant="h6" sx={{ p: 1, bgcolor: palette.primary, color: palette.white, borderRadius: 1 }}>
                {todaysAppointments.length}
              </Typography>
            }
          />
          <CardContent>
            {/* 3. Mapeamos las citas reales */}
            {todaysAppointments.length > 0 ? (
              todaysAppointments.map((appt, index) => (
                <Box key={appt.idcita}>
                  <Box sx={{ mb: 1 }}>
                    {/* <-- CAMBIO: Color de texto principal */}
                    <Typography variant="body1" color={palette.text}>{appt.descripcion}</Typography>
                    {/* <-- CAMBIO: Color de texto secundario */}
                    <Typography variant="caption" color={palette.secondary}>
                      {appt.paciente ? `${appt.paciente.nombres} ${appt.paciente.apellidos}` : 'Paciente no especificado'} - {moment(appt.hora, 'HH:mm:ss').format('hh:mm A')}
                    </Typography>
                  </Box>
                  {index < todaysAppointments.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))
            ) : (
              // <-- CAMBIO: Color de texto principal
              <Typography color={palette.text}>No hay citas programadas para hoy.</Typography>
            )}
          </CardContent>
        </CustomCard>
      </Grid>

      <Grid item xs={12} md={8}>
        <CustomCard>
          {/* <-- CAMBIO: Color y peso para el título */}
          <CardHeader title="Resumen del Último Paciente Registrado" titleTypographyProps={{ color: palette.primary, fontWeight: 'bold' }}/>
          <CardContent>
            {/* 4. Mostramos el último paciente real */}
            {latestPatient ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    {/* <-- CAMBIO: Color de texto secundario (etiqueta) */}
                    <Typography variant="body2" color={palette.secondary}>Nombre</Typography>
                    {/* <-- CAMBIO: Color de texto principal (valor) */}
                    <Typography variant="body1" color={palette.text}>{latestPatient.nombres} {latestPatient.apellidos}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <-- CAMBIO: Color de texto secundario (etiqueta) */}
                    <Typography variant="body2" color={palette.secondary}>Edad</Typography>
                    {/* <-- CAMBIO: Color de texto principal (valor) */}
                    <Typography variant="body1" color={palette.text}>{latestPatient.edad}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <-- CAMBIO: Color de texto secundario (etiqueta) */}
                    <Typography variant="body2" color={palette.secondary}>Género</Typography>
                    {/* <-- CAMBIO: Color de texto principal (valor) */}
                    <Typography variant="body1" color={palette.text}>{latestPatient.genero}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <-- CAMBIO: Color de texto secundario (etiqueta) */}
                    <Typography variant="body2" color={palette.secondary}>Teléfono</Typography>
                    {/* <-- CAMBIO: Color de texto principal (valor) */}
                    <Typography variant="body1" color={palette.text}>{latestPatient.telefono}</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, mt: 2 }}>
                  {/* <-- CAMBIO: Borde inferior con color primario */}
                  <Typography variant="body2" sx={{ p: 1, display: 'inline-block', borderBottom: `2px solid ${palette.primary}`, color: palette.primary }}>Resumen</Typography>
                </Box>
                {/* <-- CAMBIO: Color de texto principal */}
                <Typography variant="body2" color={palette.text}>
                  <b>Diagnóstico Principal:</b> {latestPatient.historialmedico?.[0]?.diagnostico || 'No registrado.'}
                  <br />
                  <b>Tratamiento Actual:</b> {latestPatient.historialmedico?.[0]?.tratamiento || 'No registrado.'}
                </Typography>
              </>
            ) : (
              // <-- CAMBIO: Color de texto principal
              <Typography color={palette.text}>No hay pacientes registrados para mostrar un resumen.</Typography>
            )}
          </CardContent>
        </CustomCard>
      </Grid>
    </Grid>
  );
}