import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Divider
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const colors = {
  primary: '#457B9D',
  secondary: '#F4A261',
  accent: '#E76F51',
  dark: '#1D3557',
  darkLight: '#2A4D69',
  light: '#F1FAEE',
  white: '#FFFFFF',
};

const MedicalFormPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    sexo: "",
    telefono: "",
    direccion: "",
    motivoConsulta: "",
    alergias: "",
    antecedentes: "",
    medicamentos: "",
    fechaCita: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "edad") {
      if (value === "" || Number(value) >= 0) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.nombre.trim()) tempErrors.nombre = "El nombre es obligatorio.";
    if (!formData.edad) tempErrors.edad = "La edad es obligatoria.";
    else if (formData.edad > 120) tempErrors.edad = "La edad no parece válida.";
    if (!formData.sexo) tempErrors.sexo = "Debe seleccionar un sexo.";
    if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono)) tempErrors.telefono = "El número de teléfono no es válido.";
    if (!formData.motivoConsulta.trim()) tempErrors.motivoConsulta = "El motivo de la consulta es obligatorio.";
    // validar fecha de cita
    if (!formData.fechaCita) tempErrors.fechaCita = "La fecha y hora de la cita son obligatorias.";
    else {
      const selected = new Date(formData.fechaCita);
      const now = new Date();
      if (isNaN(selected.getTime())) tempErrors.fechaCita = "Fecha inválida.";
      else if (selected < now) tempErrors.fechaCita = "La fecha de la cita debe ser en el futuro.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Datos del paciente:", formData);
      alert("Formulario enviado correctamente");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: colors.light,
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{ maxWidth: 600, width: "100%", p: 5, borderRadius: 3, bgcolor: colors.white }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <LocalHospitalIcon sx={{ fontSize: 50, color: colors.primary, mb: 1 }} />
          <Typography variant="h4" fontWeight="bold" color={colors.dark}>
            Formulario Médico
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          {/** Campos lineales, más grandes **/}
          <TextField
            fullWidth
            label="Nombre completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
            margin="normal"
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          />

          <TextField
            fullWidth
            label="Edad"
            name="edad"
            type="number"
            value={formData.edad}
            onChange={handleChange}
            required
            error={!!errors.edad}
            helperText={errors.edad}
            margin="normal"
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          />

          <TextField
            select
            fullWidth
            label="Sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
            error={!!errors.sexo}
            helperText={errors.sexo}
            margin="normal"
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          >
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Femenino">Femenino</MenuItem>
            <MenuItem value="Otro">Otro</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            error={!!errors.telefono}
            helperText={errors.telefono}
            margin="normal"
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          />

          <TextField
            fullWidth
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            margin="normal"
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          />

          <TextField
            fullWidth
            label="Motivo de consulta"
            name="motivoConsulta"
            value={formData.motivoConsulta}
            onChange={handleChange}
            multiline
            rows={3}
            required
            error={!!errors.motivoConsulta}
            helperText={errors.motivoConsulta}
            margin="normal"
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          />

          <TextField
            fullWidth
            label="Alergias"
            name="alergias"
            value={formData.alergias}
            onChange={handleChange}
            multiline
            rows={2}
            margin="normal"
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          />

          <TextField
            fullWidth
            label="Antecedentes médicos"
            name="antecedentes"
            value={formData.antecedentes}
            onChange={handleChange}
            multiline
            rows={2}
            margin="normal"
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          />

          <TextField
            fullWidth
            label="Medicamentos actuales"
            name="medicamentos"
            value={formData.medicamentos}
            onChange={handleChange}
            multiline
            rows={2}
            margin="normal"
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          />

          {/* Campo fecha y hora de la cita */}
          <TextField
            fullWidth
            label="Fecha y hora de la cita"
            name="fechaCita"
            type="datetime-local"
            value={formData.fechaCita}
            onChange={handleChange}
            required
            error={!!errors.fechaCita}
            helperText={errors.fechaCita}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.05rem', padding: '12px' },
              "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
              "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 4,
              py: 1.8,
              fontSize: '1.2rem',
              borderRadius: 2,
              fontWeight: 'bold',
              bgcolor: colors.primary,
              color: colors.white,
              "&:hover": { bgcolor: colors.dark }
            }}
          >
            Enviar formulario
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default MedicalFormPage;
