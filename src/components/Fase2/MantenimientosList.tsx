import { useState, useMemo } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, TextField, Stack, IconButton, Tooltip, MenuItem
} from "@mui/material";
import { useDemoStore } from "../../store/demoStore";
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import MapIcon from '@mui/icons-material/Map';

const MantenimientosList = () => {
    // Stable individual selector
    const mantenimientos = useDemoStore((state: any) => state.mantenimientos);

    const [q, setQ] = useState("");
    const [areaFilter, setAreaFilter] = useState("TODOS");
    const [machineFilter, setMachineFilter] = useState("TODOS");
    const [operatorFilter, setOperatorFilter] = useState("TODOS");

    const uniqueAreas = useMemo(() => ["TODOS", ...Array.from(new Set(mantenimientos.map((m: any) => m.area || "Planta General")))], [mantenimientos]);
    const uniqueMachines = useMemo(() => ["TODOS", ...Array.from(new Set(mantenimientos.map((m: any) => m.machineName)))], [mantenimientos]);
    const uniqueOperators = useMemo(() => ["TODOS", ...Array.from(new Set(mantenimientos.map((m: any) => m.operatorName)))], [mantenimientos]);

    const filtered = useMemo(() => {
        return mantenimientos.filter((m: any) =>
            (m.machineName.toLowerCase().includes(q.toLowerCase()) ||
                m.operatorName.toLowerCase().includes(q.toLowerCase())) &&
            (areaFilter === "TODOS" || (m.area || "Planta General") === areaFilter) &&
            (machineFilter === "TODOS" || m.machineName === machineFilter) &&
            (operatorFilter === "TODOS" || m.operatorName === operatorFilter)
        );
    }, [mantenimientos, q, areaFilter, machineFilter, operatorFilter]);

    return (
        <Box sx={{ p: 2 }}>
            <Paper className="glass-card" sx={{ p: 4, borderRadius: 3, mb: 4, border: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="primary">Monitor de Operaciones e Integridad</Typography>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            size="small"
                            placeholder="Buscar máquina u operario..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />,
                            }}
                            sx={{ bgcolor: 'white', minWidth: 250 }}
                        />
                        <TextField
                            select
                            size="small"
                            label="Área"
                            value={areaFilter}
                            onChange={(e) => setAreaFilter(e.target.value)}
                            sx={{ bgcolor: 'white', minWidth: 140 }}
                        >
                            {uniqueAreas.map(a => <MenuItem key={a as string} value={a as string}>{a as string}</MenuItem>)}
                        </TextField>
                        <TextField
                            select
                            size="small"
                            label="Máquina"
                            value={machineFilter}
                            onChange={(e) => setMachineFilter(e.target.value)}
                            sx={{ bgcolor: 'white', minWidth: 160 }}
                        >
                            {uniqueMachines.map(m => <MenuItem key={m as string} value={m as string}>{m as string}</MenuItem>)}
                        </TextField>
                        <TextField
                            select
                            size="small"
                            label="Operario"
                            value={operatorFilter}
                            onChange={(e) => setOperatorFilter(e.target.value)}
                            sx={{ bgcolor: 'white', minWidth: 160 }}
                        >
                            {uniqueOperators.map(o => <MenuItem key={o as string} value={o as string}>{o as string}</MenuItem>)}
                        </TextField>
                    </Stack>
                </Box>

                <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell><b>ID / Hash</b></TableCell>
                                    <TableCell><b>Fecha y Hora</b></TableCell>
                                    <TableCell><b>Máquina</b></TableCell>
                                    <TableCell><b>Operario / Área</b></TableCell>
                                    <TableCell><b>Estado / Sinc</b></TableCell>
                                    <TableCell align="right"><b>Trazabilidad</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">No se encontraron registros.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((m: any) => (
                                        <TableRow key={m.id} hover>
                                            <TableCell>
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', display: 'block' }}>
                                                    {m.hash ? m.hash.substring(0, 12) : '---'}
                                                </Typography>
                                                <Chip label="SHA-256" size="small" color="success" variant="outlined" sx={{ height: 16, fontSize: '0.6rem' }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{new Date(m.timestamp).toLocaleDateString()}</Typography>
                                                <Typography variant="caption" color="text.secondary">{new Date(m.timestamp).toLocaleTimeString()}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">{m.machineName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{m.category || 'Sin categoría'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{m.operatorName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{m.area || 'Planta General'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={m.status}
                                                    size="small"
                                                    color={m.status === 'Completado' ? 'success' : 'warning'}
                                                    variant="outlined"
                                                />
                                                {m.offline && (
                                                    <Chip label="Offline Sync" size="small" variant="outlined" color="warning" sx={{ ml: 1, fontSize: '0.7rem' }} />
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Tooltip title="Ver Integridad (Hash)">
                                                        <IconButton size="small"><VerifiedIcon fontSize="small" color="primary" /></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Ver Ubicación GPS">
                                                        <IconButton size="small"><MapIcon fontSize="small" color="info" /></IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Paper>
        </Box>
    );
};

export default MantenimientosList;
