import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import { AccountCircle, LineAxis, Logout, School, Settings, Warning } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const otherItems = [
    { name: "Setting", icon: <Settings />, to: '/setting' },
]

const Sidebar = (props) => {
    const theme = useTheme();
    const navigate = useNavigate()
    const { open, handleDrawerClose } = props

    const role = localStorage.getItem('role');

    const logOut = () => {
        localStorage.clear()
        navigate('/login')
    }
    let mainItems = []
    if (role === 'student') {
        mainItems = [
            { name: "Dashboard", icon: <LineAxis />, to: '/' },
            { name: "Course", icon: <School />, to: '/' },
            { name: "Profile", icon: <AccountCircle />, to: '/profile' },
            { name: "Warning", icon: <Warning />, to: '/warning' },
            { name: "Message", icon: <MailIcon />, to: '/message' },
        ]
    } else if (role === 'educator') {
        mainItems = [
            { name: "Dashboard", icon: <LineAxis />, to: '/' },
            { name: "Course", icon: <School />, to: '/' },
            { name: "Message", icon: <MailIcon />, to: '/message' },
        ]
    }

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {mainItems.map((item) => (
                    <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
                        <NavLink to={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {otherItems.map((item) => (
                    <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
                        <NavLink to={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                ))}
                <ListItem key={"Logout"} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={logOut}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary={"Logout"} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}

export default Sidebar;