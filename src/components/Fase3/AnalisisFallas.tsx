import { useState, useMemo } from "react";
import {
    Box, Typography, Paper, Grid, Card, CardContent,
    Divider, List, ListItem, ListItemText, LinearProgress, MenuItem, TextField, Stack, Chip, Avatar
} from "@mui/material";
import {
    Tooltip as ChartTooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TimelineIcon from '@mui/icons-material/Timeline';
import SpeedIcon from '@mui/icons-material/Speed';

import { useDemoStore } from "../../store/demoStore";

const AnalisisFallas = () => {
    const mantenimientos = useDemoStore((state: any) => state.mantenimientos);

    // UI State
    const [selectedMachine, setSelectedMachine] = useState<string>("TODOS");

    // List of machines for selector
    const machineList = useMemo(() =>
        ["TODOS", ...new Set(mantenimientos.map((m: any) => m.machineName))] as string[]
        , [mantenimientos]);

    const templates = useDemoStore((state: any) => state.templates);

    // 1. Heatmap by Machine: Which checklist questions fall the most?
    const failuresByQuestion = useMemo(() => {
        const counts: Record<string, number> = {};
        const filtered = mantenimientos.filter((m: any) => selectedMachine === "TODOS" || m.machineName === selectedMachine);

        // Build axes based on labels
        const labels: Record<string, string> = {};

        // Find relevant fields from templates to ensure we have enough axes
        const relevantTemplates = selectedMachine === "TODOS"
            ? templates
            : templates.filter((t: any) => filtered.some((m: any) => m.templateId === t.id));

        relevantTemplates.forEach((t: any) => {
            t.fields.filter((f: any) => f.type === 'checklist').forEach((f: any) => {
                labels[f.id] = f.label;
            });
        });

        filtered.forEach((m: any) => {
            Object.entries(m.answers).forEach(([key, val]) => {
                if ((val === false || val === "NO") && labels[key]) {
                    counts[key] = (counts[key] || 0) + 1;
                }
            });
        });

        // If we have some data but very few points, RadarChart looks bad. 
        // We ensure all checklist fields are present as axes.
        const data = Object.entries(labels).map(([id, label]) => ({
            name: label,
            value: counts[id] || 0
        }));

        if (data.length < 3) {
            // Contextual mock data if no real data/not enough axes
            return [
                { name: 'Niveles Lubricante', value: selectedMachine === "TODOS" ? 8 : (counts['f-1'] || 0) },
                { name: 'Presión Hidráulica', value: selectedMachine === "TODOS" ? 5 : (Math.random() * 2) },
                { name: 'Temperatura Operación', value: selectedMachine === "TODOS" ? 3 : (Math.random() * 1) },
                { name: 'Fugas Circuito', value: selectedMachine === "TODOS" ? 12 : (Math.random() * 3) },
                { name: 'Cableado/Terminales', value: selectedMachine === "TODOS" ? 6 : (Math.random() * 1) },
            ];
        }
        return data;
    }, [mantenimientos, selectedMachine, templates]);

    // 2. Overdue Maintenance Alerts
    const overdueAlerts = useMemo(() => {
        const now = new Date();

        // Find last maintenance for each machine
        const lastMnts: Record<string, Date> = {};
        mantenimientos.forEach((m: any) => {
            const d = new Date(m.timestamp);
            if (!lastMnts[m.machineName] || d > lastMnts[m.machineName]) {
                lastMnts[m.machineName] = d;
            }
        });

        return Object.entries(lastMnts)
            .map(([name, date]) => ({
                name,
                daysSince: Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)),
                lastDate: date
            }))
            .filter(a => a.daysSince > 15) // Alert if > 15 days for demo, though PRD says X days
            .sort((a, b) => b.daysSince - a.daysSince);
    }, [mantenimientos]);

    // 3. Historical Trend (Evolution)
    const historicalTrend = useMemo(() => {
        const filtered = mantenimientos
            .filter((m: any) => selectedMachine === "TODOS" || m.machineName === selectedMachine)
            .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        return filtered.map((m: any) => {
            const failures = Object.values(m.answers).filter(v => v === false || v === "NO").length;
            const health = Math.max(0, 100 - (failures * 20)); // Arbitrary health score
            return {
                date: new Date(m.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                Salud: health,
                Hallazgos: failures
            };
        });
    }, [mantenimientos, selectedMachine]);

    return (
        <Box>
            <Box sx={{
                mb: 4,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2
            }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">Estado de Salud de Activos</Typography>
                    <Typography variant="body2" color="text.secondary">Análisis de criticidad por equipo y mantenimiento vencido</Typography>
                </Box>
                <TextField
                    select
                    size="small"
                    value={selectedMachine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 300 } }}
                    label="Filtrar por Equipo"
                >
                    {machineList.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
            </Box>

            <Grid container spacing={3}>
                {/* 1. Heatmap Radar (By Machine) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 450 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                            <AutoGraphIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">Mapa de Calor: {selectedMachine}</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <ResponsiveContainer width="100%" height="85%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={failuresByQuestion}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="name" fontSize={9} />
                                <PolarRadiusAxis />
                                <Radar
                                    name="Hallazgos"
                                    dataKey="value"
                                    stroke={selectedMachine === 'TODOS' ? '#1976d2' : '#f44336'}
                                    fill={selectedMachine === 'TODOS' ? '#1976d2' : '#f44336'}
                                    fillOpacity={0.5}
                                />
                                <ChartTooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ display: 'block', mt: 1 }}>
                            Frecuencia de fallas detectadas en puntos de control específicos.
                        </Typography>
                    </Paper>
                </Grid>

                {/* 2. Historical Evolution (Trend) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 450 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                            <TimelineIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">Evolución del Estado (Salud %)</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <ResponsiveContainer width="100%" height="85%">
                            <LineChart data={historicalTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" fontSize={10} />
                                <YAxis domain={[0, 100]} fontSize={10} />
                                <ChartTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Salud" stroke="#4caf50" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Hallazgos" stroke="#f44336" strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* 3. Overdue Alertas (Alertas de Vencimiento) */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 400, overflow: 'hidden' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                            <WarningAmberIcon color="error" />
                            <Typography variant="subtitle1" fontWeight="bold">Alertas de Mantenimiento Vencido</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <List sx={{ height: 300, overflow: 'auto' }}>
                            {overdueAlerts.length > 0 ? overdueAlerts.map((alert, idx) => (
                                <ListItem key={idx} sx={{ px: 0, py: 1.5 }}>
                                    <Avatar sx={{ bgcolor: alert.daysSince > 25 ? '#ffebee' : '#fff3e0', color: alert.daysSince > 25 ? '#c62828' : '#ef6c00', mr: 2 }}>
                                        <SpeedIcon />
                                    </Avatar>
                                    <ListItemText
                                        primary={alert.name}
                                        secondary={`Último: ${alert.lastDate.toLocaleDateString()}`}
                                        primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }}
                                    />
                                    <Chip
                                        label={`${alert.daysSince} días sin atención`}
                                        size="small"
                                        color={alert.daysSince > 25 ? "error" : "warning"}
                                    />
                                </ListItem>
                            )) : (
                                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 5 }}>
                                    Todos los equipos están al día.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* 4. Resumen de Calidad */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card variant="outlined" sx={{ height: 400, borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                                <AssessmentIcon color="primary" />
                                <Typography variant="subtitle1" fontWeight="bold">Métricas de Confiabilidad</Typography>
                            </Box>

                            <Stack spacing={4}>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Tasa de Disponibilidad Promedio</Typography>
                                        <Typography variant="body2" fontWeight="bold">94.2%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={94.2} color="success" sx={{ height: 10, borderRadius: 5 }} />
                                </Box>

                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Cumplimiento de Checklist (Crítico)</Typography>
                                        <Typography variant="body2" fontWeight="bold">88.5%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={88.5} color="primary" sx={{ height: 10, borderRadius: 5 }} />
                                </Box>

                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Índice de Resolución de Hallazgos</Typography>
                                        <Typography variant="body2" fontWeight="bold">62%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={62} color="warning" sx={{ height: 10, borderRadius: 5 }} />
                                </Box>

                                <Box sx={{ p: 2, bgcolor: '#f0f4ff', borderRadius: 2 }}>
                                    <Typography variant="caption" fontWeight="bold">SUGERENCIA TÉCNICA:</Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        El equipo <b>{selectedMachine === 'TODOS' ? 'Compresor A' : selectedMachine}</b> muestra saturación en fallas de lubricación. Se recomienda inspección visual inmediata.
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalisisFallas;
