import {
    Dialog, DialogTitle, DialogContent, Box, Typography,
    IconButton, Divider, Grid, Paper, List, ListItem, ListItemText,
    Chip, Stack, Button
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useMemo } from "react";
import { useDemoStore } from "../../store/demoStore";

interface Props {
    open: boolean;
    onClose: () => void;
    mantenimientoId: string | null;
}

const MantenimientoDetalleModal = ({ open, onClose, mantenimientoId }: Props) => {
    const mantenimientos = useDemoStore((state: any) => state.mantenimientos);
    const templates = useDemoStore((state: any) => state.templates);

    const mnt = useMemo(() =>
        mantenimientos.find((m: any) => m.id === mantenimientoId) || null
        , [mantenimientos, mantenimientoId]);

    const template = useMemo(() => {
        if (!mnt) return null;
        return templates.find((t: any) => t.id === mnt.templateId) || null;
    }, [templates, mnt]);

    if (!mnt) return null;

    const handlePrint = () => {
        alert("Generando PDF oficial del mantenimiento para auditoría...");
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Detalle de Auditoría: {mnt.machineName}</Typography>
                        <Typography variant="caption" color="primary" sx={{ fontFamily: 'monospace' }}>
                            ID: {mnt.id}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button startIcon={<FileDownloadIcon />} size="small" variant="outlined" onClick={handlePrint}>Exportar</Button>
                        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
                    </Stack>
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ bgcolor: '#fafafa' }}>
                <Grid container spacing={3}>
                    {/* Encabezado Rápido */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                            <PersonIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Responsable
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">{mnt.operatorName}</Typography>
                        <Typography variant="caption" color="text.secondary">{mnt.area || 'Planta Principal'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                            <LocalOfferIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Contenido del Formulario
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">{template?.name || 'Inspección General'}</Typography>
                        <Chip label={mnt.status} size="small" color={mnt.status === 'Completado' ? 'success' : 'warning'} />
                    </Grid>

                    {/* Respuestas */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                            <CheckBoxIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Resultados del Checklist
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
                            <List dense sx={{ py: 0 }}>
                                {(template?.fields || []).map((f: any, idx: number) => {
                                    const val = mnt.answers[f.id];
                                    return (
                                        <ListItem key={f.id} sx={{ bgcolor: idx % 2 === 0 ? '#fff' : '#f9f9f9', borderBottom: '1px solid #eee' }}>
                                            <ListItemText
                                                primary={f.label}
                                                secondary={
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Typography variant="body2" fontWeight="bold" color={val === false ? 'error' : 'primary'}>
                                                            {val === true ? "CUMPLE (SÍ)" : val === false ? "NO CUMPLE (FALLA)" : (val || "N/A")}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            {f.type === 'checklist' && (
                                                <Chip
                                                    label={val === true ? "OK" : "FALLA"}
                                                    size="small"
                                                    color={val === true ? "success" : "error"}
                                                    variant="outlined"
                                                />
                                            )}
                                        </ListItem>
                                    );
                                })}
                                {(!template || template.fields.length === 0) && (
                                    <ListItem><ListItemText secondary="No hay campos detallados registrados." /></ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Firma */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Firma Digital Inalterable</Typography>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: '#fff', borderRadius: 2, height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {mnt.signature ? (
                                <img src={mnt.signature} alt="Firma" style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }} />
                            ) : (
                                <Typography variant="h4" sx={{ fontFamily: '"Reenie Beanie", cursive', opacity: 0.8 }}>
                                    {mnt.operatorName}
                                </Typography>
                            )}
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>Sello Biométrico Autorizado</Typography>
                        </Paper>
                    </Grid>

                    {/* Seguridad y Ubicación */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Seguridad Técnica (Traceability)</Typography>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, height: 140 }}>
                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <VerifiedUserIcon color="success" sx={{ fontSize: 16 }} />
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                        <b>HASH:</b> {mnt.hash ? mnt.hash.substring(0, 24) + '...' : 'GEN_HASH_5521...'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTimeIcon color="primary" sx={{ fontSize: 16 }} />
                                    <Typography variant="caption">
                                        <b>Timestamp:</b> {new Date(mnt.timestamp).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOnIcon color="error" sx={{ fontSize: 16 }} />
                                    <Typography variant="caption">
                                        <b>GPS:</b> {mnt.gps ? `${mnt.gps.lat.toFixed(4)}, ${mnt.gps.lng.toFixed(4)}` : "-34.6037, -58.3816"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default MantenimientoDetalleModal;
