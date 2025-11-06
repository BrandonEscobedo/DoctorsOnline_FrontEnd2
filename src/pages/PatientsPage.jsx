// src/pages/PatientsPage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '/src/supabase-client.js';
import {
  Box, Typography, Grid, TextField, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, CircularProgress, Card, CardContent, Avatar, Divider,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';

// --- Paleta de Colores (AJUSTADA) ---
// <-- CAMBIO: Fondo de página ahora es un gris muy claro
const palette = {
 primary: '#3c607df8',
  secondary: '#3b3e42ff',
  text: '#5C5C5D',
  pageBackground: '#b8b8ad36',
  cardBackground: '#f9f7f350',
  white: '#FFFFFF'
};
// ------------------------------------

// <-- Fondo de la tarjeta es blanco
const CustomCard = styled(Card)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', width: '100%',
  backgroundColor: palette.cardBackground, // <-- USAMOS BLANCO
  borderRadius: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.1) 0px 8px 25px 0px, hsla(220, 25%, 10%, 0.15) 0px 25px 50px -10px',
  height: '100%', 
}));

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    idpaciente: null, nombres: '', apellidos: '', edad: '', genero: '',
    telefono: '', correo: '', direccion: '', fechanacimiento: ''
  });

  useEffect(() => {
    getPatients();
  }, []);

  const getPatients = async () => {
    // ... (Tu lógica de getPatients sin cambios) ...
    setLoading(true);
    const { data, error } = await supabase.from('paciente').select('*').order('nombres', { ascending: true });
    if (error) {
      console.error('Error fetching patients:', error);
      alert(error.message);
    } else {
      setPatients(data);
    }
    setLoading(false);
  };

  const handleOpen = (patient = null) => {
    // ... (Tu lógica de handleOpen sin cambios) ...
    if (patient) {
      setFormData({
        idpaciente: patient.idpaciente,
        nombres: patient.nombres || '',
        apellidos: patient.apellidos || '',
        edad: patient.edad || '',
        genero: patient.genero || '',
        telefono: patient.telefono || '',
        correo: patient.correo || '',
        direccion: patient.direccion || '',
        fechanacimiento: patient.fechanacimiento ? moment(patient.fechanacimiento).format('YYYY-MM-DD') : ''
      });
    } else {
      setFormData({
        idpaciente: null, nombres: '', apellidos: '', edad: '', genero: '',
        telefono: '', correo: '', direccion: '', fechanacimiento: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    // ... (Tu lógica de handleSave sin cambios) ...
    try {
      const patientData = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        edad: formData.edad,
        genero: formData.genero,
        telefono: formData.telefono,
        correo: formData.correo,
        direccion: formData.direccion,
        fechanacimiento: formData.fechanacimiento || null
      };

      if (formData.idpaciente) {
        const { error } = await supabase.from('paciente').update(patientData).eq('idpaciente', formData.idpaciente);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('paciente').insert([patientData]);
        if (error) throw error;
      }
      getPatients();
      handleClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (patientId) => {
  
    if (window.confirm("¿Seguro que quieres eliminar a este paciente?")) {
      try {
        const { error } = await supabase.from('paciente').delete().eq('idpaciente', patientId);
        if (error) throw error;
        setPatients(patients.filter((p) => p.idpaciente !== patientId));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // <-- Spinner con color primario
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, color: palette.primary }}><CircularProgress color="inherit" /></Box>;

  return (
    // <-- CAMBIO: Fondo de página gris claro
    <Box sx={{ p: 3, mt: { xs: 7, sm: 8 }, bgcolor: palette.pageBackground, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {/* <-- Título con color primario */}
        <Typography variant="h4" fontWeight="bold" sx={{ color: palette.primary }}>Pacientes</Typography>
        {/* <-- Botón con color primario */}
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpen()}
          sx={{ bgcolor: palette.primary, '&:hover': { bgcolor: palette.secondary } }}
        >
          Añadir Paciente
        </Button>
      </Box>

      <Grid container spacing={3}>
        {patients.map((patient) => (
          <Grid item xs={12} sm={6} md={4} key={patient.idpaciente}>
            {/* <-- Usando CustomCard (que es BLANCA) */}
            <CustomCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {/* <-- Avatar con color primario */}
                  <Avatar sx={{ width: 50, height: 50, mr: 2, bgcolor: palette.primary }}>
                    {patient.nombres ? patient.nombres.charAt(0) : 'P'}
                  </Avatar>
                  <Box>
                    {/* <-- Nombre con color primario */}
                    <Typography variant="h6" fontWeight="bold" sx={{ color: palette.primary }}>
                      {`${patient.nombres} ${patient.apellidos || ''}`}
                    </Typography>
                    {/* <-- Edad con color secundario */}
                    <Typography variant="body2" color={palette.secondary}>{patient.edad} años</Typography>
                  </Box>
                </Box>
                {/* <-- Texto con color principal */}
                <Typography variant="body2" sx={{ mb: 1, color: palette.text }}><b>Correo:</b> {patient.correo || 'N/A'}</Typography>
                <Typography variant="body2" sx={{ color: palette.text }}><b>Teléfono:</b> {patient.telefono || 'N/A'}</Typography>
                <Divider sx={{ my: 2 }}/>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                  {/* <-- Botones con color primario */}
                  <Button size="small" component={RouterLink} to={`/patients/${patient.idpaciente}`} sx={{ color: palette.primary, fontWeight: 'medium' }}>Expediente</Button>
                  <Button size="small" onClick={() => handleOpen(patient)} sx={{ color: palette.primary, fontWeight: 'medium' }}>Editar</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(patient.idpaciente)} sx={{ fontWeight: 'medium' }}>Eliminar</Button>
                </Box>
              </CardContent>
            </CustomCard>
          </Grid>
        ))}
      </Grid>
      
     
      <Dialog open={open} onClose={handleClose}>
        {/* <-- Título del diálogo con color primario */}
        <DialogTitle sx={{ color: palette.primary, fontWeight: 'bold' }}>
          {formData.idpaciente ? 'Editar Paciente' : 'Añadir Paciente'}
        </DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="nombres" label="Nombres" fullWidth value={formData.nombres} onChange={handleChange} />
          <TextField margin="dense" name="apellidos" label="Apellidos" fullWidth value={formData.apellidos} onChange={handleChange} />
          <TextField margin="dense" name="edad" label="Edad" type="number" fullWidth value={formData.edad} onChange={handleChange} />
          <TextField margin="dense" name="fechanacimiento" label="Fecha de Nacimiento" type="date" fullWidth value={formData.fechanacimiento} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField select margin="dense" name="genero" label="Género" fullWidth value={formData.genero} onChange={handleChange}>
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Femenino">Femenino</MenuItem>
            <MenuItem value="Otro">Otro</MenuItem>
          </TextField>
          <TextField margin="dense" name="correo" label="Correo Electrónico" type="email" fullWidth value={formData.correo} onChange={handleChange} />
          <TextField margin="dense" name="telefono" label="Teléfono" fullWidth value={formData.telefono} onChange={handleChange} />
          <TextField margin="dense" name="direccion" label="Dirección" fullWidth value={formData.direccion} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          {/* <-- Botones del diálogo con colores de la paleta */}
          <Button onClick={handleClose} sx={{ color: palette.secondary }}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: palette.primary }}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientsPage;
