import { useState, useMemo, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Grid, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, TextField,
    Chip, FormControl, InputLabel, Select, MenuItem, Divider, Tooltip,
    Switch, FormControlLabel, useMediaQuery, useTheme, Stack
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useDemoStore, type FormField, type FieldType } from "../../store/demoStore";

const FormBuilder = () => {
    const navigate = useNavigate();
    // Stable individual selectors
    const templates = useDemoStore((state: any) => state.templates);
    const addTemplate = useDemoStore((state: any) => state.addTemplate);
    const updateTemplate = useDemoStore((state: any) => state.updateTemplate);
    const deleteTemplate = useDemoStore((state: any) => state.deleteTemplate);
    const toggleTemplateStatus = useDemoStore((state: any) => state.toggleTemplateStatus);
    const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));
    const isSm = useMediaQuery(useTheme().breakpoints.down('sm'));
    const machines = useDemoStore((state: any) => state.machines); // Extract machines

    // View state: 'list' | 'editor'
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [searchTerm, setSearchTerm] = useState("");

    // Unique machine types for dropdown
    const machineTypes = useMemo<string[]>(() => {
        return Array.from(new Set(machines.map((m: any) => m.type)));
    }, [machines]);

    // Editor State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formName, setFormName] = useState("");
    const [machineType, setMachineType] = useState("");
    const [category, setCategory] = useState("");
    const [area, setArea] = useState("");
    const [description, setDescription] = useState("");
    const [fields, setFields] = useState<FormField[]>([]);
    const [active, setActive] = useState(true);

    const handleOpenEditor = (tpl?: any) => {
        if (tpl) {
            setEditingId(tpl.id);
            setFormName(tpl.name);
            setMachineType(tpl.machineType);
            setCategory(tpl.category || "");
            setArea(tpl.area || "");
            setDescription(tpl.description || "");
            setActive(tpl.active ?? true);
            setFields(tpl.fields);
        } else {
            setEditingId(null);
            setFormName("");
            setMachineType("");
            setCategory("");
            setArea("");
            setDescription("");
            setActive(true);
            setFields([{ id: `f-${Date.now()}`, type: 'checklist', label: 'Verificar estado general', required: true }]);
        }
        setView('editor');
    };

    const handleCloseEditor = () => setView('list');

    const addField = () => {
        const newField: FormField = {
            id: `f-${Date.now()}`,
            type: 'text',
            label: 'Nueva Observación',
            required: true
        };
        setFields([...fields, newField]);
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const handleSave = () => {
        if (!formName || !machineType || fields.length === 0) {
            alert("Completa los campos obligatorios (Nombre, Máquina y al menos 1 campo).");
            return;
        }

        const data = {
            name: formName,
            machineType,
            category,
            area,
            description,
            fields,
            active
        };

        if (editingId) {
            updateTemplate(editingId, data);
            alert("Versión actualizada con éxito.");
        } else {
            addTemplate(data);
            alert("Nuevo formulario técnico publicado. Redirigiendo a QRs...");
        }
        navigate("/constructor?tab=2");
    };

    const filteredTemplates = templates.filter((t: any) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.machineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (view === 'editor') {
        return (
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <IconButton onClick={handleCloseEditor} color="primary">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold">
                        {editingId ? 'Editar Configuración' : 'Nueva Inspección Técnica'}
                    </Typography>
                </Box>

                <Paper className="glass-card" sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, border: 'none' }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Nombre del Formulario (Título)"
                                variant="outlined"
                                value={formName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth required>
                                <InputLabel>Tipo de Activo / Máquina</InputLabel>
                                <Select
                                    value={machineType}
                                    label="Tipo de Activo / Máquina"
                                    onChange={(e) => setMachineType(e.target.value)}
                                >
                                    {machineTypes.map((type: string) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Categoría (Ej: Rotativos)"
                                variant="outlined"
                                value={category}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Área de Aplicación"
                                variant="outlined"
                                value={area}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setArea(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControlLabel
                                control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} color="success" />}
                                label={active ? "Formulario Activo" : "Formulario Pausado"}
                                sx={{ mt: 1 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Descripción del Procedimiento"
                                variant="outlined"
                                value={description}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold">Items de la Encuesta</Typography>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={addField} size="small">
                            Añadir Paso/Campo
                        </Button>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        {fields.map((field, index) => (
                            <Paper key={field.id} elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fff', '&:hover': { borderColor: 'primary.light' } }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, sm: 1 }}>
                                        <Typography variant="subtitle2" color="primary">#{index + 1}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Descripción del Item"
                                            value={field.label}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField(field.id, { label: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 9, sm: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Respuesta</InputLabel>
                                            <Select
                                                value={field.type}
                                                label="Respuesta"
                                                onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                                            >
                                                <MenuItem value="text">Observación Texto</MenuItem>
                                                <MenuItem value="checklist">Cumple / Falla</MenuItem>
                                                <MenuItem value="camera">Fotografía</MenuItem>
                                                <MenuItem value="number">Medición</MenuItem>
                                                <MenuItem value="date">Fecha</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 3, sm: 2 }} sx={{ textAlign: 'right' }}>
                                        <IconButton color="error" onClick={() => removeField(field.id)} size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column-reverse', sm: 'row' },
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 4
                    }}>
                        <Button variant="outlined" onClick={handleCloseEditor} fullWidth={isSm}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            size="large"
                            fullWidth={isSm}
                        >
                            {editingId ? 'Actualizar' : 'Publicar'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                mb: 3,
                gap: 2
            }}>
                <TextField
                    size="small"
                    placeholder="Buscar plantillas..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />,
                    }}
                    sx={{ width: { xs: '100%', sm: 350 }, bgcolor: 'white' }}
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenEditor()} sx={{ minHeight: 45 }}>
                    Nueva Inspección
                </Button>
            </Box>

            {!isMobile ? (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #eee', overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><b>Nombre / Título</b></TableCell>
                                <TableCell><b>Categoría</b></TableCell>
                                <TableCell><b>Máquina/Activo</b></TableCell>
                                <TableCell><b>Versión</b></TableCell>
                                <TableCell><b>Estado</b></TableCell>
                                <TableCell align="right"><b>Acciones</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTemplates.map((tpl: any) => (
                                <TableRow key={tpl.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{tpl.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">ID: {tpl.id.substring(0, 8)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={tpl.category || 'N/A'} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{tpl.machineType}</TableCell>
                                    <TableCell>v{tpl.version || 1}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={tpl.active ? "Activo" : "Pausado"}
                                            color={tpl.active ? "success" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={tpl.active ? "Pausar Formulario" : "Activar Formulario"}>
                                            <IconButton size="small" onClick={() => toggleTemplateStatus(tpl.id)} color={tpl.active ? "warning" : "success"}>
                                                {tpl.active ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" color="primary" onClick={() => handleOpenEditor(tpl)}><EditIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton size="small" color="error" onClick={() => deleteTemplate(tpl.id)}><DeleteIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Stack spacing={2}>
                    {filteredTemplates.map((tpl: any) => (
                        <Paper key={tpl.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">{tpl.name}</Typography>
                                <Chip
                                    label={tpl.active ? "Activo" : "Pausado"}
                                    color={tpl.active ? "success" : "default"}
                                    size="small"
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary" display="block">Activo: {tpl.machineType}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip label={tpl.category || 'Inspección'} size="small" variant="outlined" />
                                <Chip label={`v${tpl.version || 1}`} size="small" variant="outlined" />
                            </Box>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color={tpl.active ? "warning" : "success"}
                                    onClick={() => toggleTemplateStatus(tpl.id)}
                                >
                                    {tpl.active ? "Pausar" : "Activar"}
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleOpenEditor(tpl)}
                                    startIcon={<EditIcon />}
                                >
                                    Editar
                                </Button>
                                <IconButton size="small" color="error" onClick={() => deleteTemplate(tpl.id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default FormBuilder;
