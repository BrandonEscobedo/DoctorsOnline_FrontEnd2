import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
// 1. Importar el cliente de Supabase
import { supabase } from "../supabase-client"; // Ajusta la ruta si es necesario

// Los estilos locales del formulario se mantienen
const colors = {
  primary: "#457B9D",
  secondary: "#F4A261",
  accent: "#E76F51",
  dark: "#1D3557",
  darkLight: "#2A4D69",
  light: "#F1FAEE",
  white: "#FFFFFF",
};

const MedicalFormPage = () => {
  // 2. Actualizar el estado para que coincida con la tabla
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    telefono: "",
    correo: "", // Campo nuevo
    fechaCita: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  // 3. Actualizar la validación
  const validate = () => {
    let tempErrors = {};
    if (!formData.nombre.trim()) tempErrors.nombre = "El nombre es obligatorio.";
    if (!formData.edad) tempErrors.edad = "La edad es obligatoria.";
    else if (formData.edad > 120) tempErrors.edad = "La edad no parece válida.";
    
    // El teléfono es 'not null' en la DB
    if (!formData.telefono) tempErrors.telefono = "El teléfono es obligatorio.";
    else if (!/^\d{7,15}$/.test(formData.telefono)) tempErrors.telefono = "El número de teléfono no es válido.";

    // El correo es 'not null' en la DB
    if (!formData.correo.trim()) tempErrors.correo = "El correo es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) tempErrors.correo = "El correo no es válido.";

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

  // 4. Actualizar handleSubmit para conectar con Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (validate()) {
      setIsSubmitting(true);
      try {
        // Mapear los nombres del estado a los nombres de las columnas
        const { data, error } = await supabase
          .from("SolicitudCita") // Nombre de tu tabla
          .insert([
            {
              nombres: formData.nombre,
              edad: formData.edad,
              Telefono: formData.telefono, // IMPORTANTE: Coincidir mayúscula de la DB
              correo: formData.correo,
              fechaCita: formData.fechaCita,
            },
          ])
          .select();

        if (error) {
          throw error;
        }

        console.log("Datos insertados:", data);
        alert("Solicitud de cita enviada correctamente");
        
        // Limpiar formulario
        setFormData({
          nombre: "",
          edad: "",
          telefono: "",
          correo: "",
          fechaCita: "",
        });
        setErrors({});

      } catch (error) {
        console.error("Error al enviar a Supabase:", error);
        setSubmitError(error.message || "Ocurrió un error al enviar el formulario.");
        alert("Error: " + (error.message || "No se pudo enviar la solicitud."));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Estilos comunes para los campos de texto
  const textFieldStyles = {
    "& .MuiInputBase-input": { color: colors.dark, fontSize: '1.1rem', padding: '14px' },
    "& .MuiFormLabel-root": { color: colors.darkLight, fontSize: '1rem' },
    "& .MuiOutlinedInput-root": { bgcolor: colors.light, borderRadius: 2 }
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
            Solicitud de Cita Médica
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 5. Renderizar solo los campos de la tabla */}
        <form onSubmit={handleSubmit}>
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
            sx={textFieldStyles}
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
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            type="tel" // Tipo 'tel' es más semántico
            value={formData.telefono}
            onChange={handleChange}
            required
            error={!!errors.telefono}
            helperText={errors.telefono}
            margin="normal"
            sx={textFieldStyles}
          />

          {/* Campo 'correo' (nuevo) */}
          <TextField
            fullWidth
            label="Correo Electrónico"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            required
            error={!!errors.correo}
            helperText={errors.correo}
            margin="normal"
            sx={textFieldStyles}
          />

          {/* Campo fecha y hora de la cita (se mantiene) */}
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

          {/* Mensaje de error de envío */}
          {submitError && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
              {submitError}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isSubmitting} // Deshabilitar mientras se envía
            sx={{
              mt: 4,
              py: 1.8,
              fontSize: '1.2rem',
              borderRadius: 2,
              fontWeight: 'bold',
              bgcolor: colors.primary,
              color: colors.white,
              "&:hover": { bgcolor: colors.dark },
              "&:disabled": { bgcolor: colors.darkLight }
            }}
          >
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default MedicalFormPage;