import { useState } from "react";
import {
    Box, Typography, Paper, TextField, Button,
    Tabs, Tab, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Chip, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Stack
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import PeopleIcon from '@mui/icons-material/People';
import { useDemoStore } from "../../store/demoStore";

const GestionControl = () => {
    const [tab, setTab] = useState(0);
    const [search, setSearch] = useState("");
    const { machines, users, addMachine, updateMachine, deleteMachine, addUser, updateUser, deleteUser } = useDemoStore();

    // Modal State
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState<any>({});

    const handleOpen = (item: any = null) => {
        if (item) {
            setEditMode(true);
            setSelectedItem(item);
            setFormData({ ...item });
        } else {
            setEditMode(false);
            setSelectedItem(null);
            setFormData(tab === 0 ? {
                name: '', type: '', area: '', status: 'Activo'
            } : {
                name: '', role: 'Técnico', email: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({});
    };

    const handleSubmit = () => {
        if (tab === 0) {
            if (editMode) updateMachine(selectedItem.id, formData);
            else addMachine(formData);
        } else {
            if (editMode) updateUser(selectedItem.id, formData);
            else addUser(formData);
        }
        handleClose();
    };

    const filteredMachines = machines.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.area && m.area.toLowerCase().includes(search.toLowerCase()))
    );

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">Gestión de Recursos</Typography>
                    <Typography variant="body2" color="text.secondary">Control centralizado de activos físicos y personal técnico</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Añadir {tab === 0 ? 'Máquina' : 'Usuario'}
                </Button>
            </Box>

            <Paper variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', px: 2 }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ flexGrow: 1 }}>
                        <Tab icon={<PrecisionManufacturingIcon />} iconPosition="start" label="Máquinas (Equipos)" />
                        <Tab icon={<PeopleIcon />} iconPosition="start" label="Usuarios (Personal)" />
                    </Tabs>
                    <TextField
                        size="small"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
                        sx={{ width: 250, my: 1 }}
                    />
                </Box>

                <TableContainer sx={{ minHeight: 300 }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            {tab === 0 ? (
                                <TableRow>
                                    <TableCell><b>Nombre / ID</b></TableCell>
                                    <TableCell><b>Tipo</b></TableCell>
                                    <TableCell><b>Área / Ubicación</b></TableCell>
                                    <TableCell><b>Estado</b></TableCell>
                                    <TableCell align="right"><b>Acciones</b></TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell><b>Nombre Completo</b></TableCell>
                                    <TableCell><b>Rol / Cargo</b></TableCell>
                                    <TableCell><b>Correo Electrónico</b></TableCell>
                                    <TableCell align="right"><b>Acciones</b></TableCell>
                                </TableRow>
                            )}
                        </TableHead>
                        <TableBody>
                            {tab === 0 ? (
                                filteredMachines.map((m) => (
                                    <TableRow key={m.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">{m.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{m.id.substring(0, 8)}...</Typography>
                                        </TableCell>
                                        <TableCell>{m.type}</TableCell>
                                        <TableCell>{m.area}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={m.status}
                                                size="small"
                                                color={m.status === 'Activo' ? 'success' : m.status === 'Inactivo' ? 'error' : 'warning'}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleOpen(m)}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => deleteMachine(m.id)}><DeleteIcon fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredUsers.map((u) => (
                                    <TableRow key={u.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">{u.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{u.id.substring(0, 8)}...</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={u.role} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleOpen(u)}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => deleteUser(u.id)}><DeleteIcon fontSize="small" /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            {(tab === 0 ? filteredMachines : filteredUsers).length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No se encontraron resultados
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* CRUD Modal */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>{editMode ? 'Editar' : 'Nuevo'} {tab === 0 ? 'Equipo' : 'Usuario'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            size="small"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {tab === 0 ? (
                            <>
                                <TextField
                                    label="Tipo de Equipo"
                                    fullWidth
                                    size="small"
                                    value={formData.type || ''}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                />
                                <TextField
                                    label="Área"
                                    fullWidth
                                    size="small"
                                    value={formData.area || ''}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                />
                                <TextField
                                    select
                                    label="Estado"
                                    fullWidth
                                    size="small"
                                    value={formData.status || 'Activo'}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <MenuItem value="Activo">Activo</MenuItem>
                                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                                    <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                                </TextField>
                            </>
                        ) : (
                            <>
                                <TextField
                                    select
                                    label="Rol"
                                    fullWidth
                                    size="small"
                                    value={formData.role || 'Técnico'}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <MenuItem value="Técnico">Técnico</MenuItem>
                                    <MenuItem value="Supervisor">Supervisor</MenuItem>
                                    <MenuItem value="Administrador">Administrador</MenuItem>
                                </TextField>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    size="small"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit}>Guardar Cambios</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GestionControl;
