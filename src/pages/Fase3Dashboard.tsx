import React, { useState } from 'react';
import { Typography, Paper, Box, Tabs, Tab } from "@mui/material";

import DashboardKPIs from "../components/Fase3/DashboardKPIs";
import HistorialMaquina from "../components/Fase3/HistorialMaquina";
import AnalisisFallas from "../components/Fase3/AnalisisFallas";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Fase3Dashboard = () => {
    const [value, setValue] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Inteligencia Operacional & Analítica
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Conversión de datos en decisiones: KPIs · Auditoría Histórica · Análisis de Fallas
            </Typography>

            <Paper elevation={0} sx={{ mt: 3, p: 1, borderRadius: 2, bgcolor: 'transparent' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab label="Dashboard Interactivo (KPIs)" />
                        <Tab label="Histórico Auditable por Equipo" />
                        <Tab label="Análisis de Fallas (Heatmap)" />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <DashboardKPIs />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <HistorialMaquina />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <AnalisisFallas />
                </CustomTabPanel>
            </Paper>
        </Box>
    );
};

export default Fase3Dashboard;
