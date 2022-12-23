import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AccountCircle, LineAxis, Logout, Mail, School, Settings, UnfoldMore, Warning } from '@mui/icons-material';

let activeStyle = {
    color: "#10b981",
    textDecoration: "none",
};

let inactiveStyle = {
    textDecoration: "none",
    color: "#c5d5db"
};

function Sidebar(props) {
    const { handleDrawerToggle, mobileOpen } = props

    const drawerWidth = 250;

    const role = localStorage.getItem('role');

    let items = []
    if (role === 'student') {
        items = [
            { name: "Course", icon: <School />, to: '/' },
            { name: "Profile", icon: <AccountCircle />, to: '/profile' },
            { name: "Warning", icon: <Warning />, to: '/warning' },
            { name: "Dashboard", icon: <LineAxis />, to: '/dashboard' },
            { name: "Message", icon: <Mail />, to: '/message' },
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
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
                        variant="subtitle1"
                    >
                        Warning System
                    </Typography>
                    <Typography
                        color="neutral.400"
                        variant="body2"
                    >
                        {role}
                    </Typography>
                </div>
                <UnfoldMore sx={{
                    color: 'neutral.500',
                    width: 20,
                    height: 20
                }} />
                {/* <Selector
                
              /> */}
            </Box>
            <Divider sx={{
                borderColor: '#2D3748',
            }} />
            <List sx={{ flexGrow: 1, color: "#fff" }}>
                {items.map((item) => (
                    <NavLink key={item.name} to={item.to} style={({ isActive }) =>
                        isActive ? activeStyle : inactiveStyle
                    }
                    >
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    </NavLink>
                ))}
            </List>
            <Divider sx={{
                borderColor: '#2D3748',
            }} />
            <List>
                {otherItems.map((item) => (
                    <NavLink key={item.name} to={item.to} style={({ isActive }) =>
                        isActive ? activeStyle : inactiveStyle
                    }
                    >
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    </NavLink>
                ))}
                <ListItem disablePadding sx={{
                    textDecoration: "none",
                    color: "#c5d5db"
                }}>
                    <ListItemButton
                    // onClick={()=>logOut()}
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