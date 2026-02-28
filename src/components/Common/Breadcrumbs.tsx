import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const routeLabels: Record<string, string> = {
    'constructor': 'Constructor & Operación',
    'analitica': 'Inteligencia Analítica',
    'saas': 'Configuración SaaS',
    'execute': 'Ejecución Formulario'
};

const tabLabels: Record<string, Record<string, string>> = {
    'constructor': {
        '0': 'Monitor de Operaciones',
        '1': 'Constructor de Formularios',
        '2': 'Equipos & QRs',
        '3': 'Trazabilidad'
    },
    'analitica': {
        '0': 'KPIs Operacionales',
        '1': 'Historial Auditable',
        '2': 'Análisis de Fallas'
    }
};

const Breadcrumbs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const pathnames = location.pathname.split('/').filter((x) => x);
    const tabValue = searchParams.get('tab');

    return (
        <Box sx={{ mb: 2 }}>
            <MuiBreadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{
                    '& .MuiBreadcrumbs-li': {
                        fontSize: '0.85rem',
                        fontWeight: 500
                    }
                }}
            >
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'text.secondary' }}
                    onClick={() => navigate('/')}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Inicio
                </Link>

                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const label = routeLabels[value] || value;

                    // Specific logic for tabs in certain routes
                    const subLabel = last && tabValue && tabLabels[value] ? tabLabels[value][tabValue] : null;

                    return last && !subLabel ? (
                        <Typography color="text.primary" key={to} sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {label}
                        </Typography>
                    ) : (
                        <React.Fragment key={to}>
                            <Link
                                underline="hover"
                                color="inherit"
                                onClick={() => navigate(to)}
                                sx={{ cursor: 'pointer', color: 'text.secondary' }}
                            >
                                {label}
                            </Link>
                            {subLabel && (
                                <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                    {subLabel}
                                </Typography>
                            )}
                        </React.Fragment>
                    );
                })}
            </MuiBreadcrumbs>
        </Box>
    );
};

export default Breadcrumbs;
