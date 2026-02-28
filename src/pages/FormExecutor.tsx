import { useState, useRef, useMemo } from "react";
import {
    Box, Typography, Paper, Grid, Button, TextField,
    Divider, Chip, MenuItem
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDemoStore } from "../store/demoStore";
import SignatureCanvas from 'react-signature-canvas';
import SaveIcon from '@mui/icons-material/Save';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

const FormExecutor = () => {
    const { id: templateId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Stable individual selectors
    const templates = useDemoStore((state: any) => state.templates);
    const machines = useDemoStore((state: any) => state.machines); // Extract machines
    const addMantenimiento = useDemoStore((state: any) => state.addMantenimiento);

    // Derived state for current template
    const template = useMemo(() =>
        templates.find((t: any) => t.id === templateId),
        [templates, templateId]);

    const [selectedMachineId, setSelectedMachineId] = useState<string>("");
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isOffline, setIsOffline] = useState(false);
    const sigCanvas = useRef<any>(null);

    if (!template) {
        return (
            <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography variant="h5" color="error">Plantilla no encontrada</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/constructor')}>Volver al Panel</Button>
            </Box>
        );
    }

    const handleChange = (fieldId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSave = () => {
        const signatureData = sigCanvas.current?.toDataURL();

        // VALIDATION
        if (!selectedMachineId) {
            alert("Error: Debes seleccionar una máquina antes de finalizar.");
            return;
        }

        // Check if all fields have an answer
        const missingFields = template.fields.some((f: any) => {
            if (f.required && (answers[f.id] === undefined || answers[f.id] === null)) return true;
            // Failure check
            if (f.type === 'checklist' && answers[f.id] === false && !answers[`${f.id}_obs`]?.trim()) return true;
            return false;
        });

        if (missingFields) {
            alert("Error: Hay campos obligatorios pendientes o fallas sin observación.");
            return;
        }

        const machine = machines.find((m: any) => m.id === selectedMachineId);

        addMantenimiento({
            templateId: template.id,
            machineName: machine ? machine.name : 'Máquina Desconocida',
            operatorName: 'Técnico de Campo (HMD)',
            status: 'Completado',
            category: template.category,
            area: template.area,
            offline: isOffline,
            answers: answers,
            signature: signatureData,
            timestamp: new Date().toISOString(),
            gps: { lat: -23.55052, lng: -46.633309 }, // Mocked
            hash: `sha256:${Math.random().toString(36).substring(2)}` // Mocked or generated
        });

        alert(isOffline ? "Mantenimiento guardado localmente (Offline). Se sincronizará al recuperar señal." : "Mantenimiento enviado con éxito. Sincronizando con el servidor...");
        navigate('/constructor');
    };

    return (
        <Box sx={{ maxWidth: 900, margin: '0 auto', pb: 8 }}>
            <Paper className="glass-card" sx={{ p: 4, borderRadius: 4, mb: 4, border: 'none', background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="primary">{template.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip label={`Categoría: ${template.category || 'N/A'}`} size="small" />
                            <Chip label={`Área: ${template.area || 'N/A'}`} size="small" variant="outlined" />
                            <Chip label={`v${template.version}`} size="small" variant="outlined" color="primary" />
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        color={isOffline ? "warning" : "success"}
                        startIcon={isOffline ? <CloudOffIcon /> : <CloudDoneIcon />}
                        onClick={() => setIsOffline(!isOffline)}
                        size="small"
                    >
                        {isOffline ? "Modo Offline" : "En Línea"}
                    </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
                    {template.description || "Diligenciamiento de inspección técnica e integridad para activos industriales."}
                </Typography>

                <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Configuración de Inspección</Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                                select
                                fullWidth
                                label="Seleccionar Máquina / Activo"
                                value={selectedMachineId}
                                onChange={(e) => setSelectedMachineId(e.target.value)}
                                required
                            >
                                {machines.filter((m: any) => m.type === template.machineType || !template.machineType).map((m: any) => (
                                    <MenuItem key={m.id} value={m.id}>
                                        {m.name} ({m.area})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Typography variant="h6" gutterBottom fontWeight="bold">Checklist de Campo</Typography>
                    <Divider sx={{ mb: 4 }} />

                    <Grid container spacing={4}>
                        {template.fields.map((field: any) => (
                            <Grid size={{ xs: 12, md: 6 }} key={field.id}>
                                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                    {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
                                </Typography>
                                {field.type === 'checklist' && (
                                    <Box>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 1 }}>
                                            <Button
                                                variant={answers[field.id] === true ? "contained" : "outlined"}
                                                color="success"
                                                onClick={() => {
                                                    handleChange(field.id, true);
                                                    handleChange(`${field.id}_obs`, "");
                                                }}
                                                fullWidth
                                                sx={{ height: 45 }}
                                            >
                                                CUMPLE
                                            </Button>
                                            <Button
                                                variant={answers[field.id] === false ? "contained" : "outlined"}
                                                color="error"
                                                onClick={() => handleChange(field.id, false)}
                                                fullWidth
                                                sx={{ height: 45 }}
                                            >
                                                FALLA
                                            </Button>
                                        </Box>
                                        {answers[field.id] === false && (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                multiline
                                                rows={2}
                                                placeholder="Describa el hallazgo o falla (Obligatorio)..."
                                                value={answers[`${field.id}_obs`] || ""}
                                                onChange={(e) => handleChange(`${field.id}_obs`, e.target.value)}
                                                error={!answers[`${field.id}_obs`]?.trim()}
                                                sx={{ mt: 1, bgcolor: 'rgba(211, 47, 47, 0.05)' }}
                                                required
                                            />
                                        )}
                                    </Box>
                                )}
                                {field.type === 'text' && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Ingrese observaciones..."
                                        value={answers[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        required={field.required}
                                        size="small"
                                    />
                                )}
                                {field.type === 'camera' && (
                                    <Box sx={{ border: '1px dashed #ccc', p: 3, textAlign: 'center', borderRadius: 1, bgcolor: '#f9f9f9', cursor: 'pointer' }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleChange(field.id, 'https://mock.image/camera.png')}
                                        >
                                            Capturar Evidencia (Foto)
                                        </Button>
                                        {answers[field.id] && <Typography variant="caption" color="success.main" display="block" sx={{ mt: 1 }}>Foto vinculada ✓</Typography>}
                                    </Box>
                                )}
                                {field.type === 'number' && (
                                    <TextField
                                        fullWidth
                                        type="number"
                                        placeholder="0.00"
                                        value={answers[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        required={field.required}
                                        size="small"
                                    />
                                )}
                                {field.type === 'date' && (
                                    <TextField
                                        fullWidth
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={answers[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        required={field.required}
                                        size="small"
                                    />
                                )}
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Firma Digital de Integridad</Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                            La firma garantiza que la información fue capturada por el técnico autorizado.
                        </Typography>
                        <Box sx={{ border: '2px solid #eee', borderRadius: 2, bgcolor: '#fafafa', width: '100%', maxWidth: 500 }}>
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor="navy"
                                canvasProps={{ width: 500, height: 180, className: 'sigCanvas' }}
                            />
                        </Box>
                        <Button size="small" onClick={() => sigCanvas.current?.clear()} sx={{ mt: 1 }}>Limpiar Lienzo</Button>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate('/constructor')} size="large" sx={{ borderRadius: 2 }}>Cancelar</Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            size="large"
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                background: 'var(--primary-color)',
                                '&:hover': { background: '#000' }
                            }}
                        >
                            Finalizar y Sellar Registro
                        </Button>
                    </Box>
                </Paper>
            </Paper>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Propulsado por el Entorno TRACKFORM 2.0 - Auditoría en Tiempo Real
                </Typography>
            </Box>
        </Box>
    );
}

export default FormExecutor;
