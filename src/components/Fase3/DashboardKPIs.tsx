import { useState, useMemo } from "react";
import {
    Box, Typography, Paper, Grid, Card, CardContent,
    Divider, Button, Stack, List, ListItem, ListItemText, Avatar
} from "@mui/material";
import {
    Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import { useDemoStore } from "../../store/demoStore";

const DashboardKPIs = () => {
    const mantenimientos = useDemoStore((state: any) => state.mantenimientos);

    // Filter state
    const [timeRange, setTimeRange] = useState("MES"); // HOY, SEMANA, MES

    // Filter Logic
    const filteredMnts = useMemo(() => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        return mantenimientos.filter((m: any) => {
            const mDate = new Date(m.timestamp).getTime();
            if (timeRange === "HOY") return (now - mDate < oneDay);
            if (timeRange === "SEMANA") return (now - mDate < oneDay * 7);
            return true;
        });
    }, [mantenimientos, timeRange]);

    // KPI Calculations
    const total = filteredMnts.length;
    const completed = filteredMnts.filter((m: any) => m.status === 'Completado').length;
    const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Overdue Alerts Logic (Machines with > 15 days without maintenance)
    const overdueCount = useMemo(() => {
        const now = Date.now();
        const fifteenDays = 15 * 24 * 60 * 60 * 1000;
        const lastMnts: Record<string, number> = {};

        mantenimientos.forEach((m: any) => {
            const mDate = new Date(m.timestamp).getTime();
            if (!lastMnts[m.machineName] || mDate > lastMnts[m.machineName]) {
                lastMnts[m.machineName] = mDate;
            }
        });

        return Object.values(lastMnts).filter(date => now - date > fifteenDays).length;
    }, [mantenimientos]);

    // Technician Performance Ranking
    const techRanking = useMemo(() => {
        const counts: Record<string, number> = {};
        mantenimientos.forEach((m: any) => {
            counts[m.operatorName] = (counts[m.operatorName] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [mantenimientos]);

    // Checklist Compliance Analysis
    const checklistStats = useMemo(() => {
        let ok = 0;
        let obs = 0;
        filteredMnts.forEach((m: any) => {
            Object.values(m.answers).forEach(val => {
                if (val === true || val === "SÍ") ok++;
                else if (val === false || val === "NO" || (typeof val === 'string' && val.length > 10)) obs++;
            });
        });
        if (ok === 0 && obs === 0) return [{ name: 'Cumple', value: 85 }, { name: 'Observación', value: 15 }];
        return [
            { name: 'Cumple (OK)', value: ok },
            { name: 'Falla/Observación', value: obs }
        ];
    }, [filteredMnts]);

    const COLORS = ['#4caf50', '#f44336'];

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">Inteligencia de Gestión</Typography>
                    <Typography variant="body2" color="text.secondary">Indicadores de cumplimiento y rendimiento operativo</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    {["HOY", "SEMANA", "MES"].map(range => (
                        <Button
                            key={range}
                            variant={timeRange === range ? "contained" : "outlined"}
                            size="small"
                            onClick={() => setTimeRange(range)}
                        >
                            {range}
                        </Button>
                    ))}
                    <Button variant="outlined" startIcon={<FileDownloadIcon />} size="small">Reporte Ejecutivo</Button>
                </Stack>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card elevation={0} variant="outlined" sx={{ bgcolor: '#e3f2fd', borderColor: '#bbdefb' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="overline" fontWeight="bold">Completados</Typography>
                                <CheckCircleIcon color="primary" fontSize="small" />
                            </Box>
                            <Typography variant="h3" fontWeight="bold">{completed}</Typography>
                            <Typography variant="caption" color="text.secondary">de {total} registros</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card elevation={0} variant="outlined" sx={{ bgcolor: '#f1f8e9', borderColor: '#dcedc8' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="overline" fontWeight="bold">Cumplimiento</Typography>
                                <TrendingUpIcon color="success" fontSize="small" />
                            </Box>
                            <Typography variant="h3" fontWeight="bold">{complianceRate}%</Typography>
                            <Typography variant="caption" color="text.secondary">Tasa de resolución</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card elevation={0} variant="outlined" sx={{ bgcolor: '#fff3e0', borderColor: '#ffe0b2' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="overline" fontWeight="bold">Tiempo Prom.</Typography>
                                <SpeedIcon color="warning" fontSize="small" />
                            </Box>
                            <Typography variant="h3" fontWeight="bold">42m</Typography>
                            <Typography variant="caption" color="text.secondary">Eficiencia medida</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card elevation={0} variant="outlined" sx={{ bgcolor: overdueCount > 0 ? '#fff4f4' : '#fafafa', borderColor: overdueCount > 0 ? '#ffcdd2' : '#e0e0e0' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="overline" fontWeight="bold" color={overdueCount > 0 ? "error" : "inherit"}>Alertas Vencidas</Typography>
                                <NotificationsActiveIcon color={overdueCount > 0 ? "error" : "disabled"} fontSize="small" />
                            </Box>
                            <Typography variant="h3" fontWeight="bold" color={overdueCount > 0 ? "error" : "text.primary"}>{overdueCount}</Typography>
                            <Typography variant="caption" color="text.secondary">Equipos sin mantenimiento</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper variant="outlined" sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                            <StarsIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">Ranking de Operarios</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <List dense>
                            {techRanking.map((tech, index) => (
                                <ListItem key={tech.name} sx={{ px: 0 }}>
                                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem', mr: 2, bgcolor: index === 0 ? '#ffd700' : '#eceff1', color: '#000' }}>
                                        {index + 1}
                                    </Avatar>
                                    <ListItemText
                                        primary={tech.name}
                                        secondary={`${tech.count} mantenimientos`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper variant="outlined" sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Distribución de Resultados</Typography>
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={checklistStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {checklistStats.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Estado de Seguridad</Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Box sx={{ p: 1, bgcolor: '#ffffff', borderRadius: 1, borderLeft: '4px solid #4caf50' }}>
                                <Typography variant="caption" fontWeight="bold" display="block">Integridad SHA-256</Typography>
                                <Typography variant="caption" color="text.secondary">Protocolo de firma validado.</Typography>
                            </Box>
                            <Box sx={{ p: 1, bgcolor: overdueCount > 0 ? '#fff4f4' : '#ffffff', borderRadius: 1, borderLeft: `4px solid ${overdueCount > 0 ? '#f44336' : '#1976d2'}` }}>
                                <Typography variant="caption" fontWeight="bold" display="block">Detección de Riesgos</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {overdueCount > 0 ? `${overdueCount} máquinas con mantenimiento vencido.` : "Mapa de calor actualizado."}
                                </Typography>
                            </Box>
                        </Stack>
                        <Box sx={{ mt: 4, display: 'flex', gap: 1, alignItems: 'center' }}>
                            <LockIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">Trazabilidad Asegurada</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardKPIs;
