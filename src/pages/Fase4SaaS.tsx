import React, { useState } from 'react';
import { Typography, Paper, Box, Tabs, Tab } from "@mui/material";

import SuperAdminPanel from "../components/Fase4/SuperAdminPanel";
import WhiteLabelSettings from "../components/Fase4/WhiteLabelSettings";

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

const Fase4SaaS = () => {
    const [value, setValue] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Administración SaaS (Multitenant)
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Control de Clientes B2B · Onboarding · Personalización Global (White-Label)
            </Typography>

            <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="fase4 tabs" textColor="primary" indicatorColor="primary">
                        <Tab label="Superadmin - Gestión de Tenants" />
                        <Tab label="Configuración White-label (Marca Propia)" />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <SuperAdminPanel />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <WhiteLabelSettings />
                </CustomTabPanel>
            </Paper>
        </Box>
    );
};

export default Fase4SaaS;
