import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    createTheme,
    ThemeProvider,
    CssBaseline,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import { useDemoStore } from "./store/demoStore";

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Dynamic theme context
    const currentTenant = useDemoStore((state: any) => state.currentTenant);

    // Dynamic MUI Theme
    const dynamicTheme = useMemo(() => createTheme({
        palette: {
            primary: {
                main: currentTenant.themeColor || '#1976d2',
            },
            secondary: {
                main: '#7b1fa2',
            },
        },
        typography: {
            fontFamily: "'Inter', 'Outfit', 'Roboto', sans-serif",
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 600,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                    },
                },
            },
        },
    }), [currentTenant.themeColor]);

    useEffect(() => {
        if (currentTenant.themeColor) {
            document.documentElement.style.setProperty('--primary-color', currentTenant.themeColor);
        }
    }, [currentTenant.themeColor]);

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <ThemeProvider theme={dynamicTheme}>
            <CssBaseline />
            <AppBar position="static" elevation={2} sx={{ bgcolor: 'primary.main', transition: 'background-color 0.3s ease' }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, cursor: "pointer", fontWeight: "bold", letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}
                        onClick={() => navigate("/")}
                    >
                        {currentTenant.logoUrl ? (
                            <img src={currentTenant.logoUrl} alt="Logo" style={{ height: 32, borderRadius: 4 }} />
                        ) : (
                            <BusinessIcon />
                        )}
                        {currentTenant.name || "TRACKFORM 2.0"}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/")}
                        sx={{
                            opacity: location.pathname === '/' ? 1 : 0.7,
                            borderBottom: location.pathname === '/' ? '2px solid white' : '2px solid transparent',
                            borderRadius: 0,
                            mr: 1
                        }}
                    >
                        <HomeIcon sx={{ mr: 1 }} fontSize="small" />
                        Panel de Control
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/constructor")}
                        sx={{
                            opacity: location.pathname.startsWith('/constructor') ? 1 : 0.7,
                            borderBottom: location.pathname.startsWith('/constructor') ? '2px solid white' : '2px solid transparent',
                            borderRadius: 0,
                            mr: 1
                        }}
                    >
                        <ArticleIcon sx={{ mr: 1 }} fontSize="small" />
                        Constructor & Operación
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/analitica")}
                        sx={{
                            opacity: location.pathname.startsWith('/analitica') ? 1 : 0.7,
                            borderBottom: location.pathname.startsWith('/analitica') ? '2px solid white' : '2px solid transparent',
                            borderRadius: 0,
                            mr: 1
                        }}
                    >
                        <DashboardIcon sx={{ mr: 1 }} fontSize="small" />
                        Inteligencia Analítica
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/saas")}
                        sx={{
                            opacity: location.pathname.startsWith('/saas') ? 1 : 0.7,
                            borderBottom: location.pathname.startsWith('/saas') ? '2px solid white' : '2px solid transparent',
                            borderRadius: 0,
                            mr: 2
                        }}
                    >
                        <BusinessIcon sx={{ mr: 1 }} fontSize="small" />
                        Configuración SaaS
                    </Button>
                    <Button color="inherit" onClick={handleLogout} variant="outlined" size="small" sx={{ borderColor: 'rgba(255,255,255,0.5)', ml: 2 }}>
                        <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                        Cerrar Sesión
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', bgcolor: '#f5f5f5', pt: 4, pb: 6 }}>
                <Container maxWidth="xl">
                    <Outlet />
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Layout;
