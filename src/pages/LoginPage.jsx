// src/pages/LoginPage.jsx
import * as React from 'react';
import { useState } from 'react';
import { supabase } from '/src/supabase-client.js';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Card, Grid, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomCard = styled(Card)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%',
  padding: theme.spacing(4), gap: theme.spacing(2), margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  backgroundColor: '#e4e4e4ff', borderRadius: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.1) 0px 8px 25px 0px, hsla(220, 25%, 10%, 0.15) 0px 25px 50px -10px',
}));

export default function LoginPage() {
  // 1. Cambiamos 'email' por 'username'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!username || !password) {
      setError('El usuario y la contraseña son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      // 2. Buscamos en la tabla 'cuentausuario' en lugar de usar supabase.auth
      const { data: userAccount, error: fetchError } = await supabase
        .from('cuentausuario')
        .select('*')
        .eq('usuario', username)
        .single(); // Esperamos encontrar solo un usuario

      if (fetchError || !userAccount) {
        throw new Error('Usuario o contraseña incorrectos.');
      }

      // 3. Comparamos la contraseña en texto plano (NO RECOMENDADO)
      if (userAccount.contraseña !== password) {
        throw new Error('Usuario o contraseña incorrectos.');
      }

      // 4. Si todo es correcto, guardamos una sesión simple y redirigimos
      sessionStorage.setItem('user', JSON.stringify(userAccount));
      navigate('/dashboard');

    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', p: 2 }}>
      <Container component="main" maxWidth="md">
        <CustomCard>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">DoctorsOnline</Typography>
            <Typography component="h2" variant="h6" sx={{ mt: 1, mb: 2 }}>Iniciar Sesión</Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* 5. El campo ahora es para 'Nombre de Usuario' */}
            <TextField margin="normal" required fullWidth id="username" label="Nombre de Usuario" name="username" autoComplete="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField margin="normal" required fullWidth name="password" label="Contraseña" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1 }} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Box>
          {/* 6. Enlace de registro eliminado */}
        </CustomCard>
      </Container>
    </Box>
  );
}