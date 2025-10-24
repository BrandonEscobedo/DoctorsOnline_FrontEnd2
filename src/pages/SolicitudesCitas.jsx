// src/pages/SolicitudesCitas.jsx

import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button, CircularProgress, Avatar, Divider, Chip, Stack
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const SolicitudCard = ({ numero, telefono, fecha_creacion, fecha_solicitada, nombres, estado, conflicto, onAccept, onReject, onResolve }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar sx={{ width: 48, height: 48 }}>{nombres ? nombres.charAt(0) : 'S'}</Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{nombres}</Typography>
                    <Typography variant="body2" color="text.secondary">Solicitud #{numero}</Typography>
                </Box>

            </Box>
            <Stack direction="row" spacing={1}>
                <Chip label={estado || 'Pendiente'} size="small" color={estado === 'Aceptada' ? 'success' : estado === 'Rechazada' ? 'error' : 'default'} />
                <Chip label={conflicto ? 'Conflicto' : 'Sin conflicto'} size="small" color={conflicto ? 'error' : 'success'} />

            </Stack>

            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" sx={{ mb: 1 }}><b>Número de teléfono:</b> {telefono}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>Fecha creación:</b> {fecha_creacion}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>Fecha solicitada:</b> {fecha_solicitada}</Typography>

            <Typography variant="body2" sx={{ mb: 2 }}><b>Nota:</b> Esta tarjeta muestra si la fecha solicitada choca con el calendario.</Typography>
        </CardContent>

        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
            {conflicto ? (
                <Button fullWidth size="small" color="warning" onClick={onResolve}>Resolver</Button>
            ) : (
                <Button fullWidth size="small" color="success" startIcon={<CheckIcon />} onClick={onAccept}>Aceptar</Button>
            )}
            <Button fullWidth size="small" color="error" startIcon={<CloseIcon />} onClick={onReject}>Rechazar</Button>
        </Box>
    </Card>
);

const SolicitudesCitas = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Generar 5 solicitudes aleatorias al montar la página y calcular conflicto
        const random = generateRandomSolicitudes(5);
        const withConflictos = detectConflictos(random);
        setSolicitudes(withConflictos);
        setLoading(false);
    }, []);

    const generateRandomSolicitudes = (count = 5) => {
        const nombresPool = [
            'Juan Pérez', 'María Gómez', 'Luis Fernández', 'Ana López', 'Carlos Ruiz',
            'Sofía Martínez', 'Diego Torres', 'Lucía Vargas', 'Miguel Castillo', 'Elena Ríos'
        ];
        const arr = [];
        for (let i = 0; i < count; i++) {
            const numero = Math.floor(1000 + Math.random() * 9000);
            const telefono = Math.floor(1000000000 + Math.random() * 9000000000);;
            const nombre = nombresPool[Math.floor(Math.random() * nombresPool.length)];
            // fecha_creacion aleatoria en los últimos 30 días
            const fechaCreacion = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30));
            // fecha_solicitada aleatoria dentro de los próximos 14 días (puede chocar)
            const fechaSolicitada = new Date(Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 14));
            arr.push({
                id: `r-${i}`,
                numero,
                telefono: telefono,
                fecha_creacion: fechaCreacion.toLocaleString(),
                fecha_solicitada: fechaSolicitada.toISOString(),
                nombres: nombre,
                estado: 'Pendiente'
            });
        }
        return arr;
    };

    // Simula algunas fechas ya reservadas en el calendario (ISO date-only strings)
    const generateBookedDates = () => {
        const booked = [];
        for (let i = 0; i < 3; i++) {
            const d = new Date(Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 14));
            booked.push(d.toISOString().slice(0, 10));
        }
        return booked;
    };

    const detectConflictos = (solicitudesArr) => {
        const booked = generateBookedDates();
        // contar solicitudes por fecha solicitada (date-only)
        const counts = {};
        solicitudesArr.forEach((s) => {
            const dateOnly = s.fecha_solicitada.slice(0, 10);
            counts[dateOnly] = (counts[dateOnly] || 0) + 1;
        });

        return solicitudesArr.map((s) => {
            const dateOnly = s.fecha_solicitada.slice(0, 10);
            const conflicto = booked.includes(dateOnly) || counts[dateOnly] > 1;
            return { ...s, fecha_solicitada: new Date(s.fecha_solicitada).toLocaleString(), conflicto };
        });
    };

    const handleDecidir = (id, aceptada) => {
        setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado: aceptada ? 'Aceptada' : 'Rechazada' } : s)));
    };

    const handleResolver = (id) => {
        // Marcar como en revisión y quitar el conflicto localmente
        setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado: 'En revisión', conflicto: false } : s)));
    };

    const [filter, setFilter] = useState('todos'); // 'todos' | 'conflicto' | 'sin'

    const filtered = solicitudes.filter((s) => {
        if (filter === 'todos') return true;
        if (filter === 'conflicto') return s.conflicto;
        if (filter === 'sin') return !s.conflicto;
        return true;
    });

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3, mt: { xs: 7, sm: 8 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Solicitudes de Citas</Typography>
                <Typography variant="body2" color="text.secondary">A continuación 5 solicitudes de ejemplo (datos aleatorios)</Typography>
            </Box>

            {solicitudes.length === 0 ? (
                <Typography variant="body1">No hay solicitudes pendientes.</Typography>
            ) : (
                <>
                    <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                        <Button variant={filter === 'todos' ? 'contained' : 'outlined'} size="small" onClick={() => setFilter('todos')}>Todos</Button>
                        <Button variant={filter === 'conflicto' ? 'contained' : 'outlined'} color="error" size="small" onClick={() => setFilter('conflicto')}>Con conflicto</Button>
                        <Button variant={filter === 'sin' ? 'contained' : 'outlined'} color="success" size="small" onClick={() => setFilter('sin')}>Sin conflicto</Button>
                    </Box>

                    <Grid container spacing={3}>
                        {filtered.map((s) => (
                            <Grid item xs={12} sm={6} md={4} key={s.id}>
                                <SolicitudCard
                                    numero={s.numero}
                                    telefono={s.telefono}
                                    fecha_creacion={s.fecha_creacion}
                                    fecha_solicitada={s.fecha_solicitada}
                                    nombres={s.nombres}
                                    estado={s.estado}
                                    conflicto={s.conflicto}
                                    onAccept={() => handleDecidir(s.id, true)}
                                    onReject={() => handleDecidir(s.id, false)}
                                    onResolve={() => handleResolver(s.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default SolicitudesCitas;
