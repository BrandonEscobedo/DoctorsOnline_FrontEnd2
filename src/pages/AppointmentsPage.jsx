// src/pages/AppointmentsPage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '/src/supabase-client.js';
import { 
  Box, Typography, Paper, Button, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle, MenuItem, FormControl, InputLabel, Select 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';

moment.locale('es');
const localizer = momentLocalizer(moment);

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3), borderRadius: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.1) 0px 8px 25px 0px, hsla(220, 25%, 10%, 0.15) 0px 25px 50px -10px',
  backgroundColor: '#ebecf0ff', height: '80vh',
}));

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]); // 1. Nuevo estado para guardar la lista de pacientes
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({ title: '', start: null, idpaciente: '' }); // Agregamos idpaciente al estado

  // 2. Usamos useEffect para cargar tanto citas como pacientes al iniciar
  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const { data, error } = await supabase.from('paciente').select('idpaciente, nombres, apellidos');
    if (error) {
      console.error('Error fetching patients:', error);
    } else {
      setPatients(data);
    }
  };

  const fetchAppointments = async () => {
    // Pedimos también el idpaciente para poder editar
    const { data, error } = await supabase
      .from('cita')
      .select('idcita, descripcion, fecha, hora, idpaciente');

    if (error) {
      console.error('Error fetching appointments:', error);
      alert(error.message);
    } else {
      const formattedData = data.map(appt => ({
        idcita: appt.idcita,
        title: appt.descripcion,
        start: new Date(`${appt.fecha}T${appt.hora}`),
        end: new Date(`${appt.fecha}T${appt.hora}`),
        idpaciente: appt.idpaciente // Guardamos el id del paciente en el evento
      }));
      setAppointments(formattedData);
    }
  };
  
  const handleOpen = (slotInfo) => {
    if (slotInfo.start) setFormData({ title: '', start: slotInfo.start, idpaciente: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
    setFormData({ title: '', start: null, idpaciente: '' });
  };

  const handleSelectEvent = (appointment) => {
    setSelectedAppointment(appointment);
    // Al editar, poblamos el formulario con los datos guardados, incluyendo el paciente
    setFormData({ 
      title: appointment.title, 
      start: appointment.start, 
      idpaciente: appointment.idpaciente 
    });
    setOpen(true);
  };

  const handleAddUpdate = async () => {
    // Validación para asegurar que se seleccionó un paciente
    if (!formData.idpaciente) {
      alert('Por favor, selecciona un paciente.');
      return;
    }

    try {
      const eventData = {
        fecha: moment(formData.start).format('YYYY-MM-DD'),
        hora: moment(formData.start).format('HH:mm:ss'),
        descripcion: formData.title,
        // 3. Usamos el idpaciente seleccionado del formulario
        idpaciente: formData.idpaciente, 
        iddoctor: 1,   // Placeholder, puedes cambiarlo después
        estado: 'programada'
      };
      
      if (selectedAppointment) { // Actualizar
        const { error } = await supabase.from('cita').update(eventData).eq('idcita', selectedAppointment.idcita);
        if (error) throw error;
      } else { // Crear
        const { error } = await supabase.from('cita').insert([eventData]);
        if (error) throw error;
      }
      fetchAppointments();
      handleClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que quieres eliminar esta cita?")) {
      try {
        const { error } = await supabase.from('cita').delete().eq('idcita', selectedAppointment.idcita);
        if (error) throw error;
        fetchAppointments();
        handleClose();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Gestión de Citas</Typography>
      <CustomPaper>
        <Calendar localizer={localizer} events={appointments} startAccessor="start" endAccessor="end" style={{ height: '100%' }} onSelectEvent={handleSelectEvent} onSelectSlot={handleOpen} selectable culture="es" messages={{ next: "Sig", previous: "Ant", today: "Hoy", month: "Mes", week: "Semana", day: "Día" }} />
      </CustomPaper>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{selectedAppointment ? 'Editar Cita' : 'Añadir Nueva Cita'}</DialogTitle>
        <DialogContent>
          {/* 4. Menú desplegable para seleccionar al paciente */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="patient-select-label">Paciente</InputLabel>
            <Select
              labelId="patient-select-label"
              id="patient-select"
              name="idpaciente"
              value={formData.idpaciente}
              label="Paciente"
              onChange={(e) => setFormData({...formData, idpaciente: e.target.value})}
            >
              {patients.map((patient) => (
                <MenuItem key={patient.idpaciente} value={patient.idpaciente}>
                  {`${patient.nombres} ${patient.apellidos}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField autoFocus margin="dense" label="Descripción de la Cita" type="text" fullWidth name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <TextField margin="dense" label="Fecha y Hora" type="datetime-local" fullWidth name="start" value={formData.start ? moment(formData.start).format('YYYY-MM-DDTHH:mm') : ''} onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })} InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          {selectedAppointment && <Button onClick={handleDelete} color="error">Eliminar</Button>}
          <Button onClick={handleAddUpdate} variant="contained">{selectedAppointment ? 'Guardar Cambios' : 'Añadir'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsPage;