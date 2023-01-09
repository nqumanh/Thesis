import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AccountCircle, LineAxis, Logout, Mail, School, Settings, UnfoldMore, Warning } from '@mui/icons-material';
import { capitalizeFirstLetter } from 'utils';

let activeStyle = {
    width: '100%',
    color: "#10b981",
    textDecoration: "none",
};

let inactiveStyle = {
    width: '100%',
    textDecoration: "none",
    color: "#c5d5db"
};

function Sidebar(props) {
    const { handleDrawerToggle, mobileOpen } = props

    const navigate = useNavigate()

    const drawerWidth = 300;

    const role = localStorage.getItem('role');

    let items = []
    if (role === 'student') {
        items = [
            { name: "Course", icon: <School />, to: '/' },
            { name: "Warning", icon: <Warning />, to: '/warning' },
            { name: "Message", icon: <Mail />, to: '/message' },
            { name: "Dashboard", icon: <LineAxis />, to: '/dashboard' },
        ]
    } else if (role === 'parents') {
        items = [
            { name: "Course", icon: <School />, to: '/' },
            { name: "Warning", icon: <Warning />, to: '/warning' },
            { name: "Message", icon: <Mail />, to: '/message' },
            { name: "Dashboard", icon: <LineAxis />, to: '/dashboard' },
        ]
    } else if (role === 'educator') {
        items = [
            { name: "Course", icon: <School />, to: '/' },
            { name: "Message", icon: <Mail />, to: '/message' },
            { name: "Dashboard", icon: <LineAxis />, to: '/dashboard' },
        ]
    }

    const otherItems = [
        { name: "Setting", icon: <Settings />, to: '/setting' },
    ]

    const drawer = (
        <Box display='flex' flexDirection="column" flex='1' sx={{ backgroundColor: "#111827" }}>
            <Box
                sx={{
                    mx: 1,
                    my: 3,
                    alignItems: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 4,
                    borderRadius: 1
                }}
            >
                <div>
                    <Typography
                        color="white"
                        variant="h5"
                    >
                        Warning System
                    </Typography>
                    <Typography
                        color="neutral.400"
                        variant="body2"
                    >
                        {capitalizeFirstLetter(role)}
                    </Typography>
                </div>
                <UnfoldMore sx={{
                    color: 'neutral.500',
                    width: 20,
                    height: 20
                }} />
            </Box>
            <Divider sx={{
                borderColor: '#2D3748',
            }} />
            <List sx={{ flexGrow: 1, color: "#fff" }}>
                {items.map((item) => (
                    <ListItem disablePadding key={item.name}>
                        <NavLink to={item.to} style={({ isActive }) =>
                            isActive ? activeStyle : inactiveStyle
                        }
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                ))}
                {(role !== 'educator') &&
                    <>
                        < Divider sx={{
                            borderColor: '#2D3748',
                        }} />
                        <ListItem disablePadding key={'profile'}>
                            <NavLink to='/profile' style={({ isActive }) =>
                                isActive ? activeStyle : inactiveStyle
                            }
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AccountCircle />
                                    </ListItemIcon>
                                    <ListItemText primary='Profile' />
                                </ListItemButton>
                            </NavLink>
                        </ListItem>
                    </>
                }
            </List>

            <Divider sx={{
                borderColor: '#2D3748',
            }} />

            <List sx={{ my: 3 }}>
                {otherItems.map((item) => (
                    <ListItem disablePadding key={item.name}>
                        <NavLink to={item.to} style={({ isActive }) =>
                            isActive ? activeStyle : inactiveStyle
                        }
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </NavLink>
                    </ListItem>
                ))}
                <ListItem disablePadding sx={{
                    textDecoration: "none",
                    color: "#c5d5db"
                }}>
                    <ListItemButton
                        onClick={() => {
                            localStorage.clear()
                            navigate('/login')
                        }}
                    >
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, display: "flex", }}
            aria-label="mailbox folders"
        >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}

export default Sidebar;