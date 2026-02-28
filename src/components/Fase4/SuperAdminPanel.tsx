import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

const tenantsData = [
    { id: 'T-001', nombre: 'RCM Ingeniería', plan: 'Enterprise', maquinas: 145, estado: 'Activo' },
    { id: 'T-002', nombre: 'Industrias ACME', plan: 'Profesional', maquinas: 80, estado: 'Activo' },
    { id: 'T-003', nombre: 'Logística Sur', plan: 'Básico', maquinas: 15, estado: 'Suspendido (Pago)' },
    { id: 'T-004', nombre: 'Constructora Beta', plan: 'Profesional', maquinas: 42, estado: 'Activo' },
];

const SuperAdminPanel = () => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Módulo de Gestión Centralizada (SaaS)
                </Typography>
                <Button variant="contained" color="secondary" startIcon={<AddBusinessIcon />}>
                    Aprovisionar Cliente
                </Button>
            </Box>
            <Paper elevation={0} variant="outlined" sx={{ mt: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="tenants table">
                        <TableHead sx={{ bgcolor: '#eceff1' }}>
                            <TableRow>
                                <TableCell><b>ID Tenant</b></TableCell>
                                <TableCell><b>Empresa Cliente</b></TableCell>
                                <TableCell><b>Suscripción</b></TableCell>
                                <TableCell><b>Máquinas Activas</b></TableCell>
                                <TableCell><b>Estado</b></TableCell>
                                <TableCell align="right"><b>Administrar</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tenantsData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell><strong>{row.nombre}</strong></TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.plan}
                                            color={row.plan === 'Enterprise' ? 'secondary' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{row.maquinas}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.estado}
                                            color={row.estado.includes('Suspendido') ? 'error' : 'success'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" size="small"><EditIcon /></IconButton>
                                        <IconButton color="error" size="small"><BlockIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default SuperAdminPanel;
