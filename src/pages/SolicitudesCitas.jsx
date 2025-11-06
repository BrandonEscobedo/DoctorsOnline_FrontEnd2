// src/pages/SolicitudesCitas.jsx

import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button, CircularProgress, Avatar, Divider, Chip, Stack,
    Alert, Snackbar
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from "../supabase-client";

const SolicitudCard = ({ 
    numero, 
    telefono, 
    fecha_creacion, 
    fecha_solicitada, 
    nombres, 
    estado, 
    conflicto, 
    onAccept, 
    onReject, 
    onResolve,
    isProcessing 
}) => (
    <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        opacity: isProcessing ? 0.6 : 1,
        border: estado === 'Aceptada' ? '2px solid #4CAF50' : 'none'
    }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar sx={{ 
                    width: 48, 
                    height: 48,
                    bgcolor: estado === 'Aceptada' ? '#4CAF50' : estado === 'Rechazada' ? '#f44336' : '#1976d2'
                }}>
                    {nombres ? nombres.charAt(0) : 'S'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{nombres}</Typography>
                    <Typography variant="body2" color="text.secondary">Solicitud #{numero}</Typography>
                </Box>
            </Box>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip 
                    label={estado || 'Pendiente'} 
                    size="small" 
                    color={estado === 'Aceptada' ? 'success' : estado === 'Rechazada' ? 'error' : 'default'} 
                />
                <Chip 
                    label={conflicto ? 'Conflicto' : 'Sin conflicto'} 
                    size="small" 
                    color={conflicto ? 'error' : 'success'} 
                />
            </Stack>

            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" sx={{ mb: 1 }}><b>Número de teléfono:</b> {telefono}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>Fecha creación:</b> {fecha_creacion}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>Fecha solicitada:</b> {fecha_solicitada}</Typography>

            {estado === 'Aceptada' && (
                <Alert severity="success" sx={{ mt: 1, mb: 1 }}>
                    Cita ya fue aceptada y creada
                </Alert>
            )}
        </CardContent>

        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
            {isProcessing ? (
                <CircularProgress size={24} />
            ) : estado === 'Aceptada' ? (
                <Button fullWidth size="small" color="success" disabled>
                    ✅ Aceptada
                </Button>
            ) : conflicto ? (
                <Button fullWidth size="small" color="warning" onClick={onResolve}>
                    Resolver
                </Button>
            ) : (
                <Button 
                    fullWidth 
                    size="small" 
                    color="success" 
                    startIcon={<CheckIcon />} 
                    onClick={onAccept}
                >
                    Aceptar
                </Button>
            )}
            <Button 
                fullWidth 
                size="small" 
                color="error" 
                startIcon={<CloseIcon />} 
                onClick={onReject}
                disabled={isProcessing || estado === 'Aceptada'}
            >
                {estado === 'Rechazada' ? 'Rechazada' : 'Rechazar'}
            </Button>
        </Box>
    </Card>
);

const SolicitudesCitas = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingIds, setProcessingIds] = useState(new Set());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Función para obtener las solicitudes de Supabase
    const fetchSolicitudes = async () => {
        try {
            setLoading(true);
            
            // Obtener solicitudes
            const { data: solicitudesData, error: errorSolicitudes } = await supabase
                .from('SolicitudCita')
                .select('*')
                .order('fechaCreacion', { ascending: false });

            if (errorSolicitudes) throw errorSolicitudes;

            // Obtener todas las citas para verificar estado
            const { data: citasData, error: errorCitas } = await supabase
                .from('cita')
                .select('*');

            if (errorCitas) throw errorCitas;

            // Mapear solicitudes con estado persistente
            const solicitudesTransformadas = solicitudesData.map(solicitud => {
                // Buscar si existe una cita para esta solicitud
                const citaRelacionada = citasData.find(cita => {
                    const coincideNombre = cita.descripcion?.includes(solicitud.nombres);
                    const coincideFecha = cita.fechaCita && solicitud.fechaCita && 
                        new Date(cita.fechaCita).getTime() === new Date(solicitud.fechaCita).getTime();
                    return coincideNombre && coincideFecha;
                });

                const estado = citaRelacionada ? 'Aceptada' : 'Pendiente';
                
                return {
                    id: solicitud.idSolicitud,
                    numero: solicitud.idSolicitud,
                    telefono: solicitud.Telefono,
                    fecha_creacion: new Date(solicitud.fechaCreacion).toLocaleString(),
                    fecha_solicitada: new Date(solicitud.fechaCita).toLocaleString(),
                    nombres: solicitud.nombres,
                    edad: solicitud.edad,
                    correo: solicitud.correo,
                    estado: estado,
                    conflicto: false // Se calcula después
                };
            });

            const withConflictos = detectConflictos(solicitudesTransformadas);
            setSolicitudes(withConflictos);

        } catch (error) {
            console.error('Error al obtener solicitudes:', error);
            showSnackbar('Error al cargar las solicitudes', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Función para aceptar una solicitud y crear la cita
    const handleAceptarSolicitud = async (solicitud) => {
        try {
            setProcessingIds(prev => new Set(prev).add(solicitud.id));

            // Verificar si ya existe una cita para esta solicitud
            const { data: citasExistentes, error: errorCitas } = await supabase
                .from('cita')
                .select('*')
                .eq('descripcion', `Cita médica para ${solicitud.nombres} - Solicitud ${solicitud.id}`);

            if (errorCitas) {
                console.error('Error verificando citas existentes:', errorCitas);
            }

            if (citasExistentes && citasExistentes.length > 0) {
                showSnackbar('⚠️ Esta solicitud ya fue aceptada anteriormente', 'warning');
                setSolicitudes(prev => 
                    prev.map(s => s.id === solicitud.id ? { ...s, estado: 'Aceptada' } : s)
                );
                return;
            }

            let idPaciente;

            // Buscar si ya existe un paciente con el mismo correo o teléfono
            const { data: pacientesExistentes, error: errorBusqueda } = await supabase
                .from('paciente')
                .select('idpaciente')
                .or(`correo.eq.${solicitud.correo},telefono.eq.${solicitud.telefono.toString().slice(0, 20)}`)
                .limit(1);

            if (errorBusqueda) {
                console.error('Error buscando paciente:', errorBusqueda);
            }

            if (pacientesExistentes && pacientesExistentes.length > 0) {
                idPaciente = pacientesExistentes[0].idpaciente;
                console.log('Usando paciente existente con ID:', idPaciente);
            } else {
                // Crear nuevo paciente
                console.log('Creando nuevo paciente para:', solicitud.nombres);
                
                const { data: nuevoPaciente, error: errorPaciente } = await supabase
                    .from('paciente')
                    .insert([
                        {
                            nombres: (solicitud.nombres || '').slice(0, 100),
                            apellidos: ''.slice(0, 100),
                            genero: 'No especificado'.slice(0, 10),
                            fechanacimiento: null,
                            edad: parseInt(solicitud.edad) || 0,
                            correo: (solicitud.correo || '').slice(0, 100),
                            telefono: (solicitud.telefono?.toString() || '').slice(0, 20),
                            direccion: 'No especificada'.slice(0, 200)
                        }
                    ])
                    .select('idpaciente');

                if (errorPaciente) throw errorPaciente;
                if (!nuevoPaciente || nuevoPaciente.length === 0) {
                    throw new Error('No se pudo crear el paciente');
                }

                idPaciente = nuevoPaciente[0].idpaciente;
                console.log('Paciente creado con ID:', idPaciente);
            }

            // Crear la cita con referencia única a la solicitud
            const { data: citaData, error: citaError } = await supabase
                .from('cita')
                .insert([
                    {
                        estado: 'Confirmada',
                        idpaciente: idPaciente,
                        iddoctor: 1,
                        descripcion: `${solicitud.nombres} - Solicitud ${solicitud.id}`,
                        fechaCita: new Date(solicitud.fecha_solicitada).toISOString()
                    }
                ])
                .select();

            if (citaError) throw citaError;

            // Actualizar estado local
            setSolicitudes(prev => 
                prev.map(s => s.id === solicitud.id ? { 
                    ...s, 
                    estado: 'Aceptada',
                    conflicto: false // Quitar conflicto al aceptar
                } : s)
            );

            showSnackbar('Cita aceptada y creada exitosamente', 'success');
            console.log('Cita creada:', citaData);

        } catch (error) {
            console.error('Error al aceptar solicitud:', error);
            showSnackbar('Error: ' + error.message, 'error');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(solicitud.id);
                return newSet;
            });
        }
    };

    // Función para rechazar una solicitud
    const handleRechazarSolicitud = async (solicitud) => {
        try {
            setProcessingIds(prev => new Set(prev).add(solicitud.id));

            // Actualizar el estado local
            setSolicitudes(prev => 
                prev.map(s => s.id === solicitud.id ? { 
                    ...s, 
                    estado: 'Rechazada',
                    conflicto: false // Quitar conflicto al rechazar
                } : s)
            );

            showSnackbar('Solicitud rechazada', 'info');

        } catch (error) {
            console.error('Error al rechazar solicitud:', error);
            showSnackbar('Error al rechazar la solicitud', 'error');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(solicitud.id);
                return newSet;
            });
        }
    };

    // Función para resolver conflicto - AHORA QUITA EL CONFLICTO PERMANENTEMENTE
    const handleResolverConflicto = async (solicitud) => {
        try {
            setProcessingIds(prev => new Set(prev).add(solicitud.id));
            
            // Quitar el conflicto permanentemente
            setSolicitudes(prev => 
                prev.map(s => s.id === solicitud.id ? { 
                    ...s, 
                    conflicto: false 
                } : s)
            );

            showSnackbar('Conflicto resuelto', 'success');

        } catch (error) {
            console.error('Error al resolver conflicto:', error);
            showSnackbar('Error al resolver el conflicto', 'error');
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(solicitud.id);
                return newSet;
            });
        }
    };

    // Función para detectar conflictos - MÁS PRECISA
    const detectConflictos = (solicitudesArr) => {
        const fechaCounts = {};
        const solicitudesPendientes = solicitudesArr.filter(s => s.estado === 'Pendiente');
        
        solicitudesPendientes.forEach(solicitud => {
            const fecha = new Date(solicitud.fecha_solicitada).toDateString();
            fechaCounts[fecha] = (fechaCounts[fecha] || 0) + 1;
        });

        return solicitudesArr.map(solicitud => {
            // Solo marcar conflicto en solicitudes pendientes
            if (solicitud.estado !== 'Pendiente') {
                return { ...solicitud, conflicto: false };
            }
            
            const fecha = new Date(solicitud.fecha_solicitada).toDateString();
            const conflicto = fechaCounts[fecha] > 1;
            return { ...solicitud, conflicto };
        });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const [filter, setFilter] = useState('todos');

    const filtered = solicitudes.filter((s) => {
        if (filter === 'todos') return true;
        if (filter === 'conflicto') return s.conflicto && s.estado === 'Pendiente';
        if (filter === 'sin') return !s.conflicto && s.estado === 'Pendiente';
        if (filter === 'aceptadas') return s.estado === 'Aceptada';
        return true;
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, mt: { xs: 7, sm: 8 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Solicitudes de Citas
                </Typography>
                <Button 
                    variant="outlined" 
                    onClick={fetchSolicitudes}
                    disabled={loading}
                >
                    Actualizar
                </Button>
            </Box>

            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                    variant={filter === 'todos' ? 'contained' : 'outlined'} 
                    size="small" 
                    onClick={() => setFilter('todos')}
                >
                    Todos ({solicitudes.length})
                </Button>
                <Button 
                    variant={filter === 'conflicto' ? 'contained' : 'outlined'} 
                    color="error" 
                    size="small" 
                    onClick={() => setFilter('conflicto')}
                >
                    Con conflicto ({solicitudes.filter(s => s.conflicto && s.estado === 'Pendiente').length})
                </Button>
                <Button 
                    variant={filter === 'sin' ? 'contained' : 'outlined'} 
                    color="success" 
                    size="small" 
                    onClick={() => setFilter('sin')}
                >
                    Sin conflicto ({solicitudes.filter(s => !s.conflicto && s.estado === 'Pendiente').length})
                </Button>
                <Button 
                    variant={filter === 'aceptadas' ? 'contained' : 'outlined'} 
                    color="success" 
                    size="small" 
                    onClick={() => setFilter('aceptadas')}
                >
                    Aceptadas ({solicitudes.filter(s => s.estado === 'Aceptada').length})
                </Button>
            </Box>

            {filtered.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                    {filter === 'aceptadas' 
                        ? 'No hay solicitudes aceptadas' 
                        : 'No hay solicitudes que coincidan con el filtro'}
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {filtered.map((solicitud) => (
                        <Grid item xs={12} sm={6} md={4} key={solicitud.id}>
                            <SolicitudCard
                                numero={solicitud.numero}
                                telefono={solicitud.telefono}
                                fecha_creacion={solicitud.fecha_creacion}
                                fecha_solicitada={solicitud.fecha_solicitada}
                                nombres={solicitud.nombres}
                                estado={solicitud.estado}
                                conflicto={solicitud.conflicto}
                                onAccept={() => handleAceptarSolicitud(solicitud)}
                                onReject={() => handleRechazarSolicitud(solicitud)}
                                onResolve={() => handleResolverConflicto(solicitud)}
                                isProcessing={processingIds.has(solicitud.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SolicitudesCitas;