import { useState, useMemo } from "react";
import {
    Box, Typography, Paper, Grid, Divider,
    TextField, MenuItem, Button, Chip
} from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from '@mui/lab';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HistoryIcon from '@mui/icons-material/History';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useDemoStore } from "../../store/demoStore";
import MantenimientoDetalleModal from "./MantenimientoDetalleModal";

const HistorialMaquina = () => {
    const mantenimientos = useDemoStore((state: any) => state.mantenimientos);
    const templates = useDemoStore((state: any) => state.templates);

    const [selectedMachine, setSelectedMachine] = useState<string>("TODOS");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [detailOpen, setDetailOpen] = useState(false);
    const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

    // List of unique machines with data
    const machineList = useMemo(() =>
        ["TODOS", ...new Set(mantenimientos.map((m: any) => m.machineName))] as string[]
        , [mantenimientos]);

    // History for selected machine
    const historyData = useMemo(() => {
        return mantenimientos
            .filter((m: any) =>
                (selectedMachine === "TODOS" || m.machineName === selectedMachine) &&
                (m.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    m.operatorName.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [mantenimientos, selectedMachine, searchTerm]);

    const getTemplateName = (id: string) => {
        return templates.find((t: any) => t.id === id)?.name || "Formulario Genérico";
    };

    const handleExportHistory = () => {
        alert(`Generando Carpeta Histórica Auditable para ${selectedMachine === "TODOS" ? "Toda la Planta" : selectedMachine} (PDF)...`);
    };

    const handleOpenDetail = (id: string) => {
        setActiveDetailId(id);
        setDetailOpen(true);
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">Histórico Auditable por Equipo</Typography>
                    <Typography variant="body2" color="text.secondary">Trazabilidad inalterable y cronología técnica de activos</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportHistory}
                >
                    Exportar Libro de Vida
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#fbfbfb' }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Seleccionar Activo</Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={selectedMachine}
                            onChange={(e) => setSelectedMachine(e.target.value)}
                            sx={{ mb: 2 }}
                        >
                            {machineList.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                        </TextField>

                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Buscador de Evento</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Operario o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, minHeight: 500 }}>
                        {historyData.length > 0 ? (
                            <Timeline position="right">
                                {historyData.map((mnt: any, index: number) => (
                                    <TimelineItem key={mnt.id}>
                                        <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="body2" color="text.secondary">
                                            {new Date(mnt.timestamp).toLocaleDateString()}
                                            <Typography variant="caption" display="block">
                                                {new Date(mnt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </TimelineOppositeContent>

                                        <TimelineSeparator>
                                            <TimelineConnector />
                                            <TimelineDot color={mnt.status === 'Completado' ? 'success' : 'warning'} variant="outlined">
                                                {mnt.status === 'Completado' ? <CheckCircleIcon fontSize="small" /> : <HistoryIcon fontSize="small" />}
                                            </TimelineDot>
                                            <TimelineConnector />
                                        </TimelineSeparator>

                                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                                            <Paper elevation={0} variant="outlined" sx={{ p: 2, bgcolor: index === 0 ? '#f3f6ff' : '#fff', borderColor: index === 0 ? '#3f51b5' : '#e0e0e0' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {getTemplateName(mnt.templateId)}
                                                    </Typography>
                                                    {index === 0 && <Chip label="Último Registro" size="small" color="primary" />}
                                                </Box>
                                                <Typography variant="body2" sx={{ my: 1 }}>
                                                    <b>Operador:</b> {mnt.operatorName} | <b>Equipo:</b> {mnt.machineName}
                                                </Typography>
                                                <Divider sx={{ my: 1 }} />
                                                <Grid container spacing={1}>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <VerifiedUserIcon sx={{ fontSize: 14, color: 'success.main' }} />
                                                            <Typography variant="caption">Hash Validado</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                                                        <Button
                                                            size="small"
                                                            sx={{ p: 0, minWidth: 0, textTransform: 'none' }}
                                                            onClick={() => handleOpenDetail(mnt.id)}
                                                        >
                                                            Ver Detalle
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                            </Timeline>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, opacity: 0.5 }}>
                                <HistoryIcon sx={{ fontSize: 60, mb: 2 }} />
                                <Typography>No hay registros históricos para estos criterios</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Reusable Detail Modal */}
            <MantenimientoDetalleModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                mantenimientoId={activeDetailId}
            />
        </Box>
    );
};

export default HistorialMaquina;
