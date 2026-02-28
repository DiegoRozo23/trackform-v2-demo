import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
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
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import MenuIcon from "@mui/icons-material/Menu";
import Breadcrumbs from "./components/Common/Breadcrumbs";
import { useDemoStore } from "./store/demoStore";

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);

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

    const navItems = [
        { label: 'Panel de Control', path: '/', icon: <HomeIcon /> },
        { label: 'Constructor & Operación', path: '/constructor', icon: <ArticleIcon /> },
        { label: 'Inteligencia Analítica', path: '/analitica', icon: <DashboardIcon /> },
        { label: 'Configuración SaaS', path: '/saas', icon: <BusinessIcon /> },
    ];

    const renderNavItems = () => (
        <>
            {navItems.map((item) => (
                <Button
                    key={item.path}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    sx={{
                        opacity: location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 1 : 0.7,
                        borderBottom: location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? '2px solid white' : '2px solid transparent',
                        borderRadius: 0,
                        mr: 1,
                        display: { xs: 'none', md: 'inline-flex' }
                    }}
                >
                    <Box sx={{ mr: 1, display: 'flex' }}>{item.icon}</Box>
                    {item.label}
                </Button>
            ))}
        </>
    );

    return (
        <ThemeProvider theme={dynamicTheme}>
            <CssBaseline />
            <AppBar position="sticky" elevation={2} sx={{ bgcolor: 'primary.main', transition: 'background-color 0.3s ease' }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, cursor: "pointer", fontWeight: "bold", letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}
                        onClick={() => navigate("/")}
                    >
                        {currentTenant.logoUrl ? (
                            <img src={currentTenant.logoUrl} alt="Logo" style={{ height: 28, borderRadius: 4 }} />
                        ) : (
                            <BusinessIcon />
                        )}
                        <Box component="span" sx={{ display: { xs: isMobile ? 'none' : 'block', sm: 'block' } }}>
                            {currentTenant.name || "TRACKFORM 2.0"}
                        </Box>
                    </Typography>

                    {!isMobile && renderNavItems()}

                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderColor: 'rgba(255,255,255,0.5)',
                            ml: 2,
                            display: { xs: 'none', sm: 'inline-flex' }
                        }}
                    >
                        <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                        Salir
                    </Button>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box
                    sx={{ width: 280, pt: 2 }}
                    role="presentation"
                    onClick={() => setDrawerOpen(false)}
                >
                    <Box sx={{ px: 2, pb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {currentTenant.logoUrl ? (
                            <img src={currentTenant.logoUrl} alt="Logo" style={{ height: 32, borderRadius: 4 }} />
                        ) : (
                            <BusinessIcon color="primary" />
                        )}
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            TRACKFORM
                        </Typography>
                    </Box>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
                                    sx={{
                                        py: 1.5,
                                        '&.Mui-selected': {
                                            borderLeft: `4px solid ${currentTenant.themeColor} `,
                                            bgcolor: 'rgba(0,0,0,0.04)'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: location.pathname === item.path ? 700 : 500,
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding sx={{ mt: 4 }}>
                            <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                                <ListItemIcon sx={{ color: 'error.main' }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Cerrar Sesión" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', bgcolor: '#f5f5f5', pt: { xs: 2, md: 4 }, pb: 6 }}>
                <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                    <Breadcrumbs />
                    <Outlet />
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Layout;
