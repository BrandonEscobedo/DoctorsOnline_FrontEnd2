// src/pages/PatientsPage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '/src/supabase-client.js';
import {
  Box, Typography, Grid, TextField, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, CircularProgress, Card, CardContent, Avatar, Divider,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  
  // 1. Estado ampliado para incluir TODOS los campos de la tabla paciente
  const [formData, setFormData] = useState({
    idpaciente: null,
    nombres: '',
    apellidos: '',
    edad: '',
    genero: '',
    telefono: '',
    correo: '',
    direccion: '',
    fechanacimiento: ''
  });

  useEffect(() => {
    getPatients();
  }, []);

  const getPatients = async () => {
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
    if (patient) {
      // Mapeamos todos los campos existentes al formulario para la edición
      setFormData({
        idpaciente: patient.idpaciente,
        nombres: patient.nombres || '',
        apellidos: patient.apellidos || '',
        edad: patient.edad || '',
        genero: patient.genero || '',
        telefono: patient.telefono || '',
        correo: patient.correo || '',
        direccion: patient.direccion || '',
        // Aseguramos que la fecha tenga el formato YYYY-MM-DD para el input
        fechanacimiento: patient.fechanacimiento ? moment(patient.fechanacimiento).format('YYYY-MM-DD') : ''
      });
    } else {
      // Limpiamos el formulario completo para un nuevo paciente
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
    try {
      // 2. Objeto con todos los datos para guardar en Supabase
      const patientData = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        edad: formData.edad,
        genero: formData.genero,
        telefono: formData.telefono,
        correo: formData.correo,
        direccion: formData.direccion,
        fechanacimiento: formData.fechanacimiento || null // Enviar null si la fecha está vacía
      };

      if (formData.idpaciente) { // Actualizar
        const { error } = await supabase.from('paciente').update(patientData).eq('idpaciente', formData.idpaciente);
        if (error) throw error;
      } else { // Crear
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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3, mt: { xs: 7, sm: 8 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Pacientes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Añadir Paciente</Button>
      </Box>

      <Grid container spacing={3}>
        {patients.map((patient) => (
          <Grid item xs={12} sm={6} md={4} key={patient.idpaciente}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 50, height: 50, mr: 2 }}>{patient.nombres ? patient.nombres.charAt(0) : 'P'}</Avatar>
                  <Box>
                    <Typography variant="h6">{`${patient.nombres} ${patient.apellidos || ''}`}</Typography>
                    <Typography variant="body2" color="text.secondary">{patient.edad} años</Typography>
                  </Box>
                </Box>
                {/* 3. Mostramos más información en la tarjeta */}
                <Typography variant="body2" sx={{ mb: 1 }}><b>Correo:</b> {patient.correo || 'N/A'}</Typography>
                <Typography variant="body2"><b>Teléfono:</b> {patient.telefono || 'N/A'}</Typography>
                <Divider sx={{ my: 2 }}/>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                  <Button size="small" component={RouterLink} to={`/patients/${patient.idpaciente}`}>Expediente</Button>
                  <Button size="small" color="primary" onClick={() => handleOpen(patient)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(patient.idpaciente)}>Eliminar</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.idpaciente ? 'Editar Paciente' : 'Añadir Paciente'}</DialogTitle>
        <DialogContent>
          {/* 4. Formulario actualizado con todos los campos */}
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
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientsPage;