// src/pages/RegisterPage.jsx
import * as React from 'react';
import { useState } from 'react';
import { supabase } from '/src/supabase-client.js';
import { Box, Button, Link, TextField, Typography, Container, Grid } from '@mui/material'; // 'Box' fue añadido aquí
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import { Link as RouterLink } from 'react-router-dom';

const CustomCard = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  backgroundColor: '#e4e4e4ff',
  borderRadius: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.1) 0px 8px 25px 0px, hsla(220, 25%, 10%, 0.15) 0px 25px 50px -10px',
}));

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let valid = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (valid) {
      try {
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) throw error;
        alert('¡Registro exitoso! Revisa tu correo electrónico para activar tu cuenta.');
      } catch (error) {
        alert(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', p: 2 }}>
      <Container component="main" maxWidth="md">
        <CustomCard>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">DoctorsOnline</Typography>
            <Typography component="h2" variant="h6" sx={{ mt: 1, mb: 2 }}>Registrarse</Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? 'Ingresa un correo válido.' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? 'La contraseña debe tener al menos 6 caracteres.' : ''}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1 }} disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Box>
          <Grid container justifyContent="center">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                {"¿Ya tienes una cuenta? Iniciar sesión"}
              </Link>
            </Grid>
          </Grid>
        </CustomCard>
      </Container>
    </Box>
  );
}