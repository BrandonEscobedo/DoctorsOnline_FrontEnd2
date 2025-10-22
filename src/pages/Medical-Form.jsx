import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

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
  });

  // estado para almacenar los errores de validación.
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    //  la validación en tiempo real para la edad.
    if (name === "edad") {
      if (value === "" || Number(value) >= 0) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // función que valida todos los campos.
  const validate = () => {
    let tempErrors = {};

    // Nombre: no puede estar vacío.
    if (!formData.nombre.trim()) {
      tempErrors.nombre = "El nombre es obligatorio.";
    }

    // Edad: no puede estar vacía y debe ser un número razonable.
    if (!formData.edad) {
      tempErrors.edad = "La edad es obligatoria.";
    } else if (formData.edad > 120) {
      tempErrors.edad = "La edad no parece válida.";
    }

    // Sexo: debe ser seleccionado.
    if (!formData.sexo) {
      tempErrors.sexo = "Debe seleccionar un sexo.";
    }

    // Teléfono (opcional): si se ingresa, debe tener un formato válido.
    // Esta es una validación simple que verifica si son entre 7 y 15 dígitos.
    if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono)) {
      tempErrors.telefono = "El número de teléfono no es válido.";
    }

    // Motivo de consulta: no puede estar vacío.
    if (!formData.motivoConsulta.trim()) {
      tempErrors.motivoConsulta = "El motivo de la consulta es obligatorio.";
    }

    setErrors(tempErrors);

    // La función devuelve `true` si no hay errores, y `false` si los hay.
    return Object.keys(tempErrors).length === 0;
  };

  //  handleSubmit para que llame a la función de validación.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Si la validación es exitosa (devuelve true)...
    if (validate()) {
      console.log("Datos del paciente:", formData);
      alert(" Formulario enviado correctamente");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#e8f5e9",
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ maxWidth: 600, width: "100%", p: 4, borderRadius: 4, bgcolor: "white" }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <LocalHospitalIcon sx={{ fontSize: 40, color: "#1976d2", mr: 1 }} />
          <Typography variant="h5" fontWeight="bold" color="primary">
            Formulario Médico
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
          />

          <TextField
            fullWidth
            label="Edad"
            name="edad"
            type="number"
            value={formData.edad}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 0 }}
            error={!!errors.edad}
            helperText={errors.edad}
          />

          <TextField
            select
            fullWidth
            label="Sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.sexo}
            helperText={errors.sexo}
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
            margin="normal"
            error={!!errors.telefono}
            helperText={errors.telefono}
          />

          <TextField fullWidth label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} margin="normal" />

          <TextField
            fullWidth
            label="Motivo de consulta"
            name="motivoConsulta"
            value={formData.motivoConsulta}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
            required
            error={!!errors.motivoConsulta}
            helperText={errors.motivoConsulta}
          />

          <TextField fullWidth label="Alergias" name="alergias" value={formData.alergias} onChange={handleChange} margin="normal" multiline rows={2} />
          <TextField fullWidth label="Antecedentes médicos" name="antecedentes" value={formData.antecedentes} onChange={handleChange} margin="normal" multiline rows={2} />
          <TextField fullWidth label="Medicamentos actuales" name="medicamentos" value={formData.medicamentos} onChange={handleChange} margin="normal" multiline rows={2} />

          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 3, borderRadius: 3, fontWeight: "bold", py: 1.5, fontSize: "1rem", bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}>
            Enviar formulario
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default MedicalFormPage;