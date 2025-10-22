// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '/src/supabase-client.js';
import { styled } from '@mui/material/styles';
import { 
  Box, Typography, Divider, Grid, Card, CardContent, 
  CardHeader, CircularProgress, Alert 
} from '@mui/material';
import moment from 'moment';

const CustomCard = styled(Card)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', width: '100%', padding: theme.spacing(2),
  backgroundColor: '#ebecf0ff', gap: theme.spacing(1), borderRadius: theme.spacing(2),
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
          .select('*, paciente(nombres, apellidos)') // Traemos el nombre del paciente relacionado
          .eq('fecha', today);
        if (appointmentsError) throw appointmentsError;
        setTodaysAppointments(appointments);

        // 2. Obtener el último paciente registrado
        const { data: patient, error: patientError } = await supabase
          .from('paciente')
          .select('*, historialmedico(*)') // Traemos su historial médico
          .order('idpaciente', { ascending: false }) // Ordenamos de más nuevo a más viejo
          .limit(1) // Solo queremos el primero
          .single(); // Esperamos solo un resultado
        if (patientError) throw patientError;
        setLatestPatient(patient);

      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <CustomCard>
          <CardHeader
            title="Tareas de Hoy"
            action={
              <Typography variant="h6" color="primary" sx={{ p: 1, bgcolor: '#e0e0e0', borderRadius: 1 }}>
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
                    <Typography variant="body1">{appt.descripcion}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {appt.paciente ? `${appt.paciente.nombres} ${appt.paciente.apellidos}` : 'Paciente no especificado'} - {moment(appt.hora, 'HH:mm:ss').format('hh:mm A')}
                    </Typography>
                  </Box>
                  {index < todaysAppointments.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))
            ) : (
              <Typography>No hay citas programadas para hoy.</Typography>
            )}
          </CardContent>
        </CustomCard>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <CustomCard>
          <CardHeader title="Resumen del Último Paciente Registrado" />
          <CardContent>
            {/* 4. Mostramos el último paciente real */}
            {latestPatient ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Nombre</Typography>
                    <Typography variant="body1">{latestPatient.nombres} {latestPatient.apellidos}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Edad</Typography>
                    <Typography variant="body1">{latestPatient.edad}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Género</Typography>
                    <Typography variant="body1">{latestPatient.genero}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Teléfono</Typography>
                    <Typography variant="body1">{latestPatient.telefono}</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, mt: 2 }}>
                  <Typography variant="body2" sx={{ p: 1, display: 'inline-block', borderBottom: '2px solid primary.main' }}>Resumen</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <b>Diagnóstico Principal:</b> {latestPatient.historialmedico?.[0]?.diagnostico || 'No registrado.'}
                  <br/>
                  <b>Tratamiento Actual:</b> {latestPatient.historialmedico?.[0]?.tratamiento || 'No registrado.'}
                </Typography>
              </>
            ) : (
              <Typography>No hay pacientes registrados para mostrar un resumen.</Typography>
            )}
          </CardContent>
        </CustomCard>
      </Grid>
    </Grid>
  );
}