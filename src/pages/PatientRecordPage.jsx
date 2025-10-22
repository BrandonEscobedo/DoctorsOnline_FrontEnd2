// src/pages/PatientRecordPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '/src/supabase-client.js';
import {
  Box, Typography, Paper, CircularProgress, Alert, Card, CardContent,
  Divider, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  IconButton // 1. Importamos IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // 1. Importamos el ícono de eliminar

const PatientRecordPage = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editableData, setEditableData] = useState({
    historial: {},
    antecedentes: {},
    nuevaEnfermedad: { nombreenfermedad: '', estado: 'Activa', observaciones: '' },
    nuevoMedicamento: { nombremedicamento: '', dosis: '', frecuencia: '' }
  });

  const getPatientRecord = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('paciente')
      .select(`*, historialmedico (*), antecedentesmedicos (*), enfermedadesprevias (*), medicamentos (*)`)
      .eq('idpaciente', patientId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching patient record:', error);
      setPatient(null); 
    } else {
      setPatient(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (patientId) {
      getPatientRecord();
    }
  }, [patientId]);

  // 2. Nueva función para manejar la eliminación de ítems
  const handleDeleteItem = async (tableName, idColumn, id) => {
    const itemName = tableName === 'medicamentos' ? 'medicamento' : 'enfermedad';
    if (window.confirm(`¿Estás seguro de que quieres eliminar este/a ${itemName}?`)) {
      try {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(idColumn, id);

        if (error) throw error;

        // Recargamos los datos para que la UI se actualice
        getPatientRecord(); 
      } catch (error) {
        alert(`Error al eliminar: ${error.message}`);
      }
    }
  };

  const handleOpenEdit = () => {
    if (!patient) return;
    setEditableData({
      historial: patient.historialmedico?.[0] || { idpaciente: patientId },
      antecedentes: patient.antecedentesmedicos?.[0] || { idpaciente: patientId },
      nuevaEnfermedad: { nombreenfermedad: '', estado: 'Activa', observaciones: '' },
      nuevoMedicamento: { nombremedicamento: '', dosis: '', frecuencia: '' }
    });
    setIsEditing(true);
  };
  const handleCloseEdit = () => setIsEditing(false);

  const handleSave = async () => {
    try {
      const { historial, antecedentes, nuevaEnfermedad, nuevoMedicamento } = editableData;
      
      historial.idpaciente = patientId;
      antecedentes.idpaciente = patientId;
      
      await supabase.from('historialmedico').upsert(historial);
      await supabase.from('antecedentesmedicos').upsert(antecedentes);

      if (nuevaEnfermedad.nombreenfermedad.trim()) {
        await supabase.from('enfermedadesprevias').insert({ ...nuevaEnfermedad, idpaciente: patientId });
      }
      if (nuevoMedicamento.nombremedicamento.trim()) {
        await supabase.from('medicamentos').insert({ ...nuevoMedicamento, idpaciente: patientId });
      }

      getPatientRecord();
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setEditableData(prev => ({
      ...prev,
      [section]: { ...prev[section], [name]: value }
    }));
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (!patient) return <Alert severity="error">Paciente no encontrado.</Alert>;
  
  const history = patient.historialmedico?.[0] || {};
  const background = patient.antecedentesmedicos?.[0] || {};
  const pastDiseases = patient.enfermedadesprevias || [];
  const medications = patient.medicamentos || [];

  return (
    <Box sx={{ p: 3, mt: { xs: 7, sm: 8 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Expediente de {patient.nombres} {patient.apellidos}</Typography>
        <Button variant="contained" startIcon={<EditIcon />} onClick={handleOpenEdit}>Editar Expediente</Button>
      </Box>

      <Grid container spacing={3}>
        {/* ... (Las tarjetas de Datos del Paciente e Historial y Antecedentes no cambian) ... */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Datos del Paciente</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography><b>Edad:</b> {patient.edad || 'N/A'} años</Typography>
              <Typography><b>Género:</b> {patient.genero || 'N/A'}</Typography>
              <Typography><b>Teléfono:</b> {patient.telefono || 'N/A'}</Typography>
              <Typography><b>Correo:</b> {patient.correo || 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Historial y Antecedentes</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography><b>Diagnóstico Principal:</b> {history.diagnostico || 'No registrado'}</Typography>
              <Typography><b>Tratamiento Actual:</b> {history.tratamiento || 'No registrado'}</Typography>
              <Typography><b>Antecedentes:</b> {background.descripcion || 'No registrados'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Enfermedades Previas</Typography>
              <Divider sx={{ my: 1 }} />
              {pastDiseases.length > 0 ? pastDiseases.map(d => (
                // 3. Se añade un botón de eliminar para cada enfermedad
                <Box key={d.idenfermedad} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography>- {d.nombreenfermedad} ({d.estado})</Typography>
                  <IconButton size="small" onClick={() => handleDeleteItem('enfermedadesprevias', 'idenfermedad', d.idenfermedad)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )) : <Typography>No hay registros.</Typography>}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Medicamentos Actuales</Typography>
              <Divider sx={{ my: 1 }} />
              {medications.length > 0 ? medications.map(m => (
                // 3. Se añade un botón de eliminar para cada medicamento
                <Box key={m.idmedicamento} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography>- {m.nombremedicamento} ({m.dosis}, {m.frecuencia})</Typography>
                  <IconButton size="small" onClick={() => handleDeleteItem('medicamentos', 'idmedicamento', m.idmedicamento)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )) : <Typography>No hay registros.</Typography>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* ... (El Dialog para editar no cambia) ... */}
      <Dialog open={isEditing} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Editar Expediente de {patient.nombres}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>Historial y Antecedentes</Typography>
          <TextField fullWidth margin="dense" label="Diagnóstico Principal" name="diagnostico" multiline rows={2} value={editableData.historial?.diagnostico || ''} onChange={(e) => handleChange(e, 'historial')} />
          <TextField fullWidth margin="dense" label="Tratamiento Actual" name="tratamiento" multiline rows={2} value={editableData.historial?.tratamiento || ''} onChange={(e) => handleChange(e, 'historial')} />
          <TextField fullWidth margin="dense" label="Descripción de Antecedentes" name="descripcion" multiline rows={2} value={editableData.antecedentes?.descripcion || ''} onChange={(e) => handleChange(e, 'antecedentes')} />
          <Divider sx={{ my: 2 }}/>
          <Typography variant="subtitle1" gutterBottom>Añadir Nueva Enfermedad Previa</Typography>
          <TextField fullWidth margin="dense" label="Nombre de la Enfermedad" name="nombreenfermedad" value={editableData.nuevaEnfermedad.nombreenfermedad} onChange={(e) => handleChange(e, 'nuevaEnfermedad')} />
          <TextField fullWidth margin="dense" label="Estado (Activa, Resuelta, etc.)" name="estado" value={editableData.nuevaEnfermedad.estado} onChange={(e) => handleChange(e, 'nuevaEnfermedad')} />
          <Divider sx={{ my: 2 }}/>
          <Typography variant="subtitle1" gutterBottom>Añadir Nuevo Medicamento</Typography>
          <TextField fullWidth margin="dense" label="Nombre del Medicamento" name="nombremedicamento" value={editableData.nuevoMedicamento.nombremedicamento} onChange={(e) => handleChange(e, 'nuevoMedicamento')} />
          <TextField fullWidth margin="dense" label="Dosis" name="dosis" value={editableData.nuevoMedicamento.dosis} onChange={(e) => handleChange(e, 'nuevoMedicamento')} />
          <TextField fullWidth margin="dense" label="Frecuencia" name="frecuencia" value={editableData.nuevoMedicamento.frecuencia} onChange={(e) => handleChange(e, 'nuevoMedicamento')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientRecordPage;