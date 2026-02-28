import { useState } from "react";
import { Box, Typography, Paper, Grid, TextField, Button, Divider } from "@mui/material";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton } from "@mui/material";
import { useDemoStore } from "../../store/demoStore";

const WhiteLabelSettings = () => {
    const currentTenant = useDemoStore((state: any) => state.currentTenant);
    const updateTenantSettings = useDemoStore((state: any) => state.updateTenantSettings);
    const [color, setColor] = useState(currentTenant.themeColor);

    const handleSave = () => {
        updateTenantSettings({ themeColor: color });
        alert("Configuración de marca actualizada globalmente.");
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                updateTenantSettings({ logoUrl: base64 });
                alert("Logotipo actualizado con éxito ✓");
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Configuración de Identidad (White-Label)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Personaliza los colores y el logotipo del panel de operaciones para reflejar tu propia marca.
            </Typography>

            <Grid container spacing={4} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} variant="outlined" sx={{ p: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Identidad Visual</Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" gutterBottom>Color Principal (Hex)</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: 40, height: 40, bgcolor: color, borderRadius: 1, mr: 2, border: '1px solid #ccc', cursor: 'pointer' }} onClick={() => document.getElementById('color-picker')?.click()} />
                                <TextField
                                    size="small"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    sx={{ width: 150 }}
                                />
                                <input
                                    id="color-picker"
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    style={{ visibility: 'hidden', width: 0, height: 0, padding: 0 }}
                                />
                                <IconButton color="primary" sx={{ ml: 1 }} onClick={() => document.getElementById('color-picker')?.click()}><ColorLensIcon /></IconButton>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="body2" gutterBottom>Logotipo de la Empresa</Typography>
                            <Box
                                sx={{
                                    border: '2px dashed #90caf9',
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: 'center',
                                    bgcolor: '#e3f2fd',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    '&:hover': { bgcolor: '#e1f5fe' }
                                }}
                                onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleLogoUpload}
                                />
                                {currentTenant.logoUrl ? (
                                    <Box component="img" src={currentTenant.logoUrl} sx={{ height: 60, mb: 1, objectFit: 'contain' }} />
                                ) : (
                                    <UploadFileIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                )}
                                <Typography variant="body2" color="primary">Clic para subir logo (.png, .jpg, .svg)</Typography>
                            </Box>
                        </Box>

                        <Button variant="contained" startIcon={<SaveIcon />} fullWidth onClick={handleSave}>
                            Guardar Cambios
                        </Button>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} variant="outlined" sx={{ p: 4, height: '100%', bgcolor: '#f5f5f5' }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Vista Previa (Preview)</Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                            {/* Mock App Header */}
                            <Box sx={{ bgcolor: color, p: 2, display: 'flex', alignItems: 'center', color: 'white' }}>
                                <Typography variant="subtitle2" fontWeight="bold">{currentTenant.name}</Typography>
                            </Box>
                            {/* Mock App Body */}
                            <Box sx={{ p: 3, minHeight: 200 }}>
                                <Typography variant="body2" gutterBottom>Bienvenido al Sistema de Mantenimiento</Typography>
                                <Button variant="contained" size="small" sx={{ bgcolor: color, mt: 2 }}>Botón Principal</Button>
                            </Box>
                        </Paper>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
export default WhiteLabelSettings;
