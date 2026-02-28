import { Box, Typography, Paper, Grid, Button, Chip } from "@mui/material";
import { useDemoStore } from "../../store/demoStore";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const MaquinasYQRs = () => {
    // Stable individual selector
    const templates = useDemoStore((state: any) => state.templates);
    const navigate = useNavigate();

    const handleCreateMaintenance = (templateId: string) => {
        navigate(`/execute/${templateId}`);
    };

    const handleDownloadQR = (name: string) => {
        alert(`Iniciando descarga segura de QR para: ${name}\n(Formato: SVG/PNG Alta Resolución)`);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">Identificación de Activos (QRs)</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Cada activo vinculado genera un código único para auditoría en sitio.
                    </Typography>
                </Box>
                <Chip label="PWA Modo Offline Listo" color="success" variant="outlined" size="small" />
            </Box>

            <Grid container spacing={3}>
                {templates.filter((t: any) => t.active).map((tpl: any) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tpl.id}>
                        <Paper elevation={0} variant="outlined" sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                            <Box sx={{ mb: 1 }}>
                                <Chip label={tpl.category || 'Sin Categoría'} size="small" variant="outlined" sx={{ mb: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold">{tpl.machineType}</Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Ref: {tpl.name}
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center', p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #eee' }}>
                                <QRCode value={`https://app.trackform.io/execute/${tpl.id}`} size={160} />
                            </Box>

                            <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexDirection: 'column' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<QrCodeScannerIcon />}
                                    onClick={() => handleCreateMaintenance(tpl.id)}
                                    fullWidth
                                >
                                    Escanear / Ejecutar
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={() => handleDownloadQR(tpl.machineType)}
                                    size="small"
                                    fullWidth
                                >
                                    Descargar QR
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MaquinasYQRs;
