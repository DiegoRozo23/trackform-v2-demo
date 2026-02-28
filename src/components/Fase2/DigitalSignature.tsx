import { useState, useMemo } from "react";
import {
    Box, Typography, Paper, Grid, Divider, List, ListItem,
    ListItemText, TextField, MenuItem, Button,
    Stack, Chip, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { useDemoStore } from "../../store/demoStore";

const DigitalSignature = () => {
    // Selectors
    const mantenimientos = useDemoStore((state: any) => state.mantenimientos);
    const templates = useDemoStore((state: any) => state.templates);

    // Filter States
    const [q, setQ] = useState("");
    const [area, setArea] = useState("TODOS");
    const [machine, setMachine] = useState("TODOS");
    const [operator, setOperator] = useState("TODOS");
    const [dateRange, setDateRange] = useState("TODOS");

    const [selectedId, setSelectedId] = useState<string | null>(mantenimientos[0]?.id || null);

    // Filter Options
    const areas = useMemo(() => ["TODOS", ...new Set(mantenimientos.map((m: any) => m.area || "N/A"))] as string[], [mantenimientos]);
    const machines = useMemo(() => ["TODOS", ...new Set(mantenimientos.map((m: any) => m.machineName))] as string[], [mantenimientos]);
    const operators = useMemo(() => ["TODOS", ...new Set(mantenimientos.map((m: any) => (m.operatorName || "N/A")))] as string[], [mantenimientos]);

    const filtered = useMemo(() => {
        return mantenimientos.filter((m: any) =>
            (m.machineName.toLowerCase().includes(q.toLowerCase()) || m.operatorName.toLowerCase().includes(q.toLowerCase())) &&
            (area === "TODOS" || m.area === area) &&
            (machine === "TODOS" || m.machineName === machine) &&
            (operator === "TODOS" || m.operatorName === operator)
        );
    }, [mantenimientos, q, area, machine, operator]);

    const selectedMnt = useMemo(() =>
        mantenimientos.find((m: any) => m.id === selectedId) || null
        , [mantenimientos, selectedId]);

    const selectedTemplate = useMemo(() => {
        if (!selectedMnt) return null;
        return templates.find((t: any) => t.id === selectedMnt.templateId) || null;
    }, [templates, selectedMnt]);

    const handleExport = (type: string) => {
        alert(`Generando reporte de Traceability en ${type} para ${filtered.length} registros...`);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Trazabilidad & Auditoría</Typography>
                <Stack direction="row" spacing={1}>
                    <Button startIcon={<FileDownloadIcon />} variant="outlined" size="small" onClick={() => handleExport('PDF')}>PDF</Button>
                    <Button startIcon={<FileDownloadIcon />} variant="outlined" size="small" onClick={() => handleExport('Excel')}>Excel</Button>
                </Stack>
            </Box>

            {/* Filter Panel */}
            <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: '#fbfbfb' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Buscar por ID o Hash..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField select fullWidth size="small" label="Área" value={area} onChange={(e) => setArea(e.target.value)}>
                            {areas.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField select fullWidth size="small" label="Máquina" value={machine} onChange={(e) => setMachine(e.target.value)}>
                            {machines.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField select fullWidth size="small" label="Operario" value={operator} onChange={(e) => setOperator(e.target.value)}>
                            {operators.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField select fullWidth size="small" label="Rango de Fecha" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                            <MenuItem value="TODOS">Cualquier fecha</MenuItem>
                            <MenuItem value="HOY">Hoy</MenuItem>
                            <MenuItem value="SEMANA">Últimos 7 días</MenuItem>
                            <MenuItem value="MES">Último mes</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                {/* List View */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ maxHeight: 600, borderRadius: 2 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: '#eee' }}><b>Registro</b></TableCell>
                                    <TableCell sx={{ bgcolor: '#eee' }}><b>Fecha</b></TableCell>
                                    <TableCell align="right" sx={{ bgcolor: '#eee' }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.map((m: any) => (
                                    <TableRow
                                        key={m.id}
                                        hover
                                        selected={selectedId === m.id}
                                        onClick={() => setSelectedId(m.id)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">{m.machineName}</Typography>
                                            <Typography variant="caption" color="text.secondary">{m.operatorName}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">{new Date(m.timestamp).toLocaleDateString()}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <VisibilityIcon fontSize="small" color={selectedId === m.id ? 'primary' : 'disabled'} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && (
                                    <TableRow><TableCell colSpan={3} align="center" sx={{ py: 4 }}>No se encontraron registros</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Detail View */}
                <Grid size={{ xs: 12, md: 7 }}>
                    {selectedMnt ? (
                        <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2, minHeight: 600 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">{selectedMnt.machineName}</Typography>
                                    <Typography variant="caption" color="primary" sx={{ fontFamily: 'monospace' }}>
                                        REG_ID: {selectedMnt.id}
                                    </Typography>
                                </Box>
                                <Chip label={selectedMnt.status} color={selectedMnt.status === 'Completado' ? 'success' : 'warning'} size="small" variant="outlined" />
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                        <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        Responsable y Área
                                    </Typography>
                                    <Typography variant="body2">{selectedMnt.operatorName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{selectedMnt.area || 'Planta Principal'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                        <LocalOfferIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        Contenido Auditado
                                    </Typography>
                                    <Typography variant="body2">{selectedMnt.category || "General"}</Typography>
                                    <Typography variant="caption" color="text.secondary">Formulario: {selectedTemplate?.name || 'Cargando...'}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                                        <CheckBoxIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        Respuestas de la Inspección (Checklist)
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f7fa', borderRadius: 1 }}>
                                        <List dense>
                                            {(selectedTemplate?.fields || []).map((f: any) => {
                                                const val = selectedMnt.answers[f.id];
                                                return (
                                                    <ListItem key={f.id} sx={{ px: 0 }}>
                                                        <ListItemText
                                                            primary={f.label}
                                                            secondary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
                                                                    <Typography variant="caption" fontWeight="bold" color="primary">
                                                                        Respuesta: {val === true ? "CUMPLE (SÍ)" : val === false ? "NO CUMPLE" : (val || "N/A")}
                                                                    </Typography>
                                                                    <TipIcon type={f.type} />
                                                                </Box>
                                                            }
                                                        />
                                                    </ListItem>
                                                );
                                            })}
                                            {(!selectedTemplate || selectedTemplate.fields.length === 0) && (
                                                <Typography variant="caption" color="text.secondary">Sin detalles de campos disponibles.</Typography>
                                            )}
                                        </List>
                                    </Paper>
                                </Grid>

                                <Grid size={{ xs: 12, lg: 6 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>Firma Digital</Typography>
                                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: '#fff' }}>
                                        {selectedMnt.signature ? (
                                            <img src={selectedMnt.signature} alt="Firma" style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }} />
                                        ) : (
                                            <Typography variant="h4" sx={{ fontFamily: '"Reenie Beanie", cursive', py: 2 }}>
                                                {selectedMnt.operatorName}
                                            </Typography>
                                        )}
                                        <Typography variant="caption" display="block" color="text.secondary">Auditado por Sistema Biométrico</Typography>
                                    </Paper>
                                </Grid>

                                <Grid size={{ xs: 12, lg: 6 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>Seguridad Técnica</Typography>
                                    <Stack spacing={1}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <VerifiedUserIcon color="success" fontSize="small" />
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                                HASH: {selectedMnt.hash ? selectedMnt.hash.substring(0, 32) + '...' : 'SEC_HASH_MOCK_881'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AccessTimeIcon color="primary" fontSize="small" />
                                            <Typography variant="caption">Time: {new Date(selectedMnt.timestamp).toLocaleString()}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationOnIcon color="error" fontSize="small" />
                                            <Typography variant="caption">GPS: -34.6037, -58.3816</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', border: '2px dashed #eee', borderRadius: 2 }}>
                            <Typography color="text.secondary">Selecciona un registro para ver la trazabilidad completa</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

const TipIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'checklist': return <Chip label="CHECK" size="small" variant="outlined" color="primary" sx={{ height: 16, fontSize: '0.6rem' }} />;
        case 'camera': return <Chip label="FOTO" size="small" variant="outlined" color="info" sx={{ height: 16, fontSize: '0.6rem' }} />;
        case 'number': return <Chip label="MEDICIÓN" size="small" variant="outlined" color="warning" sx={{ height: 16, fontSize: '0.6rem' }} />;
        case 'date': return <Chip label="FECHA" size="small" variant="outlined" color="secondary" sx={{ height: 16, fontSize: '0.6rem' }} />;
        default: return null;
    }
};

export default DigitalSignature;
