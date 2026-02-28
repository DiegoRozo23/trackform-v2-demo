import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Tabs, Tab } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import MantenimientosList from "../components/Fase2/MantenimientosList";
import FormBuilder from "../components/Fase2/FormBuilder";
import DigitalSignature from "../components/Fase2/DigitalSignature";
import MaquinasYQRs from "../components/Fase2/MaquinasYQRs";

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

const Fase2Portal = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const initialTab = tabParam ? parseInt(tabParam) : 0;

    const [value, setValue] = useState(initialTab);

    useEffect(() => {
        if (tabParam) {
            const val = parseInt(tabParam);
            if (!isNaN(val) && val !== value) {
                setValue(val);
            }
        }
    }, [tabParam]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        setSearchParams({ tab: newValue.toString() });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Gestión de Operaciones & Trazabilidad
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Constructor Visual · Ejecución mediante QR · Auditoría Inalterable
            </Typography>

            <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="operations tabs"
                        textColor="primary"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                    >
                        <Tab label="Monitor de Operaciones" />
                        <Tab label="Constructor de Formularios" />
                        <Tab label="Equipos & QRs" />
                        <Tab label="Trazabilidad (Demo Firma)" />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <MantenimientosList />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <FormBuilder />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <MaquinasYQRs />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    <DigitalSignature />
                </CustomTabPanel>
            </Paper>
        </Box>
    );
};

export default Fase2Portal;
